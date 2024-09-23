import catchAsync from "./../Utils/catchAsync.js";
import messageModel from "./../models/messageModel.js";
import userModel from "./../models/userModel.js";
import ApiError from "./../Utils/apiError.js";
import chatModel from "./../models/chatModel.js";
import sendResponse from "../utils/sendResponse.js";
import { notifyGroup, notifyUser } from "../socket.io/utils.js";
import eventTypes from "./../services/offlineNotification/enums.js";
import { pagination } from "./../utils/queryProcesses.js";

export const getChat = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;

  const { limit, skip, page } = pagination(req);

  const total = await chatModel.count({ _id: chatId });

  const pages = Math.ceil(total / limit);

  const currentChat = await chatModel
    .findById(chatId)
    .populate({ path: "messages", select: "text createdAt sender" })
    .select("messages")
    .limit(limit)
    .skip(skip);

  if (!currentChat) return next(new ApiError("chat not found"));

  sendResponse(res, { data: { page, pages, total, limit, currentChat } });
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
        chatId: "$_id",
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

  const messages = await messageModel.find({ _id: { $in: newMessages } }); // Get the populated messages
  // Remove the retrieved messages from the newMessages array
  await userModel.findByIdAndUpdate(userId, {
    $set: { newMessages: [] }, // Clear the newMessages array
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
  else notifyUser(updatedMessage, user._id, eventTypes.messageUpdate);

  sendResponse(res, { code: 202, data: { updatedMessage } });
});

export const deleteMessage = catchAsync(async (req, res, next) => {
  const message = req.message;
  const user = req.user;

  const deletedMessage = await message.remove();

  if (message.group) {
    const { _id: groupId, members } = await groupModel.findById(message.group);
    await notifyGroup(groupId, members, user._id, eventTypes.messageUpdate, {
      deletedMessage,
    });
  }
  //notify the user
  else notifyUser(deletedMessage, user._id, eventTypes.messageUpdate);

  sendResponse(res, { code: 200, data: { deletedMessage } });
});
