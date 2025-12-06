import globalErrors from "../../errors/globalErrors.js";
import mongoose from "mongoose";
export default function isDocumentExists(
  documentModel,
  paramName,
  documentName
) {
  return async (req, res, next) => {
    try {
      //check if the id is valid

      if (!mongoose.Types.ObjectId.isValid(req.params[paramName]))
        return next(globalErrors.invalidDocumentId(documentName));

      const documentId = req.params[paramName];
      const isExisted = await documentModel.exists({ _id: documentId });

      if (!isExisted)
        return next(globalErrors.documentNotFound(documentName));

      // Store the document in res.locals for use in subsequent middlewares or controllers

      next();
    } catch (error) {
      next(error);
    }
  };
}
