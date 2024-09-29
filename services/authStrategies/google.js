import { Strategy } from "passport-google-oauth20";
import passport from "passport";
import userModel from "../../models/userModel.js";

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await userModel.findOne({ email: profile.emails[0].value });

      if (user) return done(null, user);

      const newUser = await userModel.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        username: profile.emails[0].value.split("@")[0],
        verified: true,
      });
      done(null, newUser);
    }
  )
);
