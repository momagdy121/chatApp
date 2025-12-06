import ApiError from "../utils/apiError.js";

const groupErrors = {
  requiredMemberId: () => new ApiError("member ID are required", 400),
  userNotMember: () => new ApiError("user is not group member", 404),
  notAdmin: () => new ApiError("you are not admin", 403),
  cannotRemoveSelf: () => new ApiError("you can't remove yourself", 400),
  groupNotFound: () => new ApiError("Group not found", 404),
  notGroupMember: () => new ApiError("you are not a member of this group", 403),
  usersNotInContacts: (notContacts) => new ApiError(`User(s) ${notContacts.join(", ")} not in contacts`, 400),
  alreadyInGroup: (alreadyInGroup) => new ApiError(`User(s) ${alreadyInGroup.join(", ")} are already in the group`, 400),
};

export default groupErrors;
