function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text) {
  const t = normalize(text).split(" ").filter(Boolean);
  // remove very small words
  return t.filter((w) => w.length >= 3);
}

export function findRelevantDocs(allDocs, question, topK = 3) {
  const qTokens = new Set(tokens(question));
  if (qTokens.size === 0) return { docs: [], bestScore: 0 };

  const scored = allDocs.map((doc) => {
    const text = `${doc.title} ${doc.content}`;
    const dTokens = new Set(tokens(text));

    let overlap = 0;
    for (const w of qTokens) if (dTokens.has(w)) overlap++;

    // score: overlap ratio vs question size
    const score = overlap / qTokens.size;

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const bestScore = scored[0]?.score || 0;
  const docs = scored.slice(0, topK).filter((x) => x.score > 0).map((x) => x.doc);

  return { docs, bestScore };
}