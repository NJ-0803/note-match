"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type SpringOptions } from "motion/react";

const SPRING: SpringOptions = { stiffness: 60, damping: 20, mass: 0.6 };

/**
 * Normalized pointer position (-1..1 on each axis, 0 at container center),
 * spring-smoothed so layers never track the cursor 1:1. Scoped to a
 * container ref rather than the window, and pauses when the pointer leaves
 * (resets toward center) or the tab is hidden.
 */
export function usePointerParallax(containerRef: React.RefObject<HTMLElement | null>) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    function handleMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      rawX.set(Math.max(-1, Math.min(1, nx)));
      rawY.set(Math.max(-1, Math.min(1, ny)));
    }
    function handleLeave() {
      rawX.set(0);
      rawY.set(0);
    }
    function handleVisibility() {
      if (document.hidden) handleLeave();
    }

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [containerRef, rawX, rawY]);

  return { x, y };
}
