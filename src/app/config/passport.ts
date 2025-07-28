import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { IsActive, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken,
      refreshToken,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile?.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "Email does not found" });
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isActive: IsActive.ACTIVE,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: Partial<IUser>, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
