import globalErrors from "../errors/globalErrors.js";
import authErrors from "../errors/authErrors.js";

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Internal Server Error";
  err.message = err.message || "please try to report the backend developer";

  if (process.env.NODE_ENV === "production") {
    handleProdError(err, res);
  } else {
    handleDevError(err, res);
  }
};

function handleProdError(err, res) {
  let error = { ...err };
  error.message = err.message; // Ensure the error message is included
  if (err.name === "ValidationError") {
    error = handleValidatorErrors(err);
  } else if (
    err.name === "JsonWebTokenError" ||
    (err instanceof SyntaxError && err.message.includes("JSON"))
  ) {
    error = handleInvalidToken();
  } else if (err.name === "TokenExpiredError") {
    error = handleTokenExpiration();
  } else {
    error = handleOtherErrors(err);
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
}

function handleDevError(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    errorName: err.name,
  });
}

function handleValidatorErrors(err) {
  const errors = Object.values(err.errors).map((error) => error.message);
  return globalErrors.validationErrors(errors);
}

function handleOtherErrors(err) {
  return globalErrors.otherErrors(err.message, err.statusCode);
}

function handleInvalidToken() {
  return authErrors.invalidToken();
}
function handleTokenExpiration() {
  return authErrors.tokenHasExpired();
}
export default globalErrorHandler;
