"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import type { Perfume } from "@/types/perfume";
import SearchBox from "@/components/SearchBox";
import FreeTextSearch from "@/components/FreeTextSearch";
import RevealText from "@/components/motion/RevealText";

const HeroExperience = dynamic(() => import("@/components/experience/HeroExperience"), {
  ssr: false,
});

export default function HomeClient({ perfumes }: { perfumes: Perfume[] }) {
  const heroRef = useRef<HTMLDivElement>(null);

  // Ties the hero's dissolve directly to how far the user has scrolled past
  // it (not a fixed-duration animation), so it reads as the scene physically
  // falling away rather than a canned transition playing once.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.6, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const heroBlurPx = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const heroFilter = useTransform(heroBlurPx, (v) => `blur(${v}px)`);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div className="relative">
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, filter: heroFilter, y: heroY }}
        className="relative min-h-screen overflow-hidden"
      >
        <HeroExperience />

        {/* Soft vignette between the canvas and the text so the starfield and
            planet never fight the headline/intro for contrast - a cinematic
            falloff rather than a hard scrim box. */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "radial-gradient(ellipse 780px 520px at 50% 38%, color-mix(in srgb, var(--background) 68%, transparent) 0%, transparent 72%)",
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pb-24">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.3em] text-accent [text-shadow:0_2px_14px_rgba(0,0,0,0.85)]"
          >
            N&deg; 001 — Olfactory Discovery System
          </motion.p>

          <h1 className="font-display text-3xl leading-tight tracking-tight [text-shadow:0_2px_18px_rgba(0,0,0,0.85)] sm:text-5xl">
            <RevealText text="Own a scent you love?" delay={0.3} className="block text-center" />
            <RevealText text="Find what to wear next." delay={0.75} className="block text-center" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mx-auto mt-4 max-w-xl text-center text-foreground/80 [text-shadow:0_2px_14px_rgba(0,0,0,0.85)]"
          >
            Search a perfume already in your collection, or describe the scent you're after, and get
            matches ranked by shared notes — plus where to buy them in India.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.4] }}
            transition={{ duration: 2.4, delay: 2, times: [0, 0.25, 0.7, 1] }}
            className="mt-16 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            Scroll to search ↓
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 28 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="relative z-10 mx-auto max-w-5xl px-6 pb-24"
      >
        <SearchBox perfumes={perfumes} />
        <div className="mt-8">
          <FreeTextSearch perfumes={perfumes} />
        </div>
      </motion.div>
    </div>
  );
}
