import { siteConfig } from "@/lib/site";

/**
 * ads.txt tells ad exchanges which sellers are authorised to sell this site's
 * inventory. AdSense publishes the exact line to paste in your account; this
 * route emits it automatically once NEXT_PUBLIC_ADSENSE_CLIENT is set.
 */
export const dynamic = "force-static";

export function GET() {
  const client = siteConfig.adsenseClient;
  const publisherId = client.replace(/^ca-/, "");

  if (!publisherId) {
    return new Response("# ads.txt — add NEXT_PUBLIC_ADSENSE_CLIENT to generate this file\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
