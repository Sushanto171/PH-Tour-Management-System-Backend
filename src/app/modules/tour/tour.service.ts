import httpStatus from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTourType = async (payload: Partial<ITourType>) => {
  const isTourTypeExist = await TourType.findOne({ name: payload.name });
  if (isTourTypeExist) {
    throw new AppError(httpStatus.CONFLICT, "This tour-type already exist.");
  }
  const tourType = await TourType.create(payload);
  return tourType;
};

const retrieveAllTourTypes = async () => {
  const allTypes = await TourType.find({});
  const count = await TourType.countDocuments();
  return {
    count,
    allTypes,
  };
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const isTourTypeExist = await TourType.findById(id);
  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour type does not found.");
  }
  const updatedType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedType;
};

const deleteTourType = async (id: string) => {
  const isExistTourType = await TourType.findById(id);
  if (!isExistTourType) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour type does not found.");
  }
  const isTypeLinkedWithTour = await Tour.find({ tourType: id });

  if (isTypeLinkedWithTour.length < 0) {
    throw new AppError(
      httpStatus.METHOD_NOT_ALLOWED,
      "Can'nt delete it. This Tour type linked with tour"
    );
  }
  await TourType.findByIdAndDelete(id);
  return null;
};

export const tourService = {
  createTourType,
  retrieveAllTourTypes,
  updateTourType,
  deleteTourType,
};
