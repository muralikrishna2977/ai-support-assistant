import { Router } from "express";
import { requireBodyFields } from "../middleware/validate.js";
import { chatController } from "../controllers/chat.controller.js";

const router = Router();

router.post("/", requireBodyFields(["sessionId", "message"]), chatController);

export default router;