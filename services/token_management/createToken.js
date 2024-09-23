import jwt from "jsonwebtoken";

export const createAccessToken = (refreshToken) => {
  const payload = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_STRING
  );

  const id = payload.id;
  return jwt.sign(
    {
      id,
    },
    process.env.ACCESS_TOKEN_SECRET_STRING,

    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    }
  );
};

export const createRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET_STRING,

    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    }
  );
};
