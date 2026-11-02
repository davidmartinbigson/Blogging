import Link from "next/link";
import type { Metadata } from "next";
import { AdSlot } from "@/components/ad-slot";
import { CoverArt } from "@/components/cover-art";
import { ArrowRightIcon, ArrowUpRightIcon, BookIcon, SparkIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import {
  getAllPosts,
  getAllStories,
  getFeatured,
  getLatest,
  getTrending,
} from "@/lib/content";
import { categories, siteConfig, storyCategory } from "@/lib/site";
import { buildMetadata, graph, itemListSchema } from "@/lib/seo";
import { formatDateLong } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const posts = getAllPosts();
  const featured = getFeatured(3);
  const lead = featured[0];
  const secondary = featured.slice(1, 3);
  const trending = getTrending(5);
  const latest = getLatest(6, featured.map((post) => post.slug));
  const stories = getAllStories().slice(0, 3);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <JsonLd
        data={graph([
          itemListSchema(featured, "Featured stories", "/"),
          {
            "@type": "CollectionPage",
            "@id": `${siteConfig.url}/#home`,
            name: siteConfig.name,
            description: siteConfig.description,
            isPartOf: { "@id": `${siteConfig.url}/#website` },
            about: categories.map((category) => category.name),
          },
        ])}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Masthead                                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="border-b border-line">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3 text-[0.68rem] uppercase tracking-[0.14em] text-faint">
          <time dateTime={today}>{formatDateLong(today)}</time>
          <p className="hidden sm:block">Independent · Reader-supported · Human-edited</p>
          <p>
            <Link href="/archive" className="transition-colors hover:text-ink">
              Vol. {new Date().getFullYear() - siteConfig.foundingYear + 1} · No. {posts.length}
            </Link>
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Lead story                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="shell pb-4 pt-10 md:pt-14" aria-labelledby="lead-heading">
        <h1 id="lead-heading" className="sr-only">
          {siteConfig.name} — {siteConfig.tagline}
        </h1>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div className="fade-up">
            {lead ? (
              <PostCard doc={lead} variant="hero" priority />
            ) : (
              <p className="text-sm text-muted">No articles published yet.</p>
            )}
          </div>

          <aside className="lg:border-l lg:border-line lg:pl-10">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="kicker text-accent">Trending now</h2>
              <SparkIcon className="size-4 text-faint" />
            </div>
            <ol className="mt-1">
              {trending.map((doc, index) => (
                <li key={doc.slug} className="border-b border-line last:border-b-0">
                  <PostCard doc={doc} variant="compact" index={index} />
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <AdSlot placement="sidebar" minHeight={250} />
            </div>
          </aside>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Two secondary features                                            */}
      {/* ---------------------------------------------------------------- */}
      {secondary.length > 0 ? (
        <section className="shell pb-16 pt-10" aria-label="More editors' picks">
          <div className="grid gap-10 border-t border-line pt-10 sm:grid-cols-2">
            {secondary.map((doc) => (
              <PostCard key={doc.slug} doc={doc} variant="wide" />
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/* Sections                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-line bg-paper-deep">
        <div className="shell py-14">
          <SectionHeading
            kicker="Browse"
            title="Seven sections, one standard"
            description="Every guide is written for someone with a full schedule, then checked line by line before it goes live."
            href="/blog"
            linkLabel="All articles"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = posts.filter((post) => post.category === category.slug).length;
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-lg border border-line bg-surface p-5 card-lift"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: `linear-gradient(90deg, ${category.from}, ${category.to})` }}
                    aria-hidden
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-ink">{category.name}</h3>
                      <p className="mt-1.5 line-clamp-2 text-[0.83rem] leading-relaxed text-muted">
                        {category.description}
                      </p>
                    </div>
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full font-serif text-lg text-white"
                      style={{ background: `linear-gradient(140deg, ${category.from}, ${category.to})` }}
                      aria-hidden
                    >
                      {category.glyph}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.12em] text-faint">
                    <span>
                      {count} {count === 1 ? "article" : "articles"}
                    </span>
                    <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}

            <Link
              href="/stories"
              className="group relative overflow-hidden rounded-lg border border-gold/30 bg-gold/5 p-5 card-lift"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink">{storyCategory.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-[0.83rem] leading-relaxed text-muted">
                    Short fiction drafted with AI, finished by a human editor.
                  </p>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-lg text-white">
                  {storyCategory.glyph}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.12em] text-gold">
                <span>{getAllStories().length} stories</span>
                <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>

            <Link
              href="/blog"
              className="group flex flex-col justify-between rounded-lg border border-line bg-surface p-5 card-lift"
            >
              <div>
                <p className="kicker text-accent">Everything</p>
                <h3 className="mt-2 font-serif text-lg font-semibold text-ink">
                  Browse all {getAllPosts().length} guides
                </h3>
                <p className="mt-1.5 text-[0.83rem] leading-relaxed text-muted">
                  The full archive, newest first, filterable by section and topic.
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between text-[0.7rem] uppercase tracking-[0.12em] text-faint">
                <span>All articles</span>
                <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Latest                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="shell py-16" aria-labelledby="latest-heading">
        <SectionHeading
          kicker="Fresh from the desk"
          title="The latest"
          href="/blog"
          linkLabel="See everything"
        />
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((doc) => (
            <PostCard key={doc.slug} doc={doc} />
          ))}
        </div>

        <div className="mt-14 hidden justify-center md:flex">
          <AdSlot placement="footer" minHeight={120} format="horizontal" />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Story studio                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-[#14110d] text-[#f4eee4]" aria-labelledby="stories-heading">
        <div className="shell py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-5">
            <div>
              <p className="kicker text-[#d8a74a]">The Story Studio</p>
              <h2
                id="stories-heading"
                className="mt-2 font-serif text-[clamp(1.6rem,1.2rem+1.4vw,2.3rem)] font-semibold leading-tight"
              >
                Short fiction, read in one sitting
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#bfb5a6]">
                Two or three minutes of atmosphere — drafted with AI, edited by a human, and
                published only when it earns its place.
              </p>
            </div>
            <Link
              href="/stories"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-medium transition-colors hover:border-[#d8a74a] hover:text-[#d8a74a]"
            >
              Enter the studio
              <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <article key={story.slug} className="group">
                <Link href={`/stories/${story.slug}`} className="block">
                  <div className="overflow-hidden rounded-lg border border-white/10">
                    <CoverArt
                      category={story.category}
                      seedKey={story.slug}
                      ratio="aspect-[3/2]"
                      glyphClassName="text-6xl"
                      className="transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-4 text-[0.65rem] uppercase tracking-[0.16em] text-[#d8a74a]">
                    Fiction · {story.readingTime} min
                  </p>
                  <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug">
                    <span className="underline-sweep">{story.title}</span>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#bfb5a6]">
                    {story.description}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Standards + newsletter                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="shell grid gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <div>
          <p className="kicker text-accent">Why read here</p>
          <h2 className="mt-2 font-serif text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-semibold leading-tight text-ink">
            Slow enough to be right, fast enough to load
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {siteConfig.name} is a small editorial studio. We publish fewer pieces than a
            content farm, and every one of them goes through the same three steps.
          </p>

          <ol className="mt-7 space-y-5">
            {[
              {
                title: "Research first",
                body: "Claims are checked against primary sources — studies, official guidance, manufacturer documentation — before drafting begins.",
              },
              {
                title: "Edited by a human",
                body: "AI helps us draft and restructure. A person decides what gets published, and rewrites anything that reads like a machine.",
              },
              {
                title: "Kept current",
                body: "Guides carry a visible last-updated date. When something changes, we revise the article rather than writing a new one.",
              },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line font-serif text-sm text-accent">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-base font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href="/editorial-policy"
            className="group mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
          >
            Read the editorial policy
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-line bg-surface p-7 shadow-card md:p-9">
          <BookIcon className="size-6 text-accent" />
          <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-ink">
            One good idea, every Sunday
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-muted">
            The Sunday Letter is a short read: one piece from the archive, one recipe or
            routine worth trying, and nothing else. Free, and one click to leave.
          </p>
          <NewsletterForm className="mt-6" cta="Join free" />
          <p className="mt-3 text-xs text-faint">
            No spam, ever. Read our{" "}
            <Link href="/privacy-policy" className="underline decoration-line-strong underline-offset-2 hover:text-ink">
              privacy policy
            </Link>
            .
          </p>
          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center">
            {[
              { value: `${posts.length}`, label: "Guides" },
              { value: `${getAllStories().length}`, label: "Stories" },
              { value: "0", label: "Pop-ups" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl text-ink">{stat.value}</p>
                <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-faint">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
