"use client";

import { motion } from "motion/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const word = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function RevealText({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="show"
      transition={{ delayChildren: delay }}
      className={`inline-flex flex-wrap justify-center gap-x-[0.3em] ${className}`}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} transition={{ duration: 0.6, ease: "easeOut" }}>
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}
