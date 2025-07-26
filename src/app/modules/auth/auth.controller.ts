import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { credentialService } from "./auth.service";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {

  const loginIfo = await credentialService.credentialLogin(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User login successfully.",
    data: loginIfo,
  });
});

export const credentialControllers = {
  credentialLogin,
};
