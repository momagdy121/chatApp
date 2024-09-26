import eventTypes from "../../../services/offlineNotification/eventTypes.js";
import {
  constructSeenMessage,
  isAuthorizedToMarkAsRead,
  MarkMessageChatAsRead,
  notifyUser,
} from "./../../utils.js";

async function messageRead(msg, socket, io, ack) {
  try {
    const user = socket.user;

    const { chat } = constructSeenMessage(msg);

    isAuthorizedToMarkAsRead(chat, user.chats);

    await MarkMessageChatAsRead(chat);

    const receiverId = await getOtherUserChatId(chat, user._id);

    notifyUser({ chat, user: user._id }, receiverId, eventTypes.messageRead);

    ack({ success: true });
  } catch (error) {
    io.to(socket.id).emit("err", error.message);
  }
}

export default messageRead;
