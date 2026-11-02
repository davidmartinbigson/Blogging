import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AdSlot } from "@/components/ad-slot";
import { CategoryTiles } from "@/components/category-tiles";
import { ArrowRightIcon, ArrowUpRightIcon, BookIcon, SparkIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { NewsletterForm } from "@/components/newsletter-form";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { getAllPosts, getAllStories, getFeatured, getLatest, getTrending } from "@/lib/content";
import { categories, siteConfig } from "@/lib/site";
import { buildMetadata, graph, itemListSchema } from "@/lib/seo";
import { formatDateLong } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const posts = getAllPosts();
  const stories = getAllStories();
  const featured = getFeatured(4);
  const lead = featured[0];
  const picks = featured.slice(1, 4);
  const trending = getTrending(5);
  const latest = getLatest(6, featured.map((post) => post.slug));
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
      {/* Masthead strip                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="border-b border-line">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3 text-[0.66rem] uppercase tracking-[0.16em] text-faint">
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
      {/* Lead + trending                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="shell pb-10 pt-10 md:pt-12" aria-labelledby="lead-heading">
        <h1 id="lead-heading" className="sr-only">
          {siteConfig.name} — {siteConfig.tagline}
        </h1>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div className="fade-up">
            {lead ? (
              <PostCard doc={lead} variant="hero" priority />
            ) : (
              <p className="text-sm text-muted">No articles published yet.</p>
            )}
          </div>

          <aside className="lg:border-l lg:border-line lg:pl-9">
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
      {/* Editors' picks                                                    */}
      {/* ---------------------------------------------------------------- */}
      {picks.length > 0 ? (
        <section className="shell pb-16" aria-label="Editors' picks">
          <SectionHeading kicker="Editors’ picks" title="Worth your evening" href="/blog" linkLabel="All articles" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map((doc) => (
              <PostCard key={doc.slug} doc={doc} variant="feature" />
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
          <CategoryTiles posts={posts} storyCount={stories.length} storyCover={stories.find((s) => s.image)} />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Latest                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="shell py-16" aria-labelledby="latest-heading">
        <SectionHeading kicker="Fresh from the desk" title="The latest" href="/blog" linkLabel="See everything" />
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
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-5">
            <div>
              <p className="kicker text-[#d8a74a]">The Story Studio</p>
              <h2
                id="stories-heading"
                className="mt-2 font-serif text-[clamp(1.6rem,1.2rem+1.4vw,2.3rem)] font-semibold leading-tight"
              >
                Short fiction, read in one sitting
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#bfb5a6]">
                Two or three minutes of atmosphere — drafted with AI, edited by a human, published
                only when it earns its place.
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
            {stories.slice(0, 3).map((story) => (
              <article key={story.slug} className="group">
                <Link href={`/stories/${story.slug}`} className="block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-white/10">
                    {story.image ? (
                      <Image
                        src={story.image}
                        alt={story.imageAlt ?? story.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(150deg, #C7952B, #7A5410)" }}
                        aria-hidden
                      />
                    )}
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
            {siteConfig.name} is a small editorial studio. We publish fewer pieces than a content
            farm, and every one of them goes through the same three steps.
          </p>

          <ol className="mt-7 space-y-5">
            {[
              {
                title: "Research first",
                body: "Claims are checked against primary sources — studies, official guidance, manufacturer documentation — and linked at the end of each article.",
              },
              {
                title: "Edited by a human",
                body: "AI helps us draft and restructure. A person decides what gets published, and rewrites anything that reads like a machine.",
              },
              {
                title: "Kept current",
                body: "Guides carry a visible last-updated date. When something changes, we revise the article rather than writing a new one about it.",
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
            The Sunday Letter is a short read: one piece from the archive, one recipe or routine
            worth trying, and nothing else. Free, and one click to leave.
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
              { value: `${stories.length}`, label: "Stories" },
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

      <div className="shell hidden justify-center pb-8 lg:flex">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          Browse all {posts.length} guides
          <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </>
  );
}
