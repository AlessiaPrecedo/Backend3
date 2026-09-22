import express from "express";
import userRoutes from "./routes/users.router.js";
import productRoutes from "./routes/product.router.js";
import { config } from "./config/env.config.js";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
