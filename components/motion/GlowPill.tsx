/** Rounded pill with an ambient glow that breathes at rest, so the search
 * inputs read as interactive against the busy hero background instead of
 * blending in - snaps to a steady stronger glow once actually focused.
 * Pulse is a pure CSS animation (see .glow-pill in globals.css) so it's
 * already running on first paint, not waiting on a JS animation loop. */
export default function GlowPill({
  focused,
  className = "",
  children,
}: {
  focused: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`glow-pill rounded-full border bg-surface/90 backdrop-blur-sm ${
        focused ? "is-focused" : "border-border"
      } ${className}`}
    >
      {children}
    </div>
  );
}
