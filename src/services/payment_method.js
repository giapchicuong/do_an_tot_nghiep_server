import db from "../config/db";

const getAllPaymentMethod = async () => {
    try {
        const sql = "SELECT methodId, methodName FROM do_an_tot_nghiep.payment_method";

        const [data, fields] = await db.query(sql);

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
    getAllPaymentMethod,
};
