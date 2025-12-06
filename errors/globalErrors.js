import ApiError from "../utils/apiError.js";

const globalErrors = {
  invalidOBjectId: (id) => new ApiError("Invalid object id " + id + "", 400),
  routeNotFound: (url) => new ApiError(`can't find ${url}`, 404),
  documentNotYours: (docName) => new ApiError(`this ${docName} is not yours`, 403),
  invalidDocumentId: (documentName) => new ApiError(`invalid ${documentName} id`, 400),
  documentNotFound: (documentName) => new ApiError(`${documentName} not found`, 404),
  missingFields: (missingFields) => new ApiError(`Missing or empty fields: ${missingFields}`, 400),
  validationErrors: (errors) => new ApiError(errors.join(", "), 400),
  otherErrors: (message, statusCode) => new ApiError(message || "please try to report the backend developer", statusCode || 500),
};

export default globalErrors;
