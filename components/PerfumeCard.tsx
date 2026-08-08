"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Perfume } from "@/types/perfume";
import { FAMILY_STYLES, PRICE_TIER_LABELS } from "@/lib/family";
import CollectionButton from "./CollectionButton";
import MatchTags from "./MatchTags";

export default function PerfumeCard({
  perfume,
  sharedNotes,
  explanation,
  matchScore,
}: {
  perfume: Perfume;
  sharedNotes?: string[];
  explanation?: string;
  matchScore?: number;
}) {
  const family = FAMILY_STYLES[perfume.family];

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <Link href={`/perfume/${perfume.id}`} className="group" data-cursor="View">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{perfume.brand}</p>
          <h3 className="text-lg font-semibold text-foreground group-hover:underline">
            {perfume.name}
          </h3>
        </Link>
        {matchScore != null && (
          <span className="shrink-0 rounded-full bg-foreground px-2 py-1 text-[11px] font-semibold text-background">
            {Math.round(matchScore * 100)}% match
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
        <span
          style={{ color: family.color, backgroundColor: family.bg }}
          className="rounded-full px-2 py-0.5 font-medium"
        >
          {family.emoji} {perfume.family}
        </span>
        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted-foreground">
          {PRICE_TIER_LABELS[perfume.priceTier]}
        </span>
        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted-foreground">
          {perfume.gender}
        </span>
      </div>

      {(sharedNotes?.length || explanation) && (
        <MatchTags sharedNotes={sharedNotes ?? []} explanation={explanation} />
      )}

      <div className="mt-3">
        <CollectionButton id={perfume.id} />
      </div>
    </motion.div>
  );
}
