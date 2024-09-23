import ApiError from "../utils/apiError.js";

const authErrors = {
  unauthorized: () => new ApiError("Unauthorized", 401),
  missingCode: () => new ApiError("Please provide the code", 400),
  requestCodeFirst: () => new ApiError("Please request code first", 400),
  invalidCode: () => new ApiError("Invalid Code", 400),
  codeExpired: () => new ApiError("The code has expired", 410),
  missingEmail: () => new ApiError("Please provide an email", 400),
  accountAlreadyVerified: () => new ApiError("Account already verified", 409),
  missingFields: () => new ApiError("Please enter all fields", 400),
  accountNotVerified: () =>
    new ApiError("Your account is not yet verified", 403),
  invalidAccessToken: () => new ApiError("Invalid access token", 401),
  invalidRefreshToken: () => new ApiError("Invalid refresh token", 401),
  missingRefreshToken: () => new ApiError("Please log in first", 401),
  tokenExpired: () => new ApiError("Token expired", 401),
};

export default authErrors;
