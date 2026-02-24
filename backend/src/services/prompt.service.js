import { DOCS_FALLBACK } from "../constants/messages.js";

export function buildPrompt({ docsSnippets, history, userQuestion }) {
  const docsBlock = docsSnippets.length
    ? docsSnippets.map((d) => `TITLE: ${d.title}\nCONTENT: ${d.content}`).join("\n\n")
    : "(no relevant docs found)";

  const historyBlock = history.length
    ? history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")
    : "(no prior messages)";

  return `
You are a Support Assistant.

CRITICAL RULES:
- Answer ONLY using the information in the DOCUMENTATION section below.
- If the user’s question cannot be answered from the documentation, reply exactly:
"${DOCS_FALLBACK}"
- Do not guess. Do not add extra info not present in docs.

OUTPUT FORMAT (MANDATORY):
- Return the answer in plain text.
- On the LAST LINE, include exactly:
SOURCE: <TITLE>
Where <TITLE> must be exactly one of the documentation titles provided below.
- If you reply with "${DOCS_FALLBACK}", do NOT include SOURCE line.

DOCUMENTATION:
${docsBlock}

RECENT CHAT HISTORY:
${historyBlock}

USER QUESTION:
${userQuestion}
`.trim();
}