import notificationModel from "../../models/notificationModel.js";
import userModel from "../../models/userModel.js";

const offlineManyNotifier = async (usersIds, notificationType, content) => {
  if (usersIds.length === 0) return;

  const notification = await notificationModel.create({
    type: notificationType,
    content,
  });

  await userModel.updateMany(
    { _id: { $in: usersIds } },
    { $push: { notifications: notification._id } }
  );
};

export default offlineManyNotifier;
