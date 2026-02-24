import { getRecentMessages } from "../db/queries.js";

export function getLast5Pairs(sessionId) {
  // 5 pairs = up to 10 messages (user/assistant)
  const msgs = getRecentMessages(sessionId, 10);

  // ensure valid roles and keep chronological
  return msgs
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }));
}