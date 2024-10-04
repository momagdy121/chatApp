import cloudinary from "../config/cloudinary.js";
import apiError from "../utils/apiError.js";
import { Readable } from "stream";

const uploadImage = async (req, res, next) => {
  if (req.file) {
    // Change this to req.file since you're using upload.single
    try {
      const stream = Readable.from(req.file.buffer);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
        },
        (error, result) => {
          if (error)
            return next(new apiError("Failed to upload the image", 500));

          // Store the URL in res.locals for further use
          res.locals.uploadedFile = {
            fieldName: req.file.fieldName,
            url: result.secure_url,
          };

          next();
        }
      );

      stream.pipe(uploadStream);
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
};

export default uploadImage;
