import { Router } from "express";
import {
  getMockBundle,
  getMocks,
  loadMockData,
} from "../controllers/mocks.controller.js";

const router = Router();

router.get("/", getMockBundle);
router.get("/:type", getMocks);
router.post("/load", loadMockData);

export default router;
