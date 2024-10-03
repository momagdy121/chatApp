import ApiError from "../utils/apiError.js";

const globalErrors = {
  invalidOBjectId: (id) => new ApiError("Invalid object id " + id + "", 400),
};

export default globalErrors;
