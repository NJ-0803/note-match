import { NextRequest, NextResponse } from "next/server";
import { getLlmClient, LLM_MODEL, REASONING_EFFORT, normalizeScore } from "@/lib/llm";
import { getAllPerfumes } from "@/lib/data";
import { preFilterByDescription } from "@/lib/search";

export const runtime = "nodejs";

const SHORTLIST_SIZE = 25;

const SEARCH_TOOL = {
  type: "function" as const,
  function: {
    name: "submit_matches",
    description: "Submit the ranked perfume matches for the free-text query.",
    parameters: {
      type: "object",
      properties: {
        matches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "id of a matching perfume from the candidate list" },
              score: { type: "number", description: "confidence/relevance score from 0 to 1" },
              reason: { type: "string", description: "one short friendly sentence on why this fits the description" },
            },
            required: ["id", "score", "reason"],
          },
        },
      },
      required: ["matches"],
    },
  },
};

function buildCandidateList(perfumes: ReturnType<typeof getAllPerfumes>) {
  return perfumes
    .map(
      (p) =>
        `- id: ${p.id} | ${p.brand} ${p.name} | family: ${p.family} | gender: ${p.gender} | top: ${p.topNotes.join(", ")} | heart: ${p.heartNotes.join(", ")} | base: ${p.baseNotes.join(", ")}`,
    )
    .join("\n");
}

export async function POST(request: NextRequest) {
  let body: { query?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing 'query'" }, { status: 400 });
  }

  const perfumes = getAllPerfumes();
  if (perfumes.length === 0) {
    return NextResponse.json({ error: "No perfume data available yet" }, { status: 503 });
  }

  let client;
  try {
    client = getLlmClient();
  } catch {
    return NextResponse.json({ error: "Search is not configured (missing API key)" }, { status: 500 });
  }

  // Pre-filter locally (free, instant) so the LLM only ever sees a small
  // shortlist per request - the full dataset would exceed the free-tier
  // per-minute token budget if sent on every visitor search.
  const shortlist = preFilterByDescription(perfumes, query, SHORTLIST_SIZE);

  const callParams = {
    model: LLM_MODEL,
    max_tokens: 1500,
    reasoning_effort: REASONING_EFFORT,
    messages: [
      {
        role: "system" as const,
        content: [
          "You are a fragrance expert helping visitors find perfumes on a recommendation website.",
          "The visitor will describe a scent, mood, or occasion in their own words. Find the best-matching perfumes from the candidate list below, based on their note profiles.",
          "",
          "Candidate perfumes:",
          buildCandidateList(shortlist),
        ].join("\n"),
      },
      {
        role: "user" as const,
        content: `Visitor's description: "${query}"\n\nReturn up to 6 of the best-matching perfumes from the candidate list, ranked by relevance. Call submit_matches.`,
      },
    ],
    tools: [SEARCH_TOOL],
    tool_choice: { type: "function" as const, function: { name: "submit_matches" } },
  };

  async function attemptSearch() {
    const completion = await client!.chat.completions.create(callParams);
    const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("Model returned no tool call");
    // Throws if the model emitted malformed JSON - caught by the retry below,
    // not just network/API errors from the completion call itself.
    return JSON.parse(toolCall.function.arguments).matches ?? [];
  }

  let matches: Array<{ id: string; score: number; reason: string }>;
  try {
    // llama-3.1-8b-instant occasionally emits a malformed tool call under
    // strict forced tool_choice - retry the full attempt (call + parse)
    // once before falling back, since the failure can surface either as a
    // thrown request error or as unparseable content in an otherwise
    // "successful" response.
    try {
      matches = await attemptSearch();
    } catch {
      matches = await attemptSearch();
    }
  } catch (err) {
    console.error("Free-text search failed, falling back to note-overlap shortlist:", err);
    // Never leave the visitor with a bare error for a working query - fall
    // back to the deterministic local shortlist (already ranked by note/
    // family/description overlap) so a description still returns something.
    const fallback = shortlist.slice(0, 6).map((p, i) => ({
      id: p.id,
      score: Math.max(0.4, 0.85 - i * 0.08),
      reason: "Matched by note overlap with your description (AI ranking was unavailable).",
    }));
    return NextResponse.json({ matches: fallback });
  }

  const validIds = new Set(shortlist.map((p) => p.id));
  const filtered = matches
    .filter((m) => validIds.has(m.id))
    .map((m) => ({ ...m, score: normalizeScore(m.score) }));

  return NextResponse.json({ matches: filtered });
}
