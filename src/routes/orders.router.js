import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
} from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById);

export default router;
