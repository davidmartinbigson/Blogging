import { getSearchIndex } from "@/lib/content";

/** Pre-built at deploy time; the client fetches it on the first search only. */
export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  return Response.json(getSearchIndex(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
