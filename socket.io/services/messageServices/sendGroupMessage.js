import messageModel from "../../../models/messageModel.js";
import eventTypes from "./../../../services/offlineNotification/enums.js";

import {
  constructGroupMessage,
  findGroup,
  pushMessageToGroup,
  saveMsgToOfflineUser,
  getOfflineMembers,
  notifyGroup,
} from "../../utils.js";

const sendGroupMessage = async (msg, socket, io) => {
  try {
    const message = constructGroupMessage(msg, socket);

    const group = await findGroup(message.group, socket.user);

    const newMessage = await messageModel.create(message);

    let offlineMembers = [];
    //for every member
    await notifyGroup(
      group._id,
      group.members,
      socket.user._id,
      eventTypes.messageNew,
      message,
      { saveToOfflineUser: false }
    );

    offlineMembers = getOfflineMembers(group.members);

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
