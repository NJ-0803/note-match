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
    <div className="mt-2 space-y-1.5 border-t border-dashed border-border pt-2">
      {sharedNotes.length > 0 && (
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Why it matched
          </p>
          <NoteTags notes={sharedNotes} />
        </div>
      )}
      {explanation && <p className="text-xs text-muted-foreground">{explanation}</p>}
    </div>
  );
}
