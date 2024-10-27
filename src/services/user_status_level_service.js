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

    static createNewPaymentTransaction = async (db, userId, methodId, amount, statusId) => {
        const sql = "insert into `paymen_transaction`(UserId,MethodId,Amount,StatusId) values (?,?,?,?)";

        const values = [userId, methodId, amount, statusId];

        const [data] = await db.query(sql, values);

        if (data.affectedRows > 0 && data.insertId) {

            return data.insertId
        } else {
            throw new Error("Creating paymen_transaction failed");
        }
    }

    static updateTimeEndUserStatusLevel = async (db, userId, statusId, durationId) => {

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

        const [data] = await db.query(sql, [durationId, statusId, durationId, userId, statusId]);

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

const createNewUserStatusLevel = async (rawData) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const STATUSSUCCESSID = 1

        const transactionId = await UserStatusLevel.createNewPaymentTransaction(connection, rawData.userId, rawData.methodId, rawData.amount, STATUSSUCCESSID);
        await UserStatusLevel.updateTimeEndUserStatusLevel(connection, rawData.userId, rawData.currentStatusId, rawData.durationId);
        await UserStatusLevel.createHistoryUserUpgrade(connection, rawData.userId, rawData.currentStatusId, rawData.newStatusId, transactionId);

        await connection.commit();

        return {
            EM: "Create new user status level success.",
            EC: 0,
            DT: [],
        };

    } catch (error) {
        await connection.rollback();

        console.log(error);
        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    } finally {

        connection.release();
    }
}



module.exports = {
    getAllUserStatusLevel,
    createNewUserStatusLevel
};
