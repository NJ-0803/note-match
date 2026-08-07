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
          className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          Check on {link.retailer}
        </a>
      ))}
    </div>
  );
}
