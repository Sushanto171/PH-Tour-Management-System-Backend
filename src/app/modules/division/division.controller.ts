import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { divisionService } from "./division.service";

const createDivision = catchAsync(async (req, res) => {
  const division = await divisionService.createDivision(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Division created successfully",
    success: true,
    data: division,
  });
});

export const divisionController = {
  createDivision,
};
