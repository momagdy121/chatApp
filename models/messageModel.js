import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
    },

    text: { type: String, required: [true, "message can't be empty"] },
    status: {
      type: String,
      enum: ["sent", "delivered"],
      default: "sent", // Initial status when a message is created
    },
    seen: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
