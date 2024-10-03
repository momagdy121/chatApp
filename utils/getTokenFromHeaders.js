function getTokenFromHeaders(req) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader?.split(" ")[1] || null;
  return token;
}

export default getTokenFromHeaders;
