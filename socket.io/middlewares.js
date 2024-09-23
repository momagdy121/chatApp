import ApiError from "../Utils/apiError.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const verifyIoToken = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;

    if (!token) next(new ApiError("please provide the token", 400));

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_STRING);

    const user = await userModel
      .findById(payload.id)
      .select("-_id name email avatar")
      .lean();

    socket.user = user;
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};
