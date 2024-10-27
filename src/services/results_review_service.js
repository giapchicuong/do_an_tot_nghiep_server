import db from "../config/db";

const createNewResultsReview = async (rawData) => {
    try {
        const sql = "insert into `results_review`(UserId,RatingId,ImageUrl) values (?,?,?)";

        const values = [rawData.userId, rawData.ratingId, rawData.imageUrl];

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
};
