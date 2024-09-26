import { Router } from "express";
import multer from "multer";

import authController from "../controllers/authController.js";
import authValidation from "../middlewares/authValidation/index.js";

import userController from "../controllers/userController.js";
import uploadImage from "../middlewares/uploadImage.js";
import checkBodyFieldsExistence from "../middlewares/globalValidation/checkBodyFieldsExistence.js";

const authRouter = Router();
const upload = multer();
//login , sign up and verify account
authRouter.post(
  "/signup",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  checkBodyFieldsExistence(["name", "username", "email", "password"]),
  authValidation.isUserExists,
  uploadImage,
  authController.signUp
);

authRouter.post(
  "/resend-otp",
  authValidation.validateEmail,
  authValidation.isVerified,
  authController.sendVerificationCode
);
authRouter.post(
  "/refresh",
  authValidation.verifyRefreshToken,
  authController.refreshTheToken
);

authRouter.patch(
  "/verify",
  authValidation.validateEmail,
  authValidation.isVerified,
  authValidation.validateOTP,
  authController.verifyAccount
);

authRouter.post("/login", authValidation.validateLogin, authController.login);

authRouter.post("/logout", authController.logout);

//forgot password
authRouter.post(
  "/forgot-password/code",
  authValidation.validateEmail,
  authController.sendForgotPasswordCode
);

authRouter.post(
  "/forgot-password/verify",
  authValidation.validateEmail,
  authValidation.validateOTP,
  authController.verifyForgotPasswordCode
);

authRouter.patch(
  "/forgot-password/reset",
  authValidation.validateEmail,
  authValidation.validateOTP,
  userController.changePassword
);

export default authRouter;
