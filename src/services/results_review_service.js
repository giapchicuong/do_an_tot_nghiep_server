import db from "../config/db";

const getResultsReviewByUserId = async (rawData) => {
    try {
        const sql = "SELECT ratingName,ratingValue,imageUrl,created_at as createdAt FROM results_review where userId = ?";

        const values = [rawData.userId];

        const [data] = await db.query(sql, values);

        const updatedData = data.map(item => ({
            ...item,
            imageUrl: `${process.env.API}/api/v1/image/${item.imageUrl}`,
        }));

        return {
            EM: "Create new result review success.",
            EC: 0,
            DT: updatedData,
        };
    } catch (error) {

        console.log(error);
        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}

const createNewResultsReview = async (rawData) => {
    try {
        const sql = "insert into `results_review`(UserId,RatingValue,RatingName ,ImageUrl) values (?,?,?,?)";

        const values = [rawData.userId, rawData.ratingValue, rawData.ratingName, rawData.imageUrl];

        const [data] = await db.query(sql, values);

        if (data.affectedRows > 0) {

            return {
                EM: "Create new result review success.",
                EC: 0,
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
    createNewResultsReview,
    getResultsReviewByUserId
};
