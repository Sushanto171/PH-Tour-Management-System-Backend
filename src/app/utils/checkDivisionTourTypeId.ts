import httpStatus from "http-status-codes";
import { AppError } from "../errorHelpers/AppError";
import { Division } from "../modules/division/division.model";
import { ITour } from "../modules/tour/tour.interface";
import { TourType } from "../modules/tour/tour.model";

export const checkDivisionTourTypeId = async (payload: Partial<ITour>) => {
  if (payload.division) {
    const isValidDivisionId = await Division.findById(payload.division);
    if (!isValidDivisionId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Division id is invalid");
    }
  }

  if (payload.tourType) {
    const isValidTourTypeId = await TourType.findById(payload.tourType);
    if (!isValidTourTypeId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Tour type id is invalid");
    }
  }
};
