/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { connectRedis } from "./app/config/redis.config";
import { createSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const serverStart = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("🏪 Mongodb Connection stablish");
    server = app.listen(envVars.PORT, () => {
      console.log(`🔥Server running: http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await connectRedis();
  await serverStart();
  await createSuperAdmin();
})();

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
