import ApiError from "../../utils/apiError.js";

function isDocumentYours(
  docModel,
  paramId,
  docName,
  { fieldName = "user" } = {}
) {
  return async (req, res, next) => {
    const user = req.user;

    const document = await docModel.findOne({ _id: req.params[paramId] });

    if (document[fieldName].toString() !== user._id.toString())
      return next(new ApiError(`this ${docName} is not yours`, 403));

    req[docName] = document;

    next();
  };
}
export default isDocumentYours;
