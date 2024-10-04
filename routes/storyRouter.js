import { Router } from "express";
import storyController from "../controllers/storyController.js";
import authValidation from "../middlewares/authValidation/index.js";
import isDocumentExists from "../middlewares/globalValidation/isDocumentExists.js";
import storyModel from "../models/storyModel.js";
import isDocumentYours from "../middlewares/globalValidation/isDocumentYours.js";
import validateObjectID from "../middlewares/globalValidation/validateObjectID.js";
import uploadImage from "./../middlewares/uploadImage.js";
import upload from "../middlewares/multer.js";
const storyRouter = Router();

storyRouter.use(authValidation.verifyAccessToken);

storyRouter.param("storyId", validateObjectID("storyId", "story"));

storyRouter.param("storyId", isDocumentExists(storyModel, "storyId", "story"));

storyRouter
  .route("/")
  .get(storyController.getUserStories) //current logged in user
  .post(upload.single("image"), uploadImage, storyController.addStory);

storyRouter
  .delete(
    "/:storyId",
    isDocumentYours(storyModel, "storyId", "story"),
    storyController.deleteStory
  )
  .post("/:storyId/view", storyController.viewStory);

storyRouter.get("/all", storyController.getAllStories);

export default storyRouter;
