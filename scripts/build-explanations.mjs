// One-time build script: generates a plain-English "what does this note
// smell like" description for every unique note in the dataset, batched to
// keep each request small. Cached to static JSON - zero runtime cost.
//   GROQ_API_KEY=gsk_... node scripts/build-explanations.mjs
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getClient, getToolArgs, createWithRetry, LLM_MODEL, sleep } from "./_shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const NOTE_BATCH_SIZE = 15;
// Smaller requests here (~700 tokens each) than build-recommendations.mjs,
// so a shorter delay still stays safely under the 6,000 TPM free-tier cap.
const DELAY_MS = 8000;

const NOTES_TOOL = {
  type: "function",
  function: {
    name: "submit_note_descriptions",
    description: "Submit a plain-English description for each note.",
    parameters: {
      type: "object",
      properties: {
        descriptions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              note: { type: "string" },
              text: {
                type: "string",
                description: "one short plain-English sentence describing what this note/material actually smells like in real life, for someone unfamiliar with perfumery jargon",
              },
            },
            required: ["note", "text"],
          },
        },
      },
      required: ["descriptions"],
    },
  },
};

async function describeNoteBatch(client, notes) {
  const completion = await createWithRetry(client, {
    model: LLM_MODEL,
    max_tokens: 1200,
    messages: [
      {
        role: "user",
        content: [
          "For each of the following perfume notes/materials, write one short plain-English sentence describing what it actually smells like in real life, for someone with no perfumery background. Be concrete and sensory, not technical.",
          "",
          notes.map((n) => `- ${n}`).join("\n"),
          "",
          "Call submit_note_descriptions with one entry per note listed above.",
        ].join("\n"),
      },
    ],
    tools: [NOTES_TOOL],
    tool_choice: { type: "function", function: { name: "submit_note_descriptions" } },
  });

  const args = getToolArgs(completion);
  return args?.descriptions ?? [];
}

async function main() {
  const perfumes = JSON.parse(await readFile(path.join(DATA_DIR, "perfumes.json"), "utf-8"));
  const client = getClient();

  const uniqueNotes = [
    ...new Set(perfumes.flatMap((p) => [...p.topNotes, ...p.heartNotes, ...p.baseNotes])),
  ].sort();
  console.log(`Found ${uniqueNotes.length} unique notes.`);

  const outPath = path.join(DATA_DIR, "noteDescriptions.json");
  let noteDescriptions = {};
  try {
    noteDescriptions = JSON.parse(await readFile(outPath, "utf-8"));
    console.log(`Resuming: ${Object.keys(noteDescriptions).length} notes already have descriptions.`);
  } catch {
    // no existing file yet, start fresh
  }

  const remaining = uniqueNotes.filter((n) => !noteDescriptions[n]);
  console.log(`${remaining.length} notes still need descriptions.`);

  for (let i = 0; i < remaining.length; i += NOTE_BATCH_SIZE) {
    const batch = remaining.slice(i, i + NOTE_BATCH_SIZE);
    try {
      const results = await describeNoteBatch(client, batch);
      for (const { note, text } of results) {
        noteDescriptions[note] = text;
      }
      // Save incrementally so a later rate-limit failure doesn't lose progress.
      await writeFile(outPath, JSON.stringify(noteDescriptions, null, 2));
    } catch (err) {
      console.error(`Note batch failed at ${i}:`, err.message);
    }
    console.log(`  notes ${Math.min(i + NOTE_BATCH_SIZE, remaining.length)}/${remaining.length}`);
    await sleep(DELAY_MS);
  }
  console.log(`Done. ${Object.keys(noteDescriptions).length}/${uniqueNotes.length} total notes have descriptions.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
