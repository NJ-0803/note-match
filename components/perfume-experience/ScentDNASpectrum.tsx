"use client";

import { useId } from "react";
import { SCENT_AXES, computeScentProfile } from "@/lib/scentProfile";
import type { Perfume } from "@/types/perfume";

const SIZE = 320;
const CENTER = SIZE / 2;
const MAX_R = 118;
const RINGS = [1 / 3, 2 / 3, 1];

function pointOn(angle: number, radius: number): [number, number] {
  return [CENTER + radius * Math.sin(angle), CENTER - radius * Math.cos(angle)];
}

export default function ScentDNASpectrum({ perfume, color }: { perfume: Perfume; color: string }) {
  const glowId = useId();
  const profile = computeScentProfile(perfume);
  const n = SCENT_AXES.length;
  const angleStep = (Math.PI * 2) / n;

  const points = SCENT_AXES.map((axis, i) => {
    const angle = i * angleStep;
    const value = profile[axis];
    const r = (value / 10) * MAX_R;
    return { axis, value, angle, point: pointOn(angle, r) };
  });

  const polygon = points.map((p) => p.point.join(",")).join(" ");

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="shrink-0 overflow-visible">
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
          </filter>
        </defs>

        {RINGS.map((r) => (
          <circle
            key={r}
            cx={CENTER}
            cy={CENTER}
            r={MAX_R * r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
            opacity={0.5}
          />
        ))}

        {points.map(({ angle }, i) => {
          const [x, y] = pointOn(angle, MAX_R);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth={1}
              opacity={0.5}
            />
          );
        })}

        <polygon points={polygon} fill={color} opacity={0.16} filter={`url(#${glowId})`} />
        <polygon points={polygon} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.5} />

        {points.map(({ axis, point, value }, i) => (
          <circle key={axis} cx={point[0]} cy={point[1]} r={value > 0 ? 3.5 : 2} fill={color} opacity={value > 0 ? 1 : 0.35} />
        ))}

        {points.map(({ axis, angle }, i) => {
          const [x, y] = pointOn(angle, MAX_R + 24);
          return (
            <text
              key={axis}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fill: "var(--muted-foreground)",
              }}
            >
              {axis}
            </text>
          );
        })}
      </svg>

      <div className="grid w-full max-w-xs grid-cols-2 gap-x-6 gap-y-2 sm:w-auto">
        {points
          .slice()
          .sort((a, b) => b.value - a.value)
          .map(({ axis, value }) => (
            <div key={axis} className="flex items-baseline justify-between gap-3 font-mono text-xs">
              <span className="uppercase tracking-widest text-muted-foreground">{axis}</span>
              <span style={{ color }} className="tabular-nums">
                {value.toFixed(0)}/10
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
