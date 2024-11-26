import db from "../config/db";

const getVersionData = async () => {
    try {
        const sql = "select versionId, nameVersion, isSelectedVersion, created_at as createdAt from app_versions";

        const [data, fields] = await db.query(sql);

        if (data) {
            return data
        }

    } catch (error) {
        console.log(error);
        throw new Error("Get data failed");

    }
}

const getAllVersions = async () => {
    try {
        const data = await getVersionData()

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
            const data = await getVersionData()
            return {
                EM: "New app_versions created successfully",
                EC: 0,
                DT: data,
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

const updateVersion = async (rawData) => {
    try {

        const sql = `
       UPDATE app_versions
        SET isSelectedVersion = CASE
            WHEN versionId = ? THEN true
            ELSE false
        END;

`;

        const values = [rawData.versionId];

        const [data, fields] = await db.query(sql, values);


        if (data) {

            const data = await getVersionData()
            return {
                EM: "App_versions updated successfully",
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: "App_versions updated failed",
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
    updateVersion
};
