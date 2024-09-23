import groupModel from "../../models/groupModel.js";
import ApiError from "../../Utils/apiError.js";
const alreadyMembers = async (req, res, next) => {
  const { groupId } = req.params;
  const { members } = req.body;

  const group = await groupModel.findById(groupId);

  const alreadyInGroup = members.filter((member) =>
    group.members.includes(member)
  );

  if (alreadyInGroup.length > 0) {
    return next(
      new ApiError(
        `User(s) ${alreadyInGroup.join(", ")} are already in the group`,
        400
      )
    );
  }

  next();
};
export default alreadyMembers;
