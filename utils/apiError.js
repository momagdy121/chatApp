class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4")
      ? "Fail"
      : "Internal server error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
