import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ShipSquad — Your AI Squad, Your Mission",
    template: "%s | ShipSquad",
  },
  description:
    "Build a team of specialized AI agents working together on ANY goal. 10 pre-built specialists + custom agents. $99/mo. Your AI squad, your mission.",
  metadataBase: new URL("https://shipsquad.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ShipSquad — Your AI Squad, Your Mission",
    description:
      "Build a team of specialized AI agents working together on ANY goal. 10 pre-built specialists + custom agents. $99/mo.",
    url: "https://shipsquad.ai",
    siteName: "ShipSquad",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShipSquad — Your AI Squad, Your Mission",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipSquad — Your AI Squad, Your Mission",
    description:
      "Build a team of specialized AI agents working together on ANY goal. 10 pre-built specialists + custom agents. $99/mo.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShipSquad",
    url: "https://shipsquad.ai",
    description:
      "Build a team of specialized AI agents working together on ANY goal. Your AI squad, your mission.",
    logo: "https://shipsquad.ai/logo.png",
    sameAs: [
      "https://x.com/shipsquad",
      "https://linkedin.com/company/shipsquad",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShipSquad",
    url: "https://shipsquad.ai",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://shipsquad.ai/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
