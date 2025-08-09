import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { userService } from "./user.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users retrieved successfully",
    data: result.users,
    meta: result.totalUsers,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const user = await userService.getMe(decodedToken.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your profile retrieved successfully",
    data: user,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload: IUser = {
    ...req.body,
    picture: req.file?.path,
  };
  const user = await userService.createUser(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload: IUser = { ...req.body, picture: req.file?.path };
  const decodedToken = req.user;
  const user = await userService.updateUser(
    id,
    payload,
    decodedToken as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

export const userController = {
  createUser,
  getMe,
  updateUser,
  getAllUsers,
};
