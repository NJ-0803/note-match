"use client";

import { useEffect, useState } from "react";
import { getStatus, setStatus, type CollectionStatus } from "@/lib/collection";

export default function CollectionButton({ id }: { id: string }) {
  const [status, setLocalStatus] = useState<CollectionStatus | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocalStatus(getStatus(id));
    setMounted(true);
  }, [id]);

  if (!mounted) return <div className="h-8" />;

  function toggle(next: CollectionStatus) {
    const value = status === next ? null : next;
    setStatus(id, value);
    setLocalStatus(value);
  }

  const baseBtn =
    "rounded-full px-3 py-1.5 text-xs font-medium transition border";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => toggle("own")}
        className={`${baseBtn} ${
          status === "own"
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-neutral-300 text-neutral-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-neutral-700 dark:text-neutral-300"
        }`}
      >
        {status === "own" ? "✓ Own it" : "Own it"}
      </button>
      <button
        type="button"
        onClick={() => toggle("want")}
        className={`${baseBtn} ${
          status === "want"
            ? "border-amber-600 bg-amber-600 text-white"
            : "border-neutral-300 text-neutral-600 hover:border-amber-600 hover:text-amber-700 dark:border-neutral-700 dark:text-neutral-300"
        }`}
      >
        {status === "want" ? "✓ Want to try" : "Want to try"}
      </button>
    </div>
  );
}
