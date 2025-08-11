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
exports.AuthControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const AppError_1 = require("../../errorHelpers/AppError");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const setAuthCookie_1 = require("../../utils/setAuthCookie");
const userToken_1 = require("../../utils/userToken");
const auth_service_1 = require("./auth.service");
const credentialLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const loginIfo = await AuthService.credentialLogin(req.body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            // throw new AppError(err.statusCode || 401, info.message);
            return next(new AppError_1.AppError(err.statusCode || 401, err));
        }
        if (!user) {
            return next(new AppError_1.AppError(err.statusCode || 401, info.message));
        }
        const loginInfo = (0, userToken_1.createUserToken)(user);
        (0, setAuthCookie_1.setAuthCookie)(res, loginInfo);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User login successfully.",
            data: Object.assign(Object.assign({}, loginInfo), { user }),
        });
    }))(req, res, next);
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req === null || req === void 0 ? void 0 : req.cookies.refreshToken;
    // const refreshToken = req.headers.authorization as string;
    if (!refreshToken) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "No refresh received from cookies.");
    }
    const accessToken = yield auth_service_1.AuthService.getNewAccessToken(refreshToken);
    (0, setAuthCookie_1.setAuthCookie)(res, accessToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: accessToken,
        message: "User accessToken retrieved Successfully.",
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: null,
        message: "User logout successfully",
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = req.user;
    const { newPassword, oldPassword } = req.body;
    const newUpdatedPassword = yield auth_service_1.AuthService.changePassword(decoded, oldPassword, newPassword);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: newUpdatedPassword,
        message: "Password changed successfully",
    });
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = req.user;
    const { password } = req.body;
    const newUpdatedPassword = yield auth_service_1.AuthService.setPassword(decoded.userId, password);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: newUpdatedPassword,
        message: "Password set successfully",
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthService.forgotPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: null,
        message: "Email send successfully",
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = req.user;
    const newUpdatedPassword = yield auth_service_1.AuthService.resetPassword(decoded.userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        data: newUpdatedPassword,
        message: "Password reset successfully",
    });
}));
const googleCallbackController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User does not found");
    }
    const logInfo = (0, userToken_1.createUserToken)(user);
    console.log(logInfo);
    yield (0, setAuthCookie_1.setAuthCookie)(res, logInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
exports.AuthControllers = {
    credentialLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    changePassword,
    setPassword,
    forgotPassword,
    googleCallbackController,
};
