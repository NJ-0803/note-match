"use client";

import { useMemo, useState } from "react";
import type { Perfume, FragranceFamily } from "@/types/perfume";
import SearchBox from "@/components/SearchBox";
import FreeTextSearch from "@/components/FreeTextSearch";
import FamilyFilter from "@/components/FamilyFilter";
import PerfumeCard from "@/components/PerfumeCard";

export default function HomeClient({ perfumes }: { perfumes: Perfume[] }) {
  const [family, setFamily] = useState<FragranceFamily | null>(null);

  const filtered = useMemo(
    () => (family ? perfumes.filter((p) => p.family === family) : perfumes),
    [perfumes, family],
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find your next favourite scent — by notes, not luck.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-neutral-500 dark:text-neutral-400">
          Search a perfume you already love, or describe the scent you're after, and get matches ranked by
          shared notes — plus where to buy them in India.
        </p>
        <div className="mx-auto mt-6 max-w-xl">
          <SearchBox perfumes={perfumes} />
        </div>
      </section>

      <section className="mt-8">
        <FreeTextSearch perfumes={perfumes} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Or browse by family
        </h2>
        <div className="flex justify-center">
          <FamilyFilter active={family} onChange={setFamily} />
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            {family ? `${family} perfumes` : "All perfumes"}{" "}
            <span className="text-sm font-normal text-neutral-400">({filtered.length})</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PerfumeCard key={p.id} perfume={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
