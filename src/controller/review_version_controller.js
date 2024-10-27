import reviewVersionServices from '../services/review_version_service'

const createNewReviewApp = async (req, res) => {
    try {
        const data = await reviewVersionServices.createNewReviewApp(req.body);

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
    createNewReviewApp,
};