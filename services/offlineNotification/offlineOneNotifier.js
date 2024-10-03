import notificationModel from "../../models/notificationModel.js";
import userModel from "./../../models/userModel.js";

const offlineOneNotifier = async (userId, notificationType, content) => {
  const notification = await notificationModel.create({
    type: notificationType,
    ...content,
    user: userId,
  });

  await userModel.findByIdAndUpdate(userId, {
    $push: { notifications: notification._id },
  });
};

export default offlineOneNotifier;
