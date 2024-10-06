import messageModel from "../../../models/messageModel.js";
import eventTypes from "../../../services/offlineNotification/eventTypes.js";
import {
  saveMsgToOfflineUser,
  pushMessageToChat,
  constructMessage,
  getUserSocketId,
  findOrCreateChat,
} from "../../utils.js";

const sendIoMessage = async (msg, socket, io, ack) => {
  try {
    // Construct the message from the incoming data
    const message = constructMessage(msg, socket);

    // Find or create a chat between sender and receiver
    const chat = await findOrCreateChat(message.sender, message.receiver);
    message.chat = chat._id; // Assign the chat ID to the message

    const receiverSocketId = getUserSocketId(message.receiver);

    message.sender = socket.user;

    // Save the message to DB
    let newMessage = new messageModel(message);

    if (receiverSocketId) {
      newMessage.status = "delivered";
      io.to(receiverSocketId).emit(eventTypes.messageNew, newMessage);
      ack({ success: true, message: newMessage });
    }
    // Save message to be delivered when the user is offline
    else {
      await saveMsgToOfflineUser(newMessage, message.receiver);
      ack({
        success: true,
        message: newMessage,
      });
    }

    await newMessage.save();
    // Push the message into the chat between sender and receiver
    await pushMessageToChat(newMessage);
  } catch (error) {
    ack({ success: false, error: error.message });
  }
};

export default sendIoMessage;
