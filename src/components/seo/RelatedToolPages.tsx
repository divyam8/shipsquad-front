import Link from "next/link";
import { tools } from "@/data/tools";
import { comparisons } from "@/data/comparisons";

interface Props {
  toolSlug: string;
  currentPageType: "review" | "pricing" | "alternative" | "compare";
}

export function RelatedToolPages({ toolSlug, currentPageType }: Props) {
  const tool = tools.find((t) => t.slug === toolSlug);
  if (!tool) return null;

  const links = [];

  if (currentPageType !== "review" && tool.hasReviewPage)
    links.push({ href: `/review/${toolSlug}`, label: `${tool.name} Review` });
  if (currentPageType !== "pricing" && tool.hasPricingPage)
    links.push({ href: `/pricing/${toolSlug}`, label: `${tool.name} Pricing` });
  if (currentPageType !== "alternative" && tool.hasAlternativePage)
    links.push({ href: `/alternative/${toolSlug}`, label: `${tool.name} Alternatives` });

  const toolComparisons = comparisons
    .filter((c) => !c.isVsTraditional && (c.toolASlug === toolSlug || c.toolBSlug === toolSlug))
    .slice(0, 3);

  for (const comp of toolComparisons) {
    if (currentPageType !== "compare")
      links.push({ href: `/compare/${comp.slug}`, label: `${comp.toolA} vs ${comp.toolB}` });
  }

  if (links.length === 0) return null;

  return (
    <nav aria-label="Related pages" className="mt-8 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        More about {tool.name}
      </h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
