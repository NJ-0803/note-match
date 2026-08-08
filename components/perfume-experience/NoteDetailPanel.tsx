"use client";

import { motion, AnimatePresence } from "motion/react";
import { getNoteColor, getNoteCategory } from "@/lib/family";

const LAYER_LABEL = { top: "Top note", heart: "Heart note", base: "Base note" } as const;

export interface ActiveNote {
  note: string;
  layer: "top" | "heart" | "base";
  description?: string;
  sharedWithCount: number;
}

export default function NoteDetailPanel({
  active,
  onClose,
}: {
  active: ActiveNote | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-6 right-6 top-auto z-20 w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-border bg-surface/90 p-5 backdrop-blur-md sm:bottom-10 sm:right-10"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                {LAYER_LABEL[active.layer]}
              </p>
              <h3 className="mt-1 font-display text-2xl tracking-tight">{active.note}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-cursor="Rotate"
              aria-label="Close"
              className="rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {(() => {
            const category = getNoteCategory(active.note);
            if (!category) return null;
            const { color, bg } = getNoteColor(active.note);
            return (
              <span
                style={{ color, backgroundColor: bg }}
                className="mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium"
              >
                {category}
              </span>
            );
          })()}

          {active.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{active.description}</p>
          )}

          {active.sharedWithCount > 0 && (
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Shared with {active.sharedWithCount} similar {active.sharedWithCount === 1 ? "perfume" : "perfumes"} in
              your matches
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
