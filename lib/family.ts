import type { FragranceFamily } from "@/types/perfume";

export const FAMILY_STYLES: Record<FragranceFamily, { color: string; bg: string; emoji: string }> = {
  Woody: { color: "#8a5a34", bg: "#f4ece2", emoji: "\u{1FAB5}" },
  Fresh: { color: "#2f8f6e", bg: "#e4f5ef", emoji: "\u{1F343}" },
  "Fresh Spicy": { color: "#c07a2b", bg: "#faf0e2", emoji: "\u{1F336}️" },
  Oriental: { color: "#a13d5c", bg: "#f7e6ec", emoji: "\u{2728}" },
  Floral: { color: "#c15fa0", bg: "#fbe9f4", emoji: "\u{1F338}" },
  Gourmand: { color: "#b3792f", bg: "#faf1e0", emoji: "\u{1F36F}" },
  Chypre: { color: "#5c7a3f", bg: "#eef4e5", emoji: "\u{1F343}" },
  Aquatic: { color: "#2e7dae", bg: "#e4f1f9", emoji: "\u{1F30A}" },
};

// Colors for note-family "keyword" tags, used on MatchTags/note pills.
export const NOTE_COLOR_RULES: Array<{ name: string; keywords: string[]; color: string; bg: string }> = [
  { name: "Citrus", keywords: ["bergamot", "lemon", "orange", "grapefruit", "mandarin", "lime", "yuzu", "citrus"], color: "#b8860b", bg: "#fdf3d9" },
  { name: "Floral", keywords: ["rose", "jasmine", "iris", "violet", "lily", "ylang", "tuberose", "peony", "geranium", "magnolia"], color: "#c15fa0", bg: "#fbe9f4" },
  { name: "Woody", keywords: ["cedar", "sandalwood", "vetiver", "oud", "agarwood", "guaiac", "birch", "pine"], color: "#8a5a34", bg: "#f4ece2" },
  { name: "Gourmand", keywords: ["vanilla", "tonka", "caramel", "praline", "honey", "sugar", "chocolate", "benzoin", "almond", "coconut"], color: "#b3792f", bg: "#faf1e0" },
  { name: "Spicy", keywords: ["pepper", "cardamom", "cinnamon", "clove", "ginger", "saffron", "nutmeg", "chili"], color: "#c0472b", bg: "#fbe6e0" },
  { name: "Amber & Musk", keywords: ["musk", "ambroxan", "iso e super", "amber", "labdanum", "civet", "ambergris"], color: "#6b5b95", bg: "#eeeaf6" },
  { name: "Fresh & Green", keywords: ["mint", "marine", "aquatic", "ozone", "aldehyde", "green", "lavender", "eucalyptus", "sea"], color: "#2e7dae", bg: "#e4f1f9" },
  { name: "Earthy & Leather", keywords: ["patchouli", "moss", "tobacco", "leather", "incense"], color: "#5c7a3f", bg: "#eef4e5" },
];

export function getNoteColor(note: string): { color: string; bg: string } {
  const lower = note.toLowerCase();
  const rule = NOTE_COLOR_RULES.find((r) => r.keywords.some((kw) => lower.includes(kw)));
  return rule ?? { color: "#6b6b6b", bg: "#efefef" };
}

export function getNoteCategory(note: string): string | null {
  const lower = note.toLowerCase();
  const rule = NOTE_COLOR_RULES.find((r) => r.keywords.some((kw) => lower.includes(kw)));
  return rule?.name ?? null;
}

export const PRICE_TIER_LABELS: Record<number, string> = {
  1: "₹ Budget / Attar-Clone",
  2: "₹₹ Mass Market",
  3: "₹₹₹ Premium Designer",
  4: "₹₹₹₹ Niche / Luxury",
};
