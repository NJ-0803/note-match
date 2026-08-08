"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import type { Perfume, RecommendationEntry } from "@/types/perfume";
import { FAMILY_STYLES, PRICE_TIER_LABELS } from "@/lib/family";
import MatchTags from "../MatchTags";
import MiniBottle from "./MiniBottle";

const SPACING = 190;
const MAX_VISIBLE_OFFSET = 3;

export default function SimilarShowroom({
  recommendations,
  perfumesById,
  explanations,
  onPreviewColor,
}: {
  recommendations: RecommendationEntry[];
  perfumesById: Record<string, Perfume>;
  explanations: Record<string, string>;
  onPreviewColor: (color: string | null) => void;
}) {
  const router = useRouter();
  const items = useMemo(
    () =>
      recommendations
        .map((rec) => ({ rec, perfume: perfumesById[rec.id] }))
        .filter((x): x is { rec: RecommendationEntry; perfume: Perfume } => Boolean(x.perfume)),
    [recommendations, perfumesById],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [wasPanning, setWasPanning] = useState(false);

  const active = items[activeIndex];

  useEffect(() => {
    if (!active) return;
    onPreviewColor(FAMILY_STYLES[active.perfume.family].color);
    return () => onPreviewColor(null);
  }, [active, onPreviewColor]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(items.length - 1, i + 1));
      if (e.key === "ArrowLeft") setActiveIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length]);

  function commit(id: string) {
    if (selectingId) return;
    setSelectingId(id);
    window.setTimeout(() => router.push(`/perfume/${id}`), 380);
  }

  function handleCardClick(index: number) {
    if (wasPanning) return;
    if (index === activeIndex && active) {
      commit(active.perfume.id);
    } else {
      setActiveIndex(index);
    }
  }

  function onPan(_: unknown, info: { offset: { x: number } }) {
    if (Math.abs(info.offset.x) > 8) setWasPanning(true);
  }

  function onPanEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    const strongSwipe = Math.abs(info.velocity.x) > 500;
    const pastThreshold = Math.abs(info.offset.x) > 70;
    if (strongSwipe || pastThreshold) {
      if (info.offset.x < 0) setActiveIndex((i) => Math.min(items.length - 1, i + 1));
      else setActiveIndex((i) => Math.max(0, i - 1));
    }
    window.setTimeout(() => setWasPanning(false), 80);
  }

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 z-20 flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-28 pt-24"
    >
      <div className="mx-auto mb-2 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Similar showroom</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">Drag, swipe, or use the arrow keys</h2>
      </div>

      <motion.div
        onPan={onPan}
        onPanEnd={onPanEnd}
        style={{ perspective: 1000 }}
        className="relative mx-auto flex h-[300px] w-full max-w-4xl touch-pan-y items-center justify-center"
      >
        {items.map(({ rec, perfume }, index) => {
          const offset = index - activeIndex;
          if (Math.abs(offset) > MAX_VISIBLE_OFFSET) return null;
          const isActive = offset === 0;
          const family = FAMILY_STYLES[perfume.family];
          const isSelecting = selectingId === perfume.id;
          const othersFading = selectingId && !isSelecting;

          return (
            <motion.button
              key={perfume.id}
              type="button"
              data-cursor={isActive ? "Open" : "Explore"}
              onClick={() => handleCardClick(index)}
              animate={{
                x: offset * SPACING,
                scale: isSelecting ? 1.5 : isActive ? 1.25 : Math.max(0.55, 1 - Math.abs(offset) * 0.18),
                opacity: othersFading ? 0 : isActive ? 1 : Math.max(0.25, 1 - Math.abs(offset) * 0.3),
                rotateY: isActive ? 0 : offset * -10,
                filter: isActive ? "blur(0px) brightness(1)" : `blur(${Math.min(3, Math.abs(offset))}px) brightness(${1 - Math.abs(offset) * 0.18})`,
                zIndex: isSelecting ? 50 : 10 - Math.abs(offset),
              }}
              transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
              className="absolute flex flex-col items-center gap-3 focus-visible:outline-none"
            >
              <MiniBottle color={family.color} active={isActive} />
              <div className={`text-center transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{perfume.brand}</p>
                <p className="font-display text-sm">{perfume.name}</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.perfume.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-6 w-full max-w-md rounded-2xl border border-border bg-surface/80 p-5 backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {active.perfume.brand}
                </p>
                <h3 className="font-display text-xl tracking-tight">{active.perfume.name}</h3>
              </div>
              <span className="shrink-0 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background">
                {Math.round(active.rec.score * 100)}% match
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span
                style={{
                  color: FAMILY_STYLES[active.perfume.family].color,
                  backgroundColor: FAMILY_STYLES[active.perfume.family].bg,
                }}
                className="rounded-full px-2 py-0.5 font-medium"
              >
                {FAMILY_STYLES[active.perfume.family].emoji} {active.perfume.family}
              </span>
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted-foreground">
                {PRICE_TIER_LABELS[active.perfume.priceTier]}
              </span>
            </div>

            <MatchTags sharedNotes={active.rec.sharedNotes} explanation={explanations[active.perfume.id]} />

            <button
              type="button"
              data-cursor="Open"
              onClick={() => commit(active.perfume.id)}
              className="mt-4 w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-transform active:scale-[0.98]"
            >
              Open fragrance
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
