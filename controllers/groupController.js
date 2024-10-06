import catchAsync from "../Utils/catchAsync.js";
import groupModel from "../models/groupModel.js";
import sendResponse from "../utils/sendResponse.js";
import groupErrors from "../errors/groupErrors.js";
import userModel from "../models/userModel.js";
import eventTypes from "./../services/offlineNotification/eventTypes.js";

import {
  notifyGroup,
  addNewMembersToRoom,
  removeMemberFromRoom,
} from "../socket.io/utils.js";
import messageModel from "../models/messageModel.js";
import { pagination } from "./../utils/queryProcesses.js";
import userPipelines from "./../pipelinesStages/userPipelines.js";
import generalPipelines from "./../pipelinesStages/generalPiplines.js";

// Create a new group
const createGroup = catchAsync(async (req, res) => {
  const { _id: admin } = req.user;
  const user = req.user;
  const { name, description } = req.body;

  const group = await groupModel.create({
    name,
    description,
    admin,
    members: [admin],
  });

  // Add the group to the user's groups
  user.groups.push(group._id);
  await user.save();

  res.status(200).json({ state: "success", group });
});

const editGroupDescription = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { groupId } = req.params;
  const { description } = req.body;
  const group = await groupModel.findByIdAndUpdate(groupId, { description });

  notifyGroup(groupId, group.members, userId, eventTypes.groupUpdate, {
    description,
  });
  sendResponse(res, {
    message: "group description has been updated successfully",
  });
});

const deleteGroup = catchAsync(async (req, res, next) => {
  const { groupId } = req.params;
  const group = await groupModel.findByIdAndDelete(groupId);
  sendResponse(res, {
    message: "group has been deleted successfully",
    data: { group },
  });
});

const getGroups = catchAsync(async (req, res, next) => {
  const user = req.user;
  const groups = await groupModel
    .find({ _id: { $in: user.groups } })
    .select("name description _id admin")
    .populate("admin", "name username avatar _id")
    .lean();

  sendResponse(res, { data: { groups } });
});

const getGroupMessages = catchAsync(async (req, res, next) => {
  const { groupId } = req.params;
  const { limit, page, skip } = pagination(req);
  const Messages = await messageModel.aggregate([
    {
      $match: { group: groupId },
    },
    {
      $sort: { createdAt: -1 },
    },

    ...generalPipelines.paginate("messages", limit, skip),
  ]);

  if (Messages.length === 0) {
    return sendResponse(res, {
      data: { total: 0, page: 0, pages: 0, limit: 0, messages: [] },
    });
  }

  const { total, messages } = Messages[0];

  const pages = Math.ceil(total / limit);

  sendResponse(res, { data: { total, page, pages, limit, messages } });
});

const getGroupMembers = catchAsync(async (req, res, next) => {
  const { limit, page, skip } = pagination(req);
  const { group, user } = req;
  const Members = await userModel.aggregate([
    {
      $match: { _id: { $in: group.members } },
    },

    ...userPipelines.withContactCheck(user._id),
    ...userPipelines.addFieldsWithBasicInfo({ isContact: 1 }),
    ...generalPipelines.paginate("members", limit, skip),
  ]);

  const { total, members } = Members[0];

  const pages = Math.ceil(total / limit);

  sendResponse(res, { data: { page, pages, limit, total, members } });
});

const addMembers = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const { groupId } = req.params;
  const { members: membersIds } = req.body;

  const newMembers = await userModel
    .find({ _id: { $in: membersIds } })
    .select("_id name username avatar");

  // Add members to the group
  const group = await groupModel.findByIdAndUpdate(
    groupId,
    { $addToSet: { members: { $each: membersIds } } },
    { new: true, runValidators: true }
  );

  // Add the group to the user's groups
  await userModel.updateMany(
    { _id: { $in: membersIds } },
    { $addToSet: { groups: groupId } }
  );

  //add new members to the socket room
  addNewMembersToRoom(membersIds, groupId);

  // Notify the group of the new members
  await notifyGroup(group._id, group.members, userId, eventTypes.newMember, {
    newMembers,
  });

  sendResponse(res, { data: { newMembers } });
});

// Remove a member from the group

const removeMember = catchAsync(async (req, res, next) => {
  const { groupId } = req.params; // Group ID from URL params
  const { memberId } = req.body; // Member ID to remove from the group

  if (memberId.toString() === req.user._id.toString())
    return next(groupErrors.cannotRemoveSelf());

  const group = await groupModel.findById(groupId).select("group members");

  // Check if the member to remove is in the group
  if (!group.members.includes(memberId.toString()))
    return next(groupErrors.userNotMember());

  // Remove the member using the $pull operator
  await groupModel.findByIdAndUpdate(
    groupId,
    { $pull: { members: memberId } },
    { new: true, runValidators: true }
  );

  //remove group id from member groups
  await userModel.update({ _id: memberId }, { $pull: { groups: groupId } });

  // Notify the group of the member removal
  await notifyGroup(
    group._id,
    group.members,
    req.user._id,
    eventTypes.memberRemoved,
    { memberId }
  );

  //Remove member from the room in case he is online
  removeMemberFromRoom(memberId, groupId);

  // Send a success response
  sendResponse(res, {
    message: `Member ${memberId} has been removed from the group.`,
  });
});

const leaveGroup = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { groupId } = req.params;

  const group = await groupModel.findByIdAndUpdate(groupId, {
    $pull: { members: user._id },
  });

  const member = await userModel.updateOne(
    { _id: user._id },
    { $pull: { groups: groupId } }
  );

  //Remove member from the room in case he is online
  removeMemberFromRoom(user._id, groupId);

  // Notify the group of the member removal
  await notifyGroup(group._id, group.members, user._id, eventTypes.memberLeft, {
    memberId: member._id,
    user: user._id,
  });

  sendResponse(res, {
    message: "you have left the group",
  });
});

const getGroupById = catchAsync(async (req, res, next) => {
  const { groupId } = req.params;
  const group = await groupModel
    .findById(groupId)
    .select("_id name description admin");
  sendResponse(res, { data: { group } });
});

const groupController = {
  createGroup,
  editGroupDescription,
  deleteGroup,
  getGroups,
  getGroupMessages,
  getGroupMembers,
  addMembers,
  removeMember,
  leaveGroup,
  getGroupById,
};
export default groupController;
