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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = require("../../errorHelpers/AppError");
const bcrypt_1 = require("../../utils/bcrypt");
const jwt_1 = require("../../utils/jwt");
const sendEmail_1 = require("../../utils/sendEmail");
const userToken_1 = require("../../utils/userToken");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const credentialLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Email does not exist.");
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatched) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Password does not matched.");
    }
    const userTokens = (0, userToken_1.createUserToken)(isUserExist);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = isUserExist.toObject(), { password: _remove } = _a, user = __rest(_a, ["password"]);
    return {
        user,
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userToken_1.getNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (payload, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(payload.userId);
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User does not matched.");
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "oldPassword does not matched.");
    }
    user.password = yield (0, bcrypt_1.generateHashedPassword)(newPassword, env_1.envVars.BCRYPT_SALT_ROUND_ROUND);
    user.save();
    return true;
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User does not matched.");
    }
    if (user.password &&
        user.auths.some((authProvider) => authProvider.provider === "google")) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Password already set. You can change password to your profile.");
    }
    const hashedPassword = yield (0, bcrypt_1.generateHashedPassword)(plainPassword, env_1.envVars.BCRYPT_SALT_ROUND_ROUND);
    const authUser = {
        provider: "credential",
        providerId: user.email,
    };
    user.password = hashedPassword;
    user.auths = [...user.auths, authUser];
    yield user.save();
    return true;
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User does not matched.");
    }
    if (user) {
        if (!user.isVerified) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User is not verified.");
        }
        if (user.isDeleted) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User is Deleted.");
        }
        if ((user.isActive && user.isActive === user_interface_1.IsActive.BLOCKED) ||
            user.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `User is ${user.isActive}`);
        }
    }
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const resetToken = (0, jwt_1.generateJwtToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, "10min");
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${user._id}&resetToken=${resetToken}`;
    yield (0, sendEmail_1.sendEmail)({
        to: user.email,
        subject: "Reset Password",
        templateName: "forgotPassword",
        templateData: {
            name: user.name,
            resetUILink,
        },
    });
    return null;
});
const resetPassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId !== payload._id) {
        console.log(userId, payload._id);
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User does not matched.");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User does not matched.");
    }
    user.password = yield (0, bcrypt_1.generateHashedPassword)(payload.password, env_1.envVars.BCRYPT_SALT_ROUND_ROUND);
    user.save();
    return true;
});
exports.AuthService = {
    credentialLogin,
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword,
};
