import groupModel from "../../models/groupModel.js";
import ApiError from "../../Utils/apiError.js";

const isGroupMember = async (req, res, next) => {
  const user = req.user;
  const groupId = req.params.groupId;
  const group = await groupModel.findById(groupId);
  if (!group) return next(new ApiError("Group not found", 404));
  if (!group.members.includes(user._id))
    return next(new ApiError("you are not a member of this group", 403));

  req.group = group;
  next();
};

export default isGroupMember;
