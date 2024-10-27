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
            DT: [
                {
                    fruit: { total: totalReviewFruitToday, percent: percentReviewFruit },
                    app: { total: totalReviewAppToday, percent: percentReviewApp },
                    newMember: { total: totalNewMemberToday, percent: percentNewMember },
                    updateVip: { total: totalUpdateVipToday, percent: percentUpdateVip },
                }
            ]
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




module.exports = {
    getTotalListButtonDashboard,
    getTotalStarToday
};
