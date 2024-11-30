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

class GetPercentageStar {

    static getCountReview = async (db, rating, versionId, month, year) => {
        const sql = `
                   select count(reviewId) as countReview from review_version where rating =? and versionId = ? and MONTH(created_at) = ? and YEAR(created_at) = ?
        `;

        const [data] = await db.query(sql, [rating, versionId, month, year]);
        return data[0] ?? { countReview: 0 };
    }

    static getTotalReview = async (db, versionId, month, year) => {
        const sql = `
                  select count(reviewId) as totalReview from review_version where versionId = ? and MONTH(created_at) = ? and YEAR(created_at) = ?
        `;

        const [data] = await db.query(sql, [versionId, month, year]);
        return data[0].totalReview ?? { totalReview: 0 };
    }
}

const getPercentageStar = async (rawData) => {
    try {
        const listData = []
        const totalReview = await GetPercentageStar.getTotalReview(db, rawData.versionId, rawData.month, rawData.year)

        for (var i = 1; i <= 5; i++) {
            const data = await GetPercentageStar.getCountReview(db, i, rawData.versionId, rawData.month, rawData.year)
            const numberRating = data?.countReview ?? 0
            const result = totalReview > 0 ? parseFloat(((numberRating / totalReview) * 100).toFixed(2)) : 0

            listData.push(result)
        }


        return {
            EM: "Get list data success.",
            EC: 0,
            DT: {
                name: ['1 sao', '2 sao', '3 sao', '4 sao', '5 sao'],
                value: listData
            },
        };


    } catch (error) {
        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}


class GetPercentageOption {


    static getAllOption = async (db) => {
        const sql = `
                    SELECT reviewOptionId, reviewOptionName FROM review_options;
        `;

        const [data] = await db.query(sql);
        if (data.length > 0) {
            return data;
        } else {
            throw new Error("Get All Option failed");
        }
    }

    static getCountReviewByReviewDetailId = async (db, versionId, reviewOptionId, month, year) => {
        const sql = `
                   SELECT count(reviewDetailId) as countReview
                   FROM review_detail_version rdv
                   LEFT JOIN review_version rv ON rv.ReviewId = rdv.reviewId
                   WHERE versionId = ? AND rdv.reviewOptionId = ? and MONTH(rdv.created_at) = ? and YEAR(rdv.created_at) = ?
        `;

        const [data] = await db.query(sql, [versionId, reviewOptionId, month, year]);
        return data[0] ?? { countReview: 0 };
    }

    static getTotalReviewByReviewDetailByVersionId = async (db, versionId, month, year) => {
        const sql = `
                  SELECT count(reviewDetailId) as countReview
                  FROM review_detail_version rdv
                  LEFT JOIN review_version rv ON rv.ReviewId = rdv.reviewId
                  WHERE versionId = ? and MONTH(rdv.created_at) = ? and YEAR(rdv.created_at) = ?
        `;

        const [data] = await db.query(sql, [versionId, month, year]);
        return data[0] ?? { countReview: 0 };
    }
}

const getPercentageOption = async (rawData) => {
    try {
        const dataOption = await GetPercentageOption.getAllOption(db)

        const totalOption = await GetPercentageOption.getTotalReviewByReviewDetailByVersionId(db, rawData.versionId, rawData.month, rawData.year)

        const totalReviewCount = totalOption.countReview ?? 0;

        const ratingPromises = dataOption.map(async (item) => {
            const dataCount = await GetPercentageOption.getCountReviewByReviewDetailId(db, rawData.versionId, item.reviewOptionId, rawData.month, rawData.year)
            const countReview = dataCount.countReview ?? 0;
            const percentage = totalReviewCount > 0 ? parseFloat(((countReview / totalReviewCount) * 100).toFixed(2)) : 0;
            return percentage;
        });

        const listRatingResults = await Promise.all(ratingPromises);

        const nameOption = dataOption.map((e) => e.reviewOptionName)

        return {
            EM: "Get list data success.",
            EC: 0,
            DT: {
                nameOption: nameOption,
                listRating: listRatingResults,
            },
        };

    } catch (error) {
        console.log(error);
        return {
            EM: "Something went wrong in service ...",
            EC: -2,
        };
    }
}

class TotalReviewOption {

    static getAllOption = async (db) => {
        const sql = `
                    SELECT reviewOptionId, reviewOptionName FROM review_options;
        `;

        const [data] = await db.query(sql);
        if (data.length > 0) {
            return data;
        } else {
            throw new Error("Get All Option failed");
        }
    }


    static getCountReviewByDate = async (db, versionId, reviewOptionId, date) => {
        const sql = `
        SELECT count(rdv.reviewDetailId) as countReview
        FROM review_detail_version rdv
        LEFT JOIN review_version rv ON rv.ReviewId = rdv.ReviewId 
        WHERE rv.versionId = ? AND rdv.reviewOptionId = ? AND DATE(rdv.created_at) = ?;
        `
        const [data] = await db.query(sql, [versionId, reviewOptionId, date])
        return data[0].countReview ?? 0
    }

    static getTotalReviewByDate = async (db, date) => {
        const sql = `
         SELECT count(rdv.reviewDetailId) as totalReview
        FROM review_detail_version rdv
        LEFT JOIN review_version rv ON rv.ReviewId = rdv.ReviewId 
        WHERE  DATE(rdv.created_at) = ?;
        `
        const [data] = await db.query(sql, [date])
        return data[0].totalReview ?? 0
    }

    static getAvgStarByDate = async (db, versionId, date) => {
        const sql = `
        SELECT avg(rating) as avgStar
        FROM review_detail_version rdv
        LEFT JOIN review_version rv ON rv.ReviewId = rdv.ReviewId 
        WHERE rv.versionId = ?  AND DATE(rdv.created_at) = ?;
        `
        const [data] = await db.query(sql, [versionId, date])
        return data[0].avgStar ?? 0
    }



    static formattedDates = (dates) => {
        return dates.map(date => {
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        });
    };

}

const getAvgStarAndTotalOptionByDate = async (rawData) => {
    try {
        const allOptions = await TotalReviewOption.getAllOption(db);
        const listCountOption = [];
        const listAvgStar = [];

        const groupedData = {};
        allOptions.forEach(option => {
            groupedData[option.reviewOptionId] = {
                nameOption: option.reviewOptionName,
                value: []
            };
        });

        for (const date of rawData.dates) {
            for (const option of allOptions) {
                const data = await TotalReviewOption.getCountReviewByDate(
                    db,
                    rawData.versionId,
                    option.reviewOptionId,
                    date
                );
                groupedData[option.reviewOptionId].value.push(data);
            }
            const data = await TotalReviewOption.getAvgStarByDate(db, rawData.versionId, date)
            listAvgStar.push(data)
        }

        Object.values(groupedData).forEach(optionData => {
            if (optionData.value.length > 0) {
                listCountOption.push(optionData);
            }
        });

        return {
            EM: "Get data success",
            EC: 0,
            DT: {
                dates: TotalReviewOption.formattedDates(rawData.dates),
                avgStar: {
                    name: 'Trung bình số sao',
                    value: listAvgStar
                },
                listCountOption: listCountOption
            }
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something went wrong in service ...",
            EC: -2,
        };
    }
};




module.exports = {
    getTotalListButtonDashboard,
    getTotalStarToday,
    getListReviewOptions,
    getPercentageStar,
    getPercentageOption,
    getAvgStarAndTotalOptionByDate
};
