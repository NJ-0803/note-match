export default function StaticHeroFallback() {
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(ellipse 900px 600px at 50% 30%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%)",
      }}
    />
  );
}
