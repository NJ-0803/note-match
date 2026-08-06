"use client";

import { useEffect, useRef, useState } from "react";
import { getNoteColor } from "@/lib/family";
import type { Perfume } from "@/types/perfume";

const TOTAL_HOURS = 8;

function intensity(hour: number, peakStart: number, peakEnd: number, fadeIn: number, fadeOut: number) {
  if (hour < peakStart) {
    return Math.max(0, 1 - (peakStart - hour) / fadeIn);
  }
  if (hour > peakEnd) {
    return Math.max(0, 1 - (hour - peakEnd) / fadeOut);
  }
  return 1;
}

function layerIntensity(layer: "top" | "heart" | "base", hour: number) {
  if (layer === "top") return intensity(hour, 0, 0.5, 0.1, 1.5);
  if (layer === "heart") return intensity(hour, 1, 3.5, 1, 2.5);
  return intensity(hour, 3, TOTAL_HOURS, 2, 3);
}

export default function NoteTimeline({ perfume }: { perfume: Perfume }) {
  const [hour, setHour] = useState(0.2);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const durationMs = 6000;
    function tick(now: number) {
      const elapsed = (now - start) % durationMs;
      setHour((elapsed / durationMs) * TOTAL_HOURS);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const layers: Array<{ key: "top" | "heart" | "base"; label: string; notes: string[] }> = [
    { key: "top", label: "Top", notes: perfume.topNotes },
    { key: "heart", label: "Heart", notes: perfume.heartNotes },
    { key: "base", label: "Base", notes: perfume.baseNotes },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          {playing ? "Pause" : "▶ Play wear timeline"}
        </button>
        <input
          type="range"
          min={0}
          max={TOTAL_HOURS}
          step={0.05}
          value={hour}
          onChange={(e) => {
            setPlaying(false);
            setHour(Number(e.target.value));
          }}
          className="flex-1"
        />
        <span className="w-16 text-right text-xs tabular-nums text-neutral-500">
          {hour < 1 ? `${Math.round(hour * 60)}m` : `${hour.toFixed(1)}h`}
        </span>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => (
          <div key={layer.key} className="flex items-center gap-2">
            <span className="w-12 shrink-0 text-xs font-medium text-neutral-500">{layer.label}</span>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {layer.notes.map((note) => {
                const { color, bg } = getNoteColor(note);
                const op = 0.15 + 0.85 * layerIntensity(layer.key, hour);
                return (
                  <span
                    key={note}
                    style={{ color, backgroundColor: bg, opacity: op, transform: `scale(${0.9 + 0.1 * op})` }}
                    className="rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150"
                  >
                    {note}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
