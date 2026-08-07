"use client";

import { motion } from "motion/react";

export default function AboutClient({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight"
      >
        About
      </motion.h1>
      <div className="mt-6 space-y-5">
        {paragraphs.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            className="text-muted-foreground leading-relaxed"
          >
            {para}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
