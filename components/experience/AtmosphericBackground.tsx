"use client";

import { useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate, animate } from "motion/react";
import { useAtmosphereColor } from "@/lib/atmosphereColor";

/** A small set of large, heavily-blurred glow layers that drift vertically
 * at different rates as the page scrolls, tied to the page's own scroll
 * progress. Pure CSS transforms driven by motion values (no re-renders,
 * no WebGL) - meant to make the space below any hero feel like a
 * continuation of the same environment rather than a flat cutoff, giving
 * a subtle sense of descending through layers of light as you scroll.
 * The tint itself is read from the global atmosphere-color context so a
 * page (e.g. the active perfume's family) can shift it, with the shift
 * smoothly interpolated rather than snapping. */
export default function AtmosphericBackground() {
  const targetColor = useAtmosphereColor();
  const colorMV = useMotionValue(targetColor);

  useEffect(() => {
    const controls = animate(colorMV, targetColor, { duration: 1.1, ease: "easeInOut" });
    return () => controls.stop();
  }, [targetColor, colorMV]);

  const glowBg = useMotionTemplate`radial-gradient(circle, ${colorMV} 0%, transparent 70%)`;

  const { scrollYProgress } = useScroll();

  const farY = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, 340]);
  const fade = useTransform(scrollYProgress, [0, 0.12, 1], [0.55, 0.28, 0.16]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{
          y: farY,
          opacity: fade,
          background: glowBg,
          mixBlendMode: "screen",
        }}
        className="absolute -top-32 left-[8%] h-[520px] w-[520px] rounded-full blur-[110px]"
      />
      <motion.div
        style={{
          y: midY,
          opacity: fade,
          background: glowBg,
          mixBlendMode: "screen",
        }}
        className="absolute top-[35%] right-[5%] h-[420px] w-[420px] rounded-full blur-[100px]"
      />
      <motion.div
        style={{
          y: nearY,
          opacity: fade,
          background: glowBg,
          mixBlendMode: "screen",
        }}
        className="absolute top-[75%] left-[15%] h-[480px] w-[480px] rounded-full blur-[120px]"
      />
    </div>
  );
}
