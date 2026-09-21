"use client";

import type { Perfume } from "@/types/perfume";
import FloatingHero from "@/components/experience/FloatingHero";
import ModeSwitchSearch from "@/components/experience/ModeSwitchSearch";
import ScentPaths from "@/components/experience/ScentPaths";

export default function HomeClient({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <>
      <FloatingHero>
        <ModeSwitchSearch perfumes={perfumes} />
      </FloatingHero>
      <ScentPaths />
    </>
  );
}
