import Link from "next/link";
import { AdSlot } from "./ad-slot";
import {
  ArticleMeta,
  AuthorBox,
  Breadcrumbs,
  FaqSection,
  NewsletterBand,
  PrevNext,
} from "./article-parts";
import { CoverArt } from "./cover-art";
import { MdxContent } from "./mdx-content";
import { PostCard, CategoryChip } from "./post-card";
import { ReadingProgress } from "./reading-progress";
import { ShareButtons } from "./share-buttons";
import { TableOfContents, TableOfContentsMobile } from "./table-of-contents";
import { JsonLd } from "./json-ld";
import type { Doc, DocSummary } from "@/lib/types";
import { getCategory, siteConfig } from "@/lib/site";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  graph,
} from "@/lib/seo";
import { absoluteUrl, cn, slugify } from "@/lib/utils";

export function ArticleView({
  doc,
  related,
  neighbours,
  basePath,
  sectionName,
}: {
  doc: Doc;
  related: DocSummary[];
  neighbours: { previous?: DocSummary; next?: DocSummary };
  basePath: "/blog" | "/stories";
  sectionName: string;
}) {
  const category = getCategory(doc.category);
  const isStory = doc.kind === "story";
  const path = `${basePath}/${doc.slug}`;
  const url = absoluteUrl(path);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    ...(isStory
      ? [
          { name: "Story Studio", path: "/stories" },
          { name: doc.title, path },
        ]
      : [
          { name: category?.name ?? doc.category, path: `/category/${doc.category}` },
          { name: doc.title, path },
        ]),
  ];

  return (
    <>
      <JsonLd
        data={graph([
          articleSchema(doc),
          breadcrumbSchema(
            breadcrumbs.map((crumb) => ({ name: crumb.name, path: crumb.path })),
          ),
          faqSchema(doc.faq),
        ])}
      />
      <ReadingProgress />

      <article itemScope itemType="https://schema.org/Article">
        <div className="shell pt-7">
          <Breadcrumbs items={breadcrumbs} />

          <header className={cn("max-w-3xl", isStory && "mx-auto text-center")}>
            <div className={cn("flex items-center gap-3", isStory && "justify-center")}>
              <CategoryChip slug={doc.category} solid={!isStory} />
              {isStory ? (
                <span className="kicker text-gold">Fiction · {doc.readingTime} min</span>
              ) : (
                <span className="kicker text-faint">{doc.readingTime} min read</span>
              )}
            </div>

            <h1
              className="mt-5 font-serif text-[clamp(2rem,1.4rem+2.4vw,3.15rem)] font-semibold leading-[1.08] text-ink"
              itemProp="headline"
            >
              {doc.title}
            </h1>

            <p
              className={cn(
                "mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-muted md:text-[1.08rem]",
                isStory && "mx-auto italic",
              )}
              itemProp="description"
            >
              {doc.description}
            </p>

            <div className={cn("mt-6", isStory && "flex justify-center")}>
              <ArticleMeta doc={doc} />
            </div>
          </header>

          <figure
            className={cn(
              "mt-9 overflow-hidden rounded-xl border border-line",
              isStory ? "mx-auto max-w-4xl" : "",
            )}
          >
            <CoverArt
              category={doc.category}
              seedKey={doc.slug}
              ratio="aspect-[2/1]"
              glyphClassName="text-[10rem]"
            />
            <figcaption className="sr-only">{doc.imageAlt ?? `Cover art for ${doc.title}`}</figcaption>
          </figure>
        </div>

        <div className="shell grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <div className={cn(isStory && "mx-auto w-full max-w-[42rem]")}>
            <TableOfContentsMobile headings={doc.headings} />

            <div className="article-body" itemProp="articleBody">
              <MdxContent source={doc.body} />
            </div>

            {!isStory ? (
              <div className="mt-12">
                <AdSlot placement="inArticle" minHeight={280} format="fluid" />
              </div>
            ) : null}

            <FaqSection items={doc.faq} />

            {doc.tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                <span className="kicker text-faint">Filed under</span>
                {doc.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${slugify(tag)}`}
                    className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            ) : null}

            <div className="mt-8 border-t border-line pt-6">
              <ShareButtons url={url} title={doc.title} />
            </div>

            <AuthorBox doc={doc} />
            <PrevNext previous={neighbours.previous} next={neighbours.next} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-8">
              <TableOfContents headings={doc.headings} />

              <div className="rounded-lg border border-line bg-surface-muted p-4">
                <p className="kicker mb-2 text-faint">Share this piece</p>
                <ShareButtons url={url} title={doc.title} compact />
              </div>

              <AdSlot placement="sidebar" minHeight={250} />

              <div className="rounded-lg border border-line p-4">
                <p className="kicker text-accent">The Sunday Letter</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  One good idea from the archive, every Sunday.
                </p>
                <Link
                  href="/newsletter"
                  className="mt-3 inline-flex text-xs font-medium text-ink underline decoration-accent underline-offset-4 hover:text-accent"
                >
                  Subscribe free
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section className="shell pb-16" aria-labelledby="related-heading">
            <div className="mb-7 flex items-end justify-between border-b border-line pb-4">
              <h2
                id="related-heading"
                className="font-serif text-[clamp(1.4rem,1.2rem+1vw,1.85rem)] font-semibold text-ink"
              >
                {isStory ? "More from the studio" : "Keep reading"}
              </h2>
              <Link
                href={isStory ? "/stories" : "/blog"}
                className="text-xs font-medium text-ink-soft hover:text-accent"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.slug} doc={item} />
              ))}
            </div>
          </section>
        ) : null}

        <NewsletterBand compact />
      </article>

      <p className="shell py-8 text-center text-[0.7rem] leading-relaxed text-faint">
        This article is for general information only and does not replace professional advice.
        Read our{" "}
        <Link href="/disclaimer" className="underline underline-offset-2 hover:text-ink">
          full disclaimer
        </Link>{" "}
        and{" "}
        <Link href="/editorial-policy" className="underline underline-offset-2 hover:text-ink">
          editorial policy
        </Link>
        . {sectionName} · {siteConfig.name}
      </p>
    </>
  );
}
