import notificationModel from "../../models/notificationModel.js";
import userModel from "../../models/userModel.js";

const offlineManyNotifier = async (usersIds, notificationType, content) => {
  if (usersIds.length === 0) return;

  usersIds = usersIds.forEach(async (user) => {
    await notificationModel.create({
      type: notificationType,
      content,
      user,
    });
  });
};

export default offlineManyNotifier;
