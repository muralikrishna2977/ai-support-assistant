import rateLimit from "express-rate-limit";

// basic per-IP limiter
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 requests/min per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." }
});