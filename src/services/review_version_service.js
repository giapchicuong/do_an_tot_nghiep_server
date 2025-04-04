import { is } from "bluebird";
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
    for (const item of reviewOptions) {

        const sql = `
        insert into review_detail_version (ReviewId,ReviewOptionId)
          values (?,?);
          `;

        const values = [reviewId, item.reviewOptionId];

        await db.query(sql, values);
    }

}


const getVersionTotalRatingAndAvgRating = async () => {
    try {
        const sql = `
            SELECT 
            COALESCE(count(rv.rating), 0) AS totalRating, 
            COALESCE(AVG(rv.rating), 0) AS avgRating, 
            av.versionId, 
            av.nameVersion, 
            av.created_at AS createdAt
        FROM 
            app_versions av
        LEFT JOIN 
            review_version rv ON av.versionId = rv.versionId
        WHERE 
            av.isSelectedVersion = true
        GROUP BY 
            av.versionId, av.nameVersion, av.created_at;

        `;

        const [data, fields] = await db.query(sql);


        if (data && data.length > 0) {
            return {
                EM: "Get data success.",
                EC: 0,
                DT: data[0],
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


const getOptionRating = async () => {
    try {
        const sql = `
       
                select reviewOptionId, reviewOptionName from review_options;
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

const checkUserIsRating = async (connection, userId) => {
    const sql = `
      SELECT * FROM review_version where userId= ?;
    `;

    const [data, fields] = await connection.query(sql, [userId]);
    if (data.length > 0) {
        return true
    } else {
        return false
    }
};



const getUserRatings = async (connection) => {
    const sql = `
        SELECT 
            u.email,
            rv.rating,
            av.nameVersion,
            GROUP_CONCAT(ro.reviewOptionName ORDER BY rv.created_at SEPARATOR ', ') AS reviewOptions,
            MAX(rv.created_at) AS createdAt
        FROM review_version rv
        LEFT JOIN review_detail_version rdv ON rdv.ReviewId = rv.ReviewId
        LEFT JOIN users u ON u.userId = rv.userId
        LEFT JOIN app_versions av ON av.versionId = rv.VersionId
        LEFT JOIN review_options ro ON ro.ReviewOptionId = rdv.reviewOptionId
        WHERE av.IsSelectedVersion=true
        GROUP BY u.username, u.email, av.nameVersion, rv.rating
        ORDER BY createdAt DESC
        LIMIT 20;
    `;

    return await connection.query(sql);
};



const getListUserRating = async (rawData) => {
    try {
        const [data, fields] = await getUserRatings(db);

        if (data) {
            const isRating = await checkUserIsRating(db, rawData.userId)
            return {
                EM: "Get data success.",
                EC: 0,
                DT: {
                    isRating: isRating,
                    listRating: data
                },
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



const createNewReviewApp = async (rawData) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const reviewId = await createNewReviewVersion(connection, rawData.userId, rawData.versionId, rawData.rating);

        await createNewReviewDetailVersion(connection, reviewId, rawData.reviewOptions)

        const [data, fields] = await getUserRatings(connection);

        await connection.commit();
        if (data) {
            const isRating = await checkUserIsRating(db, rawData.userId)
            return {
                EM: "Create new review app success.",
                EC: 0,
                DT: {
                    isRating: isRating,
                    listRating: data
                },
            };
        }

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
    getOptionRating,
    getVersionTotalRatingAndAvgRating,
    getListUserRating
};
