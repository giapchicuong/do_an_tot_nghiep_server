import db from '../config/db'
import checkValidService from './check_valid_service'
import JwtAction from '../middleware/jwt_action'

const userStatusLevelService = async (connection, userId, statusId, durationId) => {

    const sql =
        "insert into `user_status_level`(UserId,StatusId,DurationId) VALUES (?, ?, ?)";

    const values = [userId, statusId, durationId];

    const [data, fields] = await connection.query(sql, values);

    if (data) {

        return data.insertId;
    } else {

        throw new Error("Creating UserStatus Level failed");
    }

}


const registerService = async (rawData) => {

    const connection = await db.getConnection();
    try {
        // Check email exist
        let isEmailExist = await checkValidService.checkEmailExist(rawData.email);

        if (isEmailExist) {

            return {
                EM: "The email is already exist",
                EC: 1,
                DT: 'email',
            };
        }
        // Hass password
        const hassPass = checkValidService.hashPassword(rawData.password);

        const sql =
            "insert into `users`(UserName,FullName,Email,Phone,Password,GroupID) VALUES (?, ?, ?, ?, ?, ?)";

        const values = [rawData.userName, rawData.fullName, rawData.email, rawData.phone, hassPass, 2,];

        const [data, fields] = await connection.query(sql, values);

        if (data) {

            const userStatusLevelId = await userStatusLevelService(connection, data.insertId, 2, 6);

            await connection.commit();

            return {
                EM: "A user is created successfully",
                EC: 0,
                DT: rawData,
            };

        } else {

            await connection.rollback();

            return {
                EM: "A user is created fail",
                EC: 1,
            };
        }
    } catch (error) {

        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    } finally {

        connection.release();
    }
};

const loginService = async (rawData) => {
    try {
        const sql = "select Email, Password,GroupId from users where email=?";

        const values = [rawData.email];

        const [datas, fields] = await db.query(sql, values);


        if (datas.length > 0) {

            const data = datas[0];

            const hashedPassword = data.Password;

            const isCorrectPassword = checkValidService.checkPassword(
                rawData.password,
                hashedPassword
            );

            if (isCorrectPassword) {

                const payload = {
                    email: data.Email,
                    groupId: data.GroupId,
                };

                let accessToken = JwtAction.createAccessJwt(payload);

                let refreshToken = JwtAction.createRefreshJwt(payload);

                return {
                    EM: "Login successfully",
                    EC: 0,
                    DT: {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        email: data.Email,
                        groupId: data.GroupId,
                    },
                };
            } else {

                return {
                    EM: "Your email/phone number or password is incorrect!",
                    EC: 1,
                    DT: "",
                };
            }
        } else {

            return {
                EM: "Your email/phone number or password is incorrect!",
                EC: 1,
                DT: "",
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

module.exports = {
    registerService,
    loginService
};
