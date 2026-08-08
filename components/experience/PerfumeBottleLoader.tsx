"use client";

import dynamic from "next/dynamic";

const PerfumeBottle3D = dynamic(() => import("./PerfumeBottle3D"), { ssr: false });

export default function PerfumeBottleLoader({
  color,
  offsetX,
  scale,
  dim,
}: {
  color: string;
  offsetX?: number;
  scale?: number;
  dim?: number;
}) {
  return <PerfumeBottle3D color={color} offsetX={offsetX} scale={scale} dim={dim} />;
}
