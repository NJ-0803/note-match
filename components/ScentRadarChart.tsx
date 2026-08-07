"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { SCENT_AXES, computeScentProfile } from "@/lib/scentProfile";
import type { Perfume } from "@/types/perfume";

const SERIES_COLORS = ["#c15fa0", "#2e7dae", "#b3792f"];

export default function ScentRadarChart({ perfumes }: { perfumes: Perfume[] }) {
  const data = SCENT_AXES.map((axis) => {
    const row: Record<string, string | number> = { axis };
    perfumes.forEach((p, i) => {
      row[p.name] = computeScentProfile(p)[axis];
    });
    return row;
  });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="currentColor" className="text-border" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: "currentColor" }} />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          {perfumes.map((p, i) => (
            <Radar
              key={p.id}
              name={p.name}
              dataKey={p.name}
              stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
              fill={SERIES_COLORS[i % SERIES_COLORS.length]}
              fillOpacity={0.25}
              isAnimationActive={false}
            />
          ))}
          <Tooltip />
          {perfumes.length > 1 && <Legend />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
