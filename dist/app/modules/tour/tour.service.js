"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const multer_config_1 = require("../../config/multer.config");
const AppError_1 = require("../../errorHelpers/AppError");
const checkDivisionTourTypeId_1 = require("../../utils/checkDivisionTourTypeId");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const booking_mode_1 = require("../booking/booking.mode");
const tour_constant_1 = require("./tour.constant");
const tour_model_1 = require("./tour.model");
// tour type
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (isTourTypeExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.CONFLICT, "This tour-type already exist.");
    }
    const tourType = yield tour_model_1.TourType.create(payload);
    return tourType;
});
const retrieveAllTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const allTypes = yield tour_model_1.TourType.find({});
    const count = yield tour_model_1.TourType.countDocuments();
    return {
        count,
        allTypes,
    };
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tour_model_1.TourType.findById(id);
    if (!isTourTypeExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Tour type does not found.");
    }
    const isNameExist = yield tour_model_1.TourType.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (isNameExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.CONFLICT, "Tour type name is already exist.");
    }
    const updatedType = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedType;
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistTourType = yield tour_model_1.TourType.findById(id);
    if (!isExistTourType) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Tour type does not found.");
    }
    const isTypeLinkedWithTour = yield tour_model_1.Tour.find({ tourType: id });
    if (isTypeLinkedWithTour.length > 0) {
        throw new AppError_1.AppError(http_status_codes_1.default.METHOD_NOT_ALLOWED, "Can'nt delete it. This Tour type linked with tour");
    }
    yield tour_model_1.TourType.findByIdAndDelete(id);
    return null;
});
// tour
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, checkDivisionTourTypeId_1.checkDivisionTourTypeId)(payload);
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
const retrievedAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = queryBuilder
        .filter()
        .search(tour_constant_1.tourSearchableFields)
        .fields()
        .sort()
        .paginate();
    // .build();
    // const meta =await queryBuilder.getMeta();
    const [data, meta] = yield Promise.all([tours.build(), tours.getMeta()]);
    return {
        tours: data,
        meta,
    };
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExist = yield tour_model_1.Tour.findById(id);
    // const newImages = [...(payload.images || [])];
    if (!isTourExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Tour does not found.");
    }
    if ((isTourExist === null || isTourExist === void 0 ? void 0 : isTourExist.images) &&
        isTourExist.images.length > 0 &&
        payload.images &&
        payload.images.length > 0) {
        payload.images = [...isTourExist.images, ...payload.images];
    }
    if (payload.images && payload.images.length === 0) {
        payload.images = [...(isTourExist.images ? isTourExist.images : [])];
    }
    if (isTourExist.images &&
        isTourExist.images.length > 0 &&
        payload.deleteImages &&
        payload.deleteImages.length > 0) {
        const restImages = isTourExist.images.filter((url) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(url)); });
        const updatePayloadImages = (payload.images || [])
            .filter((url) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(url)); })
            .filter((url) => !restImages.includes(url));
        payload.images = [...restImages, ...updatePayloadImages];
    }
    // console.log("arrayDelete", payload.deleteImages);
    yield (0, checkDivisionTourTypeId_1.checkDivisionTourTypeId)(payload);
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, {
        runValidators: true,
        new: true,
    });
    if (payload.deleteImages &&
        payload.deleteImages.length &&
        isTourExist.images &&
        isTourExist.images.length) {
        yield Promise.all(payload.deleteImages.map((url) => (0, multer_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistTour = yield tour_model_1.Tour.findById(id);
    if (!isExistTour) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Tour does not found");
    }
    // if tour relationship with booking or related entity so prevent deletion
    const isRelationWithBooking = yield booking_mode_1.Booking.findOne({ tour: id });
    if (isRelationWithBooking) {
        throw new AppError_1.AppError(http_status_codes_1.default.METHOD_NOT_ALLOWED, "Can'nt delete it. This tour linked with booking");
    }
    yield tour_model_1.Tour.findByIdAndDelete(id);
    return null;
});
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    if (!slug) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Invalid slug.");
    }
    const tour = yield tour_model_1.Tour.findOne({ slug });
    return tour;
});
exports.tourService = {
    createTourType,
    retrieveAllTourTypes,
    updateTourType,
    deleteTourType,
    createTour,
    retrievedAllTour,
    updateTour,
    deleteTour,
    getSingleTour,
};
