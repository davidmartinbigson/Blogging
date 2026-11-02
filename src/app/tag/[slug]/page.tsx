import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterBand } from "@/components/article-parts";
import { PostCard } from "@/components/post-card";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const match = getAllTags().find((tag) => tag.slug === slug);
  if (!match) return { title: "Topic not found" };
  return buildMetadata({
    title: `${match.tag} — articles`,
    description: `Every Sage & Story article tagged ${match.tag}, collected in one place.`,
    path: `/tag/${match.slug}`,
  });
}

export default async function TagPage({ params }: Params) {
  const { slug } = await params;
  const match = getAllTags().find((tag) => tag.slug === slug);
  if (!match) notFound();

  const posts = getPostsByTag(match.tag);
  const otherTags = getAllTags().filter((tag) => tag.slug !== slug).slice(0, 14);

  return (
    <>
      <header className="border-b border-line bg-paper-deep">
        <div className="shell py-12">
          <p className="kicker text-accent">Topic</p>
          <h1 className="mt-3 font-serif text-[clamp(1.9rem,1.5rem+1.8vw,2.8rem)] font-semibold leading-tight text-ink">
            {match.tag}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {posts.length} {posts.length === 1 ? "article" : "articles"} ·{" "}
            <Link href="/blog" className="underline decoration-line-strong underline-offset-4 hover:text-ink">
              browse everything
            </Link>
          </p>
        </div>
      </header>

      <div className="shell py-12">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((doc) => (
            <PostCard key={doc.slug} doc={doc} />
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="kicker mb-3 text-faint">Related topics</p>
          <div className="flex flex-wrap gap-2">
            {otherTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                {tag.tag}
                <span className="ml-1.5 text-faint">{tag.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <NewsletterBand compact />
    </>
  );
}
