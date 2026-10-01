import { Router } from "express";
import {
  GetMocks,
  GetMockById,
  CreateMock,
  UpdateMock,
  DeleteMock,
} from "../controllers/mocks.controller.js";

const router = Router();

router.get("/", GetMocks);
router.get("/:id", GetMockById);
router.post("/", CreateMock);
router.put("/:id", UpdateMock);
router.delete("/:id", DeleteMock);

export default router;
