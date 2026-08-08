import { notFound } from "next/navigation";
import {
  getAllPerfumes,
  getPerfumeById,
  getRecommendationsFor,
  getExplanations,
  getNoteDescriptions,
} from "@/lib/data";
import PerfumeExperience from "@/components/perfume-experience/PerfumeExperience";

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

  return (
    <PerfumeExperience
      perfume={perfume}
      recommendations={recommendations}
      perfumesById={perfumesById}
      explanations={explanations}
      noteDescriptions={noteDescriptions}
    />
  );
}
