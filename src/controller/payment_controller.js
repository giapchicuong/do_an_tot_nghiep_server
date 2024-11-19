const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');

import userStatusLevelService from "../services/user_status_level_service";

const config = {
    app_id: '2554',
    key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
    key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};


const paymentController = async (req, res) => {
    const embed_data = {
        redirecturl: 'demozpdk://payment_result',
    };

    const CURRENTNORMALSTATUSID = 2


    const items = [{ ...req.body, userId: req.user.userId, currentStatusId: CURRENTNORMALSTATUSID }];


    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: 'AIFreshify',
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
        //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
        callback_url: 'https://a608-2405-4802-a5fc-e7e0-3480-5a-5cde-5314.ngrok-free.app/api/v1/callback',
        description: `AIFreshify thanh toán cho đơn hàng #${transID}`,
        bank_code: 'zalopayapp',
    };

    try {

        const durationPrice = await userStatusLevelService.getDurationAmount(req.body.durationId)

        order.amount = durationPrice;


        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data =
            config.app_id +
            '|' +
            order.app_trans_id +
            '|' +
            order.app_user +
            '|' +
            order.amount +
            '|' +
            order.app_time +
            '|' +
            order.embed_data +
            '|' +
            order.item;

        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


        const NEWSTATUSVIPID = 1
        const CURRENTNORMALSTATUSID = 2

        const dataUser = {
            userId: req.user.userId,
            durationId: req.body.durationId,
            methodId: req.body.methodId,
            currentStatusId: CURRENTNORMALSTATUSID,
            newStatusId: NEWSTATUSVIPID,
            durationPrice: durationPrice,
            app_trans_id: order.app_trans_id,

        }

        console.log(dataUser)

        await userStatusLevelService.createNewUserStatusLevel(dataUser)

        const result = await axios.post(config.endpoint, null, { params: order });

        return res.status(200).json(result.data);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const paymentCallBackController = async (req, res) => {
    let result = {};

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng ở đây
            let dataJson = JSON.parse(dataStr, config.key2);

            const item = JSON.parse(dataJson.item)[0]

            const NEWSTATUSVIPID = 1
            const STATUSPAYMENTSUCCESS = 1

            console.log(req.body)

            const data = {
                userId: item.userId,
                currentStatusId: item.currentStatusId,
                newStatusId: NEWSTATUSVIPID,
                durationId: item.durationId,
                statusId: STATUSPAYMENTSUCCESS,
                app_trans_id: dataJson['app_trans_id']
            };

            console.log(data)

            await userStatusLevelService.updateTransactionStatusAndUserStatusLevel(data);

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.log('Error:' + ex.message);

        try {
            // Dự phòng: Cập nhật trạng thái thất bại
            let dataStr = req.body.data;
            let dataJson = JSON.parse(dataStr, config.key2);
            const item = JSON.parse(dataJson.item)[0]

            const NEWSTATUSNORMALID = 2;
            const STATUSPAYMENTFAILED = 3;

            const data = {
                userId: item.userId,
                currentStatusId: item.currentStatusId,
                newStatusId: NEWSTATUSNORMALID,
                durationId: item.durationId,
                statusId: STATUSPAYMENTFAILED,
                app_trans_id: dataJson['app_trans_id']
            };

            await userStatusLevelService.updateTransactionStatusAndUserStatusLevel(data);

        } catch (innerEx) {
            console.error('Inner error while handling fallback:', innerEx.message);
        }

        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
};


const checkStatusOrderController = async (req, res) => {
    const { app_trans_id } = req.body;

    let postData = {
        app_id: config.app_id,
        app_trans_id, // Input your app_trans_id
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
    };


    try {
        const result = await axios(postConfig);
        console.log(result.data);
        return res.status(200).json(result.data);
        /**
         * kết quả mẫu
          {
            "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
            "return_message": "",
            "sub_return_code": 1,
            "sub_return_message": "",
            "is_processing": false,
            "amount": 50000,
            "zp_trans_id": 240331000000175,
            "server_time": 1711857138483,
            "discount_amount": 0
          }
        */

    } catch (error) {

        console.log(error);

    }
};


module.exports = {
    paymentController,
    paymentCallBackController,
    checkStatusOrderController
};