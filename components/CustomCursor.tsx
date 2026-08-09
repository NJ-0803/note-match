"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useAnimationFrame } from "motion/react";

// Layered glow rings, largest/blurriest/faintest first so they sit behind
// the tighter, brighter ones - each follows the one before it with
// progressively softer spring physics, which is what makes the whole
// chain read as one continuous dissolving tail rather than separate dots
// trailing the mouse. Rendered inside a goo-filtered wrapper (see
// CURSOR_GOO_FILTER_ID below) so the chain merges into one liquid blob
// instead of looking like discrete overlapping circles.
const GLOW_LAYERS = [
  { size: 52, blur: 24, opacity: 0.16, stiffness: 55, damping: 20 },
  { size: 42, blur: 19, opacity: 0.24, stiffness: 80, damping: 21 },
  { size: 33, blur: 14, opacity: 0.34, stiffness: 130, damping: 23 },
  { size: 24, blur: 9, opacity: 0.48, stiffness: 220, damping: 26 },
  { size: 15, blur: 4, opacity: 0.68, stiffness: 420, damping: 32 },
];
const CORE_SPRING = { stiffness: 900, damping: 42 };
const CURSOR_GOO_FILTER_ID = "cursor-goo";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [strong, setStrong] = useState(false);
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const coreX = useSpring(rawX, CORE_SPRING);
  const coreY = useSpring(rawY, CORE_SPRING);

  // Meteor streak: stretches and orients along the direction of travel as
  // the pointer speeds up, and relaxes back to nothing once it slows or
  // stops - fast movement reads as a longer trailing tail, not just a chain
  // of catching-up dots.
  const streakLength = useMotionValue(0);
  const streakAngle = useMotionValue(0);

  useAnimationFrame(() => {
    if (!enabled) return;
    const vx = rawX.getVelocity();
    const vy = rawY.getVelocity();
    const speed = Math.hypot(vx, vy);
    const targetLength = Math.min(72, speed / 20);
    streakLength.set(streakLength.get() + (targetLength - streakLength.get()) * 0.25);
    if (speed > 40) {
      const angleDeg = (Math.atan2(vy, vx) * 180) / Math.PI + 180;
      streakAngle.set(angleDeg);
    }
  });

  // Build the glow chain, each layer's spring source is the previous
  // layer's own (already-springy) output.
  const layer0X = useSpring(coreX, GLOW_LAYERS[4]);
  const layer0Y = useSpring(coreY, GLOW_LAYERS[4]);
  const layer1X = useSpring(layer0X, GLOW_LAYERS[3]);
  const layer1Y = useSpring(layer0Y, GLOW_LAYERS[3]);
  const layer2X = useSpring(layer1X, GLOW_LAYERS[2]);
  const layer2Y = useSpring(layer1Y, GLOW_LAYERS[2]);
  const layer3X = useSpring(layer2X, GLOW_LAYERS[1]);
  const layer3Y = useSpring(layer2Y, GLOW_LAYERS[1]);
  const layer4X = useSpring(layer3X, GLOW_LAYERS[0]);
  const layer4Y = useSpring(layer3Y, GLOW_LAYERS[0]);

  // Ordered back-to-front for rendering: largest/faintest first.
  const chain = [
    [layer4X, layer4Y, GLOW_LAYERS[0]],
    [layer3X, layer3Y, GLOW_LAYERS[1]],
    [layer2X, layer2Y, GLOW_LAYERS[2]],
    [layer1X, layer1Y, GLOW_LAYERS[3]],
    [layer0X, layer0Y, GLOW_LAYERS[4]],
  ] as const;

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(supportsFinePointer && !reducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function handleMove(e: MouseEvent) {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    }

    // Event delegation: elements opt in via data-cursor="LABEL" (and
    // optionally data-cursor-strong for the bottle/hero-scale interactions),
    // avoiding per-element listeners.
    function handleOver(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (target) {
        setLabel(target.dataset.cursor ?? null);
        setStrong(target.hasAttribute("data-cursor-strong"));
      }
    }
    function handleOut(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (target) {
        setLabel(null);
        setStrong(false);
      }
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  const intensity = strong ? 1.7 : 1;

  return (
    <>
      <style jsx global>{`
        html,
        body,
        a,
        button,
        [role="button"] {
          cursor: none !important;
        }
        input,
        textarea {
          cursor: text !important;
        }
      `}</style>

      {/* Zero-size, defines the liquid-merge filter used below - never
          rendered visibly itself. */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id={CURSOR_GOO_FILTER_ID}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* `filter` makes this the containing block for its fixed children,
          so it must itself span the viewport for their positioning to stay
          correct. */}
      <div
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{ filter: `url(#${CURSOR_GOO_FILTER_ID})` }}
      >
        {chain.map(([mx, my, layer], i) => (
          <motion.div
            key={i}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              x: mx,
              y: my,
              width: layer.size * intensity,
              height: layer.size * intensity,
              marginLeft: -(layer.size * intensity) / 2,
              marginTop: -(layer.size * intensity) / 2,
              opacity: layer.opacity,
              filter: `blur(${layer.blur}px)`,
              background: "radial-gradient(circle, var(--accent) 0%, transparent 72%)",
              transition: "width 0.25s ease, height 0.25s ease, margin 0.25s ease",
            }}
            className="rounded-full"
          />
        ))}
      </div>

      {/* Speed-reactive meteor streak, trailing behind the direction of travel */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x: coreX,
          y: coreY,
          width: streakLength,
          height: 3,
          marginTop: -1.5,
          rotate: streakAngle,
          transformOrigin: "0% 50%",
          background: "linear-gradient(90deg, var(--accent) 0%, transparent 100%)",
          opacity: 0.9,
          filter: "drop-shadow(0 0 5px var(--accent))",
          mixBlendMode: "screen",
        }}
        className="pointer-events-none z-[99] rounded-full"
      />

      {/* Bright energy core, with a thin electric ring for extra punch */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x: coreX,
          y: coreY,
          marginLeft: -9,
          marginTop: -9,
          width: 18,
          height: 18,
          border: "1px solid var(--accent)",
          opacity: 0.55,
        }}
        className="pointer-events-none z-[100] rounded-full"
      />
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x: coreX,
          y: coreY,
          marginLeft: -3,
          marginTop: -3,
          width: 6,
          height: 6,
        }}
        className="pointer-events-none z-[101] rounded-full bg-foreground shadow-[0_0_10px_2px_var(--accent),0_0_24px_6px_color-mix(in_srgb,var(--accent)_70%,transparent)]"
      />

      {label && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.18 }}
          style={{ position: "fixed", left: 0, top: 0, x: coreX, y: coreY }}
          className="pointer-events-none z-[102] -translate-x-1/2 translate-y-4 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground"
        >
          {label}
        </motion.div>
      )}
    </>
  );
}
