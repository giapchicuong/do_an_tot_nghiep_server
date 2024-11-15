import db from "../config/db";
import checkValidService from './check_valid_service'

const getAllUserStatusLevel = async () => {
    try {
        const sql = `
                select usl.userStatusLevelId,u.fullName, u.email, sl.statusId,dos.durationTime,dos.durationName, usl.timeStart,usl.timeEnd
                from user_status_level usl
                left join users u on usl.UserId = u.UserId
                left join status_level sl on usl.StatusId = sl.StatusId
                left join duration_options dos on usl.DurationId= dos.DurationId
        `;

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

class UserStatusLevel {

    static createNewPaymentTransaction = async (db, userId, methodId, amount, statusId, app_trans_id) => {
        const sql = "insert into `paymen_transaction`(UserId,MethodId,Amount,StatusId, app_trans_id) values (?,?,?,?,?)";

        const values = [userId, methodId, amount, statusId, app_trans_id];

        const [data] = await db.query(sql, values);

        if (data.affectedRows > 0 && data.insertId) {

            return data.insertId
        } else {
            throw new Error("Creating paymen_transaction failed");
        }
    }

    static updateTransactionStatus = async (db, statusId, app_trans_id) => {
        const sql = "update `paymen_transaction` set statusId = ? where app_trans_id = ?";

        const values = [statusId, app_trans_id];

        const [data] = await db.query(sql, values);

        if (data.affectedRows > 0 && data.changedRows) {

            return data
        } else {
            throw new Error("Creating updateTransactionStatus failed");
        }
    }

    static updateTimeEndUserStatusLevel = async (db, userId, currentStatusId, newStatusId, durationId) => {

        const getDurationName = async (db, durationId) => {
            const sql = "SELECT durationName FROM duration_options WHERE durationId = ?";
            const [data] = await db.query(sql, [durationId]);
            if (data.length) {
                return data[0].durationName;
            } else {
                throw new Error("Get durationName failed");
            }
        };

        const durationName = await getDurationName(db, durationId);
        const intervalType = { days: 'DAY', months: 'MONTH' }[durationName];

        if (!intervalType) {
            throw new Error("Invalid durationName");
        }

        const sql = `UPDATE user_status_level
                     SET TimeEnd = DATE_ADD(TimeStart, INTERVAL 
                     (SELECT DurationTime FROM duration_options WHERE DurationID = ?) ${intervalType}), 
                     statusId = ?, durationId = ?
                     WHERE UserId = ? AND StatusID = ?`;

        const [data] = await db.query(sql, [durationId, newStatusId, durationId, userId, currentStatusId]);

        if (data.affectedRows > 0 && data.changedRows) {

            return data;
        } else {
            throw new Error("Updating user_status_level failed");
        }
    }


    static createHistoryUserUpgrade = async (db, userId, oldStatusId, newStatusId, transactionId) => {
        const sql = "insert into history_user_upgrades (UserId,OldStatusId,NewStatusId,TransactionId) values(?, ?, ?, ?)"

        const value = [userId, oldStatusId, newStatusId, transactionId]

        const [data] = await db.query(sql, value);

        if (data.affectedRows > 0 && data.insertId) {

            return data.insertId
        } else {
            throw new Error("Create history_user_upgrades failed");
        }
    }
}

const getDurationAmount = async (durationId) => {
    try {
        const sql = "SELECT durationPrice FROM duration_options WHERE durationId = ?";

        const values = [durationId]
        const [data, fields] = await db.query(sql, values);

        if (data.length) {
            return data[0].durationPrice;

        } else {
            throw new Error("Get durationPrice failed");
        }

    } catch (error) {
        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}

const createNewUserStatusLevel = async (rawData) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const STATUSWAITID = 2

        const transactionId = await UserStatusLevel.createNewPaymentTransaction(connection, rawData.userId, rawData.methodId, rawData.durationPrice, STATUSWAITID, rawData.app_trans_id);

        await UserStatusLevel.createHistoryUserUpgrade(connection, rawData.userId, rawData.currentStatusId, rawData.newStatusId, transactionId);

        await connection.commit();

        return;

    } catch (error) {
        await connection.rollback();

        console.log(error);
        throw new Error("Create createNewUserStatusLevel failed");

    } finally {

        connection.release();
    }
}

const updateTransactionStatusAndUserStatusLevel = async (rawData) => {
    const connection = await db.getConnection();

    try {
        await UserStatusLevel.updateTimeEndUserStatusLevel(connection, rawData.userId, rawData.currentStatusId, rawData.newStatusId, rawData.durationId);

        await UserStatusLevel.updateTransactionStatus(connection, rawData.statusId, rawData.app_trans_id);

        await connection.commit();

        return;

    } catch (error) {
        console.log(error);

        throw new Error("Create updateTransactionStatusAndUserStatusLevel failed");
    }
}



module.exports = {
    getAllUserStatusLevel,
    createNewUserStatusLevel,
    updateTransactionStatusAndUserStatusLevel,
    getDurationAmount
};
