import jwt from "jsonwebtoken";
import authErrors from "../../errors/authErrors.js";
import userModel from "../../models/userModel.js";
import checkTokenDate from "../../services/token_management/checkTokenDate.js";
import userErrors from "../../errors/userErrors.js";

const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return next(authErrors.missingRefreshToken());

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_STRING
    );

    const user = await userModel.findById(payload.id);

    if (!user.isLoggedIn) return next(userErrors.userNotLoggedIn());

    if (!user) return next(userErrors.userNotFound());

    checkTokenDate(
      user.changePassAt,
      user.refreshTokenCreatedAt,
      payload,
      authErrors
    );

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyRefreshToken;
