import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog-posts";
import { SEOPageLayout } from "@/components/layout/SEOPageLayout";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { AuthorCard } from "@/components/seo/AuthorCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export const revalidate = 86400;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 5)
    .map((p) => ({ title: p.title, href: `/blog/${p.slug}`, category: p.category }));

  return (
    <SEOPageLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: post.title },
      ]}
      relatedPages={relatedPosts}
      showTOC={false}
    >
      <ArticleSchema
        title={post.title}
        description={post.description}
        slug={post.slug}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        authorName={post.author}
      />

      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue">{post.category}</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">{post.readTime}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <span>By {post.author}</span>
          <span className="text-text-muted">&middot;</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </div>
      </header>

      <div
        className="prose-invert max-w-none text-text-secondary leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text-primary [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_strong]:text-text-primary [&_a]:text-accent-blue [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent-blue/30 [&_blockquote]:pl-4 [&_blockquote]:italic"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="flex flex-wrap gap-2 mt-10 mb-6">
        {post.tags.map((tag, i) => (
          <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-text-muted">#{tag}</span>
        ))}
      </div>

      <AuthorCard
        name={post.author}
        role="ShipSquad Team"
        bio="Building managed AI squads that ship production software. $99/mo for a full AI team."
        twitterUrl="https://x.com/shipsquad"
        linkedinUrl="https://linkedin.com/company/shipsquad"
      />
    </SEOPageLayout>
  );
}
