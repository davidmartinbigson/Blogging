import type { Metadata } from "next";
import Link from "next/link";
import { SearchExplorer } from "@/components/search-explorer";
import { getAllTags } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search every guide, recipe, explainer and story on Sage & Story.",
  path: "/search",
  noIndex: true,
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const tags = getAllTags().slice(0, 10);

  return (
    <div className="shell max-w-3xl py-12 md:py-16">
      <p className="kicker text-accent">Search</p>
      <h1 className="mt-3 font-serif text-[clamp(1.9rem,1.5rem+1.8vw,2.7rem)] font-semibold leading-tight text-ink">
        Find the thing you were looking for
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Search titles, descriptions and tags across every section.
      </p>

      <div className="mt-8">
        <SearchExplorer initialQuery={q ?? ""} />
      </div>

      <div className="mt-12 border-t border-line pt-6">
        <p className="kicker mb-3 text-faint">Popular topics</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              {tag.tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
