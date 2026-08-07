"use client";

import { useMemo, useState } from "react";
import type { Perfume } from "@/types/perfume";
import { createSearchIndex, searchPerfumes } from "@/lib/search";
import ScentRadarChart from "@/components/ScentRadarChart";
import NoteTags from "@/components/NoteTags";

const MAX_COMPARE = 3;

export default function CompareClient({ perfumes }: { perfumes: Perfume[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const index = useMemo(() => createSearchIndex(perfumes), [perfumes]);
  const results = useMemo(() => searchPerfumes(index, query, 6), [index, query]);
  const selected = selectedIds.map((id) => perfumes.find((p) => p.id === id)).filter((p): p is Perfume => Boolean(p));

  function addPerfume(id: string) {
    if (selectedIds.includes(id) || selectedIds.length >= MAX_COMPARE) return;
    setSelectedIds([...selectedIds, id]);
    setQuery("");
  }

  function removePerfume(id: string) {
    setSelectedIds(selectedIds.filter((s) => s !== id));
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Compare perfumes</h1>
      <p className="mt-1 text-muted-foreground">
        Pick 2-3 perfumes to see their scent profiles overlaid.
      </p>

      <div className="relative mt-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={selectedIds.length >= MAX_COMPARE ? "Maximum 3 perfumes" : "Add a perfume to compare…"}
          disabled={selectedIds.length >= MAX_COMPARE}
          className="w-full rounded-full border border-border bg-surface px-5 py-3 text-sm outline-none focus:border-foreground disabled:opacity-50"
        />
        {query && results.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
            {results.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => addPerfume(p.id)}
                  className="flex w-full flex-col items-start px-4 py-2.5 text-left transition-colors hover:bg-surface-muted"
                >
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">{p.brand}</span>
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {selected.map((p) => (
          <span
            key={p.id}
            className="flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-sm text-background"
          >
            {p.brand} {p.name}
            <button type="button" onClick={() => removePerfume(p.id)} aria-label={`Remove ${p.name}`}>
              ×
            </button>
          </span>
        ))}
      </div>

      {selected.length > 0 && (
        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Scent DNA overlay</h2>
          <ScentRadarChart perfumes={selected} />
        </section>
      )}

      {selected.length > 0 && (
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{p.brand}</p>
              <h3 className="font-semibold text-foreground">{p.name}</h3>
              <div className="mt-2 space-y-2 text-xs">
                <div>
                  <p className="mb-1 font-medium text-muted-foreground">Top</p>
                  <NoteTags notes={p.topNotes} />
                </div>
                <div>
                  <p className="mb-1 font-medium text-muted-foreground">Heart</p>
                  <NoteTags notes={p.heartNotes} />
                </div>
                <div>
                  <p className="mb-1 font-medium text-muted-foreground">Base</p>
                  <NoteTags notes={p.baseNotes} />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
