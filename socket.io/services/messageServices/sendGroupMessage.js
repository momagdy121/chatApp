import messageModel from "../../../models/messageModel.js";
import eventTypes from "../../../services/offlineNotification/eventTypes.js";

import {
  constructGroupMessage,
  findGroup,
  pushMessageToGroup,
  saveMsgToOfflineUser,
  getOfflineMembers,
  notifyGroup,
  getOnlineMembers,
} from "../../utils.js";

const sendGroupMessage = async (msg, socket, ack) => {
  try {
    const message = constructGroupMessage(msg, socket);

    const group = await findGroup(message.group, socket.user);

    const newMessage = await messageModel.create(message);

    //for every member
    await notifyGroup(
      group._id,
      group.members,
      socket.user._id,
      eventTypes.messageNew,
      message,
      { saveToOfflineUser: false }
    );

    const offlineMembers = getOfflineMembers(group.members);

    ack({
      success: true,
      message: newMessage,
    });

    if (offlineMembers.length > 0)
      saveMsgToOfflineUser(message, offlineMembers);

    //push message to the group
    await pushMessageToGroup(newMessage, group);

    //push message id to the group
  } catch (error) {
    ack({ success: false, error: error.message });
  }
};

export default sendGroupMessage;
