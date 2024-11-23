import db from "../config/db";

const getPaymentTransactionByUserId = async (rawData) => {
    try {
        const sql = `
        SELECT pm.methodName, ts.statusName, pt.amount,do.durationTime,do.durationName, usl.timeStart, usl.timeEnd ,pt.created_at as createdAt
        FROM paymen_transaction pt
        left join payment_method pm on pm.methodId = pt.methodId
        left join transaction_status ts on ts.statusId = pt.statusId
		left join user_status_level usl on usl.userId = pt.userId
        left join duration_options do on do.durationId = usl.durationid
        where pt.userId=?
        order by pt.created_at desc
`;

        const value = [rawData.userId]

        const [data, fields] = await db.query(sql, value);

        if (data) {
            return {
                EM: "Get data success.",
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: "Get data fail.",
                EC: 1,
                DT: [],
            };
        }

    } catch (error) {
        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}

module.exports = {
    getPaymentTransactionByUserId,
}; 
