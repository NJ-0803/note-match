"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Perfume } from "@/types/perfume";
import PerfumeCard from "./PerfumeCard";
import MagneticButton from "./motion/MagneticButton";

interface ApiMatch {
  id: string;
  score: number;
  reason: string;
}

export default function FreeTextSearch({ perfumes }: { perfumes: Perfume[] }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<ApiMatch[] | null>(null);
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();
      setMatches(data.matches ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const byId = new Map(perfumes.map((p) => [p.id, p]));

  return (
    <div>
      <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Describe what you want
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div className="relative w-full">
          <input
            type="text"
            data-cursor="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="smoky vanilla for winter evenings…"
            className="w-full border-0 border-b border-border bg-transparent px-1 py-3 text-center text-lg text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <div className="absolute inset-x-0 bottom-0 h-px bg-border">
            <motion.div
              initial={false}
              animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-full origin-center bg-accent"
              style={{ boxShadow: focused ? "0 0 12px 1px var(--accent)" : undefined }}
            />
          </div>
        </div>
        <MagneticButton
          type="submit"
          disabled={loading}
          className="rounded-full border border-border px-6 py-2 text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Find"}
        </MagneticButton>
      </form>

      {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}

      {matches && (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {matches.map((m, i) => {
            const perfume = byId.get(m.id);
            if (!perfume) return null;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <PerfumeCard perfume={perfume} matchScore={m.score} explanation={m.reason} />
              </motion.div>
            );
          })}
          {matches.length === 0 && (
            <p className="text-sm text-muted-foreground">No close matches found — try describing it differently.</p>
          )}
        </div>
      )}
    </div>
  );
}
