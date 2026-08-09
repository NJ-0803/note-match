"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Perfume } from "@/types/perfume";
import { getNoteColor } from "@/lib/family";

const POPULAR_COUNT = 18;

export type NotesMode = "AND" | "OR";

export default function NotesFilter({
  perfumes,
  active,
  mode,
  onChangeActive,
  onChangeMode,
}: {
  perfumes: Perfume[];
  active: string[];
  mode: NotesMode;
  onChangeActive: (notes: string[]) => void;
  onChangeMode: (mode: NotesMode) => void;
}) {
  const [query, setQuery] = useState("");

  // Notes ranked by how many perfumes carry them, so the default quick-pick
  // chips surface the ones actually useful for narrowing the catalogue -
  // the full 210-note vocabulary is only reachable via search.
  const { popular, all } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of perfumes) {
      for (const n of [...p.topNotes, ...p.heartNotes, ...p.baseNotes]) {
        counts.set(n, (counts.get(n) ?? 0) + 1);
      }
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n);
    return { popular: sorted.slice(0, POPULAR_COUNT), all: sorted };
  }, [perfumes]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return all.filter((n) => n.toLowerCase().includes(q) && !active.includes(n)).slice(0, 8);
  }, [query, all, active]);

  function toggle(note: string) {
    onChangeActive(active.includes(note) ? active.filter((n) => n !== note) : [...active, note]);
  }

  function add(note: string) {
    if (!active.includes(note)) onChangeActive([...active, note]);
    setQuery("");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Notes</p>
        <div className="flex overflow-hidden rounded-full border border-border font-mono text-[10px] uppercase tracking-widest">
          <button
            type="button"
            onClick={() => onChangeMode("OR")}
            title="Show perfumes with any of the selected notes"
            className={`px-3 py-1.5 transition-colors ${
              mode === "OR" ? "bg-accent text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Any of these
          </button>
          <button
            type="button"
            onClick={() => onChangeMode("AND")}
            title="Show perfumes with all of the selected notes"
            className={`px-3 py-1.5 transition-colors ${
              mode === "AND" ? "bg-accent text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All of these
          </button>
        </div>
      </div>

      <div className="relative mx-auto mt-3 max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a note (e.g. Oud, Vanilla)…"
          className="w-full rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none transition-colors focus:border-foreground"
        />
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-x-0 z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
            >
              {suggestions.map((n) => (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => add(n)}
                    className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-surface-muted"
                  >
                    {n}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {active.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {active.map((n) => {
            const { color, bg } = getNoteColor(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggle(n)}
                style={{ color, backgroundColor: bg }}
                className="rounded-full px-2.5 py-1 text-xs font-medium ring-2 ring-offset-1 ring-current"
              >
                {n} ×
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {popular
          .filter((n) => !active.includes(n))
          .map((n) => {
            const { color, bg } = getNoteColor(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggle(n)}
                style={{ color, backgroundColor: bg }}
                className="rounded-full px-2.5 py-1 text-xs font-medium opacity-70 transition hover:opacity-100"
              >
                {n}
              </button>
            );
          })}
      </div>
    </div>
  );
}
