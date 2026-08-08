"use client";

import { motion } from "motion/react";

// Slow, continuously drifting elongated glows - a restrained, panel-local
// take on a "flowing silk" backdrop (distinct from AtmosphericBackground's
// scroll-driven round blobs, which are global). Pure CSS transforms, no
// WebGL. Sits behind panel text via -z-10 within the panel's own stacking
// context - see StagePanel.tsx / NotesArchitecture.tsx.
export default function SilkPanelBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: ["-10%", "10%", "-10%"], rotate: [-6, 6, -6] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/3 h-[220px] w-[900px] -translate-x-1/2 rounded-[50%] bg-accent/10 blur-[100px]"
        style={{ mixBlendMode: "screen" }}
      />
      <motion.div
        animate={{ x: ["8%", "-8%", "8%"], rotate: [4, -4, 4] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-2/3 h-[180px] w-[760px] -translate-x-1/2 rounded-[50%] bg-accent/[0.08] blur-[90px]"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}
