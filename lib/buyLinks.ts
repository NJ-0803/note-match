import type { Perfume } from "@/types/perfume";

export interface BuyLink {
  retailer: string;
  url: string;
}

export function getBuyLinks(perfume: Perfume): BuyLink[] {
  const query = encodeURIComponent(`${perfume.brand} ${perfume.name}`);

  return [
    { retailer: "Nykaa", url: `https://www.nykaa.com/search/result/?q=${query}` },
    { retailer: "Amazon.in", url: `https://www.amazon.in/s?k=${query}` },
    { retailer: "Myntra", url: `https://www.myntra.com/${query}` },
    { retailer: "Flipkart", url: `https://www.flipkart.com/search?q=${query}` },
    { retailer: "TataCliq", url: `https://www.tatacliq.com/search/?searchCategory=all&text=${query}` },
    { retailer: "Ajmal Perfumes", url: `https://www.ajmalperfume.com/search?q=${query}` },
  ];
}
