import httpStatus from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { checkDivisionTourTypeId } from "../../utils/checkDivisionTourTypeId";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Booking } from "../booking/booking.mode";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

// tour type
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
  const isNameExist = await TourType.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (isNameExist) {
    throw new AppError(httpStatus.CONFLICT, "Tour type name is already exist.");
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
  if (isTypeLinkedWithTour.length > 0) {
    throw new AppError(
      httpStatus.METHOD_NOT_ALLOWED,
      "Can'nt delete it. This Tour type linked with tour"
    );
  }
  await TourType.findByIdAndDelete(id);
  return null;
};

// tour
const createTour = async (payload: Partial<ITour>) => {
  await checkDivisionTourTypeId(payload);

  const tour = await Tour.create(payload);
  return tour;
};

const retrievedAllTour = async (query: Record<string, string>) => {
  // const filter = query;
  // const searchTerm = query.searchTerm || "";
  // const sort = query.sort || "-createdAt";
  // const fields = query.field?.split(",").join(" ") || "";
  // const page = Number(query.page) || 1;
  // const limit = Number(query.limit) || 10;
  // const skip = (page - 1) * limit;

  // const searchArray = searchableFields.map((field) => ({
  //   [field]: { $regex: searchTerm, $options: "i" },
  // }));
  // const searchQuery = { $or: searchArray };

  // for (const field of excludeField) {
  //   // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  //   delete filter[field];
  // }

  // const tours = await Tour.find(searchQuery)
  //   .find(filter)
  //   .sort(sort)
  //   .select(fields)
  //   .skip(skip)
  //   .limit(limit);

  // const tourFilter = Tour.find(filter);
  // const toursSearch = tourFilter.find(searchQuery);
  // const tours = await toursSearch
  //   .sort(sort)
  //   .select(fields)
  //   .skip(skip)
  //   .limit(limit);
  // .populate(["division", "tourType"]);
  // const count = await Tour.countDocuments();

  // const meta = {
  //   total: count,
  //   page,
  //   limit,
  //   skip,
  //   totalPage: Math.ceil(count / limit),
  // };

  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = await queryBuilder
    .filter()
    .search(tourSearchableFields)
    .fields()
    .sort()
    .paginate();
  // .build();
  // const meta =await queryBuilder.getMeta();
  const [data, meta] = await Promise.all([tours.build(), tours.getMeta()]);

  return {
    tours: data,
    meta,
  };
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const isTourExist = await Tour.findById(id);
  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour does not found.");
  }
  await checkDivisionTourTypeId(payload);
  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    runValidators: true,
    new: true,
  });
  return updatedTour;
};

const deleteTour = async (id: string) => {
  const isExistTour = await Tour.findById(id);
  if (!isExistTour) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour does not found");
  }

  // if tour relationship with booking or related entity so prevent deletion
  const isRelationWithBooking = await Booking.findOne({ tour: id });
  if (isRelationWithBooking) {
    throw new AppError(
      httpStatus.METHOD_NOT_ALLOWED,
      "Can'nt delete it. This tour linked with booking"
    );
  }
  await Tour.findByIdAndDelete(id);
  return null;
};

export const tourService = {
  createTourType,
  retrieveAllTourTypes,
  updateTourType,
  deleteTourType,
  createTour,
  retrievedAllTour,
  updateTour,
  deleteTour,
};
