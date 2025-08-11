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
exports.checkDivisionTourTypeId = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = require("../errorHelpers/AppError");
const division_model_1 = require("../modules/division/division.model");
const tour_model_1 = require("../modules/tour/tour.model");
const checkDivisionTourTypeId = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.division) {
        const isValidDivisionId = yield division_model_1.Division.findById(payload.division);
        if (!isValidDivisionId) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Division id is invalid");
        }
    }
    if (payload.tourType) {
        const isValidTourTypeId = yield tour_model_1.TourType.findById(payload.tourType);
        if (!isValidTourTypeId) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Tour type id is invalid");
        }
    }
});
exports.checkDivisionTourTypeId = checkDivisionTourTypeId;
