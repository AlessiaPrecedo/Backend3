import app from "./app.js";
import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import logger from "./utils/logger.js";

connectDB().catch((error) => {
  logger.fatal(
    "MongoDB connection failed; database-backed endpoints are unavailable",
    { error: error.message, stack: error.stack, port: config.port },
  );
});

const server = app.listen(config.port, () => {
  logger.info("Server started successfully", {
    port: config.port,
    nodeEnv: config.nodeEnv,
  });
});

server.on("error", (error) => {
  logger.fatal("Server startup failed", {
    error: error.message,
    stack: error.stack,
    port: config.port,
  });
});
