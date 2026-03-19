/**
 * Extracts the lowest numeric price from a pricingDetail string.
 * Examples:
 *   "Free tier available, Plus at $20/mo" → "0"
 *   "From $20/mo" → "20"
 *   "Pro at $49/mo, Enterprise custom" → "49"
 */
export function extractLowestPrice(pricingDetail: string, pricingModel: string): string {
  if (pricingModel === "Free" || pricingModel === "Freemium" || /free/i.test(pricingDetail)) {
    return "0";
  }
  const matches = pricingDetail.match(/\$(\d+(?:\.\d+)?)/g);
  if (!matches || matches.length === 0) return "0";
  const prices = matches.map((m) => parseFloat(m.replace("$", ""))).filter((p) => p > 0);
  return prices.length > 0 ? String(Math.min(...prices)) : "0";
}

/**
 * Generates a short price hint for use in SERP titles.
 * "Free tier available, Plus at $20/mo" → "Free + $20/mo Pro"
 * "From $49/mo" → "From $49/mo"
 */
export function pricingHint(pricingDetail: string, pricingModel: string): string {
  const hasFree = pricingModel === "Free" || pricingModel === "Freemium" || /free/i.test(pricingDetail);
  const matches = pricingDetail.match(/\$\d+(?:\.\d+)?(?:\/\w+)?/g);
  const firstPrice = matches?.[0] || "";
  if (hasFree && firstPrice) return `Free + ${firstPrice}`;
  if (hasFree) return "Free Plan Available";
  if (firstPrice) return `From ${firstPrice}`;
  return "Custom Pricing";
}

/**
 * Builds a Google-compliant SoftwareApplication JSON-LD for a tool.
 */
export function buildSoftwareApplicationSchema(tool: {
  name: string;
  slug: string;
  description: string;
  category: string;
  pricing: string;
  pricingDetail: string;
  rating: number;
}) {
  const price = extractLowestPrice(tool.pricingDetail, tool.pricing);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    operatingSystem: "Web",
    image: `https://shipsquad.ai/og-image.png`,
    url: `https://shipsquad.ai/review/${tool.slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      bestRating: 5,
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
      description: tool.pricingDetail,
    },
    review: {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: tool.rating, bestRating: 5 },
      author: { "@type": "Organization", name: "ShipSquad" },
      publisher: { "@type": "Organization", name: "ShipSquad" },
    },
  };
}
