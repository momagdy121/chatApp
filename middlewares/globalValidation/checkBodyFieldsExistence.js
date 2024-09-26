import ApiError from "../../utils/apiError.js";

function checkBodyFieldsExistence(fields) {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => !req.body[field]).join(", ");

    if (missingFields) {
      return next(
        new ApiError(`Missing or empty fields: ${missingFields}`, 400)
      );
    }

    next();
  };
}

export default checkBodyFieldsExistence;
