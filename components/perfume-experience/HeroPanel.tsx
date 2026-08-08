"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Perfume } from "@/types/perfume";
import { FAMILY_STYLES, PRICE_TIER_LABELS } from "@/lib/family";
import CollectionButton from "../CollectionButton";
import ShareButton from "../ShareButton";
import type { PerfumeView } from "./PerfumeExperience";

export default function HeroPanel({
  perfume,
  hasRecommendations,
  onNavigate,
}: {
  perfume: Perfume;
  hasRecommendations: boolean;
  onNavigate: (view: PerfumeView) => void;
}) {
  const family = FAMILY_STYLES[perfume.family];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex min-h-screen w-full items-center"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{perfume.brand}</p>
          <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-6xl">{perfume.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
            <span style={{ color: family.color, backgroundColor: family.bg }} className="rounded-full px-2 py-0.5 font-medium">
              {family.emoji} {perfume.family}
            </span>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted-foreground">
              {PRICE_TIER_LABELS[perfume.priceTier]}
            </span>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted-foreground">{perfume.gender}</span>
          </div>

          {perfume.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{perfume.description}</p>
          )}

          <div className="mt-8 flex items-center gap-3">
            <CollectionButton id={perfume.id} />
            <ShareButton perfumeId={perfume.id} label="Share" />
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <button
            type="button"
            data-cursor="Discover"
            onClick={() => onNavigate("notes")}
            className="rounded-full border border-border px-5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
          >
            Fragrance notes
          </button>
          {hasRecommendations && (
            <button
              type="button"
              data-cursor="Explore"
              onClick={() => onNavigate("showroom")}
              className="rounded-full bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-background transition-transform active:scale-[0.98]"
            >
              Explore similar
            </button>
          )}
          <Link
            href="/compare"
            data-cursor="Open"
            className="rounded-full border border-border px-5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
          >
            Compare
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
