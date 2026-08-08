"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Perfume } from "@/types/perfume";
import SearchBox from "@/components/SearchBox";
import FreeTextSearch from "@/components/FreeTextSearch";

type Mode = "known" | "describe";

const MODES: { id: Mode; label: string }[] = [
  { id: "known", label: "I know a perfume" },
  { id: "describe", label: "Describe a scent" },
];

// Switching modes never reloads or jumps - the search interface itself is
// swapped via AnimatePresence, like switching a setting on an instrument
// rather than navigating between two separate forms.
export default function ModeSwitchSearch({ perfumes }: { perfumes: Perfume[] }) {
  const [mode, setMode] = useState<Mode>("known");

  return (
    <div>
      <div className="mb-8 flex justify-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em]">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            data-cursor="Enter"
            onClick={() => setMode(m.id)}
            className={`relative px-4 py-2 transition-colors ${
              mode === m.id ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode === m.id && (
              <motion.span
                layoutId="mode-switch-underline"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
              />
            )}
            {m.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {mode === "known" ? <SearchBox perfumes={perfumes} /> : <FreeTextSearch perfumes={perfumes} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
