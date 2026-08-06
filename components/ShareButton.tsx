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
      className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
    >
      📤 {label}
    </button>
  );
}
