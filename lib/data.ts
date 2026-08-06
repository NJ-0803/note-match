import { readFileSync } from "node:fs";
import path from "node:path";
import type { Perfume, PerfumeRecommendations, NoteDescriptions } from "@/types/perfume";

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(filename: string, fallback: T): T {
  try {
    const raw = readFileSync(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getAllPerfumes(): Perfume[] {
  return readJson<Perfume[]>("perfumes.json", []);
}

export function getPerfumeById(id: string): Perfume | undefined {
  return getAllPerfumes().find((p) => p.id === id);
}

export function getRecommendations(): PerfumeRecommendations {
  return readJson<PerfumeRecommendations>("perfumes.recommendations.json", {});
}

export function getRecommendationsFor(id: string) {
  return getRecommendations()[id] ?? [];
}

export function getExplanations(): Record<string, string> {
  return readJson<Record<string, string>>("explanations.json", {});
}

export function getExplanationFor(fromId: string, toId: string): string | undefined {
  return getExplanations()[`${fromId}::${toId}`];
}

export function getNoteDescriptions(): NoteDescriptions {
  return readJson<NoteDescriptions>("noteDescriptions.json", {});
}
