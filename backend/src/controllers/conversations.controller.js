import { getConversation } from "../db/queries.js";

export async function conversationsController(req, res, next) {
  try {
    const { sessionId } = req.params;

    if (!sessionId || String(sessionId).trim() === "") {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const messages = getConversation(sessionId).map((m) => ({
      id: m.id,
      sessionId: m.session_id,
      role: m.role,
      content: m.content,
      createdAt: m.created_at,
    }));

    res.json({ sessionId, messages });
  } catch (err) {
    next(err);
  }
}