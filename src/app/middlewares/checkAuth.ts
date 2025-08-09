import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { AppError } from "../errorHelpers/AppError";
import { IsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { verifyJwtToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const accessToken = req.cookies.accessToken;
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "Invalid token");
      }
      const verifiedToken = verifyJwtToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User email is not exist.");
      }

      if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified.");
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted.");
      }
      if (
        (isUserExist.isActive && isUserExist.isActive === IsActive.BLOCKED) ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}.`
        );
      }

      if (!authRoles.includes(isUserExist.role)) {
        throw new AppError(403, "You are not permitted to view this route.");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
