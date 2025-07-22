/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envConfig } from "./app/config/env";

let server: Server;

const serverStart = async () => {
  try {
    await mongoose.connect(envConfig.DB_URL);
    console.log("🏪 Mongodb Connection stablish");
    server = app.listen(envConfig.PORT, () => {
      console.log(`🔥Server running: http://localhost:${envConfig.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

serverStart();

// unhandled Rejection error
process.on("unhandledRejection", () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// uncaught error
process.on("uncaughtException", () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
