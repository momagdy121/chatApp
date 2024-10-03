import mongoose from "mongoose";
import notificationTypes from "../services/offlineNotification/eventTypes.js";
const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [...Object.values(notificationTypes)],
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
});

const notificationModel = mongoose.model("notifications", notificationSchema);
export default notificationModel;
