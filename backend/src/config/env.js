import dotenv from "dotenv";
dotenv.config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT || 8080),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  // LLM
  OPENAI_API_KEY: required("OPENAI_API_KEY"),
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4.1-mini"
};
