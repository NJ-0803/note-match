"use client";

export default function ShareButton({ perfumeId, label = "Share your matches" }: { perfumeId: string; label?: string }) {
  const imageUrl = `/api/og?id=${perfumeId}`;

  async function handleShare() {
    const absoluteUrl = `${window.location.origin}${imageUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My perfume matches", url: absoluteUrl });
        return;
      } catch {
        // user cancelled or share failed, fall through to opening the image
      }
    }
    window.open(imageUrl, "_blank");
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
    >
      📤 {label}
    </button>
  );
}
