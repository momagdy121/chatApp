import { Router } from "express";
import validateObjectID from "../middlewares/globalValidation/validateObjectID.js";
import authValidation from "../middlewares/authValidation/index.js";
import userController from "./../controllers/userController.js";
import checkBodyFieldsExistence from "../middlewares/globalValidation/checkBodyFieldsExistence.js";
import isDocumentExists from "./../middlewares/globalValidation/isDocumentExists.js";
import userModel from "../models/userModel.js";

const userRouter = Router();

userRouter.param("userId", validateObjectID("userId", "user"));
userRouter.param("userId", isDocumentExists(userModel, "userId", "user"));

//check if the user name is available or not to use
userRouter.get(
  "/username/check",
  checkBodyFieldsExistence(["username"]),
  userController.checkUsername
);

userRouter.use(authValidation.verifyAccessToken); //verify the access token

//get the data of the user
userRouter
  .route("/profile")
  .get(userController.getProfile)
  .patch(userController.editProfile);

userRouter.get("/search", userController.usersSearch);

userRouter.patch(
  "/password/change",
  checkBodyFieldsExistence(["old", "new"]),
  authValidation.verifyPassword,
  userController.changePassword
);

//contact request
userRouter.get("/pending-requests", userController.getPendingRequests);
userRouter.get("/contacts", userController.getContacts);
userRouter.get("/online", userController.getOnlineContacts);

userRouter.get("/notifications", userController.getOfflineNotifications);

userRouter
  .post("/:userId/request", userController.sendRequest)
  .patch("/:userId/request/reject", userController.rejectRequest)
  .patch("/:userId/request/accept", userController.acceptRequest);

userRouter.get("/:userId", userController.getUserById);

userRouter.get(
  "/",
  checkBodyFieldsExistence(["userIds"]),
  userController.getUsersByIds
);

//admin //owner

// userRouter.get("/all-users", isAuthorized(rule.OWNER, rule.ADMIN), getAllUser);
// userRouter.patch("/:userId/change-rule", isAuthorized(rule.OWNER), changeRule);

export default userRouter;
