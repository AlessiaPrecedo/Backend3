import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
} from "../controllers/orders.controller.js";

const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);

export default router;
