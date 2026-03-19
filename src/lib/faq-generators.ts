import type { FAQItem } from "@/components/seo/FAQSchema";

interface ToolLike {
  name: string;
  slug: string;
  pricing: string;
  pricingDetail: string;
  rating: number;
  pros: string[];
  cons: string[];
  alternatives: string[];
  category: string;
  expertVerdict?: string;
}

export function generateReviewFAQs(tool: ToolLike): FAQItem[] {
  return [
    {
      question: `Is ${tool.name} free?`,
      answer: tool.pricing === "Free"
        ? `Yes, ${tool.name} is completely free to use.`
        : tool.pricing === "Freemium"
        ? `${tool.name} offers a free tier with limited features. Paid plans start at ${tool.pricingDetail.match(/\$\d+/)?.[0] || 'varies'}/month.`
        : `${tool.name} does not have a free plan. Pricing: ${tool.pricingDetail.split(',')[0]}.`,
    },
    {
      question: `What are the best alternatives to ${tool.name}?`,
      answer: `The top alternatives to ${tool.name} include ${tool.alternatives.slice(0, 3).join(", ")}. Each offers different strengths — see our full alternatives comparison.`,
    },
    {
      question: `What is ${tool.name} rated?`,
      answer: `${tool.name} is rated ${tool.rating}/5 by ShipSquad. Key strength: ${tool.pros[0]?.toLowerCase()}. Main limitation: ${tool.cons[0]?.toLowerCase()}.`,
    },
    {
      question: `Who should use ${tool.name}?`,
      answer: tool.expertVerdict?.slice(0, 200) || `${tool.name} is best for teams that need ${tool.pros[0]?.toLowerCase()}. It may not be ideal if you need ${tool.cons[0]?.toLowerCase()}.`,
    },
  ];
}

export function generateComparisonFAQs(toolA: string, toolB: string, verdict: string, category: string): FAQItem[] {
  return [
    {
      question: `Is ${toolA} better than ${toolB}?`,
      answer: verdict.slice(0, 200),
    },
    {
      question: `${toolA} vs ${toolB}: which is cheaper?`,
      answer: `Pricing varies by plan and team size. See our detailed pricing comparison above for the full breakdown of ${toolA} and ${toolB} plans.`,
    },
    {
      question: `Can I switch from ${toolA} to ${toolB}?`,
      answer: `Yes, most ${category} tools support data export. Check both tools' documentation for migration guides. Key factors: data portability, integration overlap, and team retraining time.`,
    },
    {
      question: `What do users say about ${toolA} vs ${toolB}?`,
      answer: `Users choosing between ${toolA} and ${toolB} typically prioritize different needs. See our feature-by-feature comparison and use-case recommendations above.`,
    },
  ];
}

export function generatePricingFAQs(tool: ToolLike): FAQItem[] {
  return [
    {
      question: `How much does ${tool.name} cost?`,
      answer: `${tool.name} pricing: ${tool.pricingDetail}. See the full plan comparison above for feature limits and hidden costs.`,
    },
    {
      question: `Does ${tool.name} have a free plan?`,
      answer: tool.pricing === "Free" || tool.pricing === "Freemium"
        ? `Yes, ${tool.name} offers a free tier. However, it has limitations — see the free tier breakdown above.`
        : `${tool.name} does not offer a free plan. The lowest tier starts at ${tool.pricingDetail.match(/\$\d+/)?.[0] || 'custom pricing'}.`,
    },
    {
      question: `Is ${tool.name} worth the price?`,
      answer: `At ${tool.rating}/5, ${tool.name} ${tool.rating >= 4 ? 'delivers strong value' : 'has room for improvement'}. ${tool.pros[0]}. Consider alternatives if: ${tool.cons[0]?.toLowerCase()}.`,
    },
  ];
}

export function generateAlternativeFAQs(tool: ToolLike, altNames: string[]): FAQItem[] {
  return [
    {
      question: `Why switch from ${tool.name}?`,
      answer: `Common reasons to switch from ${tool.name}: ${tool.cons.slice(0, 2).join(', ').toLowerCase()}. Top alternatives include ${altNames.slice(0, 3).join(', ')}.`,
    },
    {
      question: `What is the best ${tool.name} alternative?`,
      answer: `The best ${tool.name} alternative depends on your needs. ${altNames[0]} is our top pick for most users. See the full comparison above.`,
    },
    {
      question: `Are there free alternatives to ${tool.name}?`,
      answer: `Several ${tool.name} alternatives offer free tiers. Check pricing details in our comparison table above to find free options in the ${tool.category} category.`,
    },
  ];
}
