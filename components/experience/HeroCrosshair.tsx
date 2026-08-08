"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// Reticle-style focus indicator, scoped to ScrubVideoHero only. Distinct
// from CustomCursor's global meteor trail - this doesn't replace it, it's a
// second, section-local accent that reinforces the viewfinder/REC framing
// already in the hero (corner brackets, frame counter).
export default function HeroCrosshair({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 260, damping: 28 });
  const springY = useSpring(y, { stiffness: 260, damping: 28 });
  const opacity = useSpring(0, { stiffness: 260, damping: 30 });

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(supportsFinePointer && !reducedMotion);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!enabled || !el) return;

    function handleMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    }
    function handleEnter() {
      setActive(true);
      opacity.set(1);
    }
    function handleLeave() {
      setActive(false);
      opacity.set(0);
    }

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerenter", handleEnter);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerenter", handleEnter);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [enabled, containerRef, x, y, opacity]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: springX, y: springY, opacity }}
      className="pointer-events-none absolute left-0 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      <div className="relative h-12 w-12">
        <div className={`absolute inset-0 rounded-full border transition-colors ${active ? "border-accent/50" : "border-accent/30"}`} />
        <div className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-accent/60" />
        <div className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-accent/60" />
        <div className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-accent/60" />
        <div className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-accent/60" />
      </div>
    </motion.div>
  );
}
