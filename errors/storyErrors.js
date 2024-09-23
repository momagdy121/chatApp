import ApiError from "../utils/apiError.js";

const storyErrors = {
  provideDescriptionOrImage: () =>
    new ApiError("Please provide description or image", 400),
  alreadyViewed: () => new ApiError("story already viewed", 400),
  notContact: () => new ApiError("you are not contact to the publisher", 401),
};

export default storyErrors;
