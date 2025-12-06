import globalErrors from "../../errors/globalErrors.js";

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
      return next(globalErrors.documentNotYours(docName));

    req[docName] = document;

    next();
  };
}
export default isDocumentYours;
