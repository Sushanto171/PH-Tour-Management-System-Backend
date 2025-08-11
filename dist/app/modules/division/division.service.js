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
exports.divisionService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const multer_config_1 = require("../../config/multer.config");
const AppError_1 = require("../../errorHelpers/AppError");
const checkDivision_1 = require("../../utils/checkDivision");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const division_model_1 = require("./division.model");
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, checkDivision_1.checkDivision)("", payload);
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const retrieveAllDivision = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const divisions = await Division.find();
    // const count = await Division.countDocuments();
    const queryBuilder = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find(), query);
    const divisionBuilder = queryBuilder.filter().paginate();
    const [divisions, meta] = yield Promise.all([
        divisionBuilder.build(),
        divisionBuilder.getMeta(),
    ]);
    return {
        divisions,
        meta,
    };
});
const updateDivision = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isDivisionExist = yield division_model_1.Division.findById(id);
    if (!isDivisionExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Division does not found.");
    }
    yield (0, checkDivision_1.checkDivision)(id, payload);
    const division = yield division_model_1.Division.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return division;
});
const deleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isDivisionExist = yield division_model_1.Division.findById(id);
    if (!isDivisionExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Division does not found.");
    }
    const res = yield division_model_1.Division.findOneAndDelete({ _id: new mongoose_1.Types.ObjectId(id) });
    if (isDivisionExist.thumbnail) {
        yield (0, multer_config_1.deleteImageFromCloudinary)(isDivisionExist.thumbnail);
    }
    return res;
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    if (!slug) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Division slug is invalid.");
    }
    const division = yield division_model_1.Division.findOne({ slug });
    return division;
});
exports.divisionService = {
    createDivision,
    retrieveAllDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision,
};
