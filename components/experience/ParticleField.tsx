"use client";

import { Sparkles } from "@react-three/drei";

export default function ParticleField({ count, opacity }: { count: number; opacity: number }) {
  return (
    <Sparkles
      count={count}
      scale={[8, 5, 8]}
      size={2.2}
      speed={0.15}
      opacity={opacity}
      color="#c2a878"
      noise={1}
    />
  );
}
