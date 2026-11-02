import { getAllDocs } from "@/lib/content";
import { getCategory, siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const docs = getAllDocs().slice(0, 50);
  const updated = docs[0] ? new Date(`${docs[0].date}T12:00:00Z`).toUTCString() : new Date().toUTCString();

  const items = docs
    .map((doc) => {
      const url = absoluteUrl(doc.kind === "story" ? `/stories/${doc.slug}` : `/blog/${doc.slug}`);
      return `    <item>
      <title>${escapeXml(doc.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${doc.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(doc.description)}</description>
      <category>${escapeXml(getCategory(doc.category)?.name ?? doc.category)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — ${escapeXml(siteConfig.tagline)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${updated}</lastBuildDate>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
