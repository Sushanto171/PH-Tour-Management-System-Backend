import bcrypt from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { IsActive, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done(null, false, { message: "User dose not exist." });
        }

        if (!isUserExist.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified.");
          return done("User is not verified.");
        }
        if (isUserExist.isDeleted) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted.");
          return done("User is Deleted.");
        }
        if (
          (isUserExist.isActive && isUserExist.isActive === IsActive.BLOCKED) ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          // throw new AppError(httpStatus.BAD_REQUEST, "User is Blocked.");
          return done(`User is ${isUserExist.isActive}`);
        }
        if (
          isUserExist.auths.some(
            (provider) =>
              provider.provider === "google" && !isUserExist.password
          )
        ) {
          return done(null, false, {
            message:
              "This email is already linked with a Google account. Please log in using Google or set a password to use email and password login.",
          });
        }

        const isMatch = await bcrypt.compare(
          password,
          isUserExist.password as string
        );
        if (!isMatch) {
          return done("Password does not match.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: pass, ...rest } = isUserExist.toObject();
        return done(null, rest);
      } catch (error) {
        done(error);
      }
    }
  )
);

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

        if (user) {
          if (!user.isVerified) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified.");
            return done(null, false, { message: "User is not verified." });
          }
          if (user.isDeleted) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted.");
            return done(null, false, { message: "User is Deleted." });
          }
          if (
            (user.isActive && user.isActive === IsActive.BLOCKED) ||
            user.isActive === IsActive.INACTIVE
          ) {
            return done(null, false, { message: `User is ${user.isActive}` });
          }
        }
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
