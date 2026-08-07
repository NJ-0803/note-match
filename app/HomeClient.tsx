"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import type { Perfume } from "@/types/perfume";
import SearchBox from "@/components/SearchBox";
import FreeTextSearch from "@/components/FreeTextSearch";
import RevealText from "@/components/motion/RevealText";

const HeroExperience = dynamic(() => import("@/components/experience/HeroExperience"), {
  ssr: false,
});

export default function HomeClient({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <div className="relative min-h-[85vh]">
      <HeroExperience />

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-5xl flex-col justify-center px-6 py-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-3 text-center font-mono text-xs uppercase tracking-[0.3em] text-accent"
        >
          N&deg; 001 — Olfactory Discovery System
        </motion.p>

        <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">
          <RevealText text="Own a scent you love?" delay={0.3} className="block text-center" />
          <RevealText text="Find what to wear next." delay={0.75} className="block text-center" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mx-auto mt-4 max-w-xl text-center text-muted-foreground"
        >
          Search a perfume already in your collection, or describe the scent you're after, and get
          matches ranked by shared notes — plus where to buy them in India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mx-auto mt-8 w-full max-w-xl"
        >
          <SearchBox perfumes={perfumes} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-8"
        >
          <FreeTextSearch perfumes={perfumes} />
        </motion.div>
      </div>
    </div>
  );
}
