import userModel from "../../models/userModel.js";
import userErrors from "../../errors/userErrors.js";
const isUserExists = async (req, res, next) => {
  const { email, username } = req.body;

  const currUser = await userModel.find({ $or: [{ email }, { username }] });

  if (currUser.length > 0)
    return next(userErrors.usernameOrEmailNotAvailable());

  next();
};

export default isUserExists;
