import NoteTags from "./NoteTags";

export default function MatchTags({
  sharedNotes,
  explanation,
}: {
  sharedNotes: string[];
  explanation?: string;
}) {
  if (sharedNotes.length === 0 && !explanation) return null;
  return (
    <div className="mt-2 space-y-1.5 border-t border-dashed border-neutral-200 pt-2 dark:border-neutral-700">
      {sharedNotes.length > 0 && (
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            Why it matched
          </p>
          <NoteTags notes={sharedNotes} />
        </div>
      )}
      {explanation && <p className="text-xs text-neutral-500 dark:text-neutral-400">{explanation}</p>}
    </div>
  );
}
