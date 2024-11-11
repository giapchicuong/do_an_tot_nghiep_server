import db from "../config/db";
import HelpFunction from "../utils/help_function";

class TotalReview {

    static getTotalReviewFruitYesterday = async () => {
        try {
            const sql = `
                    select resultId from results_review
                    WHERE DATE(created_at) = DATE(NOW() - INTERVAL 1 DAY);
            `;

            const [data] = await db.query(sql);

            return data.length;
        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }


    static getTotalReviewFruitToday = async () => {
        try {
            const sql = `
                    select resultId from results_review
                    where Date(created_at) = Date(Now()); 
            `;

            const [data] = await db.query(sql);

            return data.length;
        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }

    static getTotalReviewAppYesterday = async () => {
        try {
            const sql = `
                    select reviewid from review_version
                    WHERE DATE(created_at) = DATE(NOW() - INTERVAL 1 DAY);
            `;

            const [data] = await db.query(sql);

            return data.length;
        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }

    static getTotalReviewAppToday = async () => {
        try {
            const sql = `
                    select reviewid from review_version
                    where Date(created_at) = Date(Now()); 
            `;

            const [data] = await db.query(sql);

            return data.length;
        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }

    static getTotalNewMemberYesterday = async () => {
        try {
            const sql = `
                  select userId from users 
                    where DATE(created_at) = DATE(NOW() - INTERVAL 1 DAY) && groupId = 2; 
            `;

            const [data] = await db.query(sql);


            return data.length;
        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }

    static getTotalNewMemberToday = async () => {
        try {
            const sql = `
                  select userId from users 
                    where Date(created_at) = Date(Now()) && groupId = 2; 
            `;

            const [data] = await db.query(sql);

            return data.length;
        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }

    static getTotalUpdateVipYesterday = async () => {
        try {
            const sql = `
                    select UserStatusLevelId from user_status_level
                    where DATE(created_at) = DATE(NOW() - INTERVAL 1 DAY)  && statusid =1;
            `;

            const [data] = await db.query(sql);

            return data.length;
        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }

    static getTotalUpdateVipToday = async () => {
        try {
            const sql = `
                    select UserStatusLevelId from user_status_level
                    where Date(created_at) = Date(Now())  && statusid =1
            `;

            const [data] = await db.query(sql);

            return data.length;

        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }


}

const getTotalListButtonDashboard = async () => {
    try {
        const totalReviewFruitYesterday = await TotalReview.getTotalReviewFruitYesterday();
        const totalReviewAppYesterday = await TotalReview.getTotalReviewAppYesterday();
        const totalNewMemberYesterday = await TotalReview.getTotalNewMemberYesterday();
        const totalUpdateVipYesterday = await TotalReview.getTotalUpdateVipYesterday();

        const totalReviewFruitToday = await TotalReview.getTotalReviewFruitToday();
        const totalReviewAppToday = await TotalReview.getTotalReviewAppToday();
        const totalNewMemberToday = await TotalReview.getTotalNewMemberToday();
        const totalUpdateVipToday = await TotalReview.getTotalUpdateVipToday();

        const percentReviewFruit = HelpFunction.calculatorPercentTotalWithYesterday(totalReviewFruitToday, totalReviewFruitYesterday);
        const percentReviewApp = HelpFunction.calculatorPercentTotalWithYesterday(totalReviewAppToday, totalReviewAppYesterday);
        const percentNewMember = HelpFunction.calculatorPercentTotalWithYesterday(totalNewMemberToday, totalNewMemberYesterday);
        const percentUpdateVip = HelpFunction.calculatorPercentTotalWithYesterday(totalUpdateVipToday, totalUpdateVipYesterday);


        return {
            EM: "Get total success.",
            EC: 0,
            DT:
            {
                fruit: { total: totalReviewFruitToday, percent: percentReviewFruit },
                app: { total: totalReviewAppToday, percent: percentReviewApp },
                newMember: { total: totalNewMemberToday, percent: percentNewMember },
                updateVip: { total: totalUpdateVipToday, percent: percentUpdateVip },
            }

        };

    } catch (error) {
        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}

class TotalReviewStar {

    static getTotalReviewStarToday = async (star) => {
        try {
            const sql = `
                    select Rating from review_version
                    where Date(created_at) = Date(Now()) && rating = ${star};
            `;

            const [data] = await db.query(sql);

            return data.length;
        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }

}

const getTotalStarToday = async () => {

    try {
        const star1 = await TotalReviewStar.getTotalReviewStarToday(1);
        const star2 = await TotalReviewStar.getTotalReviewStarToday(2);
        const star3 = await TotalReviewStar.getTotalReviewStarToday(3);
        const star4 = await TotalReviewStar.getTotalReviewStarToday(4);
        const star5 = await TotalReviewStar.getTotalReviewStarToday(5);


        return {
            EM: "Get total success.",
            EC: 0,
            DT: {
                column: ['1 sao', '2 sao', '3 sao', '4 sao', '5 sao'],
                value: [star1, star2, star3, star4, star5],
            }
        };

    } catch (error) {
        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}

const getListReviewOptions = async () => {
    try {
        const sql = `
        SELECT 
        u.username,
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
        where Date(rv.created_at) = Date(Now())
        GROUP BY u.username, u.email, av.nameVersion,rv.rating;

        `;

        const [data, fields] = await db.query(sql);

        if (data) {
            return {
                EM: "Get list review options success.",
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: "Get review options fail.",
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


const getPercentageStar = async (rawData) => {
    try {
        const sql = `
                WITH total_reviews AS (
                SELECT 
                    COUNT(rating) AS total_count
                FROM 
                    review_version
                WHERE 
                    EXTRACT(YEAR FROM created_at) = ?
                    AND EXTRACT(MONTH FROM created_at) = ?
            )

            SELECT 
                rating AS numberStar,
                COUNT(rating) AS ratingCount,
                ROUND(COUNT(rating) * 100.0 / (SELECT total_count FROM total_reviews), 2) AS ratingPercentage
            FROM 
                review_version
            WHERE 
                EXTRACT(YEAR FROM created_at) = ?
                AND EXTRACT(MONTH FROM created_at) = ?
            GROUP BY 
                rating
            ORDER BY 
                rating desc;
        `;
        const values = [rawData.year, rawData.month, rawData.year, rawData.month];
        const [data, fields] = await db.query(sql, values);

        if (data) {
            const numberStar = data.map((e) => e.numberStar)
            const ratingPercentage = data.map((e) => e.ratingPercentage)
            const ratingCount = data.map((e) => e.ratingCount)
            return {
                EM: "Get list data success.",
                EC: 0,
                DT: [{ numberStar: numberStar }, { ratingCount: ratingCount }, { ratingPercentage: ratingPercentage }],
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

const getPercentageOption = async (rawData) => {
    try {
        const sql = `
              WITH totalReviewOption AS (
                    SELECT 
                        COUNT(reviewOptionId) AS totalOption
                    FROM 
                        review_detail_version
                    WHERE 
                        EXTRACT(YEAR FROM review_detail_version.created_at) = ?
                        AND EXTRACT(MONTH FROM review_detail_version.created_at) = ?
                )

                SELECT 
                    ro.reviewOptionName AS reviewOptionName,
                    COUNT(rdv.reviewOptionId) AS reviewOptionCount,
                    ROUND(COUNT(rdv.reviewOptionId) * 100.0 / (SELECT totalOption FROM totalReviewOption), 2) AS optionPercentage
                FROM 
                    review_version rv
                LEFT JOIN review_detail_version rdv ON rdv.reviewId = rv.reviewId
                LEFT JOIN review_options ro ON ro.reviewOptionId = rdv.reviewOptionId
                WHERE 
                    EXTRACT(YEAR FROM rdv.created_at) = ?
                    AND EXTRACT(MONTH FROM rdv.created_at) = ?
                GROUP BY 
                    ro.reviewOptionName
                ORDER BY 
                    ro.reviewOptionName;

        `;
        const values = [rawData.year, rawData.month, rawData.year, rawData.month];
        const [data, fields] = await db.query(sql, values);

        if (data) {
            const reviewOptionName = data.map((e) => e.reviewOptionName)
            const reviewOptionCount = data.map((e) => e.reviewOptionCount)
            const optionPercentage = data.map((e) => e.optionPercentage)
            return {
                EM: "Get list data success.",
                EC: 0,
                DT: [{ reviewOptionName: reviewOptionName }, { reviewOptionCount: reviewOptionCount }, { optionPercentage: optionPercentage }],
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
    getTotalListButtonDashboard,
    getTotalStarToday,
    getListReviewOptions,
    getPercentageStar,
    getPercentageOption
};
