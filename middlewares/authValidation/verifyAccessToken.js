import jwt from "jsonwebtoken";
import authErrors from "../../errors/authErrors.js";
import userErrors from "./../../errors/userErrors.js";
import userModel from "../../models/userModel.js";
import catchAsync from "../../utils/catchAsync.js";
import checkTokenDate from "../../services/token_management/checkTokenDate.js";
import handleTokenRefresh from "../../services/token_management/handleTokenRefresh.js";

const verifyAccessToken = catchAsync(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    if (!refreshToken) return next(authErrors.missingRefreshToken());

    if (!accessToken)
      return await handleTokenRefresh(req, res, (err) => {
        return next(err);
      });

    const payload = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_STRING
    );

    const user = await userModel.findById(payload.id);

    if (!user) return next(userErrors.userNotFound());

    checkTokenDate(user, user.accessTokenCreatedAt, payload);

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // If the access token is expired, refresh it
      return await handleTokenRefresh(req, res);
    } else {
      return next(authErrors.invalidAccessToken());
    }
  }
});

export default verifyAccessToken;
