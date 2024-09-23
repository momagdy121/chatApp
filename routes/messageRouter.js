import { Router } from "express";
import {
  deleteMessage,
  getAllChats,
  getChat,
  getOfflineMessages,
  updateMessage,
} from "./../controllers/messageController.js";
import authValidation from "../middlewares/authValidation/index.js";
import isDocumentExists from "./../middlewares/globalValidation/isDocumentExists.js";
import messageModel from "../models/messageModel.js";
import isDocumentYours from "./../middlewares/globalValidation/isDocumentYours.js";
import checkBodyFieldsExistence from "./../middlewares/globalValidation/checkBodyFieldsExistence.js";

const messageRouter = Router();

messageRouter.param(
  "messageId",
  isDocumentExists(messageModel, "messageId", "message")
);

messageRouter.use(authValidation.verifyAccessToken);

messageRouter.get("/chats", getAllChats);
messageRouter.get("/offline", getOfflineMessages);

messageRouter.get("/:chatId", getChat);

messageRouter.patch(
  "/:messageId",
  checkBodyFieldsExistence(["text"]),
  isDocumentYours(messageModel, "messageId", "message", {
    fieldName: "sender",
  }),
  updateMessage
);

messageRouter.delete(
  "/:messageId",
  isDocumentYours(messageModel, "messageId", "message", {
    fieldName: "sender",
  }),
  deleteMessage
);

export default messageRouter;
