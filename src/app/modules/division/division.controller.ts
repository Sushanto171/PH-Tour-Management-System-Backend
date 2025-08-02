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

const retrieveAllDivision = catchAsync(async (req, res) => {
  const response = await divisionService.retrieveAllDivision(
    req.query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "All division retrieved successfully",
    success: true,
    data: response.divisions,
    meta: response.meta,
  });
});

const updateDivision = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedDivision = await divisionService.updateDivision(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Division updated successfully.",
    success: true,
    data: updatedDivision,
  });
});

const deleteDivision = catchAsync(async (req, res) => {
  const id = req.params.id;
  await divisionService.deleteDivision(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Division deleted successfully.",
    success: true,
    data: null,
  });
});

const getSingleDivision = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const division = await divisionService.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Division retrieved successfully.",
    success: true,
    data: division,
  });
});

export const divisionController = {
  createDivision,
  retrieveAllDivision,
  updateDivision,
  deleteDivision,
  getSingleDivision,
};
