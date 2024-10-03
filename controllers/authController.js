import userModel from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import verificationMail from "../services/mail/verificationMail.js";
import resetPassMail from "../services/mail/resetPassMail.js";
import generateTokensFullProcess from "../services/token_management/generateTokensFullProcess.js";
import sendResponse from "../utils/sendResponse.js";

const signUp = catchAsync(async (req, res, next) => {
  const { email, password, name, username } = req.body;

  let avatar = null;
  if (req.files) avatar = res.locals.uploadedFiles[0].url;

  const user = await userModel.create({
    email,
    password,
    name,
    username,
    avatar,
  });

  sendResponse(res, {
    code: 201,
    data: {
      user: {
        email,
        username,
        name,
        id: user._id,
        avatar: user.avatar,
        bio: user.bio,
        city: user.city,
        website: user.website,
      },
    },
    message: "We sent a verification code to your email",
  });
});

const sendVerificationCode = catchAsync(async (req, res, next) => {
  const user = req.user;

  const verificationCode = await user.createOTP();

  await user.save({ validateBeforeSave: false });

  await verificationMail(req.body.email, verificationCode);

  sendResponse(res, { message: "We sent a verification code to your email" });
});

const verifyAccount = catchAsync(async (req, res, next) => {
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("name email username _id avatar");

  // Update user properties
  user.verified = true;
  user.isLoggedIn = true;
  user.hashedCode = undefined;
  user.codeExpired = undefined;

  await user.save();
  // Create tokens
  const { newAccessToken: accessToken } = await generateTokensFullProcess(
    req.user,
    res
  );

  sendResponse(res, { message: "verified", data: { user, accessToken } });
});

const login = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { newAccessToken: accessToken, newRefreshToken: refreshToken } =
    await generateTokensFullProcess(user, res);

  const userData = {
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    id: user._id,
  };

  user.isLoggedIn = true;

  await user.save();

  sendResponse(res, {
    message: "logged in",
    data: {
      userData,
      accessToken,
      refreshToken,
    },
  });
});

const logout = catchAsync(async (req, res, next) => {
  const user = req.user;

  user.isLoggedIn = false;
  await user.save();

  res.clearCookie("refreshToken", {
    path: "/api/auth", // Match the path used when setting the cookie
    httpOnly: true, // Ensure all other attributes match
    sameSite: "Strict",
  });

  // Clear the access token as well
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "Strict",
  });

  sendResponse(res, { message: "logged out" });
});

const sendForgotPasswordCode = catchAsync(async (req, res, next) => {
  const user = req.user;
  const resetCode = await user.createOTP();

  await resetPassMail(user.email, resetCode);

  await await user.save({ validateBeforeSave: false });

  sendResponse(res, {
    message: `Reset password code sent to your email ${req.body.email},"will be expired in 10 minutes !!" note :check your spam if you didn't found the message in your inbox `,
  });
});

const verifyForgotPasswordCode = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    message:
      "now make patch request with the code , email and the the new password ",
  });
});

const refreshTheToken = catchAsync(async (req, res, next) => {
  const { newAccessToken: accessToken, newRefreshToken: refreshToken } =
    await generateTokensFullProcess(req.user, res);
  sendResponse(res, {
    message: "refreshed",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

//import them as one object
const authController = {
  signUp,
  sendVerificationCode,
  verifyAccount,
  login,
  logout,
  sendForgotPasswordCode,
  verifyForgotPasswordCode,
  refreshTheToken,
};

export default authController;
