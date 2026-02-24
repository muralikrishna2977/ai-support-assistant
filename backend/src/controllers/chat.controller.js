import { DOCS_FALLBACK } from "../constants/messages.js";
import { upsertSession, insertMessage } from "../db/queries.js";
import { loadDocs } from "../services/docs.service.js";
import { getLast5Pairs } from "../services/context.service.js";
import { buildPrompt } from "../services/prompt.service.js";
import { callLLM } from "../services/llm.service.js";
import { findRelevantDocs } from "../services/docsSearch.service.js";
import {
  extractAnswerAndSource,
  isValidSource
} from "../services/sourceGuard.service.js";

export async function chatController(req, res, next) {
  try {
    const sessionId = String(req.body.sessionId || "").trim();
    const message = String(req.body.message || "").trim();

    if (!sessionId) return res.status(400).json({ error: "sessionId is required" });
    if (!message) return res.status(400).json({ error: "message is required" });

    // Ensure session exists
    upsertSession(sessionId);

    // Store user message
    insertMessage({ sessionId, role: "user", content: message });

    // Load docs
    const allDocs = loadDocs();

    // Find relevant docs
    const { docs: relevantDocs, bestScore } = findRelevantDocs(allDocs, message, 3);

    // If no relevant docs => strict fallback (no LLM call)
    if (!relevantDocs.length || bestScore < 0.15) {
      insertMessage({ sessionId, role: "assistant", content: DOCS_FALLBACK });
      return res.json({ reply: DOCS_FALLBACK, tokensUsed: 0 });
    }

    // Load last 5 pairs from SQLite
    const history = getLast5Pairs(sessionId);

    // Build prompt
    const prompt = buildPrompt({
      docsSnippets: relevantDocs,
      history,
      userQuestion: message
    });

    // Call LLM
    let rawText = "";
    let tokensUsed = 0;

    try {
      const out = await callLLM(prompt);
      rawText = (out.text || "").trim();
      tokensUsed = out.tokensUsed ?? 0;
    } catch (e) {
      return res.status(502).json({ error: "LLM service failed. Please try again." });
    }

    // Parse answer + source
    const { answer, source } = extractAnswerAndSource(rawText);

    let finalReply = "";

    // If model used fallback, accept
    if (answer === DOCS_FALLBACK) {
      finalReply = DOCS_FALLBACK;
      tokensUsed = tokensUsed ?? 0;
    } else {
      // Strict: must have source AND source must match one of provided doc titles
      if (!answer || !isValidSource(source, relevantDocs)) {
        finalReply = DOCS_FALLBACK;
        tokensUsed = 0;
      } else {
        finalReply = answer;
      }
    }

    // Store assistant
    insertMessage({ sessionId, role: "assistant", content: finalReply });

    return res.json({ reply: finalReply, tokensUsed });
  } catch (err) {
    next(err);
  }
}