import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { AppError } from "../../errorHelpers/AppError";
import { generateHashedPassword } from "../../utils/bcrypt";
import {
  createUserToken,
  getNewAccessTokenWithRefreshToken,
} from "../../utils/userToken";
import { IUser } from "../user/user.interface";
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

const resetPassword = async (
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

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
};
