"use client";

import { useMemo, useState } from "react";
import type { Perfume, RecommendationEntry } from "@/types/perfume";
import PerfumeCard from "./PerfumeCard";

interface Props {
  recommendations: RecommendationEntry[];
  perfumesById: Record<string, Perfume>;
  explanations: Record<string, string>;
}

export default function RecommendationsList({ recommendations, perfumesById, explanations }: Props) {
  const [cheaperFirst, setCheaperFirst] = useState(false);

  const sorted = useMemo(() => {
    const withPerfume = recommendations
      .map((r) => ({ rec: r, perfume: perfumesById[r.id] }))
      .filter((x): x is { rec: RecommendationEntry; perfume: Perfume } => Boolean(x.perfume));

    if (cheaperFirst) {
      return [...withPerfume].sort((a, b) => a.perfume.priceTier - b.perfume.priceTier);
    }
    return withPerfume;
  }, [recommendations, perfumesById, cheaperFirst]);

  if (sorted.length === 0) {
    return <p className="text-sm text-neutral-500">No recommendations generated yet for this perfume.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-500">{sorted.length} similar perfumes</p>
        <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={cheaperFirst}
            onChange={(e) => setCheaperFirst(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Similar but cheaper first
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sorted.map(({ rec, perfume }) => (
          <PerfumeCard
            key={perfume.id}
            perfume={perfume}
            matchScore={rec.score}
            sharedNotes={rec.sharedNotes}
            explanation={explanations[perfume.id]}
          />
        ))}
      </div>
    </div>
  );
}
