import express from "express";
import userRoutes from "./routes/users.router.js";
import productRoutes from "./routes/product.router.js";
import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import mocksRouter from "./routes/mocks.router.js";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/api/mocks", mocksRouter);

connectDB().catch((error) => {
  console.error(
    "MongoDB connection failed; database-backed endpoints are unavailable:",
    error.message,
  );
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
