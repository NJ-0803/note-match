"use client";

import { motion } from "motion/react";

// One masked line of text: clips inside an overflow-hidden box and rises
// into place from blur, used for the hero headline's entrance choreography.
export default function MaskReveal({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "110%", opacity: 0, filter: "blur(10px)" }}
        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`block ${className}`}
      >
        {text}
      </motion.span>
    </span>
  );
}
