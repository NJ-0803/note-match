"use client";

import type { PerfumeView } from "./PerfumeExperience";

const TABS: Array<{ id: PerfumeView; label: string }> = [
  { id: "hero", label: "Fragrance" },
  { id: "notes", label: "Notes" },
  { id: "dna", label: "Scent DNA" },
  { id: "timeline", label: "Wear" },
  { id: "showroom", label: "Similar" },
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
      <div className="flex items-center gap-1 rounded-full border border-border bg-surface/80 px-1.5 py-1.5 backdrop-blur-md">
        {TABS.filter((t) => t.id !== "showroom" || hasRecommendations).map((tab, i) => {
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-cursor="Open"
              onClick={() => onChange(tab.id)}
              className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors sm:px-4 sm:text-xs ${
                active ? "bg-accent text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="mr-1.5 opacity-60">{String(i + 1).padStart(2, "0")}</span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
