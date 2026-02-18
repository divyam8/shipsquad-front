interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 mb-8">
      <h2 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
        Table of Contents
      </h2>
      <ol className="space-y-1.5">
        {items.map((item, index) => (
          <li
            key={index}
            style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
          >
            <a
              href={`#${item.id}`}
              className="text-sm text-text-secondary hover:text-accent-blue transition-colors"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
