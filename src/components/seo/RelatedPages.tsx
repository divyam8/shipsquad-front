interface RelatedPage {
  title: string;
  href: string;
  category?: string;
}

interface RelatedPagesProps {
  pages: RelatedPage[];
  title?: string;
}

export function RelatedPages({
  pages,
  title = "Related Pages",
}: RelatedPagesProps) {
  if (pages.length === 0) return null;

  return (
    <aside className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {pages.map((page, index) => (
          <li key={index}>
            <a
              href={page.href}
              className="group flex items-start gap-2 text-sm text-text-secondary hover:text-accent-blue transition-colors"
            >
              <span className="text-text-muted group-hover:text-accent-blue mt-0.5">
                &rarr;
              </span>
              <span>
                {page.title}
                {page.category && (
                  <span className="ml-1.5 text-xs text-text-muted">
                    ({page.category})
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
