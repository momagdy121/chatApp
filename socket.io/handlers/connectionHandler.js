import eventTypes from "../../services/offlineNotification/eventTypes.js";
import sendGroupMessage from "../services/messageServices/sendGroupMessage.js";
import sendIoMessage from "../services/messageServices/sendIoMessage.js";
import typingState from "../services/messageServices/typingState.js";
import chatRead from "../services/messageServices/chatRead.js";

import { joinGroupRooms } from "../services/userServices/GroupRooms.js";

import {
  addUserToOnline,
  removeUserFromOnline,
} from "../services/userServices/userStatus.js";

export const userSocketMap = new Map(); // Moved to this module

export const handleConnection = async (io, socket) => {
  if (!socket.user) return;

  // Add the user to the online state
  addUserToOnline(socket, io, userSocketMap);

  joinGroupRooms(socket);

  // Listen for messages sent by the user
  socket.on("sendMessage", async (msg, ack) => {
    await sendIoMessage(msg, socket, io, ack);
  });

  socket.on("sendGroupMessage", (msg, ack) => {
    sendGroupMessage(msg, socket, ack);
  });

  socket.on("chatRead", (msg, ack) => {
    chatRead(msg, socket, ack);
  });

  socket.on("typing", (msg, ack) =>
    typingState(msg, socket, io, eventTypes.typingStart, ack)
  );

  socket.on("stopTyping", (msg, ack) =>
    typingState(msg, socket, io, eventTypes.typingStop, ack)
  );

  // Handle disconnection
  socket.on("disconnect", () => {
    removeUserFromOnline(socket, io, userSocketMap);
  });
};
