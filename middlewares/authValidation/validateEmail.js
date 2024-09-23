import userModel from "../../models/userModel.js";
import authErrors from "../../errors/authErrors.js";
import userErrors from "../../errors/userErrors.js";

async function validateEmail(req, res, next) {
  if (!req.body.email) return next(authErrors.missingEmail());

  const user = await userModel.findOne({
    email: req.body.email,
  });
  if (!user) return next(userErrors.userNotFound());

  req.user = user;
  next();
}

export default validateEmail;
