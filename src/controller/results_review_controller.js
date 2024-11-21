import resultsReviewServices from '../services/results_review_service'

const createNewResultsReview = async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    try {
        if (!req.file) {
            return res.status(200).json({
                EM: "Cannot put image",
                EC: 2,
                DT: [req.file],
            });
        } else {
            if (
                req.file.mimetype === "image/png" ||
                req.file.mimetype === "image/jpg" ||
                req.file.mimetype === "image/jpeg"
            ) {
                const data = await resultsReviewServices.createNewResultsReview({ ...req.body, userId: req.user.userId, imageUrl: req.file.filename });
                if (data) {
                    return res.status(200).json({
                        EM: data.EM,
                        EC: data.EC,
                        DT: data.DT,
                    });
                }
            } else {
                return res.status(200).json({
                    EM: "Only upload type of image : png, jpg, jpeg",
                    EC: 2,
                    DT: [req.file.mimetype],
                });
            }
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
    createNewResultsReview,
};