import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterBand } from "@/components/article-parts";
import { PostCard } from "@/components/post-card";
import { getFeatured, getAllPosts, getAllTags } from "@/lib/content";
import { categories, siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "All articles",
  description:
    "Every guide, explainer and recipe on Sage & Story — organised by section and updated regularly.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featured = getFeatured(2);
  const rest = posts.filter((post) => !featured.some((item) => item.slug === post.slug));
  const tags = getAllTags().slice(0, 12);

  return (
    <>
      <header className="border-b border-line">
        <div className="shell py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker text-accent">The archive</p>
              <h1 className="mt-3 font-serif text-[clamp(2rem,1.5rem+2.2vw,3.1rem)] font-semibold leading-[1.1] text-ink">
                All articles
              </h1>
              <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
                {posts.length} published guides across {categories.length} sections. Everything
                here is written to be read once and used many times.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/archive"
                className="rounded-full border border-line px-3.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                By date
              </Link>
              <Link
                href="/stories"
                className="rounded-full border border-gold/40 px-3.5 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
              >
                Fiction
              </Link>
            </div>
          </div>

          <nav aria-label="Filter by section" className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper"
            >
              Everything
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-full border border-line px-3.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                {category.shortName}
                <span className="ml-1.5 text-faint">
                  {posts.filter((post) => post.category === category.slug).length}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {featured.length > 0 ? (
        <section className="shell pt-12" aria-label="Featured">
          <div className="grid gap-10 border-b border-line pb-12 sm:grid-cols-2">
            {featured.map((doc) => (
              <PostCard key={doc.slug} doc={doc} variant="wide" />
            ))}
          </div>
        </section>
      ) : null}

      <section className="shell py-12">
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {rest.map((doc) => (
              <PostCard key={doc.slug} doc={doc} />
            ))}
          </div>

          <aside className="space-y-8">
            <div className="rounded-lg border border-line bg-surface-muted p-5">
              <p className="kicker mb-3 text-faint">Popular topics</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="rounded-full border border-line bg-surface px-2.5 py-1 text-[0.7rem] text-ink-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    {tag.tag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-line p-5">
              <p className="kicker text-accent">Start here</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                New to the site? The editorial policy explains how we research, edit and
                correct everything you read here.
              </p>
              <Link
                href="/editorial-policy"
                className="mt-3 inline-flex text-xs font-medium text-ink underline decoration-accent underline-offset-4 hover:text-accent"
              >
                Read our standards
              </Link>
            </div>

            <div className="rounded-lg border border-line p-5">
              <p className="kicker text-faint">Visit a section</p>
              <ul className="mt-3 space-y-2 text-sm">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="flex items-center justify-between text-muted transition-colors hover:text-accent"
                    >
                      {category.name}
                      <span className="text-faint" aria-hidden>
                        {category.glyph}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <NewsletterBand compact />
      <p className="shell py-8 text-center text-xs text-faint">
        {siteConfig.name} publishes {posts.length} guides. Everything is free to read.
      </p>
    </>
  );
}
