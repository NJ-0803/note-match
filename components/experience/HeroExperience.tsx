"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useHeroCapabilities, useIsMobileViewport } from "@/lib/useHeroCapabilities";
import ParticleField from "./ParticleField";
import GalaxyRing from "./GalaxyRing";
import StaticHeroFallback from "./StaticHeroFallback";

function RevealController({ children }: { children: (reveal: number) => React.ReactNode }) {
  const [reveal, setReveal] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const durationMs = 2200;
    let raf: number;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      // ease-out cubic
      setReveal(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <>{children(reveal)}</>;
}

export default function HeroExperience() {
  const capability = useHeroCapabilities();
  const isMobile = useIsMobileViewport();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (capability !== "enabled") {
    return <StaticHeroFallback />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile }}
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 2, 4]} intensity={220} color="#e6c896" decay={1.5} />
        <pointLight position={[-3, -1, 3]} intensity={100} color="#c2a878" decay={1.5} />
        <pointLight position={[0, 0, 6]} intensity={60} color="#ffffff" decay={1.5} />
        <RevealController>
          {(reveal) => (
            <>
              <ParticleField count={isMobile ? 60 : 180} opacity={reveal * 0.6} />
              <GalaxyRing reveal={reveal} />
            </>
          )}
        </RevealController>
      </Canvas>
    </div>
  );
}
