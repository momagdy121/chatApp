import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  description: {
    type: String,
  },
  image: {
    type: String,
  },

  viewers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Users who have viewed the story
    },
  ],

  expiresAt: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000, // Set to expire in 24 hours by default
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Automatically delete story after expiry

const storyModel = mongoose.model("stories", storySchema);

export default storyModel;
