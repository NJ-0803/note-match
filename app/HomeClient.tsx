"use client";

import { motion } from "motion/react";
import type { Perfume } from "@/types/perfume";
import SearchBox from "@/components/SearchBox";
import FreeTextSearch from "@/components/FreeTextSearch";

export default function HomeClient({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center px-6 py-10">
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
    </div>
  );
}
