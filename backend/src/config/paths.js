import path from "path";

export const ROOT_DIR = path.resolve(process.cwd(), ".."); // project root (ai-support-assistant/)
export const DOCS_PATH = path.join(ROOT_DIR, "docs.json");
export const DB_PATH = path.join(process.cwd(), "data", "app.sqlite"); // backend/data/app.sqlite