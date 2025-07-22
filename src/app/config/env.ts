import dotenv from "dotenv";
dotenv.config();

interface RequiredEnv {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
}

const loadEnvVariables = (): RequiredEnv => {
  const requiredEnvVariables = ["PORT", "DB_URL", "NODE_ENV"];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envConfig: RequiredEnv = loadEnvVariables();
