import paymentTransactionServices from '../services/payment_transaction_service'

const getPaymentTransactionByUserId = async (req, res) => {
    try {
        const data = await paymentTransactionServices.getPaymentTransactionByUserId({ userId: req.user.userId });

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};
module.exports = {
    getPaymentTransactionByUserId,
};