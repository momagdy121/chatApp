import catchAsync from "./../Utils/catchAsync.js";
import messageModel from "./../models/messageModel.js";
import userModel from "./../models/userModel.js";
import chatModel from "./../models/chatModel.js";
import sendResponse from "../utils/sendResponse.js";
import { notifyGroup, notifyUser } from "../socket.io/utils.js";
import eventTypes from "./../services/offlineNotification/eventTypes.js";
import { pagination } from "./../utils/queryProcesses.js";
import generalPipelines from "./../pipelinesStages/generalPiplines.js";
import mongoose from "mongoose";
import messageErrors from "../errors/messageErrors.js";

export const getChatMessages = catchAsync(async (req, res, next) => {
  const user = req.user;
  let { chatId } = req.params;

  if (!user.chats.includes(chatId)) return next(messageErrors.ChatNotFound());

  chatId = mongoose.Types.ObjectId(chatId);

  const { limit, skip, page } = pagination(req);

  const Messages = await messageModel.aggregate([
    {
      $match: { chat: chatId },
    },

    {
      $sort: { createdAt: -1 },
    },
    ...generalPipelines.paginate("messages", limit, skip),
  ]);

  const { total, messages } = Messages[0];
  const pages = Math.ceil(total / limit);

  sendResponse(res, { data: { total, page, pages, limit, messages } });
});

export const getAllChats = catchAsync(async (req, res, next) => {
  const user = req.user;
  const chats = user.chats;

  const allChats = await chatModel.aggregate([
    {
      $match: { _id: { $in: chats } },
    },
    {
      $lookup: {
        from: "users", // Replace with your actual user collection name
        localField: "participants",
        foreignField: "_id",
        as: "participants",
      },
    },
    {
      $unwind: {
        path: "$participants",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "participants._id": { $ne: user._id },
      },
    },
    {
      $project: {
        contact: {
          _id: "$participants._id",
          name: "$participants.name",
          username: "$participants.username",
          avatar: "$participants.avatar",
          online: "$participants.online",
        },
        // Include other fields you want to project from the chat document
      },
    },
  ]);

  sendResponse(res, { data: { allChats } });
});

export const getOfflineMessages = catchAsync(async (req, res, next) => {
  const { newMessages, _id: userId } = req.user;

  if (!newMessages || newMessages.length === 0) return res.send([]); // No new messages to return

  const messages = await messageModel.find({ _id: { $in: newMessages } });

  await messageModel.updateMany(
    { _id: { $in: newMessages } }, // Find all messages with _id in newMessages
    { $set: { status: "delivered" } } // Set their status to "delivered"
  );
  // Remove the retrieved messages from the newMessages array
  await userModel.findByIdAndUpdate(userId, {
    $set: { newMessages: [] }, // Clear the newMessages array
  });

  [...messages].forEach((message) => {
    let messageContent;

    if (message.group) {
      messageContent = {
        _id: message._id,
        group: message.group,
      };
    } else {
      messageContent = {
        _id: message._id,
        chat: message.chat,
        receiver: message.receiver,
      };
    }
    notifyUser(messageContent, message.sender, eventTypes.messageDelivered);
  });

  sendResponse(res, { data: { messages } });
});

export const updateMessage = catchAsync(async (req, res, next) => {
  const text = req.body.text;
  const { message, user } = req;

  message.text = text;
  message.isEdited = true;

  const updatedMessage = await message.save();

  if (message.group) {
    const { _id: groupId, members } = await groupModel.findById(message.group);
    await notifyGroup(groupId, members, user._id, eventTypes.messageUpdate, {
      updatedMessage,
    });
  }
  //notify the user
  else notifyUser(updatedMessage, message.receiver, eventTypes.messageUpdate);

  sendResponse(res, { code: 202, data: { updatedMessage } });
});

export const deleteMessage = catchAsync(async (req, res, next) => {
  const message = req.message;
  const user = req.user;

  const deletedMessage = await message.remove();

  if (message.group) {
    const { _id: groupId, members } = await groupModel.findById(message.group);
    await notifyGroup(groupId, members, user._id, eventTypes.messageDelete, {
      deletedMessage,
    });
  }
  //notify the user
  else notifyUser(deletedMessage, message.receiver, eventTypes.messageDelete);

  sendResponse(res, { code: 200, data: { deletedMessage } });
});
