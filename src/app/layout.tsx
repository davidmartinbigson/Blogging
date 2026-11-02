import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeScript } from "@/components/theme";
import { siteConfig } from "@/lib/site";
import { graph } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.publisher, url: siteConfig.url }],
  creator: siteConfig.publisher,
  publisher: siteConfig.publisher,
  keywords: [
    "recipes",
    "healthy living",
    "personal finance",
    "home improvement",
    "technology guides",
    "travel guides",
    "short stories",
  ],
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: `${siteConfig.name} — RSS` }],
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: "/og", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "lifestyle",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.name} — RSS`}
          href={absoluteUrl("/rss.xml")}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd data={graph([])} />
        <Analytics />
        {siteConfig.adsenseClient ? (
          <Script
            id="adsense-loader"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClient}`}
          />
        ) : null}
      </body>
    </html>
  );
}
