"use client";

import { useState } from "react";
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
    <div className="rounded-2xl border border-border bg-gradient-to-br from-surface-muted to-surface p-5">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        N&deg; 002 — Or describe a scent
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="something smoky and vanilla for winter evenings…"
          className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
        />
        <MagneticButton
          type="submit"
          disabled={loading}
          className="rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Find"}
        </MagneticButton>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {matches && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {matches.map((m) => {
            const perfume = byId.get(m.id);
            if (!perfume) return null;
            return (
              <PerfumeCard key={m.id} perfume={perfume} matchScore={m.score} explanation={m.reason} />
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
