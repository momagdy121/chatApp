import ApiError from "../utils/apiError.js";

const messageErrors = {
  ChatNotFound: () => {
    return new ApiError("Chat not found", 404);
  },
};

export default messageErrors;
