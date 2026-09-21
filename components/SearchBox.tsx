"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { createSearchIndex, searchPerfumes } from "@/lib/search";
import type { Perfume } from "@/types/perfume";
import GlowPill from "./motion/GlowPill";

export default function SearchBox({ perfumes }: { perfumes: Perfume[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const index = useMemo(() => createSearchIndex(perfumes), [perfumes]);
  const results = useMemo(() => searchPerfumes(index, query), [index, query]);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultListId = useId();

  function chooseResult(resultIndex: number) {
    const perfume = results[resultIndex];
    if (perfume) router.push(`/perfume/${perfume.id}`);
  }

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
            setActiveIndex(-1);
          }}
          onFocus={() => {
            setOpen(true);
            setFocused(true);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 150);
            setFocused(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && results.length > 0) {
              e.preventDefault();
              setOpen(true);
              setActiveIndex((current) => (current + 1) % results.length);
            }
            if (e.key === "ArrowUp" && results.length > 0) {
              e.preventDefault();
              setOpen(true);
              setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
            }
            if (e.key === "Enter" && activeIndex >= 0) {
              e.preventDefault();
              chooseResult(activeIndex);
            }
            if (e.key === "Escape") {
              setOpen(false);
              setActiveIndex(-1);
              e.currentTarget.blur();
            }
          }}
          placeholder="Search fragrance..."
          aria-activedescendant={activeIndex >= 0 ? `${resultListId}-${activeIndex}` : undefined}
          aria-autocomplete="list"
          aria-controls={resultListId}
          aria-expanded={open && results.length > 0}
          role="combobox"
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
            id={resultListId}
            role="listbox"
            className="absolute inset-x-0 z-20 mt-3 overflow-hidden rounded-[1.35rem] border border-border/80 bg-[#11100f]/92 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl"
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
                  id={`${resultListId}-${i}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    chooseResult(i);
                  }}
                  role="option"
                  aria-selected={activeIndex === i}
                  className={`flex w-full flex-col items-center rounded-xl px-4 py-2.5 text-center transition-colors hover:bg-accent/10 hover:text-accent ${
                    activeIndex === i ? "bg-accent/10 text-accent" : ""
                  }`}
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
