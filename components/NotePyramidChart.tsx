"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Perfume } from "@/types/perfume";

const LAYER_COLORS = {
  Top: "#e8b04b",
  Heart: "#c15fa0",
  Base: "#8a5a34",
};

export default function NotePyramidChart({ perfume }: { perfume: Perfume }) {
  const data = [
    { layer: "Top", notes: perfume.topNotes, value: perfume.topNotes.length || 1 },
    { layer: "Heart", notes: perfume.heartNotes, value: perfume.heartNotes.length || 1 },
    { layer: "Base", notes: perfume.baseNotes, value: perfume.baseNotes.length || 1 },
  ];
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-4">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="layer"
              innerRadius={38}
              outerRadius={68}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.layer} fill={LAYER_COLORS[d.layer as keyof typeof LAYER_COLORS]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as (typeof data)[number];
                const pct = Math.round((d.value / total) * 100);
                return (
                  <div className="rounded-lg border border-neutral-200 bg-white p-2 text-xs shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                    <p className="font-semibold" style={{ color: LAYER_COLORS[d.layer as keyof typeof LAYER_COLORS] }}>
                      {d.layer} notes · {pct}%
                    </p>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-400">{d.notes.join(", ")}</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-1 text-sm">
        {data.map((d) => (
          <li key={d.layer} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: LAYER_COLORS[d.layer as keyof typeof LAYER_COLORS] }}
            />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{d.layer}:</span>
            <span className="text-neutral-500 dark:text-neutral-400">{d.notes.join(", ")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
