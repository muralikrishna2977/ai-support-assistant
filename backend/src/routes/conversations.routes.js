import { Router } from "express";
import { conversationsController } from "../controllers/conversations.controller.js";

const router = Router();

router.get("/:sessionId", conversationsController);

export default router;