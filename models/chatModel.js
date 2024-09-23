import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
      },
    ],

    status: {
      type: String,
      enum: ["active", "pending"], // Use 'pending' for new or unaccepted chats
      default: "pending",
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
  }
);

const chatModel = mongoose.model("chats", chatSchema);

export default chatModel;
