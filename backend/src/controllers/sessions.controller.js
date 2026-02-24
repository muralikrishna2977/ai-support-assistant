import { listSessions } from "../db/queries.js";

export async function sessionsController(req, res, next) {
  try {
    const sessions = listSessions().map((s) => ({
      sessionId: s.id,
      createdAt: s.created_at,
      lastUpdated: s.updated_at,
    }));

    res.json({ sessions });
  } catch (err) {
    next(err);
  }
}