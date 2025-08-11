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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const env_1 = require("./env");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done(null, false, { message: "User dose not exist." });
        }
        if (!isUserExist.isVerified) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified.");
            return done("User is not verified.");
        }
        if (isUserExist.isDeleted) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted.");
            return done("User is Deleted.");
        }
        if ((isUserExist.isActive && isUserExist.isActive === user_interface_1.IsActive.BLOCKED) ||
            isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is Blocked.");
            return done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist.auths.some((provider) => provider.provider === "google" && !isUserExist.password)) {
            return done(null, false, {
                message: "This email is already linked with a Google account. Please log in using Google or set a password to use email and password login.",
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isMatch) {
            return done("Password does not match.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = isUserExist.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
        return done(null, rest);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "Email does not found" });
        }
        let user = yield user_model_1.User.findOne({ email });
        if (user) {
            if (!user.isVerified) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified.");
                return done(null, false, { message: "User is not verified." });
            }
            if (user.isDeleted) {
                // throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted.");
                return done(null, false, { message: "User is Deleted." });
            }
            if ((user.isActive && user.isActive === user_interface_1.IsActive.BLOCKED) ||
                user.isActive === user_interface_1.IsActive.INACTIVE) {
                return done(null, false, { message: `User is ${user.isActive}` });
            }
        }
        if (!user) {
            user = yield user_model_1.User.create({
                name: profile.displayName,
                email: email,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: user_interface_1.Role.USER,
                isActive: user_interface_1.IsActive.ACTIVE,
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id,
                    },
                ],
            });
        }
        done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => done(null, user._id));
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    done(null, user);
}));
