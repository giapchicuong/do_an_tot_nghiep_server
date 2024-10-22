import db from "../config/db";

const getAllRatingLevels = async () => {
    try {
        const sql = "select ratingId, ratingPercent, created_at as createdAt FROM `rating_level`";

        const [data, fields] = await db.query(sql);

        if (data) {
            return {
                EM: "Get rating level success.",
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: "Get rating level fail.",
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

const createNewRatingLevel = async (rawData) => {
    try {

        const sql =
            "insert into `rating_level`(`RatingPercent`) value (?)";

        const values = [rawData.ratingPercent];

        const [data, fields] = await db.query(sql, values);

        if (data) {
            return {
                EM: "New rating level created successfully",
                EC: 0,
                DT: rawData,
            };
        } else {
            return {
                EM: "Creating a new rating level failed",
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

const deleteRatingLevel = async (rawData) => {
    try {
        const sql = "delete from `rating_level` where ratingId = ? limit 1";

        const values = [rawData.ratingId];

        const [data, fields] = await db.query(sql, values);

        if (data.affectedRows > 0) {

            return {
                EM: "Delete rating level successfully",
                EC: 0,
                DT: rawData,
            };
        } else {

            return {
                EM: "Rating Level not exist",
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


const updateRatingLevel = async (rawData) => {
    try {

        const sql = "update `rating_level` set RatingPercent = ? where ratingId = ?";

        const values = [rawData.ratingPercent, rawData.ratingId];

        const [data, fields] = await db.query(sql, values);

        if (data.affectedRows > 0) {

            return {
                EM: "A rating updated successfully",
                EC: 0,
                DT: rawData,
            };
        } else {
            return {
                EM: "Rating level a new group failed",
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

module.exports = {
    getAllRatingLevels,
    createNewRatingLevel,
    updateRatingLevel,
    deleteRatingLevel
};
