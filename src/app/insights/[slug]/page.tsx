import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { AuthorCard } from "@/components/seo/AuthorCard";

interface Props {
  params: Promise<{ slug: string }>;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getSupabase();
  const { data: article } = await supabase
    .from("articles")
    .select("title, description, published_at, keywords, author")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author],
      tags: article.keywords,
    },
  };
}

export const revalidate = 3600; // 1 hour ISR

export default async function InsightsArticlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = getSupabase();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) notFound();

  // Related articles by same domain
  const { data: related } = await supabase
    .from("articles")
    .select("slug, title, domain")
    .eq("status", "published")
    .eq("domain", article.domain)
    .neq("slug", slug)
    .order("composite_score", { ascending: false })
    .limit(5);

  const relatedPages = (related || []).map((r: any) => ({
    title: r.title,
    href: `/insights/${r.slug}`,
    category: r.domain || "AI",
  }));

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Insights", href: "/insights" },
        { label: article.title },
      ]}
      relatedPages={relatedPages}
      showTOC={false}
    >
      <ArticleSchema
        title={article.title}
        description={article.description}
        slug={article.slug}
        publishedAt={article.published_at}
        authorName={article.author}
        basePath="insights"
      />

      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {article.domain && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue">{article.domain}</span>
          )}
          {article.ai_tool && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">{article.ai_tool}</span>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">
            {Math.ceil(article.word_count / 200)} min read
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{article.title}</h1>
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <span>By {article.author}</span>
          <span className="text-text-muted">&middot;</span>
          <time dateTime={article.published_at}>
            {new Date(article.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </div>
      </header>

      <div
        className="prose-invert max-w-none text-text-secondary leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text-primary [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_strong]:text-text-primary [&_a]:text-accent-blue [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent-blue/30 [&_blockquote]:pl-4 [&_blockquote]:italic"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="flex flex-wrap gap-2 mt-10 mb-6">
        {(article.keywords || []).map((tag: string, i: number) => (
          <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">#{tag}</span>
        ))}
      </div>

      <AuthorCard
        name={article.author}
        role="ShipSquad AI Insights"
        bio="AI-powered analysis of the latest developments in artificial intelligence, tailored for your industry."
        twitterUrl="https://x.com/shipsquad_ai"
        linkedinUrl="https://linkedin.com/company/shipsquad"
      />
    </SEOPageLayout>
  );
}
