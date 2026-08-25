"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { createSearchIndex, searchPerfumes } from "@/lib/search";
import type { Perfume } from "@/types/perfume";
import GlowPill from "./motion/GlowPill";

export default function SearchBox({ perfumes }: { perfumes: Perfume[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const index = useMemo(() => createSearchIndex(perfumes), [perfumes]);
  const results = useMemo(() => searchPerfumes(index, query), [index, query]);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={containerRef}>
      <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        What do you already love?
      </p>
      <GlowPill focused={focused} className="flex items-center gap-3 px-5 py-3">
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted-foreground">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.2" y2="16.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          data-cursor="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setFocused(true);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 150);
            setFocused(false);
          }}
          placeholder="Search fragrance..."
          className="w-full border-0 bg-transparent text-left text-base text-foreground outline-none placeholder:text-muted-foreground/70 sm:text-lg"
        />
      </GlowPill>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 z-20 mt-3 overflow-hidden"
          >
            {results.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <button
                  type="button"
                  onMouseDown={() => router.push(`/perfume/${p.id}`)}
                  className="flex w-full flex-col items-center px-4 py-2.5 text-center transition-colors hover:text-accent"
                >
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{p.brand}</span>
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
