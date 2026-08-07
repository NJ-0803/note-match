"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSearchIndex, searchPerfumes } from "@/lib/search";
import type { Perfume } from "@/types/perfume";

export default function SearchBox({ perfumes }: { perfumes: Perfume[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const index = useMemo(() => createSearchIndex(perfumes), [perfumes]);
  const results = useMemo(() => searchPerfumes(index, query), [index, query]);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search a perfume you love… (e.g. Sauvage, Bleu de Chanel)"
        className="w-full rounded-full border border-border bg-surface px-5 py-3 text-sm shadow-sm outline-none transition-colors focus:border-foreground"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onMouseDown={() => router.push(`/perfume/${p.id}`)}
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
  );
}
