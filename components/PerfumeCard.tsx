import Link from "next/link";
import type { Perfume } from "@/types/perfume";
import { FAMILY_STYLES, PRICE_TIER_LABELS } from "@/lib/family";
import CollectionButton from "./CollectionButton";
import MatchTags from "./MatchTags";

export default function PerfumeCard({
  perfume,
  sharedNotes,
  explanation,
  matchScore,
}: {
  perfume: Perfume;
  sharedNotes?: string[];
  explanation?: string;
  matchScore?: number;
}) {
  const family = FAMILY_STYLES[perfume.family];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/perfume/${perfume.id}`} className="group">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{perfume.brand}</p>
          <h3 className="text-lg font-semibold text-neutral-900 group-hover:underline dark:text-neutral-50">
            {perfume.name}
          </h3>
        </Link>
        {matchScore != null && (
          <span className="shrink-0 rounded-full bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
            {Math.round(matchScore * 100)}% match
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
        <span
          style={{ color: family.color, backgroundColor: family.bg }}
          className="rounded-full px-2 py-0.5 font-medium"
        >
          {family.emoji} {perfume.family}
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {PRICE_TIER_LABELS[perfume.priceTier]}
        </span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {perfume.gender}
        </span>
      </div>

      {(sharedNotes?.length || explanation) && (
        <MatchTags sharedNotes={sharedNotes ?? []} explanation={explanation} />
      )}

      <div className="mt-3">
        <CollectionButton id={perfume.id} />
      </div>
    </div>
  );
}
