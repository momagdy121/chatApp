import userModel from "../models/userModel.js";
import userErrors from "../errors/userErrors.js";
import catchAsync from "../utils/catchAsync.js";
import { pagination } from "../utils/queryProcesses.js";
import sendResponse from "../utils/sendResponse.js";
import userPipelines from "../pipelinesStages/userPipelines.js";
import notificationModel from "../models/notificationModel.js";
import { notifyUser } from "../socket.io/utils.js";
import eventTypes from "../services/offlineNotification/eventTypes.js";
import generalPipelines from "../pipelinesStages/generalPiplines.js";
import mongoose from "mongoose";
import globalErrors from "../errors/globalErrors.js";

const checkUsername = catchAsync(async (req, res, next) => {
  const { username } = req.body;

  const user = await userModel.exists({ username });

  if (user) return next(userErrors.usernameNotAvailable());

  sendResponse(res, { message: "Username is available" });
});

const getProfile = catchAsync(async (req, res) => {
  const { _id, name, username, rule, verified, avatar, city, bio, website } =
    req.user;

  const user = {
    _id,
    name,
    username,
    rule,
    verified,
    avatar,
    city,
    bio,
    website,
  };

  sendResponse(res, { data: { user } });
});

const editProfile = catchAsync(async (req, res, next) => {
  const { name, city, bio, website } = req.body;
  const user = req.user;

  if (name !== undefined) user.name = name;
  if (city !== undefined) user.city = city;
  if (bio !== undefined) user.bio = bio;
  if (website !== undefined) user.website = website;

  await user.save();

  sendResponse(res, { data: { name, city, bio, website } });
});

const getContacts = catchAsync(async (req, res, next) => {
  const user = req.user;

  const { limit, skip, page } = pagination(req);

  const Contacts = await userModel.aggregate([
    { $match: { _id: { $in: user.contacts } } },

    ...userPipelines.addFieldsWithBasicInfo(),
    ...generalPipelines.paginate("contacts", limit, skip),
  ]);

  const { total, contacts } = Contacts[0];
  const pages = Math.ceil(total / limit);

  sendResponse(res, {
    data: { page, limit, pages, total, contacts },
  });
});

const usersSearch = catchAsync(async (req, res, next) => {
  const { limit, skip, page } = pagination(req);

  if (!req.query.q) return next(userErrors.provideSearchQuery());

  let Users = await userModel.findByName(req.query.q, {
    stages: [
      ...userPipelines.withContactCheck(req.user._id),
      ...userPipelines.addFieldsWithBasicInfo({ isContact: 1 }),
      ...generalPipelines.paginate("users", limit, skip),
    ],
  });

  const { total, users } = Users[0];
  const pages = Math.ceil(total / limit);

  sendResponse(res, { data: { page, limit, pages, total, users } });
});

const getUserById = catchAsync(async (req, res, next) => {
  let user = await userModel.findWithId(req.params.userId, {
    stages: [
      ...userPipelines.withContactCheck(req.user._id),
      ...userPipelines.addFieldsWithBasicInfo({
        bio: 1,
        website: 1,
        city: 1,
        isContact: 1,
      }),
    ],
  });

  sendResponse(res, { data: { user: user[0] } });
});

const getUsersByIds = catchAsync(async (req, res, next) => {
  let { userIds } = req.body;

  const invalidUserIds = userIds.filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );

  if (invalidUserIds.length > 0)
    return next(globalErrors.invalidOBjectId(invalidUserIds));

  userIds = userIds.map((id) => mongoose.Types.ObjectId(id));

  if (!Array.isArray(userIds)) return next(userErrors.provideArrayOfIds);
  const users = await userModel.aggregate([
    { $match: { _id: { $in: userIds } } },

    ...userPipelines.withContactCheck(req.user._id),

    ...userPipelines.addFieldsWithBasicInfo({ isContact: 1 }),
  ]);

  sendResponse(res, { data: { users } });
});

const changePassword = catchAsync(async (req, res, next) => {
  const user = req.user;

  user.password = req.body.new;
  user.hashedCode = undefined;
  user.codeExpired = undefined;
  user.isLoggedIn = false;

  await user.save();

  res.clearCookie("refreshToken", {
    path: "/api/auth", // Match the path used when setting the cookie
    httpOnly: true, // Ensure all other attributes match
    sameSite: "Strict",
  });

  // Clear the access token as well
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "Strict",
  });

  sendResponse(res, {
    code: 202,
    message: "Password changed successfully, please login again",
  });
});

const sendRequest = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { contacts } = req.user;

  if (contacts.includes(userId)) return next(userErrors.alreadyContact());

  const userData = {
    _id: req.user._id,
    name: req.user.name,
    username: req.user.username,
    avatar: req.user.avatar,
  };

  const user = await userModel.findById(userId);

  if (user.pendingRequests.includes(req.user._id))
    return next(userErrors.alreadySentRequest());

  user.pendingRequests.push(req.user._id);
  await user.save();

  await notifyUser(
    {
      user: userData,
    },
    userId,
    eventTypes.requestReceive
  );

  sendResponse(res, { message: "Request sent successfully" });
});

const rejectRequest = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;

  if (!user.pendingRequests.includes(userId))
    return next(userErrors.requestNotFound());

  user.pendingRequests.pull(userId);
  await user.save();

  sendResponse(res, { message: "Request rejected successfully", code: 202 });
});

const acceptRequest = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { user } = req;

  if (!user.pendingRequests.includes(userId.toString()))
    return next(userErrors.requestNotFound());

  const otherUser = await userModel.findById(userId);

  user.pendingRequests.pull(userId);
  user.contacts.push(user._id);
  otherUser.contacts.push(user._id);

  await Promise.all([user.save(), otherUser.save()]);

  const userData = {
    _id: user._id,
    name: user.name,
    username: user.username,
    avatar: user.avatar,
  };
  notifyUser({ user: userData }, userId, eventTypes.requestAccept);

  sendResponse(res, { message: "Request accepted successfully", code: 202 });
});

const getPendingRequests = catchAsync(async (req, res, next) => {
  const user = req.user;

  const users = await userModel
    .find({ _id: { $in: user.pendingRequests } })
    .selectBasicInfo()
    .lean();

  sendResponse(res, { data: { users } });
});

const getOfflineNotifications = async (req, res, next) => {
  const user = req.user;

  const notifications = await notificationModel.find({
    user: user._id,
    delivered: false,
  });

  await notificationModel.updateMany(
    { user: user._id },
    { $set: { delivered: true } }
  );

  await userModel.findByIdAndUpdate(user._id, {
    $set: { notifications: [] },
  });

  sendResponse(res, { data: { notifications } });
};

const getOnlineContacts = async (req, res, next) => {
  const user = req.user;

  const onlineContacts = await userModel
    .find({ _id: { $in: user.contacts }, online: true })
    .select("_id name username avatar online")
    .lean();

  sendResponse(res, { data: { onlineContacts } });
};

const userController = {
  checkUsername,
  getProfile,
  editProfile,
  getContacts,
  usersSearch,
  getUserById,
  changePassword,
  sendRequest,
  rejectRequest,
  acceptRequest,
  getPendingRequests,
  getOnlineContacts,
  getOfflineNotifications,
  getUsersByIds,
};
export default userController;
