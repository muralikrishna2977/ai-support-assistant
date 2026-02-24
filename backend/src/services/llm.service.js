import OpenAI from "openai";
import { env } from "../config/env.js";

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function callLLM(prompt) {
  // Using Responses API (recommended)
  const resp = await client.responses.create({
    model: env.OPENAI_MODEL,
    input: prompt,
  });

  const text =
    resp.output_text?.trim?.() ||
    (resp.output?.[0]?.content?.[0]?.text?.trim?.() ?? "");

  const tokensUsed = resp.usage?.total_tokens ?? null;

  return { text, tokensUsed };
}