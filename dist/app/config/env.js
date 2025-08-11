"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariables = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES",
        "BCRYPT_SALT_ROUND_ROUND",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
        "JWT_REFRESH_EXPIRES",
        "JWT_REFRESH_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "FRONTEND_URL",
        "EXPRESS_SESSION",
        "SSL_STORE_ID",
        "SSL_STORE_PASS",
        "SSL_PAYMENT_API",
        "SSL_VALIDATION_API",
        "SSL_BACKEND_SUCCESS_URL",
        "SSL_BACKEND_CANCEL_URL",
        "SSL_BACKEND_FAIL_URL",
        "SSL_FRONTEND_SUCCESS_URL",
        "SSL_FRONTEND_CANCEL_URL",
        "SSL_FRONTEND_FAIL_URL",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "SMTP_FROM",
        "REDIS_PASS",
        "REDIS_HOST",
        "REDIS_PORT",
        "TWILIO_ACCOUNT_SIID",
        "TWILIO_AUTH_TOKEN",
        "SSL_IPN_URL",
    ];
    requiredEnvVariables.forEach((key) => {
        if (!process.env[key])
            throw new Error(`Missing env variable: ${key}`);
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        BCRYPT_SALT_ROUND_ROUND: process.env.BCRYPT_SALT_ROUND,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        EXPRESS_SESSION: process.env.EXPRESS_SESSION,
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID,
            SSL_STORE_PASS: process.env.SSL_STORE_PASS,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
            SSL_BACKEND_SUCCESS_URL: process.env.SSL_BACKEND_SUCCESS_URL,
            SSL_BACKEND_CANCEL_URL: process.env.SSL_BACKEND_CANCEL_URL,
            SSL_BACKEND_FAIL_URL: process.env.SSL_BACKEND_FAIL_URL,
            SSL_FRONTEND_SUCCESS_URL: process.env.SSL_FRONTEND_SUCCESS_URL,
            SSL_FRONTEND_CANCEL_URL: process.env.SSL_FRONTEND_CANCEL_URL,
            SSL_FRONTEND_FAIL_URL: process.env.SSL_FRONTEND_FAIL_URL,
            SSL_IPN_URL: process.env.SSL_IPN_URL,
        },
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        },
        NODEMAILER: {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_FROM: process.env.SMTP_FROM,
        },
        REDIS: {
            REDIS_PASS: process.env.REDIS_PASS,
            REDIS_HOST: process.env.REDIS_HOST,
            REDIS_PORT: process.env.REDIS_PORT,
        },
        TWILIO: {
            TWILIO_ACCOUNT_SIID: process.env.TWILIO_ACCOUNT_SIID,
            TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        },
    };
};
exports.envVars = loadEnvVariables();
