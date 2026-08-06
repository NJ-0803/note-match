"use client";

import { useEffect, useState } from "react";
import type { Perfume } from "@/types/perfume";
import { getCollection } from "@/lib/collection";
import PerfumeCard from "@/components/PerfumeCard";

export default function CollectionClient({ perfumes }: { perfumes: Perfume[] }) {
  const [entries, setEntries] = useState<{ id: string; status: "own" | "want" }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function refresh() {
      setEntries(getCollection());
    }
    refresh();
    setMounted(true);
    window.addEventListener("perfume-notes:collection-changed", refresh);
    return () => window.removeEventListener("perfume-notes:collection-changed", refresh);
  }, []);

  const byId = new Map(perfumes.map((p) => [p.id, p]));
  const owned = entries.filter((e) => e.status === "own").map((e) => byId.get(e.id)).filter((p): p is Perfume => Boolean(p));
  const wanted = entries.filter((e) => e.status === "want").map((e) => byId.get(e.id)).filter((p): p is Perfume => Boolean(p));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">My Collection</h1>
      <p className="mt-1 text-neutral-500 dark:text-neutral-400">
        Saved on this device only — no account needed.
      </p>

      {mounted && entries.length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">
          Nothing saved yet. Browse perfumes and tap "Own it" or "Want to try" to build your collection.
        </p>
      )}

      {owned.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Own it ({owned.length})</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {owned.map((p) => (
              <PerfumeCard key={p.id} perfume={p} />
            ))}
          </div>
        </section>
      )}

      {wanted.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Want to try ({wanted.length})</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wanted.map((p) => (
              <PerfumeCard key={p.id} perfume={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
