import Link from "next/link";
import type { Metadata } from "next";
import { getPostsByAuthor } from "@/lib/content";
import { authors } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Authors & editors",
  description:
    "The people accountable for what gets published on Sage & Story, and how we use AI in the process.",
  path: "/authors",
});

export default function AuthorsPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="shell py-12 md:py-16">
          <p className="kicker text-accent">Masthead</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,1.5rem+2vw,3rem)] font-semibold leading-tight text-ink">
            The people behind the words
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            Every article carries a named byline. These are the desks that write, research and
            edit for Sage &amp; Story.
          </p>
        </div>
      </header>

      <div className="shell grid gap-6 py-12 md:grid-cols-2">
        {authors.map((author) => {
          const count = getPostsByAuthor(author.slug).length;
          return (
            <article key={author.slug} className="rounded-xl border border-line bg-surface p-6 card-lift">
              <div className="flex items-start gap-4">
                <span
                  className="grid size-12 shrink-0 place-items-center rounded-full font-serif text-base text-white"
                  style={{ background: `linear-gradient(140deg, ${author.from}, ${author.to})` }}
                  aria-hidden
                >
                  {author.initials}
                </span>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-ink">
                    <Link href={`/authors/${author.slug}`} className="hover:text-accent">
                      {author.name}
                    </Link>
                  </h2>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.1em] text-faint">{author.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{author.bio}</p>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs">
                <span className="text-faint">
                  {count} {count === 1 ? "piece" : "pieces"}
                </span>
                <Link href={`/authors/${author.slug}`} className="font-medium text-ink hover:text-accent">
                  Read their work
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
