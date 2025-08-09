import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { AppError } from "../../errorHelpers/AppError";
import { generateHashedPassword } from "../../utils/bcrypt";
import { generateJwtToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendEmail";
import {
  createUserToken,
  getNewAccessTokenWithRefreshToken,
} from "../../utils/userToken";
import { IAuthsProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist.");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password does not matched.");
  }
  const userTokens = createUserToken(isUserExist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _remove, ...user } = isUserExist.toObject();

  return {
    user,
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await getNewAccessTokenWithRefreshToken(refreshToken);
  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  payload: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not matched.");
  }
  const isPasswordMatched = await bcrypt.compare(
    oldPassword,
    user.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "oldPassword does not matched.");
  }

  user.password = await generateHashedPassword(
    newPassword,
    envVars.BCRYPT_SALT_ROUND_ROUND
  );
  user.save();

  return true;
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not matched.");
  }

  if (
    user.password &&
    user.auths.some((authProvider) => authProvider.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password already set. You can change password to your profile."
    );
  }
  const hashedPassword = await generateHashedPassword(
    plainPassword,
    envVars.BCRYPT_SALT_ROUND_ROUND
  );
  const authUser: IAuthsProvider = {
    provider: "credential",
    providerId: user.email,
  };
  user.password = hashedPassword;
  user.auths = [...user.auths, authUser];
  await user.save();
  return true;
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not matched.");
  }
  if (user) {
    if (!user.isVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is not verified.");
    }
    if (user.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted.");
    }
    if (
      (user.isActive && user.isActive === IsActive.BLOCKED) ||
      user.isActive === IsActive.INACTIVE
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, `User is ${user.isActive}`);
    }
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = generateJwtToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    "10min"
  );

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&resetToken=${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    templateName: "forgotPassword",
    templateData: {
      name: user.name,
      resetUILink,
    },
  });
  return null;
};

const resetPassword = async (userId: string, newPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not matched.");
  }
  user.password = await generateHashedPassword(
    newPassword,
    envVars.BCRYPT_SALT_ROUND_ROUND
  );
  user.save();

  return true;
};

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
  resetPassword,
};
