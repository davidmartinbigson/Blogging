import Image from "next/image";
import Link from "next/link";
import type { DocSummary } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { getCategory } from "@/lib/site";
import { CoverArt } from "./cover-art";

type Variant = "default" | "hero" | "wide" | "compact" | "mini" | "story" | "feature";

export function hrefFor(doc: DocSummary) {
  return doc.kind === "story" ? `/stories/${doc.slug}` : `/blog/${doc.slug}`;
}

/** Photo when the post has one, generative art otherwise. */
export function DocThumb({
  doc,
  ratio = "aspect-[16/10]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className,
  zoom = true,
  glyphClassName,
}: {
  doc: DocSummary;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  zoom?: boolean;
  glyphClassName?: string;
}) {
  if (!doc.image) {
    return (
      <CoverArt
        category={doc.category}
        seedKey={doc.slug}
        ratio={ratio}
        showLabel={false}
        glyphClassName={glyphClassName ?? "text-6xl"}
        className={cn(zoom && "transition-transform duration-700 group-hover:scale-[1.04]", className)}
      />
    );
  }

  return (
    <div className={cn("relative isolate overflow-hidden bg-paper-deep", ratio, className)}>
      <Image
        src={doc.image}
        alt={doc.imageAlt ?? doc.title}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-cover",
          zoom && "transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]",
        )}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70"
        aria-hidden
      />
    </div>
  );
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
      <span aria-hidden className="text-[0.7em]">
        {cat.glyph}
      </span>
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
    <div className={cn("flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted", className)}>
      {showDate ? (
        <>
          <time dateTime={doc.date}>{formatDate(doc.date)}</time>
          <span aria-hidden className="text-faint">
            ·
          </span>
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
  priority?: boolean;
  index?: number;
}) {
  const href = hrefFor(doc);
  const cat = getCategory(doc.category);

  if (variant === "compact") {
    return (
      <article className="group relative flex gap-3.5 border-b border-line py-4 last:border-b-0">
        {typeof index === "number" ? (
          <span className="w-5 shrink-0 pt-1 font-serif text-lg text-faint" aria-hidden>
            {index + 1}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[0.975rem] font-semibold leading-snug text-ink">
            <Link href={href} className="underline-sweep">
              {doc.title}
            </Link>
          </h3>
          <PostMeta doc={doc} className="mt-1.5" />
        </div>
        {doc.image ? (
          <Link href={href} className="w-16 shrink-0 overflow-hidden rounded-md" tabIndex={-1} aria-hidden>
            <div className="relative aspect-square">
              <Image src={doc.image} alt="" fill sizes="64px" className="object-cover" />
            </div>
          </Link>
        ) : null}
      </article>
    );
  }

  if (variant === "mini") {
    return (
      <article className="group flex gap-3">
        <Link href={href} className="w-20 shrink-0 overflow-hidden rounded-md" tabIndex={-1} aria-hidden>
          <DocThumb doc={doc} ratio="aspect-square" sizes="80px" />
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
          <DocThumb doc={doc} ratio="aspect-[3/2]" glyphClassName="text-6xl" />
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
      <article className="group grid gap-7 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <Link
          href={href}
          className="block overflow-hidden rounded-xl border border-line"
          aria-hidden
          tabIndex={-1}
        >
          <DocThumb
            doc={doc}
            ratio="aspect-[4/3]"
            sizes="(min-width: 1024px) 55vw, 100vw"
            priority
            glyphClassName="text-[9rem]"
          />
        </Link>
        <div>
          <div className="mb-4 flex items-center gap-3">
            <CategoryChip slug={doc.category} solid />
            <span className="kicker text-faint">Editor&apos;s pick</span>
          </div>
          <h2 className="font-serif text-[clamp(1.8rem,1.2rem+1.9vw,2.75rem)] font-semibold leading-[1.06] text-ink">
            <Link href={href} className="underline-sweep">
              {doc.title}
            </Link>
          </h2>
          <p className="mt-4 max-w-prose text-[1rem] leading-relaxed text-muted">{doc.description}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-soft">
              {cat?.shortName ?? doc.category}
            </span>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <PostMeta doc={doc} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "feature") {
    return (
      <article className="group relative isolate overflow-hidden rounded-xl border border-line">
        <Link href={href} className="block" tabIndex={-1} aria-label={doc.title}>
          <DocThumb doc={doc} ratio="aspect-[4/5]" sizes="(min-width: 1024px) 30vw, 100vw" />
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 pt-16 text-white">
          <div className="kicker mb-2 text-white/70">{cat?.name ?? doc.category}</div>
          <h3 className="font-serif text-xl font-semibold leading-tight">
            <Link href={href} className="pointer-events-auto underline-sweep">
              {doc.title}
            </Link>
          </h3>
          <p className="mt-2 text-[0.7rem] uppercase tracking-[0.1em] text-white/60">
            {doc.readingTime} min read
          </p>
        </div>
      </article>
    );
  }

  if (variant === "wide") {
    return (
      <article className="group grid gap-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center">
        <Link href={href} className="block overflow-hidden rounded-lg" aria-hidden tabIndex={-1}>
          <DocThumb doc={doc} ratio="aspect-[16/11]" sizes="(min-width: 640px) 240px, 100vw" glyphClassName="text-5xl" />
        </Link>
        <div>
          <CategoryChip slug={doc.category} className="mb-2" />
          <h3 className="font-serif text-xl font-semibold leading-snug text-ink md:text-[1.35rem]">
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
        <DocThumb doc={doc} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      </Link>
      <div className="flex flex-1 flex-col">
        <CategoryChip slug={doc.category} className="mb-2.5 self-start" />
        <h3 className="font-serif text-[1.3rem] font-semibold leading-[1.22] text-ink">
          <Link href={href} className="underline-sweep">
            {doc.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.9rem] leading-relaxed text-muted">{doc.description}</p>
        <PostMeta doc={doc} className="mt-auto pt-4" />
      </div>
    </article>
  );
}
