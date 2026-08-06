export const FRAGRANCE_FAMILIES = [
  "Woody",
  "Fresh",
  "Fresh Spicy",
  "Oriental",
  "Floral",
  "Gourmand",
  "Chypre",
  "Aquatic",
] as const;

export type FragranceFamily = (typeof FRAGRANCE_FAMILIES)[number];

// 1 = budget (attars/clones/mass market), 4 = premium/niche
export type PriceTier = 1 | 2 | 3 | 4;

export interface Perfume {
  id: string;
  brand: string;
  name: string;
  gender: "Masculine" | "Feminine" | "Unisex";
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  family: FragranceFamily;
  priceTier: PriceTier;
  description?: string;
}

export interface RecommendationEntry {
  id: string;
  score: number; // 0-1, higher = more similar
  sharedNotes: string[];
}

export interface PerfumeRecommendations {
  [perfumeId: string]: RecommendationEntry[];
}

export interface ExplanationEntry {
  pairKey: string; // `${fromId}::${toId}`
  text: string;
}

export interface NoteDescriptions {
  [noteName: string]: string;
}
