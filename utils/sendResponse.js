const sendResponse = (
  res,
  { status = "success", code = 200, message = null, data = {} } = {}
) => {
  const response = {};

  response.status = status;

  if (message) response.message = message;

  res.status(code).send({ ...response, ...data });
};

export default sendResponse;
