import userServices from '../services/user_service'

const readFunc = async (req, res) => {
    try {
        const data = await userServices.getAllUser();

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};
const createFunc = async (req, res) => {
    try {
        const data = await userServices.createNewUser(req.body);

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const updateFunc = async (req, res) => {
    try {
        const data = await userServices.updateUser(req.body);

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const getUserAccount = async (req, res) => {

    try {
        const dataCheckIsVip = await userServices.checkUserLevelIsVip(req.user.userId);

        if (dataCheckIsVip) {

            await userServices.checkTimeEndAndUpdate(req.user.userId);

            return res.status(200).json({
                EM: "Get user account successfully",
                EC: 0,
                DT: {
                    accessToken: req.accessToken,
                    refreshToken: req.refreshToken,
                    email: req.user.email,
                    userId: req.user.userId,
                    groupId: req.user.groupId,
                    isVip: true,
                    durations: dataCheckIsVip[0],
                },
            });
        } else {

            return res.status(200).json({
                EM: "Get user account successfully",
                EC: 0,
                DT: {
                    accessToken: req.accessToken,
                    refreshToken: req.refreshToken,
                    email: req.user.email,
                    userId: req.user.userId,
                    groupId: req.user.groupId,
                    isVip: false,
                    duration: null
                },
            });
        }

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const data = await userServices.getUserById(req.user.userId);

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            EM: "error from server",
            EC: "-1",
            DT: "",
        });
    }
};

module.exports = {
    readFunc,
    createFunc,
    updateFunc,
    getUserAccount,
    getUserById,
};