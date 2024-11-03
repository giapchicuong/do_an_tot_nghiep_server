import db from "../config/db";

const createNewReviewVersion = async (db, userId, versionId, rating) => {

    const sql = "insert into `review_version` (UserId,VersionId,Rating) values(?,?,?)";

    const values = [userId, versionId, rating];

    const [data] = await db.query(sql, values);

    if (data.affectedRows > 0 && data.insertId) {

        return data.insertId;
    } else {

        throw new Error("Creating data failed");
    }
}

const createNewReviewDetailVersion = async (db, reviewId, reviewOptions) => {
    console.log('reviewoptions', reviewOptions)
    for (const item of reviewOptions) {

        const sql = `
        insert into review_detail_version (ReviewId,ReviewOptionId)
          values (?,?);
          `;

        const values = [reviewId, item.reviewOptionId];

        await db.query(sql, values);
    }

}


const createNewReviewApp = async (rawData) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const reviewId = await createNewReviewVersion(connection, rawData.userId, rawData.versionId, rawData.rating);

        await createNewReviewDetailVersion(connection, reviewId, rawData.reviewOptions)
        await connection.commit();

        return {
            EM: "Create new review app success.",
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
    createNewReviewApp,
};
