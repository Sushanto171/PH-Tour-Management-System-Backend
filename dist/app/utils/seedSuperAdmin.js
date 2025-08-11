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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuperAdmin = void 0;
/* eslint-disable no-console */
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcrypt_1 = require("./bcrypt");
const createSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            console.log("🙎‍♂️ Super Admin already exist.");
            return;
        }
        const hashedPassword = yield (0, bcrypt_1.generateHashedPassword)(env_1.envVars.SUPER_ADMIN_PASSWORD, env_1.envVars.BCRYPT_SALT_ROUND_ROUND);
        const authProvider = {
            provider: "credential",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        const payload = {
            name: "Super Admin",
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: user_interface_1.Role.SUPER_ADMIN,
            isVerified: true,
            auths: [authProvider],
        };
        const superAdmin = yield user_model_1.User.create(payload);
        return superAdmin;
    }
    catch (error) {
        console.log(error);
    }
});
exports.createSuperAdmin = createSuperAdmin;
