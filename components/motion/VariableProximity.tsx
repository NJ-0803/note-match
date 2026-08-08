"use client";

import { useRef } from "react";
import { useAnimationFrame } from "motion/react";

const MIN_WEIGHT = 400;
const MAX_WEIGHT = 700;
const RADIUS = 90;
const NBSP = " ";

export default function VariableProximity({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef({ x: -9999, y: -9999 });

  useAnimationFrame(() => {
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    const { x: px, y: py } = pointer.current;
    const near =
      px > bounds.left - RADIUS &&
      px < bounds.right + RADIUS &&
      py > bounds.top - RADIUS &&
      py < bounds.bottom + RADIUS;

    for (const el of letterRefs.current) {
      if (!el) continue;
      if (!near) {
        el.style.fontVariationSettings = `"wght" ${MIN_WEIGHT}`;
        continue;
      }
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(cx - px, cy - py);
      const t = Math.max(0, 1 - dist / RADIUS);
      const weight = Math.round(MIN_WEIGHT + t * (MAX_WEIGHT - MIN_WEIGHT));
      el.style.fontVariationSettings = `"wght" ${weight}`;
    }
  });

  return (
    <span
      ref={containerRef}
      onPointerMove={(e) => {
        pointer.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerLeave={() => {
        pointer.current = { x: -9999, y: -9999 };
      }}
      className={`font-[family-name:var(--font-geist-mono-variable)] ${className}`}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            letterRefs.current[i] = el;
          }}
          style={{ display: "inline-block", fontVariationSettings: `"wght" ${MIN_WEIGHT}` }}
        >
          {char === " " ? NBSP : char}
        </span>
      ))}
    </span>
  );
}
