import Groq from "groq-sdk";

let client: Groq | null = null;

export function getLlmClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }
    client = new Groq({ apiKey });
  }
  return client;
}

// Open-weight model hosted on Groq's free tier (no credit card required).
// Chosen over gpt-oss-120b specifically for its much higher free-tier daily
// quota (14,400 requests/day, 500K tokens/day vs. 1,000 requests/day and
// 200K tokens/day for gpt-oss-120b) - this app makes many small calls rather
// than a few large ones, so the smaller model's limits fit better.
export const LLM_MODEL = "llama-3.1-8b-instant";
