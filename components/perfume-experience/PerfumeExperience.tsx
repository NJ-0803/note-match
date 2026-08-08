"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Perfume, RecommendationEntry, NoteDescriptions } from "@/types/perfume";
import { FAMILY_STYLES } from "@/lib/family";
import { useSetAtmosphereColor } from "@/lib/atmosphereColor";
import PerfumeBottleLoader from "../experience/PerfumeBottleLoader";
import NotePyramidChart from "../NotePyramidChart";
import BuyLinks from "../BuyLinks";
import HeroPanel from "./HeroPanel";
import NotesArchitecture from "./NotesArchitecture";
import ScentDNASpectrum from "./ScentDNASpectrum";
import WearTimelinePanel from "./WearTimelinePanel";
import SimilarShowroom from "./SimilarShowroom";
import StagePanel from "./StagePanel";
import StateTabs from "./StateTabs";

export type PerfumeView = "hero" | "notes" | "dna" | "timeline" | "showroom";

const BOTTLE_CONFIG: Record<PerfumeView, { offsetX?: number; scale: number; dim: number }> = {
  hero: { scale: 1, dim: 1 },
  notes: { offsetX: 0, scale: 0.55, dim: 0.8 },
  dna: { offsetX: 0, scale: 0.5, dim: 0.7 },
  timeline: { offsetX: 0, scale: 0.55, dim: 0.8 },
  showroom: { scale: 0.5, dim: 0.06 },
};

export default function PerfumeExperience({
  perfume,
  recommendations,
  perfumesById,
  explanations,
  noteDescriptions,
}: {
  perfume: Perfume;
  recommendations: RecommendationEntry[];
  perfumesById: Record<string, Perfume>;
  explanations: Record<string, string>;
  noteDescriptions: NoteDescriptions;
}) {
  const [view, setView] = useState<PerfumeView>("hero");
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const family = FAMILY_STYLES[perfume.family];

  useSetAtmosphereColor(previewColor ?? family.color);

  // Each state is meant to read as a clean, self-contained viewport, not an
  // accumulating scroll position - and the AnimatePresence exit/enter swap
  // can otherwise trigger the browser's scroll-anchoring to drift the page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  const bottleConfig = BOTTLE_CONFIG[view];
  const hasRecommendations = recommendations.length > 0;

  return (
    <div>
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0"
          data-cursor={view === "hero" ? "Rotate" : undefined}
          data-cursor-strong={view === "hero" ? true : undefined}
        >
          <PerfumeBottleLoader
            color={family.color}
            offsetX={bottleConfig.offsetX}
            scale={bottleConfig.scale}
            dim={bottleConfig.dim}
          />
        </div>

        <AnimatePresence mode="wait">
          {view === "hero" && (
            <HeroPanel key="hero" perfume={perfume} hasRecommendations={hasRecommendations} onNavigate={setView} />
          )}
          {view === "notes" && (
            <NotesArchitecture
              key="notes"
              perfume={perfume}
              noteDescriptions={noteDescriptions}
              recommendations={recommendations}
            />
          )}
          {view === "dna" && (
            <StagePanel key="dna" eyebrow="Scent DNA" title="Fragrance fingerprint" align="center">
              <ScentDNASpectrum perfume={perfume} color={family.color} />
            </StagePanel>
          )}
          {view === "timeline" && (
            <StagePanel key="timeline" eyebrow="Wear" title="How it evolves on skin" align="center">
              <WearTimelinePanel perfume={perfume} />
            </StagePanel>
          )}
        </AnimatePresence>

        {view === "showroom" && (
          <SimilarShowroom
            recommendations={recommendations}
            perfumesById={perfumesById}
            explanations={explanations}
            onPreviewColor={setPreviewColor}
          />
        )}

        <StateTabs view={view} onChange={setView} hasRecommendations={hasRecommendations} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl border-t border-border px-6 pb-28 pt-10">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">Full fragrance details</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <NotePyramidChart perfume={perfume} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-muted-foreground">Where to buy (India)</p>
            <BuyLinks perfume={perfume} />
          </div>
        </div>
      </div>
    </div>
  );
}
