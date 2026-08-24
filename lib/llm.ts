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

// llama-3.1-8b-instant was removed from Groq's catalog (calls now 404 with
// model_not_found) - openai/gpt-oss-20b is the smallest current Groq model
// with tool-calling support, keeping this app's many-small-calls workload
// on the cheapest/fastest option available today.
export const LLM_MODEL = "openai/gpt-oss-20b";

// gpt-oss models emit a chain-of-thought before the tool call, which counts
// against max_tokens - "low" keeps that CoT short so small requests don't
// get truncated mid-JSON, without materially hurting match quality for a
// task this narrow (picking from an already-filtered shortlist).
export const REASONING_EFFORT = "low" as const;

// gpt-oss doesn't reliably keep scores on the requested 0-1 scale (observed
// values up to ~10) - rescale defensively instead of trusting the prompt.
export function normalizeScore(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  if (raw > 10) return Math.min(1, raw / 100);
  if (raw > 1) return raw / 10;
  return Math.max(0, raw);
}
