"use client";

import { useState } from "react";
import type { Perfume } from "@/types/perfume";
import PerfumeCard from "./PerfumeCard";

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
    <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-5 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950">
      <p className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        ✨ Or just describe a scent
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="something smoky and vanilla for winter evenings…"
          className="flex-1 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {loading ? "Thinking…" : "Find"}
        </button>
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
            <p className="text-sm text-neutral-500">No close matches found — try describing it differently.</p>
          )}
        </div>
      )}
    </div>
  );
}
