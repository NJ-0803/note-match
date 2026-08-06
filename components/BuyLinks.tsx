import { getBuyLinks } from "@/lib/buyLinks";
import type { Perfume } from "@/types/perfume";

export default function BuyLinks({ perfume }: { perfume: Perfume }) {
  const links = getBuyLinks(perfume);
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.retailer}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
        >
          Check on {link.retailer}
        </a>
      ))}
    </div>
  );
}
