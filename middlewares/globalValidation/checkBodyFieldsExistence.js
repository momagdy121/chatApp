import globalErrors from "../../errors/globalErrors.js";

function checkBodyFieldsExistence(fields) {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => !req.body[field]).join(", ");

    if (missingFields) {
      return next(
        globalErrors.missingFields(missingFields)
      );
    }

    next();
  };
}

export default checkBodyFieldsExistence;
