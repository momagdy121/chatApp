import jwt from "jsonwebtoken";
import { createRefreshToken, createAccessToken } from "./createToken.js";
export default async function generateTokensFullProcess(user, res) {
  const newRefreshToken = createRefreshToken(user._id);
  const newAccessToken = createAccessToken(newRefreshToken); // Use the new refresh token to create a new access token

  // Save new token creation dates
  user.accessTokenCreatedAt = jwt.decode(newAccessToken).iat;
  user.refreshTokenCreatedAt = jwt.decode(newRefreshToken).iat;
  await user.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: process.env.REFRESH_TOKEN_COOKIE_EXPIRE_IN,
  });

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: process.env.ACCESS_TOKEN_COOKIE_EXPIRE_IN,
  });
  return { newRefreshToken, newAccessToken };
}
