import ApiError from "../utils/apiError.js";

const userErrors = {
  userNotFound: () => new ApiError("User not found", 404),
  incorrectPassword: () => new ApiError("Password is incorrect", 401),
  userAlreadyExists: () => new ApiError("User already exists", 409),
  usernameNotAvailable: () => new ApiError("Username is not available", 409),
  alreadySentRequest: () => new ApiError("You already sent a request", 400),
  requestNotFound: () => new ApiError("You don't have this request", 400),
  provideSearchQuery: () => new ApiError("Please provide a search query", 400),
  provideRule: () => new ApiError("Please provide a rule", 400),
  invalidRule: () => new ApiError("Invalid rule provided", 400),
  usernameOrEmailNotAvailable: () =>
    new ApiError("this username or email already taken", 409),
  provideArrayOfIds: () =>
    new ApiError("Please provide an array of users ids", 400),
};

export default userErrors;
