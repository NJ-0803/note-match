"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { usePointerParallax } from "@/lib/usePointerParallax";
import FloatingIngredient, { type IngredientConfig } from "./FloatingIngredient";
import ElectricFlow from "./ElectricFlow";
import MaskReveal from "@/components/motion/MaskReveal";

const INGREDIENTS: IngredientConfig[] = [
  {
    id: "petal",
    type: "petal",
    top: "12%",
    left: "38%",
    size: 46,
    depth: 0.3,
    from: "top",
    entranceDelay: 0.2,
    floatDuration: 4.5,
    floatAmplitude: 10,
    rotateRange: 8,
  },
  {
    id: "bergamot",
    type: "bergamot",
    top: "22%",
    left: "9%",
    size: 42,
    depth: 0.65,
    from: "left",
    entranceDelay: 0.26,
    floatDuration: 7,
    floatAmplitude: 14,
    rotateRange: 6,
    aboveText: true,
  },
  {
    id: "droplet",
    type: "droplet",
    top: "36%",
    left: "84%",
    size: 26,
    depth: 0.85,
    from: "right",
    entranceDelay: 0.32,
    floatDuration: 9,
    floatAmplitude: 6,
    rotateRange: 3,
    aboveText: true,
  },
  {
    id: "vanilla",
    type: "vanilla",
    top: "66%",
    left: "13%",
    size: 60,
    depth: 0.45,
    from: "bottom",
    entranceDelay: 0.38,
    floatDuration: 6,
    floatAmplitude: 12,
    rotateRange: 5,
  },
  {
    id: "oud",
    type: "oud",
    top: "72%",
    left: "80%",
    size: 44,
    depth: 0.3,
    from: "left",
    entranceDelay: 0.44,
    floatDuration: 10,
    floatAmplitude: 4,
    rotateRange: 2,
  },
  {
    id: "peppercorn",
    type: "peppercorn",
    top: "85%",
    left: "47%",
    size: 30,
    depth: 0.6,
    from: "bottom",
    entranceDelay: 0.5,
    floatDuration: 5,
    floatAmplitude: 8,
    rotateRange: 8,
  },
  {
    id: "amber",
    type: "amber",
    top: "9%",
    left: "82%",
    size: 90,
    depth: 0.2,
    from: "right",
    entranceDelay: 0.22,
    floatDuration: 8,
    floatAmplitude: 10,
    rotateRange: 4,
  },
];

export default function FloatingHero({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { x, y } = usePointerParallax(sectionRef);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const exitScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const exitBlurPx = useTransform(scrollYProgress, [0.5, 1], [0, 12]);
  const exitFilter = useTransform(exitBlurPx, (v) => `blur(${v}px)`);

  return (
    <motion.section
      ref={sectionRef}
      style={prefersReducedMotion ? undefined : { opacity: exitOpacity, scale: exitScale, filter: exitFilter }}
      className="relative min-h-screen overflow-hidden"
    >
      {!prefersReducedMotion &&
        INGREDIENTS.map((cfg) => <FloatingIngredient key={cfg.id} config={cfg} pointerX={x} pointerY={y} />)}

      {!prefersReducedMotion && <ElectricFlow pointerX={x} pointerY={y} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative z-20 flex justify-center pt-10 sm:pt-12"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-accent">A better way to find a fragrance</p>
      </motion.div>

      <div className="hero-heading-block relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-6 pt-[clamp(4rem,10vh,8rem)] text-center sm:px-10">
        <h1 className="font-display text-[clamp(4.25rem,10.5vw,9.5rem)] font-medium leading-[0.82] tracking-[-0.065em] text-foreground">
          <MaskReveal text="Find the scent" delay={0.8} />
          <MaskReveal text="that follows you." delay={0.94} className="text-foreground/72" />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.14 }}
          className="mt-8 max-w-xl text-base leading-7 text-foreground/60 sm:text-lg"
        >
          Start with the perfume that already feels like you, or describe the atmosphere you want to leave behind.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="hero-search-anchor pointer-events-none z-30"
      >
        <div className="pointer-events-auto w-full max-w-2xl">{children}</div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2"
      >
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Follow the notes</p>
        <div className="relative h-px w-14 overflow-hidden bg-foreground/15">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/3 bg-accent"
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
