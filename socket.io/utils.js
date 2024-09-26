import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import chatModel from "./../models/chatModel.js";
import groupModel from "./../models/groupModel.js";
import { io } from "../socket.io/socket.js";
import { userSocketMap } from "./handlers/connectionHandler.js";
import offlineManyNotifier from "../services/offlineNotification/offlineManyNotifier.js";
import offlineOneNotifier from "../services/offlineNotification/offlineOneNotifier.js";

export const pushMessageToChat = async (newMessage) => {
  const { chat: currentChatId } = newMessage;

  const currentChat = await chatModel.findById(currentChatId);

  currentChat.messages.push(newMessage._id);
  currentChat.lastMessage = newMessage._id;
  await currentChat.save();
};
export const findOrCreateChat = async (senderId, receiverId) => {
  let chat = await chatModel.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  // If no chat exists, create a new one
  if (!chat) {
    chat = await chatModel.create({
      participants: [senderId, receiverId],
    });

    // Add the new chat ID to both users' chat lists
    await userModel.updateMany(
      { _id: { $in: [senderId, receiverId] } },
      { $addToSet: { chats: chat._id } }
    );
  }

  return chat;
};
export const findMessage = async (messageId) => {
  const message = await messageModel.findById(messageId);

  if (!message) throw new Error("Message not found");
  return message;
};
export const saveMsgToOfflineUser = async (message, userIds) => {
  // Ensure userIds is always an array
  if (!Array.isArray(userIds)) userIds = [userIds];

  // Update all offline users with the new message
  await userModel.updateMany(
    { _id: { $in: userIds } },
    { $push: { newMessages: message._id } }
  );
};

export const getUserSocketId = (receiverId) => {
  return userSocketMap.get(receiverId.toString());
};
export const constructMessage = (jsonMsg, socket) => {
  const message = JSON.parse(jsonMsg);

  if (!message.receiver || !message.text)
    throw new Error("Invalid message format");

  message.sender = socket.user._id.toString();

  return message;
};

export const constructSeenMessage = (jsonMsg) => {
  const message = JSON.parse(jsonMsg);
  if (!message.group && !message.chat)
    throw new Error("Invalid message format should have group or chat");
  return message;
};

export const isAuthorizedToMarkAsRead = (CurrentChat, chats) => {
  if (!chats.includes(CurrentChat.toString()))
    throw new Error("Unauthorized to mark as read in this chat");
};

export const constructGroupMessage = (jsonMsg, socket) => {
  const message = JSON.parse(jsonMsg);
  if (!message.group || !message.text)
    throw new Error("Invalid message format");
  message.sender = socket.user._id.toString();
  return message;
};

export const findGroup = async (groupId, user) => {
  const group = await groupModel.findById(groupId);
  if (!group) throw new Error("Group not found");

  if (!user.groups.includes(groupId.toString()))
    throw new Error("User not a member of group");

  return group;
};
export const pushMessageToGroup = async (message, group) => {
  group.messages.push(message._id);
  await group.save();
};
export const getOfflineMembers = (groupMembers) => {
  return groupMembers.filter((member) => !userSocketMap.has(member.toString()));
};
export const getOnlineMembers = (groupMembers) => {
  return groupMembers.filter((member) => userSocketMap.has(member.toString()));
};
export async function notifyGroup(
  groupId,
  members,
  userId,
  event,
  content,
  { saveToOfflineUser = true } = {}
) {
  const senderSocketId = getUserSocketId(userId);

  io.to(groupId.toString())
    .except([senderSocketId])
    .emit(event, { groupId, content });

  if (saveToOfflineUser) {
    const offlineMembers = getOfflineMembers(members);

    if (offlineMembers.length > 0)
      await offlineManyNotifier(offlineMembers, event, {
        groupId,
        content,
      });
  }
}
export async function notifyContacts(content, contactsIds, event) {
  let offlineContactsIds = [];

  contactsIds.forEach((contact) => {
    const receiverSocketId = getUserSocketId(contact);
    if (receiverSocketId) io.to(receiverSocketId).emit(event, content);
    else offlineContactsIds.push(contact);
  });

  if (offlineContactsIds.length > 0)
    await offlineManyNotifier(offlineContactsIds, event, {
      content,
    });
}
export async function notifyUser(content, userId, event) {
  const receiverSocketId = getUserSocketId(userId);
  if (receiverSocketId) io.to(receiverSocketId).emit(event, content);
  else
    await offlineOneNotifier(userId, event, {
      content,
    });
}

export const addNewMembersToRoom = (membersIds, groupId) => {
  membersIds.forEach((memberId) => {
    const memberSocketId = getUserSocketId(memberId); // Get the socket ID if the member is online
    if (memberSocketId) {
      io.sockets.sockets.get(memberSocketId).join(groupId.toString()); // Make them join the room
    }
  });
};

export const removeMemberFromRoom = (memberId, groupId) => {
  const memberSocketId = getUserSocketId(memberId); // Get the socket ID if the member is online
  if (memberSocketId)
    io.sockets.sockets.get(memberSocketId).leave(groupId.toString()); // Make them leave the room
};

export const MarkMessageChatAsRead = async (chatIdOrGroupId) => {
  await messageModel.updateMany(
    { chat: chatIdOrGroupId, seen: false },

    { $set: { seen: true } }
  );
};

export const getOtherUserChatId = async (chatId, userId) => {
  const chat = await chatModel.findById(chatId).select("participants");

  return chat.participants.find(
    (user) => user.toString() !== userId.toString()
  );
};
