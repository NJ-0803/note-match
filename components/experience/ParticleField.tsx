"use client";

import { Sparkles } from "@react-three/drei";

export default function ParticleField({
  count,
  opacity,
  scale = [8, 5, 8],
  size = 2.2,
}: {
  count: number;
  opacity: number;
  scale?: [number, number, number];
  size?: number;
}) {
  return (
    <Sparkles
      count={count}
      scale={scale}
      size={size}
      speed={0.15}
      opacity={opacity}
      color="#c2a878"
      noise={1}
    />
  );
}
