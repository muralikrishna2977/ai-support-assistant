import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { DB_PATH } from "../config/paths.js";

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new Database(DB_PATH);

// safer defaults
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

