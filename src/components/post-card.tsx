import Link from "next/link";
import type { DocSummary } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { getCategory } from "@/lib/site";
import { CoverArt } from "./cover-art";

type Variant = "default" | "hero" | "wide" | "compact" | "mini" | "story";

function hrefFor(doc: DocSummary) {
  return doc.kind === "story" ? `/stories/${doc.slug}` : `/blog/${doc.slug}`;
}

export function CategoryChip({
  slug,
  className,
  solid = false,
}: {
  slug: string;
  className?: string;
  solid?: boolean;
}) {
  const cat = getCategory(slug);
  if (!cat) return null;
  return (
    <Link
      href={slug === "stories" ? "/stories" : `/category/${slug}`}
      className={cn(
        "kicker inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors",
        solid
          ? "bg-accent text-white hover:bg-accent-strong"
          : "bg-accent-soft text-accent hover:bg-accent hover:text-white",
        className,
      )}
    >
      <span aria-hidden className="text-[0.7em]">{cat.glyph}</span>
      {cat.shortName}
    </Link>
  );
}

export function PostMeta({
  doc,
  className,
  showDate = true,
}: {
  doc: DocSummary;
  className?: string;
  showDate?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted",
        className,
      )}
    >
      {showDate ? (
        <>
          <time dateTime={doc.date}>{formatDate(doc.date)}</time>
          <span aria-hidden className="text-faint">·</span>
        </>
      ) : null}
      <span>{doc.readingTime} min read</span>
    </div>
  );
}

export function PostCard({
  doc,
  variant = "default",
  priority: _priority = false,
  index,
}: {
  doc: DocSummary;
  variant?: Variant;
  /** Marks the card as the likely LCP element; cover art is CSS-only, so this
   *  only reserves above-the-fold rendering priority for future <Image> use. */
  priority?: boolean;
  index?: number;
}) {
  const href = hrefFor(doc);
  const cat = getCategory(doc.category);

  if (variant === "compact") {
    return (
      <article className="group relative flex gap-4 border-b border-line py-5 last:border-b-0">
        {typeof index === "number" ? (
          <span className="w-6 shrink-0 pt-0.5 font-serif text-xl text-faint" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        <div className="min-w-0">
          <CategoryChip slug={doc.category} className="mb-2" />
          <h3 className="font-serif text-[1.0625rem] font-semibold leading-snug text-ink">
            <Link href={href} className="underline-sweep">
              {doc.title}
            </Link>
          </h3>
          <PostMeta doc={doc} className="mt-1.5" />
        </div>
      </article>
    );
  }

  if (variant === "mini") {
    return (
      <article className="group flex gap-3">
        <Link href={href} className="w-20 shrink-0 overflow-hidden rounded-md" tabIndex={-1}>
          <CoverArt category={doc.category} seedKey={doc.slug} ratio="aspect-[4/3]" showLabel={false} glyphClassName="text-3xl" />
        </Link>
        <div className="min-w-0 pt-0.5">
          <h3 className="font-serif text-[0.95rem] font-semibold leading-snug text-ink">
            <Link href={href} className="underline-sweep">
              {doc.title}
            </Link>
          </h3>
          <PostMeta doc={doc} className="mt-1" />
        </div>
      </article>
    );
  }

  if (variant === "story") {
    return (
      <article className="group relative">
        <Link href={href} className="block overflow-hidden rounded-lg border border-line card-lift">
          <CoverArt category={doc.category} seedKey={doc.slug} ratio="aspect-[3/2]" glyphClassName="text-6xl" />
          <div className="bg-surface p-5">
            <div className="kicker mb-2 text-gold">Fiction · {doc.readingTime} min</div>
            <h3 className="font-serif text-xl font-semibold leading-tight text-ink">
              <span className="underline-sweep">{doc.title}</span>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{doc.description}</p>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "hero") {
    return (
      <article className="group grid gap-6 md:grid-cols-[1.15fr_1fr] md:items-center">
        <Link href={href} className="block overflow-hidden rounded-xl" aria-hidden tabIndex={-1}>
          <CoverArt
            category={doc.category}
            seedKey={doc.slug}
            ratio="aspect-[4/3]"
            glyphClassName="text-[9rem]"
            className="transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </Link>
        <div>
          <div className="mb-4 flex items-center gap-3">
            <CategoryChip slug={doc.category} solid />
            <span className="kicker text-faint">Editor&apos;s pick</span>
          </div>
          <h2 className="font-serif text-[clamp(1.7rem,1.2rem+1.8vw,2.6rem)] font-semibold leading-[1.1] text-ink">
            <Link href={href} className="underline-sweep">
              {doc.title}
            </Link>
          </h2>
          <p className="mt-4 max-w-prose text-[0.975rem] leading-relaxed text-muted">
            {doc.description}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-ink-soft">
              {cat?.shortName ?? doc.category}
            </span>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <PostMeta doc={doc} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "wide") {
    return (
      <article className="group grid gap-5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center">
        <Link href={href} className="block overflow-hidden rounded-lg" aria-hidden tabIndex={-1}>
          <CoverArt
            category={doc.category}
            seedKey={doc.slug}
            ratio="aspect-[16/10]"
            showLabel={false}
            glyphClassName="text-5xl"
            className="transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </Link>
        <div>
          <CategoryChip slug={doc.category} className="mb-2" />
          <h3 className="font-serif text-xl font-semibold leading-snug text-ink md:text-[1.4rem]">
            <Link href={href} className="underline-sweep">
              {doc.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{doc.description}</p>
          <PostMeta doc={doc} className="mt-3" />
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="mb-4 block overflow-hidden rounded-lg" aria-hidden tabIndex={-1}>
        <CoverArt
          category={doc.category}
          seedKey={doc.slug}
          ratio="aspect-[16/10]"
          showLabel={false}
          glyphClassName="text-6xl"
          className="transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <CategoryChip slug={doc.category} className="mb-2.5 self-start" />
        <h3 className="font-serif text-[1.3rem] font-semibold leading-[1.25] text-ink">
          <Link href={href} className="underline-sweep">
            {doc.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.9rem] leading-relaxed text-muted">{doc.description}</p>
        <PostMeta doc={doc} className="mt-4 pt-1" />
      </div>
    </article>
  );
}
