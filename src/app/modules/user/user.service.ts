import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { deleteImageFromCloudinary } from "../../config/multer.config";
import { AppError } from "../../errorHelpers/AppError";
import { generateHashedPassword } from "../../utils/bcrypt";
import { IAuthsProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  // const isUserExist = await User.findOne({ email });
  // if (isUserExist) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "This email already exist.");
  // }
  const authProvider: IAuthsProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const hashedPassword = await generateHashedPassword(
    password as string,
    envVars.BCRYPT_SALT_ROUND_ROUND
  );
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...response } = user.toObject();

  return response;
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User id does not exist");
  }
  return user;
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User id does not exist");
  }
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.GUIDE || decodedToken.role === Role.USER) {
    if (decodedToken.userId !== userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Your are unauthorized.");
    }
  }

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not find");
  }
  if (
    decodedToken.role === Role.ADMIN &&
    isUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your are unauthorized.");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    // if (decodedToken.role === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
    //   throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    // }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (payload.picture && isUserExist.picture) {
    await deleteImageFromCloudinary(isUserExist.picture);
  }
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({}).select("-password");
  const total = await User.countDocuments();

  const data = {
    users,
    totalUsers: { total },
  };
  return data;
};

export const userService = {
  createUser,
  getMe,
  updateUser,
  getAllUsers,
  getUserById
};
