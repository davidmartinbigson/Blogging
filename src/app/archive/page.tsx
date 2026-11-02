import type { Metadata } from "next";
import Link from "next/link";
import { getArchive } from "@/lib/content";
import { getCategory } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Archive",
  description: "Every piece published on Sage & Story, newest first and organised by year.",
  path: "/archive",
});

export default function ArchivePage() {
  const archive = getArchive();
  const total = archive.reduce((sum, group) => sum + group.docs.length, 0);

  return (
    <>
      <header className="border-b border-line bg-paper-deep">
        <div className="shell py-12 md:py-16">
          <p className="kicker text-accent">Archive</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,1.5rem+2vw,3rem)] font-semibold leading-tight text-ink">
            Everything, by date
          </h1>
          <p className="mt-3 text-sm text-muted">
            {total} pieces across {archive.length} {archive.length === 1 ? "year" : "years"}.
          </p>
        </div>
      </header>

      <div className="shell max-w-3xl py-12">
        {archive.map((group) => (
          <section key={group.year} className="mb-12">
            <div className="mb-4 flex items-baseline gap-4 border-b border-line pb-2">
              <h2 className="font-serif text-2xl font-semibold text-ink">{group.year}</h2>
              <span className="text-xs text-faint">{group.docs.length} pieces</span>
            </div>
            <ul className="divide-y divide-line/70">
              {group.docs.map((doc) => (
                <li key={`${doc.kind}-${doc.slug}`}>
                  <Link
                    href={doc.kind === "story" ? `/stories/${doc.slug}` : `/blog/${doc.slug}`}
                    className="group flex flex-wrap items-baseline justify-between gap-2 py-3"
                  >
                    <span className="font-serif text-base text-ink group-hover:text-accent">
                      {doc.title}
                    </span>
                    <span className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.1em] text-faint">
                      <span>{getCategory(doc.category)?.shortName ?? doc.category}</span>
                      <time dateTime={doc.date}>{formatDate(doc.date)}</time>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
