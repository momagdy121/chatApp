import ApiError from "../../utils/apiError.js";

export default function fieldEnums(field, enums) {
  return (req, res, next) => {
    enums.includes(req.body[field])
      ? next()
      : next(new ApiError(`${field} should be one of ${enums}`, 400));
  };
}
