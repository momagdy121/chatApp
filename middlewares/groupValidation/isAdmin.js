import groupErrors from "../../errors/groupErrors.js";
import groupModel from "./../../models/groupModel.js";

const isAdmin = async (req, res, next) => {
  const user = req.user;
  const groupId = req.params.groupId;
  const group = await groupModel.findById(groupId);

  if (group.admin.toString() !== user._id.toString())
    return next(groupErrors.notAdmin());

  next();
};

export default isAdmin;
