import eventTypes from "../../../services/offlineNotification/eventTypes.js";
import {
  constructSeenMessage,
  getOtherUserChatId,
  isAuthorizedToMarkAsRead,
  MarkMessageChatAsRead,
  notifyUser,
} from "../../utils.js";

async function chatRead(msg, socket, ack) {
  try {
    const user = socket.user;

    const { chat } = constructSeenMessage(msg);

    isAuthorizedToMarkAsRead(chat, user.chats);

    await MarkMessageChatAsRead(chat);

    const receiverId = await getOtherUserChatId(chat, user._id);

    notifyUser({ chat, user: user._id }, receiverId, eventTypes.chatRead);

    ack({ success: true });
  } catch (error) {
    ack({ success: false, error: error.message });
  }
}

export default chatRead;
