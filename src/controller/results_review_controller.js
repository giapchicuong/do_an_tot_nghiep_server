import resultsReviewServices from '../services/results_review_service'

const createNewResultsReview = async (req, res) => {
    try {
        const data = await resultsReviewServices.createNewResultsReview(req.body);

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
    createNewResultsReview,
};