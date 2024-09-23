import generateTokensFullProcess from "./generateTokensFullProcess.js";
import verifyRefreshToken from "../../middlewares/authValidation/verifyRefreshToken.js";

const handleTokenRefresh = async (req, res, next) => {
  try {
    await verifyRefreshToken(req, res, async (err) => {
      if (err) return next(err);
      const user = req.user;
      await generateTokensFullProcess(user, res);
      next();
    });
  } catch (err) {
    return next(err);
  }
};

export default handleTokenRefresh;
