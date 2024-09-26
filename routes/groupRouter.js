import { Router } from "express";
import groupController from "../controllers/groupController.js";
import isAdmin from "../middlewares/groupValidation/isAdmin.js";
import isGroupMember from "../middlewares/groupValidation/isGroupMember.js";
import isDocumentExists from "../middlewares/globalValidation/isDocumentExists.js";
import groupModel from "./../models/groupModel.js";
import verifyAccessToken from "./../middlewares/authValidation/verifyAccessToken.js";
import checkBodyFieldsExistence from "./../middlewares/globalValidation/checkBodyFieldsExistence.js";
import areContacts from "../middlewares/groupValidation/areContacts.js";
import alreadyMembers from "../middlewares/groupValidation/AlreadyMembers.js";

const groupRouter = Router();

groupRouter.use(verifyAccessToken);

groupRouter.param("groupId", isDocumentExists(groupModel, "groupId", "Group"));
groupRouter.param("groupId", isGroupMember);
// Create a new group
groupRouter
  .route("/")
  .post(
    checkBodyFieldsExistence(["name", "description"]),
    groupController.createGroup
  )
  .get(groupController.getGroups);

groupRouter
  .route("/:groupId")
  .patch(isAdmin, groupController.editGroupDescription)
  .delete(isAdmin, groupController.deleteGroup);
// Add members to a group
groupRouter
  .route("/:groupId/members")
  .post(
    isAdmin,
    checkBodyFieldsExistence(["members"]),
    areContacts,
    alreadyMembers,
    groupController.addMembers
  )
  .delete(
    isAdmin,
    checkBodyFieldsExistence(["memberId"]),
    groupController.removeMember
  )
  .get(groupController.getGroupMembers);

// Get group messages
groupRouter.route("/:groupId/messages").get(groupController.getGroupMessages);

export default groupRouter;
