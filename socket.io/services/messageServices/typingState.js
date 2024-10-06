import { getUserSocketId } from "../../utils.js";

const typingState = (msg, socket, io, event, ack) => {
  try {
    const senderId = socket.user._id.toString();
    const message = JSON.parse(msg);
    const receiver = message.receiver;

    if (!receiver)
      throw new Error("Invalid message format: Missing receiver ID");

    const receiverSocketId = getUserSocketId(receiver);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(event, senderId);
    }

    ack({ success: true });
  } catch (error) {
    ack({ success: false, error: error.message });
  }
};

export default typingState;
