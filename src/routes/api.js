import express from "express";
import authController from "../controller/auth_controller";
import userController from "../controller/user_controller";
import groupsController from "../controller/groups_controller";
import rolesController from "../controller/roles_controller";
import ratingLevelController from "../controller/rating_level_controller";
import userStatusLevelController from "../controller/user_status_level_controller";
import dashboardController from "../controller/dashboard_controller";
import reviewVersionController from "../controller/review_version_controller";
import resultsReviewController from "../controller/results_review_controller";
import JwtAction from "../middleware/jwt_action";

const router = express.Router();

const initApiRoutes = (app) => {

    router.all("*", JwtAction.checkUserJwt);

    // Auth
    router.post("/register", authController.registerController);
    router.post("/login", authController.loginController);
    router.post("/logout", authController.logoutController);

    // Users
    router.get("/users/read", userController.readFunc);
    router.post("/users/create", userController.createFunc);
    router.put("/users/update", userController.updateFunc);
    router.get("/account", userController.getUserAccount);
    router.get("/user/getAccountInfo", userController.getUserById);

    // Groups
    router.get("/groups/read", groupsController.readFunc);
    router.post("/groups/create", groupsController.createFunc);
    router.delete("/groups/delete", groupsController.deleteFunc);
    router.put("/groups/update", groupsController.updateFunc);

    // Roles
    router.get("/roles/read", rolesController.readFunc);
    router.post("/roles/create", rolesController.createFunc);
    router.delete("/roles/delete", rolesController.deleteFunc);
    router.put("/roles/update", rolesController.updateFunc);

    // Rating Level
    router.get("/ratingLevel/read", ratingLevelController.readFunc);
    router.post("/ratingLevel/create", ratingLevelController.createFunc);
    router.delete("/ratingLevel/delete", ratingLevelController.deleteFunc);
    router.put("/ratingLevel/update", ratingLevelController.updateFunc);

    // User Status Level
    router.get("/userStatusLevel/read", userStatusLevelController.readFunc);
    router.post("/userStatusLevel/create", userStatusLevelController.createFunc);

    // Dashboard 
    router.get("/dashboard/getListTotal", dashboardController.getTotalListButtonDashboard);
    router.get("/dashboard/getTotalStar", dashboardController.getTotalStarToday);
    router.get("/dashboard/listReviewOptions", dashboardController.getListReviewOptions);

    // Analyst
    router.post("/dashboard/getPercentageStar", dashboardController.getPercentageStar);
    router.post("/dashboard/getPercentageOption", dashboardController.getPercentageOption);
    router.post("/dashboard/getAvgAndNumberOption", dashboardController.getAvgAndNumberOption);

    // Review Version
    router.post("/reviewVersion/create", reviewVersionController.createNewReviewApp);
    router.get("/reviewVersion/getOptionRating", reviewVersionController.getOptionRating);
    router.get("/reviewVersion/getVersionTotalRatingAndAvgRating", reviewVersionController.getVersionTotalRatingAndAvgRating);
    router.get("/reviewVersion/getListUserRating", reviewVersionController.getListUserRating);

    // Result Review
    router.post("/resultReview/create", resultsReviewController.createNewResultsReview);

    return app.use("/api/v1/", router);
};

export default initApiRoutes;