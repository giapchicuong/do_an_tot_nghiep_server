import db from "../config/db";

const getAllVersions = async () => {
    try {
        const sql = "select versionId, nameVersion, isSelectedVersion, created_at as createdAt from app_versions";

        const [data, fields] = await db.query(sql);

        if (data) {
            return {
                EM: "Get app_versions success.",
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: "Get app_versions fail.",
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

const createNewVersion = async (rawData) => {
    try {

        const sql =
            "insert into `app_versions`(nameVersion) value (?)";

        const values = [rawData.nameVersion];

        const [data, fields] = await db.query(sql, values);

        if (data) {
            return {
                EM: "New app_versions created successfully",
                EC: 0,
                DT: rawData,
            };
        } else {
            return {
                EM: "Creating a new app_versions failed",
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
    getAllVersions,
    createNewVersion,
};
