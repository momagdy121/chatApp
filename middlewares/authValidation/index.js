import isAuthorized from "./isAuthorized.js";
import validateEmail from "./validateEmail.js";
import validateOTP from "./validateOTP.js";
import verifyPassword from "./verifyPassword.js";
import verifyAccessToken from "./verifyAccessToken.js";
import verifyRefreshToken from "./verifyRefreshToken.js";
import isUserExists from "./isUserExists.js";
import isVerified from "./isVerified.js";
import validateLogin from "./validateLogin.js";

const authValidation = {
  isAuthorized,
  validateEmail,
  validateOTP,
  verifyPassword,
  verifyAccessToken,
  verifyRefreshToken,
  isUserExists,
  isVerified,
  validateLogin,
};

export default authValidation;
