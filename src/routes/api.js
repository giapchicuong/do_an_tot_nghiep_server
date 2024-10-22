import express from "express";
import authController from "../controller/auth_controller";
import userController from "../controller/user_controller";
import groupsController from "../controller/groups_controller";
import rolesController from "../controller/roles_controller";
import ratingLevelController from "../controller/rating_level_controller";
import userStatusLevelController from "../controller/user_status_level_controller";
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


    return app.use("/api/v1/", router);
};

export default initApiRoutes;