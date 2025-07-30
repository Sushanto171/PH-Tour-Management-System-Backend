import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { tourService } from "./tour.service";

// tour types
const createTourType = catchAsync(async (req, res) => {
  const tourType = await tourService.createTourType(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "TourType created successfully.",
    data: tourType,
  });
});

const getAllTourTypes = catchAsync(async (req, res) => {
  const result = await tourService.retrieveAllTourTypes();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "TourType retrieved successfully.",
    data: result.allTypes,
    meta: {
      total: result.count,
    },
  });
});

const updateTourType = catchAsync(async (req, res) => {
  const id = req.params.id;
  const tourType = await tourService.updateTourType(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "TourType created successfully.",
    data: tourType,
  });
});

const deleteTourType = catchAsync(async (req, res) => {
  const id = req.params.id;
  const tourType = await tourService.deleteTourType(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "TourType created successfully.",
    data: tourType,
  });
});

export const tourController = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
};
