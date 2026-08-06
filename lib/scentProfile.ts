import type { Perfume } from "@/types/perfume";

export const SCENT_AXES = [
  "Woody",
  "Fresh",
  "Sweet",
  "Spicy",
  "Floral",
  "Earthy",
  "Citrus",
  "Musky",
] as const;

export type ScentAxis = (typeof SCENT_AXES)[number];

const AXIS_KEYWORDS: Record<ScentAxis, string[]> = {
  Woody: ["cedar", "sandalwood", "vetiver", "oud", "agarwood", "guaiac", "birch", "pine", "woody"],
  Fresh: ["bergamot", "mint", "marine", "aquatic", "ozone", "aldehyde", "green", "lavender", "eucalyptus", "sea"],
  Sweet: ["vanilla", "tonka", "caramel", "praline", "honey", "sugar", "chocolate", "benzoin", "almond", "coconut"],
  Spicy: ["pepper", "cardamom", "cinnamon", "clove", "ginger", "saffron", "nutmeg", "chili", "spice"],
  Floral: ["rose", "jasmine", "iris", "violet", "lily", "ylang", "tuberose", "orange blossom", "freesia", "peony", "geranium", "magnolia", "heliotrope"],
  Earthy: ["patchouli", "oud", "oakmoss", "moss", "tobacco", "leather", "incense", "vetiver"],
  Citrus: ["bergamot", "lemon", "orange", "grapefruit", "mandarin", "lime", "yuzu", "citrus"],
  Musky: ["musk", "ambroxan", "iso e super", "amber", "labdanum", "civet", "ambergris"],
};

function matchWeight(note: string, position: "top" | "heart" | "base"): number {
  const positionWeight = position === "top" ? 2 : position === "heart" ? 3 : 4;
  return positionWeight;
}

export function computeScentProfile(perfume: Perfume): Record<ScentAxis, number> {
  const raw: Record<ScentAxis, number> = {
    Woody: 0, Fresh: 0, Sweet: 0, Spicy: 0, Floral: 0, Earthy: 0, Citrus: 0, Musky: 0,
  };

  const positioned: Array<[string[], "top" | "heart" | "base"]> = [
    [perfume.topNotes, "top"],
    [perfume.heartNotes, "heart"],
    [perfume.baseNotes, "base"],
  ];

  for (const [notes, position] of positioned) {
    for (const note of notes) {
      const lower = note.toLowerCase();
      for (const axis of SCENT_AXES) {
        if (AXIS_KEYWORDS[axis].some((kw) => lower.includes(kw))) {
          raw[axis] += matchWeight(note, position);
        }
      }
    }
  }

  const result = {} as Record<ScentAxis, number>;
  for (const axis of SCENT_AXES) {
    result[axis] = Math.min(10, raw[axis]);
  }
  return result;
}

export function sharedNotes(a: Perfume, b: Perfume): string[] {
  const aNotes = new Set(
    [...a.topNotes, ...a.heartNotes, ...a.baseNotes].map((n) => n.toLowerCase()),
  );
  const bAll = [...b.topNotes, ...b.heartNotes, ...b.baseNotes];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const note of bAll) {
    const lower = note.toLowerCase();
    if (aNotes.has(lower) && !seen.has(lower)) {
      seen.add(lower);
      out.push(note);
    }
  }
  return out;
}
