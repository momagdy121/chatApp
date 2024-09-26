import messageModel from "../../../models/messageModel.js";
import eventTypes from "../../../services/offlineNotification/eventTypes.js";

import {
  constructGroupMessage,
  findGroup,
  pushMessageToGroup,
  saveMsgToOfflineUser,
  getOfflineMembers,
  notifyGroup,
} from "../../utils.js";

const sendGroupMessage = async (msg, socket, io, ack) => {
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

    const onlineMembers = getOnlineMembers(group.members);
    if (onlineMembers.length > 0)
      ack({ message: newMessage._id, status: eventTypes.messageDelivered });

    if (offlineMembers.length > 0)
      saveMsgToOfflineUser(message, offlineMembers);

    //push message to the group
    await pushMessageToGroup(newMessage, group);

    //push message id to the group
  } catch (error) {
    io.to(socket.id).emit("err", error.message);
  }
};

export default sendGroupMessage;
