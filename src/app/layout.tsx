import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShipSquad — Your AI Squad, Your Mission",
  description:
    "An AI-powered squad builds production software for you in 1-2 weeks. $99/mo. Join the mission.",
  metadataBase: new URL("https://shipsquad.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ShipSquad — Your AI Squad, Your Mission",
    description:
      "An AI-powered squad builds production software for you in 1-2 weeks. $99/mo. Join the mission.",
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
      "An AI-powered squad builds production software for you in 1-2 weeks. $99/mo. Join the mission.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShipSquad",
  url: "https://shipsquad.ai",
  description:
    "AI-powered squad that builds production software in 1-2 weeks. Your AI squad, your mission.",
  logo: "https://shipsquad.ai/logo.png",
};

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
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
