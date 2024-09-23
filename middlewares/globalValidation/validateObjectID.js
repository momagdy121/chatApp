import mongoose from "mongoose";

const validateObjectID = (idParam, name) => {
  return (req, res, next) => {
    const id = req.params[idParam];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "fail",
        message: "please provide a valid " + name + " id",
      });
    }
    next();
  };
};

export default validateObjectID;
