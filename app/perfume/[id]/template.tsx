"use client";

import PageMaterializeOverlay from "@/components/motion/PageMaterializeOverlay";

export default function PerfumeTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageMaterializeOverlay />
      {children}
    </>
  );
}
