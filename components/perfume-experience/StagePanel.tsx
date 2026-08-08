"use client";

import { motion } from "motion/react";

export default function StagePanel({
  children,
  eyebrow,
  title,
  align = "left",
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-28 ${
        align === "center" ? "items-center text-center" : ""
      }`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </motion.div>
  );
}
