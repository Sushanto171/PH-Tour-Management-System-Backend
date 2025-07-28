import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { envVars } from "../../config/env";
import { AppError } from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { createUserToken } from "../../utils/userToken";
import { AuthService } from "./auth.service";

const credentialLogin = catchAsync(async (req, res, next) => {
  // const loginIfo = await AuthService.credentialLogin(req.body);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.authenticate("local", async (err: any, user: any, info: any) => {
    if (err) {
      return next(new AppError(httpStatus.BAD_GATEWAY, info.message));
    }
    if (!user) {
      return next(new AppError(httpStatus.BAD_GATEWAY, info.message));
    }
    const loginInfo = createUserToken(user);
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successfully.",
      data: { ...loginInfo, user },
    });
  })(req, res, next);
});

const getNewAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req?.cookies.refreshToken;
  // const refreshToken = req.headers.authorization as string;
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No refresh received from cookies."
    );
  }
  const accessToken = await AuthService.getNewAccessToken(refreshToken);
  setAuthCookie(res, accessToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: accessToken,
    message: "User accessToken retrieved Successfully.",
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: null,
    message: "User logout successfully",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const decoded = req.user;
  const { newPassword, oldPassword } = req.body;
  const newUpdatedPassword = await AuthService.resetPassword(
    decoded as JwtPayload,
    oldPassword,
    newPassword
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: newUpdatedPassword,
    message: "Password changed successfully",
  });
});

const googleCallbackController = catchAsync(async (req, res) => {
  const user = req.user;
  let redirectTo = req.query.state ? (req.query.state as string) : "";
  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1);
  }
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not found");
  }
  const logInfo = createUserToken(user);
  setAuthCookie(res, logInfo);
  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
});

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
};
