"use client";

import { useEffect, useState } from "react";

type HeroCapability = "checking" | "enabled" | "fallback";

/** Decides whether the WebGL hero should render, entirely client-side and
 * after mount - starts in a "checking" state (renders nothing/fallback)
 * so there's never a server/client mismatch or a flash of the canvas
 * before we know it's safe and wanted. */
export function useHeroCapabilities(): HeroCapability {
  const [state, setState] = useState<HeroCapability>("checking");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let hasWebGL = false;
    try {
      const canvas = document.createElement("canvas");
      hasWebGL = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      hasWebGL = false;
    }

    setState(prefersReducedMotion || !hasWebGL ? "fallback" : "enabled");
  }, []);

  return state;
}

export function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
