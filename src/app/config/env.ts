import dotenv from "dotenv";
dotenv.config();

interface RequiredEnv {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_EXPIRESIN: string;
  BCRYPT_SALT: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_EMAIL: string;
}

const loadEnvVariables = (): RequiredEnv => {
  const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "JWT_ACCESS_SECRET",
    "JWT_EXPIRESIN",
    "BCRYPT_SALT",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
  ];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_EXPIRESIN: process.env.JWT_EXPIRESIN as string,
    BCRYPT_SALT: process.env.BCRYPT_SALT as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
  };
};

export const envVars: RequiredEnv = loadEnvVariables();
