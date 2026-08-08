"use client";

import dynamic from "next/dynamic";

const PerfumeBottle3D = dynamic(() => import("./PerfumeBottle3D"), { ssr: false });

export default function PerfumeBottleLoader({ color }: { color: string }) {
  return <PerfumeBottle3D color={color} />;
}
