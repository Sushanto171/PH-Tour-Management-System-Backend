import dotenv from "dotenv";
dotenv.config();

interface RequiredEnv {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_EXPIRES: string;
  BCRYPT_SALT_ROUND_ROUND: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_EMAIL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL: string;
  EXPRESS_SESSION: string;
  SSL: {
    SSL_STORE_ID: string;
    SSL_STORE_PASS: string;
    SSL_PAYMENT_API: string;
    SSL_VALIDATION_API: string;
    SSL_BACKEND_SUCCESS_URL: string;
    SSL_BACKEND_CANCEL_URL: string;
    SSL_BACKEND_FAIL_URL: string;
    SSL_FRONTEND_SUCCESS_URL: string;
    SSL_FRONTEND_CANCEL_URL: string;
    SSL_FRONTEND_FAIL_URL: string;
  };
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  NODEMAILER: {
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM: string;
  };
}

const loadEnvVariables = (): RequiredEnv => {
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
  ];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    BCRYPT_SALT_ROUND_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    EXPRESS_SESSION: process.env.EXPRESS_SESSION as string,
    SSL: {
      SSL_STORE_ID: process.env.SSL_STORE_ID as string,
      SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
      SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
      SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
      SSL_BACKEND_SUCCESS_URL: process.env.SSL_BACKEND_SUCCESS_URL as string,
      SSL_BACKEND_CANCEL_URL: process.env.SSL_BACKEND_CANCEL_URL as string,
      SSL_BACKEND_FAIL_URL: process.env.SSL_BACKEND_FAIL_URL as string,
      SSL_FRONTEND_SUCCESS_URL: process.env.SSL_FRONTEND_SUCCESS_URL as string,
      SSL_FRONTEND_CANCEL_URL: process.env.SSL_FRONTEND_CANCEL_URL as string,
      SSL_FRONTEND_FAIL_URL: process.env.SSL_FRONTEND_FAIL_URL as string,
    },
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    NODEMAILER: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_FROM: process.env.SMTP_FROM as string,
    },
  };
};

export const envVars: RequiredEnv = loadEnvVariables();
