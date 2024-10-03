import ApiError from "../../utils/apiError.js";
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
        return next(new ApiError(`invalid ${documentName} id`, 400));

      const documentId = req.params[paramName];
      const isExisted = await documentModel.exists({ _id: documentId });

      if (!isExisted)
        return next(new ApiError(`${documentName} not found`, 404));

      // Store the document in res.locals for use in subsequent middlewares or controllers

      next();
    } catch (error) {
      next(error);
    }
  };
}
