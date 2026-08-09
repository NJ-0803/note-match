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
      <div className="mb-8 flex justify-center gap-3 font-mono text-sm uppercase tracking-[0.2em] sm:text-base">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              data-cursor="Enter"
              onClick={() => setMode(m.id)}
              style={active ? { boxShadow: "0 0 18px 1px color-mix(in srgb, var(--accent) 55%, transparent)" } : undefined}
              className={`relative overflow-hidden rounded-full border px-5 py-2.5 transition-colors duration-300 ${
                active
                  ? "border-accent text-accent"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-foreground/25 to-transparent"
                animate={{ x: ["-120%", "260%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6, delay: active ? 0 : 0.6 }}
              />
              <span className="relative">{m.label}</span>
            </button>
          );
        })}
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
