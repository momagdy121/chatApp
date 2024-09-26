import apiError from "../../utils/apiError.js";

const checkTokenDate = (changePassAt, TokenCreatedAt, payload) => {
  if (TokenCreatedAt != payload.iat)
    throw new apiError(
      "This token is no longer valid (old token detected)",
      401
    );

  if (changePassAt > payload.iat)
    throw new apiError(
      "this token is no longer valid because password has been changed",
      401
    );
};

export default checkTokenDate;
