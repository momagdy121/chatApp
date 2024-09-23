import userModel from "../../models/userModel.js";
import userErrors from "../../errors/userErrors.js";
import authErrors from "../../errors/authErrors.js";
const validateLogin = async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!(email || username) || !password)
    return next(authErrors.missingFields());

  const user = await userModel.findOne({ $or: [{ email }, { username }] });

  if (!user) return next(userErrors.userNotFound());

  const isMatch = await user.comparePassword(password, user.password);

  if (!isMatch) return next(userErrors.incorrectPassword());

  if (!user.verified) return next(authErrors.accountNotVerified());

  req.user = user;

  next();
};

export default validateLogin;
