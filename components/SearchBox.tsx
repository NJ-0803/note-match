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
        className="w-full rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm shadow-sm outline-none transition focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-100"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onMouseDown={() => router.push(`/perfume/${p.id}`)}
                className="flex w-full flex-col items-start px-4 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <span className="text-xs uppercase tracking-wide text-neutral-400">{p.brand}</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">{p.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
