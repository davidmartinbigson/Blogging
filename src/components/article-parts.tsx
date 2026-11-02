import Image from "next/image";
import Link from "next/link";
import type { Doc, DocSummary } from "@/lib/types";
import { getAuthor, getCategory } from "@/lib/site";
import { cn, formatDateLong } from "@/lib/utils";
import { ArrowRightIcon, ChevronLeftIcon } from "./icons";
import { NewsletterForm } from "./newsletter-form";

export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] uppercase tracking-[0.1em] text-faint">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span className="hidden max-w-[18rem] truncate text-ink-soft sm:inline" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-ink">
                  {item.name}
                </Link>
              )}
              {!last ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ArticleMeta({ doc }: { doc: Doc | DocSummary }) {
  const author = getAuthor(doc.author);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.78rem] text-muted">
      <span className="flex items-center gap-2">
        <span
          className="grid size-7 place-items-center rounded-full text-[0.6rem] font-semibold text-white"
          style={{ background: `linear-gradient(140deg, ${author.from}, ${author.to})` }}
          aria-hidden
        >
          {author.initials}
        </span>
        <Link href={`/authors/${author.slug}`} className="font-medium text-ink-soft hover:text-accent">
          {author.name}
        </Link>
      </span>
      <span aria-hidden className="h-3 w-px bg-line-strong" />
      <time dateTime={doc.date}>{formatDateLong(doc.date)}</time>
      <span aria-hidden className="h-3 w-px bg-line-strong" />
      <span>{doc.readingTime} min read</span>
      {doc.updated && doc.updated !== doc.date ? (
        <>
          <span aria-hidden className="h-3 w-px bg-line-strong" />
          <span className="text-sage">Updated {formatDateLong(doc.updated)}</span>
        </>
      ) : null}
    </div>
  );
}

export function FaqSection({ items }: { items: Array<{ question: string; answer: string }> }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-14 border-t border-line pt-8">
      <h2 id="faq-heading" className="font-serif text-2xl font-semibold text-ink">
        Frequently asked questions
      </h2>
      <div className="mt-5 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
              <span className="font-sans text-[0.95rem] font-medium text-ink">{item.question}</span>
              <span
                className="mt-0.5 shrink-0 text-faint transition-transform group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <p className="mt-2.5 max-w-prose font-sans text-sm leading-relaxed text-muted">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function AuthorBox({ doc }: { doc: Doc | DocSummary }) {
  const author = getAuthor(doc.author);
  return (
    <aside className="mt-12 rounded-xl border border-line bg-surface-muted p-6">
      <div className="flex items-start gap-4">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-full font-serif text-sm text-white"
          style={{ background: `linear-gradient(140deg, ${author.from}, ${author.to})` }}
          aria-hidden
        >
          {author.initials}
        </span>
        <div>
          <p className="kicker text-faint">Written by</p>
          <h2 className="mt-1 font-serif text-lg font-semibold text-ink">
            <Link href={`/authors/${author.slug}`} className="hover:text-accent">
              {author.name}
            </Link>
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{author.bio}</p>
          <Link
            href="/editorial-policy"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-accent"
          >
            How we research and edit
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function PrevNext({
  previous,
  next,
}: {
  previous?: DocSummary;
  next?: DocSummary;
}) {
  if (!previous && !next) return null;
  const href = (doc: DocSummary) => (doc.kind === "story" ? `/stories/${doc.slug}` : `/blog/${doc.slug}`);

  return (
    <nav aria-label="More articles" className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
      {previous ? (
        <Link
          href={href(previous)}
          className="group rounded-lg border border-line p-4 transition-colors hover:border-line-strong"
        >
          <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.12em] text-faint">
            <ChevronLeftIcon className="size-3" /> Newer
          </span>
          <span className="mt-1 block font-serif text-base font-medium leading-snug text-ink group-hover:text-accent">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={href(next)}
          className="group rounded-lg border border-line p-4 text-right transition-colors hover:border-line-strong"
        >
          <span className="flex items-center justify-end gap-1 text-[0.65rem] uppercase tracking-[0.12em] text-faint">
            Older <ArrowRightIcon className="size-3" />
          </span>
          <span className="mt-1 block font-serif text-base font-medium leading-snug text-ink group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

export function NewsletterBand({ compact = false }: { compact?: boolean }) {
  return (
    <section className={cn("border-y border-line bg-paper-deep", compact ? "py-10" : "py-14")}>
      <div className="shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-lg">
          <p className="kicker text-accent">The Sunday Letter</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight text-ink">
            One useful idea, once a week
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            A single piece from the archive plus one thing worth trying. No noise, no
            upsells, unsubscribing takes one click.
          </p>
        </div>
        <NewsletterForm className="w-full md:w-auto md:min-w-[22rem]" cta="Subscribe" />
      </div>
    </section>
  );
}

export function CategoryHeader({
  slug,
  count,
  latestDate,
  cover,
}: {
  slug: string;
  count: number;
  latestDate?: string;
  cover?: { image?: string; imageAlt?: string; title: string; slug: string };
}) {
  const category = getCategory(slug);
  if (!category) return null;

  return (
    <header className="relative overflow-hidden border-b border-line bg-paper-deep">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${category.from}, ${category.to})` }}
        aria-hidden
      />
      <div className="shell grid gap-10 py-12 md:py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span
              className="grid size-11 place-items-center rounded-full font-serif text-xl text-white"
              style={{ background: `linear-gradient(140deg, ${category.from}, ${category.to})` }}
              aria-hidden
            >
              {category.glyph}
            </span>
            <div>
              <p className="kicker text-faint">Section</p>
              <h1 className="font-serif text-[clamp(1.7rem,1.3rem+1.6vw,2.6rem)] font-semibold leading-tight text-ink">
                {category.name}
              </h1>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted md:text-[0.97rem]">{category.intro}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-faint">
            {count} {count === 1 ? "article" : "articles"}
            {latestDate ? ` · Updated ${formatDateLong(latestDate)}` : ""}
          </p>
        </div>

        {cover?.image ? (
          <Link
            href={`/blog/${cover.slug}`}
            className="group relative block overflow-hidden rounded-xl border border-line"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={cover.image}
                alt={cover.imageAlt ?? cover.title}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-white/70">Latest</p>
                <p className="mt-1 font-serif text-base font-semibold leading-snug text-white">
                  {cover.title}
                </p>
              </div>
            </div>
          </Link>
        ) : null}
      </div>
    </header>
  );
}
