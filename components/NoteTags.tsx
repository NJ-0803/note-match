import { getNoteColor } from "@/lib/family";

export default function NoteTags({
  notes,
  highlight,
}: {
  notes: string[];
  highlight?: Set<string>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {notes.map((note) => {
        const { color, bg } = getNoteColor(note);
        const isHighlighted = highlight?.has(note.toLowerCase());
        return (
          <span
            key={note}
            style={{ color, backgroundColor: bg }}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              isHighlighted ? "ring-2 ring-offset-1 ring-current" : ""
            }`}
          >
            {note}
          </span>
        );
      })}
    </div>
  );
}
