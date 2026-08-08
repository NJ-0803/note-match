export default function MiniBottle({ color, active }: { color: string; active: boolean }) {
  return (
    <div className="pointer-events-none flex flex-col items-center">
      <div
        className="h-3 w-5 rounded-t-sm"
        style={{ background: `color-mix(in srgb, ${color} 70%, #1a1815)` }}
      />
      <div
        className="h-24 w-14 rounded-lg"
        style={{
          background: `linear-gradient(155deg, color-mix(in srgb, ${color} 55%, transparent) 0%, color-mix(in srgb, ${color} 20%, transparent) 55%, transparent 100%)`,
          border: `1px solid color-mix(in srgb, ${color} 60%, transparent)`,
          boxShadow: active
            ? `0 0 40px 6px color-mix(in srgb, ${color} 45%, transparent)`
            : `0 0 16px 2px color-mix(in srgb, ${color} 20%, transparent)`,
        }}
      />
    </div>
  );
}
