import db from "../config/db";
import checkValidService from './check_valid_service'

const getAllUser = async () => {
    try {
        const sql = "select userId,fullName,email,phone,groupId,created_at as createdAt FROM users";

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

const createNewUser = async (rawData) => {
    try {
        // Check email exist
        let isEmailExist = await checkValidService.checkEmailExist(rawData.email);

        if (isEmailExist) {
            return {
                EM: "The email is already exist",
                EC: 1,
                DT: "email",
            };
        }

        // Hass password
        const hassPass = checkValidService.hashPassword(rawData.password);

        const sql =
            "insert into `users`(userName,fullName,email,phone,password,groupId) VALUES (?, ?, ?, ?, ?, ?)";

        const values = [rawData.userName, rawData.fullName, rawData.email, rawData.phone, hassPass, rawData.groupId,];

        const [data, fields] = await db.query(sql, values);

        if (data) {
            return {
                EM: "New user created successfully",
                EC: 0,
                DT: rawData,
            };
        } else {
            return {
                EM: "Creating a new user failed",
                EC: 2,
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
};


const updateUser = async (rawData) => {
    try {

        const sql = "update users set fullName = ?,groupId = ? where userId = ?";

        const values = [rawData.fullName, rawData.groupId, rawData.userId];

        const [data, fields] = await db.query(sql, values);

        if (data.affectedRows > 0) {

            return {
                EM: "A user updated successfully",
                EC: 0,
                DT: rawData,
            };
        } else {
            return {

                EM: "Updated a new user failed",
                EC: 2,
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
};

const getUserById = async (id) => {
    try {
        const sql = `
                                    SELECT 
                    u.fullName, 
                    u.email, 
                    COUNT(DISTINCT rr.ResultId) AS totalResultReview, 
                    (SELECT sl.statusName 
                    FROM status_level sl 
                    JOIN user_status_level usl ON usl.statusId = sl.statusId 
                    WHERE usl.userid = u.userid 
                    LIMIT 1) AS statusName,
                    (SELECT 
                        CASE 
                            WHEN usl.timeEnd IS NULL OR usl.timeEnd < NOW() THEN 0
                            ELSE FLOOR((UNIX_TIMESTAMP(usl.timeEnd) - UNIX_TIMESTAMP(NOW())) / 86400)
                        END 
                    FROM user_status_level usl 
                    WHERE usl.userid = u.userid 
                    LIMIT 1) AS timeInDayEnd
                FROM 
                    users u
                LEFT JOIN 
                    results_review rr ON rr.userid = u.userid
                LEFT JOIN 
                    user_status_level usl ON usl.userid = u.userid
                WHERE 
                    u.userid = ?
                GROUP BY 
                    u.userid;

        `;

        const values = [id];
        const [data, fields] = await db.query(sql, values);

        if (data.length > 0) {
            return {
                EM: "Get data success.",
                EC: 0,
                DT: data[0],
            };
        } else {
            return {
                EM: "Get data fail.",
                EC: 1,
                DT: {},
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

const checkUserLevelIsAdmin = async (id) => {
    try {
        const sql = `
                select do.durationId
                from user_status_level usl
                left join duration_options do on do.durationId = usl.durationId
                where usl.userId = ? and usl.statusId =1;
        `;

        const values = [id];
        const [data, fields] = await db.query(sql, values);


        if (data.length > 0) {
            return data;
        }
        return;

    } catch (error) {
        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}


const checkTimeEndAndUpdate = async (id) => {
    try {
        const sql = `
                 UPDATE user_status_level usl
                SET usl.TimeEnd = null, usl.TimeStart = NOW(), usl.DurationId = 6, usl.StatusId = 2
                WHERE usl.timeEnd < NOW() and usl.userid = ?;
        `;

        const values = [id];
        const [data, fields] = await db.query(sql, values);

        if (data.affectedRows > 0) {
            return data.affectedRows;
        } else {
            return;
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
    getAllUser,
    getUserById,
    createNewUser,
    updateUser,
    checkTimeEndAndUpdate,
    checkUserLevelIsAdmin
};
