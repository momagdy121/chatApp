import groupModel from "../../models/groupModel.js";
import groupErrors from "../../errors/groupErrors.js";
const alreadyMembers = async (req, res, next) => {
  const { groupId } = req.params;
  const { members } = req.body;

  const group = await groupModel.findById(groupId);

  const alreadyInGroup = members.filter((member) =>
    group.members.includes(member)
  );

  if (alreadyInGroup.length > 0) {
    return next(
      groupErrors.alreadyInGroup(alreadyInGroup)
    );
  }

  next();
};
export default alreadyMembers;
