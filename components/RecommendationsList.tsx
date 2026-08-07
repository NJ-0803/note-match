"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Perfume, RecommendationEntry } from "@/types/perfume";
import PerfumeCard from "./PerfumeCard";

interface Props {
  recommendations: RecommendationEntry[];
  perfumesById: Record<string, Perfume>;
  explanations: Record<string, string>;
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

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
    return <p className="text-sm text-muted-foreground">No recommendations generated yet for this perfume.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{sorted.length} similar perfumes</p>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={cheaperFirst}
            onChange={(e) => setCheaperFirst(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          Similar but cheaper first
        </label>
      </div>
      <motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {sorted.map(({ rec, perfume }) => (
          <motion.div key={perfume.id} variants={cardVariants}>
            <PerfumeCard
              perfume={perfume}
              matchScore={rec.score}
              sharedNotes={rec.sharedNotes}
              explanation={explanations[perfume.id]}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
