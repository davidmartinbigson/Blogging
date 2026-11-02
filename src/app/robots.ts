import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/search"],
      },
      {
        // Media partners crawl these to place ads; allow them explicitly.
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
