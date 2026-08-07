"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Perfume, FragranceFamily } from "@/types/perfume";
import SearchBox from "@/components/SearchBox";
import FreeTextSearch from "@/components/FreeTextSearch";
import FamilyFilter from "@/components/FamilyFilter";
import PerfumeCard from "@/components/PerfumeCard";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function HomeClient({ perfumes }: { perfumes: Perfume[] }) {
  const [family, setFamily] = useState<FragranceFamily | null>(null);

  const filtered = useMemo(
    () => (family ? perfumes.filter((p) => p.family === family) : perfumes),
    [perfumes, family],
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Own a scent you love? Find what to wear next.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Search a perfume already in your collection, or describe the scent you're after, and get matches
          ranked by shared notes — plus where to buy them in India.
        </p>
        <div className="mx-auto mt-6 max-w-xl">
          <SearchBox perfumes={perfumes} />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8"
      >
        <FreeTextSearch perfumes={perfumes} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mt-14"
      >
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Or explore by family
        </h2>
        <div className="flex justify-center">
          <FamilyFilter active={family} onChange={setFamily} />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mt-16 border-t border-border pt-10"
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            {family ? `${family} perfumes` : "The full catalogue"}{" "}
            <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span>
          </h2>
        </div>
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p) => (
            <motion.div key={p.id} variants={cardVariants}>
              <PerfumeCard perfume={p} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
