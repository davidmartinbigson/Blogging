import Link from "next/link";
import { categories } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="kicker text-accent">Error 404</p>
      <h1 className="mt-4 max-w-xl font-serif text-[clamp(2rem,1.5rem+2vw,3rem)] font-semibold leading-tight text-ink">
        This page went to press without us
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        The link may be old, or the article may have moved. Start from a section instead — the
        good stuff is never more than one click away.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="rounded-full border border-line px-3.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            {category.shortName}
          </Link>
        ))}
        <Link
          href="/stories"
          className="rounded-full border border-gold/40 px-3.5 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
        >
          Stories
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-4 text-sm">
        <Link href="/" className="font-medium text-ink underline decoration-accent underline-offset-4 hover:text-accent">
          Go home
        </Link>
        <Link href="/search" className="text-muted hover:text-ink">
          Search the site
        </Link>
      </div>
    </div>
  );
}
