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



module.exports = {
    getAllUserStatusLevel,
};
