import Fuse from "fuse.js";
import type { Perfume } from "@/types/perfume";

export function createSearchIndex(perfumes: Perfume[]) {
  return new Fuse(perfumes, {
    keys: [
      { name: "name", weight: 0.6 },
      { name: "brand", weight: 0.4 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}

export function searchPerfumes(index: Fuse<Perfume>, query: string, limit = 8): Perfume[] {
  if (!query.trim()) return [];
  return index
    .search(query, { limit })
    .map((result) => result.item);
}

/** Broader index over notes/family/description, used to pre-filter a
 * shortlist for the free-text AI search so we never send the full dataset
 * to the LLM in one request (keeps requests within free-tier token limits). */
export function createDescriptionSearchIndex(perfumes: Perfume[]) {
  return new Fuse(perfumes, {
    keys: [
      { name: "topNotes", weight: 0.3 },
      { name: "heartNotes", weight: 0.3 },
      { name: "baseNotes", weight: 0.2 },
      { name: "family", weight: 0.1 },
      { name: "description", weight: 0.1 },
    ],
    threshold: 0.45,
    ignoreLocation: true,
    minMatchCharLength: 3,
  });
}

export function preFilterByDescription(perfumes: Perfume[], query: string, limit = 25): Perfume[] {
  const index = createDescriptionSearchIndex(perfumes);
  const matched = index.search(query, { limit }).map((r) => r.item);
  if (matched.length >= Math.min(limit, 10)) return matched;
  // Fuzzy note search can come up short for very abstract queries (e.g. "romantic date night").
  // Pad with a broader slice so the LLM still has a reasonable pool to reason over.
  const matchedIds = new Set(matched.map((p) => p.id));
  const filler = perfumes.filter((p) => !matchedIds.has(p.id)).slice(0, limit - matched.length);
  return [...matched, ...filler];
}
