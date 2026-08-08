"use client";

import { motion } from "motion/react";
import type { Perfume } from "@/types/perfume";
import SearchBox from "@/components/SearchBox";
import FreeTextSearch from "@/components/FreeTextSearch";
import RevealText from "@/components/motion/RevealText";
import ScrubVideoHero from "@/components/experience/ScrubVideoHero";

export default function HomeClient({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <div className="relative">
      <ScrubVideoHero videoSrc="/hero/bottle-scrub.mp4" posterSrc="/hero/bottle-poster.jpg">
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl flex-col justify-center px-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            N&deg; 001 — Olfactory Discovery System
          </motion.p>

          <h1 className="font-display text-4xl leading-[0.95] tracking-tight sm:text-7xl">
            <RevealText text="Own a scent" delay={0.3} className="justify-start" />
            <span className="mt-1 flex items-baseline gap-3">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="text-accent"
              >
                //
              </motion.span>
              <RevealText text="you love" delay={0.85} className="justify-start" />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-6 max-w-md font-mono text-xs uppercase tracking-widest text-foreground/60"
          >
            Find what to wear next
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="mt-4 max-w-md text-sm text-foreground/70"
          >
            Search a perfume already in your collection, or describe the scent you're after, and
            get matches ranked by shared notes — plus where to buy them in India.
          </motion.p>
        </div>
      </ScrubVideoHero>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 28 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="relative z-10 mx-auto max-w-5xl px-6 py-24"
      >
        <SearchBox perfumes={perfumes} />
        <div className="mt-8">
          <FreeTextSearch perfumes={perfumes} />
        </div>
      </motion.div>
    </div>
  );
}
