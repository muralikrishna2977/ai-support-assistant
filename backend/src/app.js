import express from "express";
import cors from "cors";
import morgan from "morgan";

import { rateLimiter } from "./middleware/rateLimit.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import chatRoutes from "./routes/chat.routes.js";
import sessionsRoutes from "./routes/sessions.routes.js";
import conversationsRoutes from "./routes/conversations.routes.js";

import { initDb } from "./db/migrations.js";
import { env } from "./config/env.js";

const app = express();

// init DB tables at startup
initDb();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// basic per-IP rate limiting
app.use(rateLimiter);

// health
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// APIs
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/conversations", conversationsRoutes);

// errors
app.use(notFoundHandler);
app.use(errorHandler);

export default app;