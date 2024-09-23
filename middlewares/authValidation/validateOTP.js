import authErrors from "../../errors/authErrors.js";

async function validateOTP(req, res, next) {
  if (!req.body.code) return next(authErrors.missingCode());

  const user = req.user;

  if (!user.hashedCode) return next(authErrors.requestCodeFirst());

  const isMatch = await user.compareOTPs(req.body.code, user.hashedCode);

  if (!isMatch) return next(authErrors.invalidCode());

  if (user.codeExpired < Date.now()) return next(authErrors.codeExpired());

  next();
}

export default validateOTP;
