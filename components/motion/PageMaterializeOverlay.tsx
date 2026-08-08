"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const PARTICLE_COUNT = 14;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

/** A one-shot "materializing" reveal: a radial iris wipe plus a brief burst
 * of light particles, in the site's existing accent color. Pure CSS/motion,
 * no WebGL, so it stays fast - meant to play once per mount (a segment
 * template remounts it fresh on every navigation into a new route/param). */
export default function PageMaterializeOverlay() {
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(false), 750);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  if (!visible) return null;

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const distance = 90 + (i % 3) * 40;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: (i % 4) * 0.03,
    };
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ clipPath: "circle(150% at 50% 45%)" }}
        animate={{ clipPath: "circle(0% at 50% 45%)" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-background"
      />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.6, delay: p.delay, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-accent"
          style={{ top: "45%", left: "50%" }}
        />
      ))}
    </div>
  );
}
