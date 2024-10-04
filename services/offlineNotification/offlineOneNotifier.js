import notificationModel from "../../models/notificationModel.js";
import userModel from "./../../models/userModel.js";

const offlineOneNotifier = async (userId, notificationType, content) => {
  await notificationModel.create({
    type: notificationType,
    ...content,
    user: userId,
  });
};

export default offlineOneNotifier;
