import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  members: [
    {
      ref: "users",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],

  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const groupModel = mongoose.model("groups", groupSchema);

export default groupModel;
