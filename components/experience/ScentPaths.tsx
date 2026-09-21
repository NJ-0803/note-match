"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const PATHS = [
  {
    href: "/perfume/dior-eau-sauvage",
    title: "Citrus with a shadow",
    brand: "Dior Eau Sauvage",
    notes: "Lemon · Basil · Vetiver",
    description: "For crisp mornings that need more than brightness.",
    className: "md:col-span-7 md:min-h-[34rem]",
    atmosphere:
      "radial-gradient(circle at 22% 18%, rgba(240, 196, 89, 0.82), transparent 23%), radial-gradient(circle at 76% 72%, rgba(45, 107, 74, 0.72), transparent 34%), linear-gradient(135deg, #15100a 0%, #2c2110 46%, #07120c 100%)",
  },
  {
    href: "/perfume/chanel-no-5",
    title: "A floral that lingers",
    brand: "Chanel N°5",
    notes: "Aldehydes · Jasmine · Iris",
    description: "For an entrance that leaves a soft, powdery echo.",
    className: "md:col-span-5 md:min-h-[34rem]",
    atmosphere:
      "radial-gradient(circle at 62% 24%, rgba(243, 234, 210, 0.82), transparent 18%), radial-gradient(circle at 30% 78%, rgba(197, 142, 117, 0.46), transparent 36%), linear-gradient(150deg, #201817 0%, #705148 48%, #181213 100%)",
  },
  {
    href: "/perfume/chanel-bleu-de-chanel",
    title: "Cool air, warm skin",
    brand: "Bleu de Chanel",
    notes: "Grapefruit · Incense · Cedar",
    description: "For the kind of clarity that gains depth after dark.",
    className: "md:col-span-5 md:min-h-[30rem]",
    atmosphere:
      "radial-gradient(circle at 76% 18%, rgba(94, 150, 181, 0.68), transparent 22%), radial-gradient(circle at 22% 72%, rgba(24, 47, 66, 0.9), transparent 38%), linear-gradient(145deg, #071119 0%, #173040 54%, #090b0d 100%)",
  },
  {
    href: "/perfume/chanel-coco-mademoiselle",
    title: "After-dark warmth",
    brand: "Coco Mademoiselle",
    notes: "Orange · Patchouli · Vanilla",
    description: "For citrus light sharpened by a velvet dry-down.",
    className: "md:col-span-7 md:min-h-[30rem]",
    atmosphere:
      "radial-gradient(circle at 24% 22%, rgba(234, 130, 48, 0.64), transparent 20%), radial-gradient(circle at 82% 70%, rgba(123, 61, 37, 0.78), transparent 40%), linear-gradient(135deg, #200b08 0%, #592217 50%, #17100d 100%)",
  },
] as const;

function ScentPath({ path }: { path: (typeof PATHS)[number] }) {
  return (
    <Link
      href={path.href}
      className={`group relative isolate flex overflow-hidden border border-foreground/10 p-6 sm:p-8 ${path.className}`}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: path.atmosphere }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.07 }}
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.55),transparent_58%,rgba(0,0,0,0.22))]" />
      <div aria-hidden className="absolute -right-20 top-14 h-64 w-64 rounded-full border border-foreground/25 transition-transform duration-700 group-hover:scale-125" />
      <div aria-hidden className="absolute -right-7 top-[9.25rem] h-44 w-44 rounded-full border border-foreground/15 transition-transform duration-700 group-hover:translate-x-8" />

      <div className="relative z-10 flex w-full flex-col justify-between gap-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/65">{path.notes}</p>
        <div className="max-w-md">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/60">{path.brand}</p>
          <h3 className="font-display text-4xl leading-[0.92] tracking-tight text-foreground sm:text-5xl">{path.title}</h3>
          <p className="mt-5 max-w-sm text-sm leading-6 text-foreground/72">{path.description}</p>
          <span className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-foreground transition-colors group-hover:text-accent">
            Meet the scent <span aria-hidden>↗</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ScentPaths() {
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start 78%", "end 38%"] });
  const storyOpacity = useTransform(scrollYProgress, [0, 0.75], [0.18, 1]);

  return (
    <section className="relative overflow-hidden border-t border-foreground/10 bg-[#090908] px-4 py-28 sm:px-8 md:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <h2 className="font-display text-5xl leading-[0.9] tracking-tight text-foreground sm:text-7xl md:col-span-8">
            Begin with a memory. <span className="text-foreground/45">End with a signature.</span>
          </h2>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground md:col-span-4 md:justify-self-end">
            A fragrance is never one note. It is the tension between the first impression, the heart, and what stays.
          </p>
        </div>

        <div className="grid grid-flow-dense grid-cols-1 gap-px overflow-hidden bg-foreground/10 md:grid-cols-12">
          {PATHS.map((path) => (
            <ScentPath key={path.href} path={path} />
          ))}
        </div>

        <section ref={storyRef} className="mx-auto max-w-4xl py-28 text-center md:py-44">
          <motion.p style={{ opacity: storyOpacity }} className="font-display text-4xl leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            The best recommendation is not a ranking. It is the moment a familiar note becomes a different version of you.
          </motion.p>
          <Link
            href="/catalogue"
            className="mt-12 inline-flex border-b border-accent pb-2 text-xs uppercase tracking-[0.28em] text-accent transition-colors hover:border-foreground hover:text-foreground"
          >
            Explore the full catalogue
          </Link>
        </section>
      </div>
    </section>
  );
}
