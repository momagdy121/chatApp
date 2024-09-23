import cloudinary from "../config/cloudinary.js";
import apiError from "../utils/apiError.js";
import { Readable } from "stream";

const uploadImage = async (req, res, next) => {
  if (req.files) {
    try {
      // Iterate over each field in req.files (e.g., avatar)
      const uploadPromises = Object.entries(req.files).map(
        ([fieldName, files]) => {
          // For each file in the field, create a readable stream and upload
          return Promise.all(
            files.map((file) => {
              return new Promise((resolve, reject) => {
                const stream = Readable.from(file.buffer);

                const uploadStream = cloudinary.uploader.upload_stream(
                  {
                    resource_type: "image",
                  },
                  (error, result) => {
                    if (error)
                      reject(new apiError("Failed to upload the image", 500));
                    resolve({ fieldName, url: result.secure_url });
                  }
                );

                stream.pipe(uploadStream);
              });
            })
          );
        }
      );

      // Wait for all uploads to finish
      const uploadedFiles = await Promise.all(uploadPromises);

      // Store the URLs in res.locals for further use
      res.locals.uploadedFiles = uploadedFiles.flat();

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
};

export default uploadImage;
