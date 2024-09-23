import messageModel from "../../../models/messageModel.js";
import {
  saveMsgToOfflineUser,
  pushMessageToChat,
  constructMessage,
  getUserSocketId,
  findOrCreateChat,
} from "../../utils.js";

const sendIoMessage = async (msg, socket, io) => {
  try {
    // Construct the message from the incoming data
    const message = constructMessage(msg, socket);

    // Find or create a chat between sender and receiver
    const chat = await findOrCreateChat(message.sender, message.receiver);
    message.chat = chat._id; // Assign the chat ID to the message

    const receiverSocketId = getUserSocketId(message.receiver);

    // Save the message to DB
    let newMessage = await messageModel.create(message);

    if (receiverSocketId) {
      newMessage.sender = socket.user;
      io.to(receiverSocketId).emit("message:new", newMessage);
    }
    // Save message to be delivered when the user is offline
    else await saveMsgToOfflineUser(newMessage, message.receiver);

    // Push the message into the chat between sender and receiver
    await pushMessageToChat(newMessage);
  } catch (error) {
    io.to(socket.id).emit("err", error.message);
  }
};

export default sendIoMessage;
