import sendGroupMessage from "../services/messageServices/sendGroupMessage.js";
import sendIoMessage from "../services/messageServices/sendIoMessage.js";
import typingState from "../services/messageServices/typingState.js";

import { joinGroupRooms } from "../services/userServices/GroupRooms.js";

import {
  addUserToOnline,
  removeUserFromOnline,
} from "../services/userServices/userStatus.js";

export const userSocketMap = new Map(); // Moved to this module

export const handleConnection = async (io, socket) => {
  const userId = socket.user?._id;
  if (!userId) return;

  // Add the user to the online state
  addUserToOnline(socket, io, userSocketMap);

  joinGroupRooms(socket);

  // Listen for messages sent by the user
  socket.on("sendMessage", (msg) => sendIoMessage(msg, socket, io));

  socket.on("sendGroupMessage", (msg) => sendGroupMessage(msg, socket, io));

  socket.on("typing", (msg) => {
    typingState(msg, socket, io, "typing:start");
  });

  socket.on("stopTyping", (msg) => {
    typingState(msg, socket, io, "typing:stop");
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    removeUserFromOnline(socket, io, userSocketMap);
  });
};
