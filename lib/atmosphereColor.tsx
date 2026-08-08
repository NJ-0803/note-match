"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";

const DEFAULT_ATMOSPHERE_COLOR = "#c2a878";

interface AtmosphereColorApi {
  color: string;
  setColor: (color: string | null, key: string) => void;
}

const AtmosphereColorContext = createContext<AtmosphereColorApi | null>(null);

/** Lets any page push a tint into the global atmosphere (e.g. a perfume's
 * family color) without each page having to mount its own background layer.
 * Entries are keyed so the most recently mounted caller wins, and removing
 * a key falls back to whatever's left (or the default accent). */
export function AtmosphereColorProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Record<string, string>>({});
  const order = Object.keys(entries);
  const color = order.length > 0 ? entries[order[order.length - 1]] : DEFAULT_ATMOSPHERE_COLOR;

  const setColor = useCallback((next: string | null, key: string) => {
    setEntries((prev) => {
      if (next === null) {
        if (!(key in prev)) return prev;
        const { [key]: _omit, ...rest } = prev;
        return rest;
      }
      if (prev[key] === next) return prev;
      return { ...prev, [key]: next };
    });
  }, []);

  const value = useMemo(() => ({ color, setColor }), [color, setColor]);

  return <AtmosphereColorContext.Provider value={value}>{children}</AtmosphereColorContext.Provider>;
}

export function useAtmosphereColor(): string {
  const ctx = useContext(AtmosphereColorContext);
  return ctx?.color ?? DEFAULT_ATMOSPHERE_COLOR;
}

/** Call from any client page/component to tint the global atmosphere while
 * mounted; automatically reverts on unmount. Pass null to temporarily stop
 * contributing without unmounting. */
export function useSetAtmosphereColor(color: string | null) {
  const ctx = useContext(AtmosphereColorContext);
  const key = useId();

  useEffect(() => {
    if (!ctx) return;
    ctx.setColor(color, key);
    return () => ctx.setColor(null, key);
  }, [ctx, color, key]);
}
