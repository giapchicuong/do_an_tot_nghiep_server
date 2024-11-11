import dashboardServices from '../services/dashboard_service'

const getTotalListButtonDashboard = async (req, res) => {
    try {
        const data = await dashboardServices.getTotalListButtonDashboard();

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

const getTotalStarToday = async (req, res) => {
    try {
        const data = await dashboardServices.getTotalStarToday();

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

const getListReviewOptions = async (req, res) => {
    try {
        const data = await dashboardServices.getListReviewOptions();

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

const getPercentageStar = async (req, res) => {
    try {
        const data = await dashboardServices.getPercentageStar(req.body);

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

const getPercentageOption = async (req, res) => {
    try {
        const data = await dashboardServices.getPercentageOption(req.body);

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
    getTotalListButtonDashboard,
    getTotalStarToday,
    getListReviewOptions,
    getPercentageStar,
    getPercentageOption
};