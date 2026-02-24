import { DOCS_FALLBACK } from "../constants/messages.js";

export function extractAnswerAndSource(text) {
  const t = String(text || "").trim();
  if (!t) return { answer: "", source: "" };

  // If model returned fallback, keep as-is
  if (t === DOCS_FALLBACK) return { answer: DOCS_FALLBACK, source: "" };

  const lines = t.split("\n").map((x) => x.trim()).filter(Boolean);
  const last = lines[lines.length - 1] || "";

  const m = last.match(/^SOURCE:\s*(.+)\s*$/i);
  if (!m) {
    // No source line => invalid for doc-based answer
    return { answer: "", source: "" };
  }

  const source = m[1].trim();
  const answerLines = lines.slice(0, -1);
  const answer = answerLines.join("\n").trim();

  return { answer, source };
}

export function isValidSource(source, docsSnippets) {
  const s = String(source || "").trim();
  if (!s) return false;
  const titles = docsSnippets.map((d) => String(d.title || "").trim());
  return titles.includes(s);
}