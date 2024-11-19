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



const getOptionName = async () => {
    try {
        const sql = `
            select ro.reviewOptionName
            from review_options ro 
        `;

        const [data] = await db.query(sql);

        return data;
    } catch (error) {
        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}


const getAvgNumberStar = async () => {
    try {
        const sql = `
              WITH date_range AS (
                SELECT '2024-11-01' AS reviewDate
                UNION ALL SELECT '2024-11-02'
                UNION ALL SELECT '2024-11-03'
                UNION ALL SELECT '2024-11-04'
                UNION ALL SELECT '2024-11-05'
                UNION ALL SELECT '2024-11-06'
                UNION ALL SELECT '2024-11-07'
            )

            -- Kết hợp với bảng review_version để tính trung bình sao cho từng ngày
            SELECT 
                dr.reviewDate,
                ROUND(COALESCE(AVG(rv.rating), 0),2) AS averageRating, -- Tránh giá trị NULL, trả về 0 nếu không có đánh giá
                COUNT(rv.rating) AS totalCount -- Số lượng đánh giá
            FROM 
                date_range dr
            LEFT JOIN review_version rv
                ON DATE(rv.created_at) = dr.reviewDate
                AND EXTRACT(MONTH FROM rv.created_at) = 11  -- Lọc theo tháng 11
                AND EXTRACT(YEAR FROM rv.created_at) = 2024  -- Lọc theo năm 2024
            WHERE
                dr.reviewDate BETWEEN '2024-11-01' AND '2024-11-07'  -- Điều kiện ngày bắt đầu và ngày kết thúc
            GROUP BY 
                dr.reviewDate
            ORDER BY 
                dr.reviewDate ASC;
        `;

        const [data] = await db.query(sql);

        return data;
    } catch (error) {
        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}

const getOption = async () => {
    try {
        const sql = `
                        WITH date_range AS (
                SELECT '2024-11-01' AS reviewDate
                UNION ALL SELECT '2024-11-02'
                UNION ALL SELECT '2024-11-03'
                UNION ALL SELECT '2024-11-04'
                UNION ALL SELECT '2024-11-05'
                UNION ALL SELECT '2024-11-06'
                UNION ALL SELECT '2024-11-07'
            ),
            option_list AS (
                SELECT ReviewOptionName
                FROM review_options
            ),
            date_option_combination AS (
                SELECT dr.reviewDate, ol.ReviewOptionName
                FROM date_range dr
                CROSS JOIN option_list ol
            )

            SELECT 
                doc.reviewDate,
                COALESCE(doc.ReviewOptionName, 'Không có đánh giá') AS nameOption,
                COALESCE(COUNT(rdv.reviewOptionId), 0) AS totalReviewOption
            FROM 
                date_option_combination doc
            LEFT JOIN review_version rv
                ON DATE(rv.created_at) = doc.reviewDate
            LEFT JOIN review_detail_version rdv
                ON rdv.reviewId = rv.reviewId
            LEFT JOIN review_options ro 
                ON ro.ReviewOptionName = doc.ReviewOptionName
            GROUP BY 
                doc.reviewDate, 
                doc.ReviewOptionName
            ORDER BY 
                doc.reviewDate ASC, 
                doc.ReviewOptionName;
                        
        `;

        const [data] = await db.query(sql);

        return data;
    } catch (error) {
        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    }
}



const getAvgAndNumberOption = async (rawData) => {
    try {

        const optionsDate = [
            "2024-11-01",
            "2024-11-02",
            "2024-11-03",
            "2024-11-04",
            "2024-11-05",
            "2024-11-06",
            "2024-11-07",
        ];

        const options = [
            "Bất tiện",
            "Chậm",
            "Chính xác",
            "Không chính xác",
            "Nhanh",
            "Tiện lợi",
        ];

        // const listOptionName = await getOptionName();
        const dataAvg = await getAvgNumberStar();
        const dataOption = await getOption();
        console.log(dataOption)
        if (dataAvg) {
            const dateTime = dataAvg.map((e) => e.reviewDate)
            const averageRating = dataAvg.map((e) => e.averageRating)
            const value0 = dataOption
                .filter((e) => e.reviewDate === optionsDate[0])
                .map((e) => e.totalReviewOption);

            const value1 = dataOption
                .filter((e) => e.reviewDate === optionsDate[1])
                .map((e) => e.totalReviewOption);

            const value2 = dataOption
                .filter((e) => e.reviewDate === optionsDate[2])
                .map((e) => e.totalReviewOption);

            const value3 = dataOption
                .filter((e) => e.reviewDate === optionsDate[3])
                .map((e) => e.totalReviewOption);

            const value4 = dataOption
                .filter((e) => e.reviewDate === optionsDate[4])
                .map((e) => e.totalReviewOption);

            const value5 = dataOption
                .filter((e) => e.reviewDate === optionsDate[5])
                .map((e) => e.totalReviewOption);

            const value6 = dataOption
                .filter((e) => e.reviewDate === optionsDate[6])
                .map((e) => e.totalReviewOption);

            // const options = listOptionName.map((e) => e.reviewOptionName)

            return {
                EM: "Get list data success.",
                EC: 0,
                DT: [
                    {
                        dateTime: dateTime
                    },
                    {
                        averageRating: averageRating
                    },
                    {
                        name: options[0],
                        value: value0
                    },
                    {
                        name: options[1],
                        value: value1
                    },
                    {
                        name: options[2],
                        value: value2
                    },
                    {
                        name: options[3],
                        value: value3
                    },
                    {
                        name: options[4],
                        value: value4
                    },
                    {
                        name: options[5],
                        value: value5
                    },
                    {
                        name: options[6],
                        value: value6
                    },
                ],
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

class TotalReviewOption {

    static getTotalReviewOptionByDate = async (date) => {
        try {
            const sql = `
                SELECT 
                    rdv.reviewOptionid, ro.reviewOptionName,
                    COUNT(rdv.reviewOptionid) AS totalReviewOption
                FROM 
                    review_detail_version rdv
                LEFT JOIN review_options ro on ro.reviewOptionId = rdv.ReviewOptionId
                WHERE 
                    rdv.created_at = ?

                GROUP BY 
                    rdv.reviewOptionid, ro.reviewOptionName
                ORDER BY
                    ro.reviewOptionId asc;
            `;

            const values = [date]

            const [data] = await db.query(sql, values);

            return data;

        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }

    static getAvgStarByDayMonthYear = async (date) => {
        try {
            const sql = `
               SELECT 
                    DATE_FORMAT(created_at, '%e/%c') AS dayMonth, 
                    ROUND(AVG(rv.rating), 1) AS avgRating
                FROM 
                    review_version rv
                WHERE 
                    DATE(rv.created_at) = ?
                GROUP BY 
                    dayMonth;
            `;

            const value = [date]

            const [data, fields] = await db.query(sql, value);

            return data;

        } catch (error) {
            console.log(error);

            return {
                EM: "Some thing went wrong in service ...",
                EC: -2,
            };
        }
    }
}
const getAvgStarAndTotalOptionByDate = async (rawData) => {
    const listDayMonth = [];
    const listDataAvgStar = [];
    const resultMap = {};

    try {
        for (const item of rawData.days) {

            const avgStar = await TotalReviewOption.getAvgStarByDayMonthYear(item);
            const totalReview = await TotalReviewOption.getTotalReviewOptionByDate(item);

            if (avgStar) {
                avgStar.forEach((e) => listDayMonth.push(e.dayMonth));
                avgStar.forEach((e) => listDataAvgStar.push(e.avgRating));
            }

            if (totalReview) {
                totalReview.forEach((e) => {
                    const name = getNameByReviewOptionId(e.reviewOptionid);
                    if (!resultMap[name]) {
                        resultMap[name] = { name: name, data: [] };
                    }
                    resultMap[name].data.push(e.totalReviewOption);
                });
            }
        }

        // Chuyển kết quả từ đối tượng resultMap sang mảng result
        const result = Object.values(resultMap);

        return {
            EM: "get data success",
            EC: 0,
            DT: {
                listDayMonth,
                listDataAvgStar,
                result
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

// Hàm ví dụ để lấy tên theo reviewOptionid
function getNameByReviewOptionId(id) {
    switch (id) {
        case 1: return "Chính xác";
        case 2: return "Nhanh";
        case 3: return "Tiện lợi";
        case 4: return "Chậm";
        case 5: return "Không chính xác";
        case 6: return "Bất tiện";
        default: return "Không xác định";
    }
}



module.exports = {
    getTotalListButtonDashboard,
    getTotalStarToday,
    getListReviewOptions,
    getPercentageStar,
    getPercentageOption,
    getAvgAndNumberOption,
    getAvgStarAndTotalOptionByDate
};
