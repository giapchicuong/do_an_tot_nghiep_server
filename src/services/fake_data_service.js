import db from "../config/db";
import checkValidService from './check_valid_service'

const createNewReviewVersion = async (db, userId, versionId, rating, day) => {

    // Lấy ngày hiện tại và thay đổi ngày thành ngày được truyền vào
    const currentDate = new Date();  // Lấy ngày hiện tại
    const createdAt = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 0, 0, 0);

    const sql = "insert into `review_version` (UserId,VersionId,Rating,created_at,updated_at) values(?,?,?,?,?)";

    const values = [userId, versionId, rating, createdAt, createdAt];

    const [data] = await db.query(sql, values);

    if (data.affectedRows > 0 && data.insertId) {

        return data.insertId;
    } else {

        throw new Error("Creating data failed");
    }
}

const createNewReviewDetailVersion = async (db, reviewId, reviewOptions, day) => {

    const currentDate = new Date();  // Lấy ngày hiện tại
    const createdAt = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 0, 0, 0);

    for (const item of reviewOptions) {

        const sql = `
        insert into review_detail_version (ReviewId,ReviewOptionId,created_at,updated_at)
          values (?,?,?,?);
          `;

        const values = [reviewId, item.reviewOptionId, createdAt, createdAt];

        await db.query(sql, values);
    }

}

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
        WHERE av.created_at = (SELECT MAX(created_at) FROM app_versions)
        GROUP BY u.username, u.email, av.nameVersion, rv.rating
        ORDER BY createdAt DESC;
    `;

    return await connection.query(sql);
};



const createNewReviewApp = async (rawData) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const generateFakeItems = (startId, endId, startDay, endDay, versionId) => {
            const items = [];
            const userIds = Array.from({ length: endId - startId + 1 }, (_, i) => i + startId); // Tạo danh sách userId từ startId đến endId

            const userCount = userIds.length;
            const dayRange = endDay - startDay + 1;

            // Phân bổ người dùng ngẫu nhiên cho mỗi ngày
            const dailyUsers = Array.from({ length: dayRange }, () => []);

            // Chia đều hoặc ngẫu nhiên người dùng cho mỗi ngày
            userIds.forEach(userId => {
                const randomDay = Math.floor(Math.random() * dayRange) + startDay;
                dailyUsers[randomDay - startDay].push(userId);
            });

            // Duyệt qua từng ngày và tạo đánh giá cho người dùng
            dailyUsers.forEach((usersForDay, dayIndex) => {
                const day = startDay + dayIndex;

                usersForDay.forEach(userId => {
                    const rating = Math.floor(Math.random() * 5) + 1;

                    let availableOptions = [];
                    if (rating <= 3) {
                        availableOptions = [4, 5, 6];
                    } else {
                        availableOptions = [1, 2, 3];
                    }

                    const numOptions = Math.floor(Math.random() * 3) + 1;

                    let reviewOptions = [];
                    while (reviewOptions.length < numOptions) {
                        const randomOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
                        if (!reviewOptions.includes(randomOption)) {
                            reviewOptions.push(randomOption);
                        }
                    }

                    items.push({
                        userId,
                        versionId,
                        rating,
                        day: [day],
                        reviewOptions: reviewOptions.map(optionId => ({ reviewOptionId: optionId }))
                    });
                });
            });

            return items;
        };

        // Gọi hàm với các tham số: startId, endId, startDay, endDay, versionId
        const fakeItems = generateFakeItems(parseInt(rawData.startUserId), parseInt(rawData.endUserId), parseInt(rawData.startDay), parseInt(rawData.endDay), parseInt(rawData.versionId));

        console.log(fakeItems);


        for (const item of fakeItems) {

            const reviewId = await createNewReviewVersion(connection, item.userId, item.versionId, item.rating, item.day[0]);

            await createNewReviewDetailVersion(connection, reviewId, item.reviewOptions, item.day[0])

        }

        const [data, fields] = await getUserRatings(connection);

        await connection.commit();
        if (data) {

            return {
                EM: "Create new review app success.",
                EC: 0,
                DT: data,
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

const userStatusLevelService = async (connection, userId, statusId, durationId) => {

    const sql = `
    INSERT INTO user_status_level (UserId, StatusId, DurationId, TimeStart) 
    VALUES (?, ?, ?, ?)
`;
    const timeStart = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const values = [userId, statusId, durationId, timeStart];

    const [data, fields] = await connection.query(sql, values);

    if (data) {

        return data.insertId;
    } else {

        throw new Error("Creating UserStatus Level failed");
    }

}


const registerService = async (rawData) => {

    const connection = await db.getConnection();
    console.log(rawData)
    try {
        for (var i = parseInt(rawData.startId); i <= parseInt(rawData.totalLength); i++) {
            console.log(`Processing user with email: khachang${i}@gmail.com`);

            const hassPass = checkValidService.hashPassword('12345');

            const sql =
                "insert into `users`(UserName,FullName,Email,Phone,Password,GroupID) VALUES (?, ?, ?, ?, ?, ?)";
            const values = ['khachhang', 'khach hang', `khachang${i}@gmail.com`, '0000000000', hassPass, 2];

            try {
                const [data, fields] = await connection.query(sql, values);
                console.log('Inserted data:', data);

                if (data) {
                    await userStatusLevelService(connection, data.insertId, 2, 6);
                    await connection.commit();
                } else {
                    throw new Error("Failed to insert user");
                }
            } catch (error) {
                console.error(`Error inserting user khachang${i}@gmail.com:`, error);
                await connection.rollback();
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }



        return {
            EM: 'create many user success',
            EC: 0,
            DT: []
        }



    } catch (error) {

        console.log(error);

        return {
            EM: "Some thing went wrong in service ...",
            EC: -2,
        };
    } finally {

        connection.release();
    }
};



module.exports = {
    createNewReviewApp,
    registerService
};