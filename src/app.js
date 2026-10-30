import express from "express";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/users.router.js";
import productRoutes from "./routes/product.router.js";
import orderRoutes from "./routes/orders.router.js";
import deliveryRoutes from "./routes/deliveries.router.js";
import { swaggerSpec } from "./docs/swagger.config.js";
import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import mocksRouter from "./routes/mocks.router.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import logger from "./utils/logger.js";

const app = express();
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  //En esta función se registra la información de cada solicitud HTTP que llega al servidor, incluyendo el método, la ruta, el código de estado y la duración de la solicitud en milisegundos. Esto es útil para monitorear el rendimiento y depurar problemas en la aplicación.
  const startedAt = Date.now();
  res.on("finish", () => {
    logger.http("HTTP request", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });
  next();
});
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/deliveries", deliveryRoutes);
app.use("/api/mocks", mocksRouter);
app.use(notFoundHandler);
app.use(errorHandler);

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
