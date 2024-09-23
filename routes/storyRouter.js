import { Router } from "express";
import storyController from "../controllers/storyController.js";
import authValidation from "../middlewares/authValidation/index.js";
import checkBodyFieldsExistence from "../middlewares/globalValidation/checkBodyFieldsExistence.js";
import isDocumentExists from "../middlewares/globalValidation/isDocumentExists.js";
import storyModel from "../models/storyModel.js";
import isDocumentYours from "../middlewares/globalValidation/isDocumentYours.js";
import validateObjectID from "../middlewares/globalValidation/validateObjectID.js";
import multer from "multer";
import uploadImage from "./../middlewares/uploadImage.js";

const upload = multer();
const storyRouter = Router();

storyRouter.use(authValidation.verifyAccessToken);

storyRouter.param("storyId", validateObjectID("storyId", "story"));

storyRouter.param("storyId", isDocumentExists(storyModel, "storyId", "story"));

storyRouter
  .route("/")
  .get(storyController.getUserStories) //current logged in user
  .post(
    upload.fields([{ name: "image", maxCount: 1 }]),
    uploadImage,
    storyController.addStory
  );

storyRouter.route("/:storyId/view", storyController.viewStory);

storyRouter.delete(
  "/:storyId",
  isDocumentYours(storyModel, "storyId", "story"),
  storyController.deleteStory
);

storyRouter.get("/new", storyController.getNewStories);

storyRouter.get("/all", storyController.getAllStories);

export default storyRouter;
