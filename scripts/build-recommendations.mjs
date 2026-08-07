// One-time build script: for every perfume, deterministically pre-filters
// a shortlist of candidates by note overlap (free, instant), then asks the
// LLM to pick and rank the true top matches from that shortlist and write a
// short "why it matches" explanation for each - all in a single call per
// perfume. This keeps every request small enough to fit Groq's free-tier
// per-minute token limits even though the full dataset is ~200 perfumes.
// Run manually whenever data/perfumes.json changes:
//   GROQ_API_KEY=gsk_... node scripts/build-recommendations.mjs
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getClient,
  getToolArgs,
  createWithRetry,
  LLM_MODEL,
  noteText,
  perfumeLabel,
  sleep,
  preFilterCandidates,
} from "./_shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

const SHORTLIST_SIZE = 18;
const TOP_N = 8;
// Free tier for llama-3.1-8b-instant: 30 RPM / 6,000 TPM. TPM is the binding
// constraint here (each request is ~1.5-2K tokens with an 18-perfume
// shortlist), so pace at roughly 3 req/min to stay safely under 6,000 TPM.
const DELAY_MS = 19000;

const MATCH_TOOL = {
  type: "function",
  function: {
    name: "submit_matches",
    description: "Submit the ranked list of most similar perfumes with an explanation for each.",
    parameters: {
      type: "object",
      properties: {
        matches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "id of the matched perfume from the candidate list" },
              score: { type: "number", description: "similarity score from 0 to 1, higher = more similar" },
              sharedNotes: {
                type: "array",
                items: { type: "string" },
                description: "specific notes/materials shared or closely related between the two perfumes",
              },
              explanation: {
                type: "string",
                description: "one short, specific, friendly sentence on why this smells similar, naming the actual shared notes",
              },
            },
            required: ["id", "score", "sharedNotes", "explanation"],
          },
        },
      },
      required: ["matches"],
    },
  },
};

function buildCandidateList(candidates) {
  return candidates
    .map((p) => `- id: ${p.id} | ${perfumeLabel(p)} | family: ${p.family} | ${noteText(p)}`)
    .join("\n");
}

async function getMatchesFor(client, perfume, candidates) {
  const systemText = [
    "You are a fragrance expert helping build a perfume-recommendation database.",
    "Given a target perfume and a shortlist of candidates, pick and rank the ones that genuinely smell most similar, based on their note profiles.",
  ].join(" ");

  const userText = [
    `Target perfume: ${perfumeLabel(perfume)} (id: ${perfume.id})`,
    `Family: ${perfume.family}`,
    `Notes: ${noteText(perfume)}`,
    "",
    "Candidates (already pre-filtered for note overlap):",
    buildCandidateList(candidates),
    "",
    `Return the top ${TOP_N} most similar from this list, ranked best first. Weigh closely related materials (e.g. Ambroxan and Iso E Super are both clean woody-amber notes) not just exact string matches. Call submit_matches.`,
  ].join("\n");

  const completion = await createWithRetry(client, {
    model: LLM_MODEL,
    max_tokens: 1200,
    messages: [
      { role: "system", content: systemText },
      { role: "user", content: userText },
    ],
    tools: [MATCH_TOOL],
    tool_choice: { type: "function", function: { name: "submit_matches" } },
  });

  const args = getToolArgs(completion);
  return args?.matches ?? [];
}

async function main() {
  const perfumes = JSON.parse(await readFile(path.join(DATA_DIR, "perfumes.json"), "utf-8"));
  console.log(`Loaded ${perfumes.length} perfumes.`);

  const recPath = path.join(DATA_DIR, "perfumes.recommendations.json");
  const expPath = path.join(DATA_DIR, "explanations.json");
  let recommendations = {};
  let explanations = {};
  try {
    recommendations = JSON.parse(await readFile(recPath, "utf-8"));
    explanations = JSON.parse(await readFile(expPath, "utf-8"));
    console.log(`Resuming: ${Object.keys(recommendations).length} perfumes already processed.`);
  } catch {
    // no existing output yet, start fresh
  }

  const client = getClient();
  const todo = perfumes.filter((p) => !recommendations[p.id] || recommendations[p.id].length === 0);
  console.log(`${todo.length} perfumes need (re)processing.`);
  let done = 0;

  for (const perfume of todo) {
    try {
      const candidates = preFilterCandidates(perfume, perfumes, SHORTLIST_SIZE);
      const matches = await getMatchesFor(client, perfume, candidates);
      const validIds = new Set(candidates.map((c) => c.id));
      const cleanMatches = matches.filter((m) => validIds.has(m.id)).slice(0, TOP_N);

      recommendations[perfume.id] = cleanMatches.map((m) => ({
        id: m.id,
        score: m.score,
        sharedNotes: m.sharedNotes,
      }));
      for (const m of cleanMatches) {
        explanations[`${perfume.id}::${m.id}`] = m.explanation;
      }
    } catch (err) {
      console.error(`Failed for ${perfume.id}:`, err.message);
      recommendations[perfume.id] = [];
    }
    done += 1;
    console.log(`  ${done}/${todo.length} done`);
    // Save incrementally so a later failure doesn't lose progress.
    await writeFile(recPath, JSON.stringify(recommendations, null, 2));
    await writeFile(expPath, JSON.stringify(explanations, null, 2));
    await sleep(DELAY_MS);
  }

  console.log(`Done. ${Object.keys(recommendations).length}/${perfumes.length} perfumes have recommendations.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
