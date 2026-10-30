import { Router } from "express";
import {
  getAllDeliveries,
  getDeliveryById,
} from "../controllers/deliveries.controller.js";

const router = Router();

router.get("/", getAllDeliveries);
router.get("/:id", getDeliveryById);

export default router;
