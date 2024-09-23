import userErrors from "../../errors/userErrors.js";

async function verifyPassword(req, res, next) {
  let { old } = req.body;

  const user = req.user;
  const isMatch = await user.comparePassword(old, user.password);

  if (!isMatch) return next(userErrors.incorrectPassword());

  next();
}
export default verifyPassword;
