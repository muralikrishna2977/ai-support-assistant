import { db } from "./sqlite.js";

export function initDb() {
  // sessions table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )
  `).run();

  // messages table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user','assistant')),
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )
  `).run();

  // indexes for speed
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_messages_session_time ON messages(session_id, created_at)`).run();
  db.prepare(`CREATE INDEX IF NOT EXISTS idx_sessions_updated ON sessions(updated_at)`).run();
}