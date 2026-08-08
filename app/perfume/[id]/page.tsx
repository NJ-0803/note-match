import { notFound } from "next/navigation";
import {
  getAllPerfumes,
  getPerfumeById,
  getRecommendationsFor,
  getExplanations,
  getNoteDescriptions,
} from "@/lib/data";
import { FAMILY_STYLES, PRICE_TIER_LABELS } from "@/lib/family";
import PerfumeBottleLoader from "@/components/experience/PerfumeBottleLoader";
import NotePyramidChart from "@/components/NotePyramidChart";
import ScentRadarChart from "@/components/ScentRadarChart";
import NoteTimeline from "@/components/NoteTimeline";
import RecommendationsList from "@/components/RecommendationsList";
import BuyLinks from "@/components/BuyLinks";
import CollectionButton from "@/components/CollectionButton";
import ShareButton from "@/components/ShareButton";

export default async function PerfumePage({ params }: PageProps<"/perfume/[id]">) {
  const { id } = await params;
  const perfume = getPerfumeById(id);
  if (!perfume) notFound();

  const perfumes = getAllPerfumes();
  const perfumesById = Object.fromEntries(perfumes.map((p) => [p.id, p]));
  const recommendations = getRecommendationsFor(perfume.id);
  const explanations: Record<string, string> = {};
  const allExplanations = getExplanations();
  for (const rec of recommendations) {
    const text = allExplanations[`${perfume.id}::${rec.id}`];
    if (text) explanations[rec.id] = text;
  }
  const noteDescriptions = getNoteDescriptions();
  const allNotes = [...perfume.topNotes, ...perfume.heartNotes, ...perfume.baseNotes];
  const family = FAMILY_STYLES[perfume.family];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="order-2 h-[340px] sm:h-[420px] md:order-1">
          <PerfumeBottleLoader color={family.color} />
        </div>

        <div className="order-1 md:order-2">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{perfume.brand}</p>
          <h1 className="font-display text-4xl tracking-tight">{perfume.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span style={{ color: family.color, backgroundColor: family.bg }} className="rounded-full px-2 py-0.5 font-medium">
              {family.emoji} {perfume.family}
            </span>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted-foreground">
              {PRICE_TIER_LABELS[perfume.priceTier]}
            </span>
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted-foreground">
              {perfume.gender}
            </span>
          </div>
          {perfume.description && (
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">{perfume.description}</p>
          )}
          <div className="mt-5 flex flex-col items-start gap-2">
            <CollectionButton id={perfume.id} />
            <ShareButton perfumeId={perfume.id} />
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Note pyramid</h2>
        <NotePyramidChart perfume={perfume} />
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Scent DNA</h2>
        <ScentRadarChart perfumes={[perfume]} />
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">How it wears over time</h2>
        <NoteTimeline perfume={perfume} />
      </section>

      {allNotes.some((n) => noteDescriptions[n]) && (
        <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            What do these notes actually smell like?
          </h2>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[...new Set(allNotes)].map((note) =>
              noteDescriptions[note] ? (
                <div key={note}>
                  <dt className="text-sm font-semibold text-foreground">{note}</dt>
                  <dd className="text-sm text-muted-foreground">{noteDescriptions[note]}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Where to buy (India)</h2>
        <BuyLinks perfume={perfume} />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Similar perfumes</h2>
        <RecommendationsList
          recommendations={recommendations}
          perfumesById={perfumesById}
          explanations={explanations}
        />
      </section>
    </div>
  );
}
