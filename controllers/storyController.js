import catchAsync from "../utils/catchAsync.js";
import storyModel from "../models/storyModel.js";
import sendResponse from "./../utils/sendResponse.js";
import storyErrors from "../errors/storyErrors.js";
import { notifyContacts, notifyUser } from "../socket.io/utils.js";
import eventsTypes from "../services/offlineNotification/eventTypes.js";

const addStory = catchAsync(async (req, res, next) => {
  const { description } = req.body;
  const { contacts } = req.user;
  const image = res.locals.uploadedFiles[0]?.url || null;

  if (!description && !image)
    return next(storyErrors.provideDescriptionOrImage());

  const newStory = await storyModel.create({
    user: req.user._id,
    description,
    image,
  });

  await notifyContacts(newStory, contacts, eventsTypes.storyNew);

  sendResponse(res, { data: newStory });
});

const getNewStories = catchAsync(async (req, res, next) => {
  const user = req.user;

  const newStories = storyModel
    .find({ _id: { $in: user.newStories } })
    .select("content user createdAt _id");

  user.newStories = [];
  await user.save();

  sendResponse(res, { data: { newStories } });
});

const deleteStory = catchAsync(async (req, res, next) => {
  const { storyId } = req.params;
  const user = req.user;

  await storyModel.findByIdAndDelete(storyId);
  await notifyContacts(
    { story: storyId, user: user._id },
    contacts,
    eventsTypes.storyDelete
  );

  sendResponse(res, { message: "Story deleted successfully" });
});

const getAllStories = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Aggregate stories from the user's contacts
  const stories = await storyModel.aggregate([
    {
      $match: {
        user: { $in: user.contacts },
        expiresAt: { $gte: new Date() }, // Only include non-expired stories
      },
    },
    {
      $addFields: {
        seen: { $in: [user._id, "$viewers"] }, // Add 'seen' field
      },
    },
    {
      $sort: { createdAt: -1 }, // Optional: sort by creation date
    },
    {
      $project: {
        description: 1,
        image: 1,
        seen: 1,
        user: 1,
        createdAt: 1,
        _id: 1,
        expiresAt: 1,
      },
    },
  ]);

  sendResponse(res, { data: { stories } });
});

const viewStory = catchAsync(async (req, res, next) => {
  const { storyId } = req.params;
  const userId = req.user._id;
  const { contacts } = req.user;

  // Fetch the story from the database
  const story = await storyModel.findById(storyId);

  //check if the story owner is contact to the current user

  if (!contacts.includes(story.user.toString()))
    return next(storyErrors.notYourStory());

  // Add the user to the list of viewers if they haven't already viewed the story
  if (!story.viewers.includes(userId)) {
    story.viewers.push(userId);
    await story.save();
    await notifyUser(
      {
        story: storyId,
        user: userId,
      },
      story.user._id,
      eventsTypes.storyView
    );
  } else return next(storyErrors.alreadyViewed());

  sendResponse(res, { data: { story } });
});

const getUserStories = catchAsync(async (req, res, next) => {
  const user = req.user;

  const stories = await storyModel
    .find({ user: user._id })
    .select("description image viewers user createdAt _id");

  sendResponse(res, { data: { stories } });
}); //current logged in user

const storyController = {
  addStory,
  getNewStories,
  deleteStory,
  getUserStories,
  getAllStories,
  viewStory,
};

export default storyController;
