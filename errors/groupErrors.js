import ApiError from "../Utils/apiError.js";

const groupErrors = {
  requiredMemberId: () => new ApiError("member ID are required", 400),
  userNotMember: () => new ApiError("user is not group member", 404),
  notAdmin: () => new ApiError("you are not admin", 403),
  cannotRemoveSelf: () => new ApiError("you can't remove yourself", 400),
};

export default groupErrors;
