import groupModel from "../../models/groupModel.js";
import groupErrors from "../../errors/groupErrors.js";

const isGroupMember = async (req, res, next) => {
  const user = req.user;
  const groupId = req.params.groupId;
  const group = await groupModel.findById(groupId);
  if (!group) return next(groupErrors.groupNotFound());
  if (!group.members.includes(user._id))
    return next(groupErrors.notGroupMember());

  req.group = group;
  next();
};

export default isGroupMember;
