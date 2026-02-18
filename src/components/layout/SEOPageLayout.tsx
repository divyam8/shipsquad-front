import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { RelatedPages } from "@/components/seo/RelatedPages";
import { CTABanner } from "@/components/seo/CTABanner";
import { TableOfContents } from "@/components/seo/TableOfContents";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface RelatedPage {
  title: string;
  href: string;
  category?: string;
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface FurtherReadingLink {
  title: string;
  href: string;
  description?: string;
}

interface SEOPageLayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  relatedPages?: RelatedPage[];
  tocItems?: TOCItem[];
  ctaHeadline?: string;
  ctaDescription?: string;
  showCTA?: boolean;
  showTOC?: boolean;
  showRelated?: boolean;
  sidebar?: React.ReactNode;
  furtherReading?: FurtherReadingLink[];
}

export function SEOPageLayout({
  children,
  breadcrumbs,
  relatedPages = [],
  tocItems = [],
  ctaHeadline,
  ctaDescription,
  showCTA = true,
  showTOC = true,
  showRelated = true,
  sidebar,
  furtherReading = [],
}: SEOPageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <BreadcrumbNav items={breadcrumbs} />
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
          <div className="min-w-0">
            {showTOC && tocItems.length > 0 && (
              <TableOfContents items={tocItems} />
            )}
            <article className="prose-invert max-w-none">{children}</article>
            {furtherReading.length > 0 && (
              <section className="mt-12 rounded-xl border border-white/[0.05] bg-white/[0.02] p-6">
                <h2 className="text-lg font-bold text-text-primary mb-4">Further Reading</h2>
                <div className="space-y-3">
                  {furtherReading.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      className="group block rounded-lg border border-white/[0.03] bg-white/[0.01] p-3 hover:border-accent-blue/20 transition-colors"
                    >
                      <span className="text-sm font-medium text-text-primary group-hover:text-accent-blue transition-colors">
                        {link.title}
                      </span>
                      {link.description && (
                        <p className="text-xs text-text-muted mt-1">{link.description}</p>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            )}
            {showCTA && (
              <CTABanner
                headline={ctaHeadline}
                description={ctaDescription}
              />
            )}
          </div>
          {(showRelated || sidebar) && (
            <div className="hidden lg:block space-y-6 mt-8 lg:mt-0">
              {sidebar}
              {showRelated && relatedPages.length > 0 && (
                <RelatedPages pages={relatedPages} />
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
