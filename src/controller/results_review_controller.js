import resultsReviewServices from '../services/results_review_service'

const getResultsReviewByUserId = async (req, res) => {
    try {
        const data = await resultsReviewServices.getResultsReviewByUserId({ userId: req.user.userId });
        if (data) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
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


const createNewResultsReview = async (req, res) => {
    try {
        const data = await resultsReviewServices.createNewResultsReview({ ...req.body, userId: req.user.userId });
        if (data) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
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

module.exports = {
    createNewResultsReview, getResultsReviewByUserId
};