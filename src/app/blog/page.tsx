import type { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";

export const metadata: Metadata = {
  title: "ShipSquad Blog — AI Agents, Automation & Building with AI",
  description: "Insights on AI agents, multi-agent systems, automation, and building production software with AI squads. Guides, comparisons, and industry analysis.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 86400;

export default function BlogIndex() {
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const categories = [...new Set(blogPosts.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

        <h1 className="text-4xl font-bold mb-4">ShipSquad Blog</h1>
        <p className="text-lg text-text-secondary mb-10">
          Insights on AI agents, automation, and building with managed AI squads.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <span key={cat} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.05] text-text-secondary border border-white/[0.05]">
              {cat}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="group rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 hover:border-accent-blue/20 transition-all">
              <div className="flex gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">{post.category}</span>
                <span className="text-xs text-text-muted">{post.readTime}</span>
              </div>
              <h2 className="font-semibold text-text-primary group-hover:text-accent-blue transition-colors mb-2 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm text-text-secondary line-clamp-3 mb-3">{post.description}</p>
              <time className="text-xs text-text-muted" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </time>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
