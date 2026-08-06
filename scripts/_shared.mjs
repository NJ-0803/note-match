import Groq from "groq-sdk";

// Open-weight model on Groq's free tier - chosen over the larger gpt-oss
// models specifically for its much higher daily quota (14,400 requests/day,
// 500K tokens/day vs 1,000 req/day and 200K tokens/day for gpt-oss-120b),
// since this workload is many small calls rather than a few large ones.
export const LLM_MODEL = "llama-3.1-8b-instant";

export function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set. Export it before running this script.");
  }
  return new Groq({ apiKey });
}

export function getToolArgs(completion) {
  const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall) return null;
  return JSON.parse(toolCall.function.arguments);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** llama-3.1-8b-instant occasionally emits a malformed (non-JSON) tool call
 * under Groq's strict forced tool_choice, especially with larger schemas.
 * Retry a couple of times with a short backoff before giving up. */
export async function createWithRetry(client, params, retries = 2) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await client.chat.completions.create(params);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await sleep(1500 * (attempt + 1));
    }
  }
  throw lastErr;
}

export function noteText(perfume) {
  return `Top: ${perfume.topNotes.join(", ")} | Heart: ${perfume.heartNotes.join(", ")} | Base: ${perfume.baseNotes.join(", ")}`;
}

export function perfumeLabel(perfume) {
  return `${perfume.brand} ${perfume.name}`;
}

function allNotesLower(perfume) {
  return {
    top: perfume.topNotes.map((n) => n.toLowerCase()),
    heart: perfume.heartNotes.map((n) => n.toLowerCase()),
    base: perfume.baseNotes.map((n) => n.toLowerCase()),
  };
}

function overlapScore(a, b) {
  const an = allNotesLower(a);
  const bn = allNotesLower(b);
  const weight = { top: 1, heart: 2, base: 3 };
  let score = 0;
  for (const posA of ["top", "heart", "base"]) {
    for (const noteA of an[posA]) {
      for (const posB of ["top", "heart", "base"]) {
        if (bn[posB].includes(noteA)) {
          score += weight[posA] + weight[posB];
        }
      }
    }
  }
  if (a.family === b.family) score += 4;
  return score;
}

/**
 * Deterministic (free, instant) pre-filter so we only send a manageable
 * shortlist of candidates to the LLM per request, keeping each call well
 * under Groq's free-tier per-minute token limits instead of sending the
 * full ~200-perfume dataset on every call.
 */
export function preFilterCandidates(target, perfumes, limit = 20) {
  return perfumes
    .filter((p) => p.id !== target.id)
    .map((p) => ({ perfume: p, score: overlapScore(target, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.perfume);
}
