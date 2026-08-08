"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { getNoteColor } from "@/lib/family";
import type { Perfume } from "@/types/perfume";

const TOTAL_HOURS = 8;

const PHASES = [
  { key: "top", label: "Opening", hour: 0.2 },
  { key: "heart", label: "Heart", hour: 2.2 },
  { key: "base", label: "Dry-down", hour: 6 },
] as const;

function intensity(hour: number, peakStart: number, peakEnd: number, fadeIn: number, fadeOut: number) {
  if (hour < peakStart) return Math.max(0, 1 - (peakStart - hour) / fadeIn);
  if (hour > peakEnd) return Math.max(0, 1 - (hour - peakEnd) / fadeOut);
  return 1;
}

function layerIntensity(layer: "top" | "heart" | "base", hour: number) {
  if (layer === "top") return intensity(hour, 0, 0.5, 0.1, 1.5);
  if (layer === "heart") return intensity(hour, 1, 3.5, 1, 2.5);
  return intensity(hour, 3, TOTAL_HOURS, 2, 3);
}

function dominantPhase(hour: number): (typeof PHASES)[number]["key"] {
  const scores: Record<(typeof PHASES)[number]["key"], number> = {
    top: layerIntensity("top", hour),
    heart: layerIntensity("heart", hour),
    base: layerIntensity("base", hour),
  };
  return (Object.keys(scores) as Array<(typeof PHASES)[number]["key"]>).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b,
  );
}

export default function WearTimelinePanel({ perfume }: { perfume: Perfume }) {
  const [hour, setHour] = useState(0.2);
  const dominant = dominantPhase(hour);

  const layers: Array<{ key: "top" | "heart" | "base"; notes: string[] }> = [
    { key: "top", notes: perfume.topNotes },
    { key: "heart", notes: perfume.heartNotes },
    { key: "base", notes: perfume.baseNotes },
  ];

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between">
        {PHASES.map((phase) => (
          <button
            key={phase.key}
            type="button"
            data-cursor="Discover"
            onClick={() => setHour(phase.hour)}
            className={`font-mono text-xs uppercase tracking-[0.25em] transition-colors ${
              dominant === phase.key ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {phase.label}
          </button>
        ))}
      </div>

      <div className="relative mt-4">
        <div className="h-px w-full bg-border" />
        <motion.div
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_var(--accent)]"
          style={{ left: `${(hour / TOTAL_HOURS) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <input
          type="range"
          min={0}
          max={TOTAL_HOURS}
          step={0.05}
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          aria-label="Scrub time since application"
          className="absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2 cursor-pointer opacity-0"
        />
      </div>

      <p className="mt-2 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {hour < 1 ? `${Math.round(hour * 60)}m` : `${hour.toFixed(1)}h`} since application
      </p>

      <div className="mt-8 space-y-4">
        {layers.map((layer) => {
          const layerOn = layerIntensity(layer.key, hour);
          return (
            <div key={layer.key} style={{ opacity: 0.35 + 0.65 * layerOn }} className="transition-opacity duration-200">
              <div className="flex flex-wrap gap-1.5">
                {layer.notes.map((note) => {
                  const { color, bg } = getNoteColor(note);
                  return (
                    <span
                      key={note}
                      style={{
                        color,
                        backgroundColor: bg,
                        transform: `scale(${0.92 + 0.08 * layerOn})`,
                      }}
                      className="rounded-full px-2.5 py-1 text-xs font-medium transition-transform duration-200"
                    >
                      {note}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
