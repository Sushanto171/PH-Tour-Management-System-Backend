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
exports.userController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const getUserByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.userService.getUserByEmail(req.params.email);
        res.status(http_status_codes_1.default.OK).json({
            message: "User retrieved successfully",
            user,
        });
    }
    catch (error) {
        next(error);
        // res.status(httpStatus.BAD_REQUEST).json({
        //   message: `Something went wrong ${error.message}`,
        //   error,
        // });
    }
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.userService.createUser(req.body);
        res.status(http_status_codes_1.default.CREATED).json({
            message: "User created successfully.",
            user,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            message: `Something went wrong ${error.massage}`,
            error,
        });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.userService.updateUser(req);
        res.status(http_status_codes_1.default.OK).json({
            message: "User updated successfully ",
            user,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({
            message: `Something went wrong ${error.message}`,
            error,
        });
    }
});
exports.userController = {
    createUser,
    getUserByEmail,
    updateUser,
};
