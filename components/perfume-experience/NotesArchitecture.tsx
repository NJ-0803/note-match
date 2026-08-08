"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Perfume, NoteDescriptions, RecommendationEntry } from "@/types/perfume";
import { getNoteColor } from "@/lib/family";
import NoteDetailPanel, { type ActiveNote } from "./NoteDetailPanel";

const LAYER_COPY = {
  top: {
    eyebrow: "Opening",
    title: "Top notes",
    body: "The first impression of the fragrance. Brighter, more volatile notes appear here, then fade within the first half hour.",
  },
  heart: {
    eyebrow: "Character",
    title: "Heart notes",
    body: "The core personality of the fragrance, emerging as the top notes settle and carrying it through the next few hours.",
  },
  base: {
    eyebrow: "Dry-down",
    title: "Base notes",
    body: "The longest-lasting signature left on the skin, built from the heaviest, slowest-evaporating materials.",
  },
} as const;

function countSharedWith(note: string, recommendations: RecommendationEntry[]): number {
  const lower = note.toLowerCase();
  return recommendations.filter((r) => r.sharedNotes.some((n) => n.toLowerCase() === lower)).length;
}

export default function NotesArchitecture({
  perfume,
  noteDescriptions,
  recommendations,
}: {
  perfume: Perfume;
  noteDescriptions: NoteDescriptions;
  recommendations: RecommendationEntry[];
}) {
  const [active, setActive] = useState<ActiveNote | null>(null);

  function open(note: string, layer: ActiveNote["layer"]) {
    setActive({
      note,
      layer,
      description: noteDescriptions[note],
      sharedWithCount: countSharedWith(note, recommendations),
    });
  }

  function NoteChip({ note, layer }: { note: string; layer: ActiveNote["layer"] }) {
    const { color, bg } = getNoteColor(note);
    const isActive = active?.note === note;
    return (
      <button
        type="button"
        data-cursor="Discover"
        onClick={() => open(note, layer)}
        style={{ color, backgroundColor: bg }}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-transform hover:scale-105 ${
          isActive ? "ring-2 ring-offset-1 ring-current" : ""
        }`}
      >
        {note}
      </button>
    );
  }

  const heartMid = Math.ceil(perfume.heartNotes.length / 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-28"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Fragrance architecture</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">What this fragrance is doing</h2>
      </div>

      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {LAYER_COPY.top.eyebrow} — {LAYER_COPY.top.title}
        </p>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">{LAYER_COPY.top.body}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {perfume.topNotes.map((n) => (
            <NoteChip key={n} note={n} layer="top" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
          {perfume.heartNotes.slice(0, heartMid).map((n) => (
            <NoteChip key={n} note={n} layer="heart" />
          ))}
        </div>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {LAYER_COPY.heart.eyebrow}
          </p>
          <p className="mt-1 max-w-[10rem] text-xs text-muted-foreground">{LAYER_COPY.heart.title}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          {perfume.heartNotes.slice(heartMid).map((n) => (
            <NoteChip key={n} note={n} layer="heart" />
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {LAYER_COPY.base.eyebrow} — {LAYER_COPY.base.title}
        </p>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">{LAYER_COPY.base.body}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {perfume.baseNotes.map((n) => (
            <NoteChip key={n} note={n} layer="base" />
          ))}
        </div>
      </div>

      <NoteDetailPanel active={active} onClose={() => setActive(null)} />
    </motion.div>
  );
}
