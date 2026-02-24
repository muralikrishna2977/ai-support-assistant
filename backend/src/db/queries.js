import { db } from "./sqlite.js";

/** Create session row if missing, and bump updated_at. */
export function upsertSession(sessionId) {
  db.prepare(
    `INSERT INTO sessions (id) VALUES (?)
     ON CONFLICT(id) DO UPDATE SET updated_at = datetime('now')`
  ).run(sessionId);
}

export function touchSession(sessionId) {
  db.prepare(`UPDATE sessions SET updated_at = datetime('now') WHERE id = ?`).run(sessionId);
}

export function insertMessage({ sessionId, role, content }) {
  db.prepare(
    `INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)`
  ).run(sessionId, role, content);

  touchSession(sessionId);
}

export function getConversation(sessionId) {
  return db.prepare(
    `SELECT id, session_id, role, content, created_at
     FROM messages
     WHERE session_id = ?
     ORDER BY created_at ASC, id ASC`
  ).all(sessionId);
}

/**
 * Get last N "pairs" (user+assistant) => 2*N rows max.
 * We'll fetch last 10 messages for 5 pairs, then slice safely.
 */
export function getRecentMessages(sessionId, maxMessages = 10) {
  const rows = db.prepare(
    `SELECT role, content, created_at
     FROM messages
     WHERE session_id = ?
     ORDER BY created_at DESC, id DESC
     LIMIT ?`
  ).all(sessionId, maxMessages);

  return rows.reverse(); // chronological
}

export function listSessions() {
  return db.prepare(
    `SELECT id, created_at, updated_at
     FROM sessions
     ORDER BY updated_at DESC`
  ).all();
}