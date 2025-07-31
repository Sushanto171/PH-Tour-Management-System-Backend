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
    statusCode: httpStatus.OK,
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
    statusCode: httpStatus.OK,
    message: "TourType Updated successfully.",
    data: tourType,
  });
});

const deleteTourType = catchAsync(async (req, res) => {
  const id = req.params.id;
  const tourType = await tourService.deleteTourType(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "TourType Deleted successfully.",
    data: tourType,
  });
});

// tour
const createTour = catchAsync(async (req, res) => {
  const tour = await tourService.createTour(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tour created successfully.",
    data: tour,
  });
});

const retrieveAllTour = catchAsync(async (req, res) => {
  const tour = await tourService.retrievedAllTour();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour retrieved successfully.",
    data: tour.tours,
    meta: { total: tour.count },
  });
});

const updateTour = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedTour = await tourService.updateTour(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour updated successfully.",
    data: updatedTour,
  });
});

const deleteTour = catchAsync(async (req, res) => {
  const result = await tourService.deleteTour(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour deleted successfully.",
    data: result,
  });
});

export const tourController = {
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  retrieveAllTour,
  updateTour,
  deleteTour,
};
