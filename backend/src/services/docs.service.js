import fs from "fs";
import { DOCS_PATH } from "../config/paths.js";

let cache = null;
let cacheMtime = null;

export function loadDocs() {
  const stat = fs.statSync(DOCS_PATH);
  const mtime = stat.mtimeMs;

  if (cache && cacheMtime === mtime) return cache;

  const raw = fs.readFileSync(DOCS_PATH, "utf-8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("docs.json must be an array of {title, content}");
  }

  cache = parsed.map((d) => ({
    title: String(d.title || "").trim(),
    content: String(d.content || "").trim(),
  }));

  cacheMtime = mtime;
  return cache;
}