interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  authorUrl?: string;
  imageUrl?: string;
}

export function ArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  authorName,
  authorUrl,
  imageUrl,
}: ArticleSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://shipsquad.ai/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "ShipSquad",
      url: "https://shipsquad.ai",
      logo: {
        "@type": "ImageObject",
        url: "https://shipsquad.ai/logo.png",
      },
    },
    image: imageUrl || "https://shipsquad.ai/og-image.png",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://shipsquad.ai/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
