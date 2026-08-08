"use client";

import type { PerfumeView } from "./PerfumeExperience";

const TABS: Array<{ id: PerfumeView; label: string; shortLabel: string }> = [
  { id: "hero", label: "Fragrance", shortLabel: "Fragrance" },
  { id: "notes", label: "Notes", shortLabel: "Notes" },
  { id: "dna", label: "Scent DNA", shortLabel: "DNA" },
  { id: "timeline", label: "Wear", shortLabel: "Wear" },
  { id: "showroom", label: "Similar", shortLabel: "Similar" },
];

export default function StateTabs({
  view,
  onChange,
  hasRecommendations,
}: {
  view: PerfumeView;
  onChange: (view: PerfumeView) => void;
  hasRecommendations: boolean;
}) {
  return (
    <nav className="pointer-events-auto fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
      <div
        style={{ scrollbarWidth: "none" }}
        className="flex max-w-full items-center gap-px overflow-x-auto rounded-full border border-border bg-surface/80 px-1.5 py-1.5 backdrop-blur-md [&::-webkit-scrollbar]:hidden sm:gap-1"
      >
        {TABS.filter((t) => t.id !== "showroom" || hasRecommendations).map((tab, i) => {
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-cursor="Open"
              onClick={() => onChange(tab.id)}
              className={`shrink-0 rounded-full px-1.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors sm:px-4 sm:text-xs ${
                active ? "bg-accent text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="hidden opacity-60 sm:mr-1.5 sm:inline">{String(i + 1).padStart(2, "0")}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
