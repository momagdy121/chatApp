import jwt from "jsonwebtoken";
import authErrors from "../../errors/authErrors.js";
import userErrors from "./../../errors/userErrors.js";
import userModel from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import checkTokenDate from "../../services/token_management/checkTokenDate.js";
import getTokenFromHeaders from "./../../utils/getTokenFromHeaders.js";

const verifyAccessToken = catchAsync(async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken || getTokenFromHeaders(req);

    if (!accessToken) return next(authErrors.missingAccessToken());

    const payload = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_STRING
    );

    const user = await userModel.findById(payload.id);

    if (!user) return next(userErrors.userNotFound());

    if (!user.isLoggedIn) return next(userErrors.userNotLoggedIn());

    checkTokenDate(user.changePassAt, user.accessTokenCreatedAt, payload);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

export default verifyAccessToken;
