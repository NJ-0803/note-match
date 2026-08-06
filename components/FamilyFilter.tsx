"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FRAGRANCE_FAMILIES, type FragranceFamily } from "@/types/perfume";
import { FAMILY_STYLES } from "@/lib/family";

export default function FamilyFilter({
  active,
  onChange,
}: {
  active: FragranceFamily | null;
  onChange: (family: FragranceFamily | null) => void;
}) {
  const data = FRAGRANCE_FAMILIES.map((family) => ({ family, value: 1 }));

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="family"
              innerRadius={28}
              outerRadius={70}
              paddingAngle={3}
              onClick={(entry: { family?: FragranceFamily; payload?: { family: FragranceFamily } }) => {
                const family = entry.family ?? entry.payload?.family;
                if (family) onChange(active === family ? null : family);
              }}
              cursor="pointer"
              isAnimationActive={false}
            >
              {data.map((d) => {
                const style = FAMILY_STYLES[d.family];
                const isActive = active === d.family;
                return (
                  <Cell
                    key={d.family}
                    fill={style.color}
                    opacity={active && !isActive ? 0.3 : 1}
                    stroke={isActive ? "#111" : "none"}
                    strokeWidth={isActive ? 2 : 0}
                  />
                );
              })}
            </Pie>
            <Tooltip
              content={({ active: hovered, payload }) => {
                if (!hovered || !payload?.length) return null;
                const d = payload[0].payload as { family: FragranceFamily };
                const style = FAMILY_STYLES[d.family];
                return (
                  <div className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs font-medium shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                    {style.emoji} {d.family}
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {FRAGRANCE_FAMILIES.map((family) => {
          const style = FAMILY_STYLES[family];
          const isActive = active === family;
          return (
            <button
              key={family}
              type="button"
              onClick={() => onChange(isActive ? null : family)}
              style={{
                color: isActive ? "#fff" : style.color,
                backgroundColor: isActive ? style.color : style.bg,
              }}
              className="rounded-full px-2.5 py-1 text-xs font-medium transition"
            >
              {style.emoji} {family}
            </button>
          );
        })}
      </div>
    </div>
  );
}
