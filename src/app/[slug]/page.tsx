import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { NewsletterBand } from "@/components/article-parts";
import { getStaticPage, staticPages } from "@/lib/pages";
import { buildMetadata, graph } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { formatDateLong } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return staticPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getStaticPage(slug);
  if (!page) return { title: "Page not found" };
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
  });
}

export default async function StaticContentPage({ params }: Params) {
  const { slug } = await params;
  const page = getStaticPage(slug);
  if (!page) notFound();

  const sidebarPages = staticPages.filter((item) => item.showInSidebar);

  return (
    <>
      <JsonLd
        data={graph([
          {
            "@type": "WebPage",
            "@id": `${siteConfig.url}/${page.slug}#webpage`,
            url: `${siteConfig.url}/${page.slug}`,
            name: page.title,
            description: page.description,
            dateModified: page.updated,
            isPartOf: { "@id": `${siteConfig.url}/#website` },
          },
        ])}
      />

      <header className="border-b border-line bg-paper-deep">
        <div className="shell py-12 md:py-16">
          <p className="kicker text-accent">{page.kicker}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2rem,1.5rem+2vw,3rem)] font-semibold leading-[1.12] text-ink">
            {page.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-muted">{page.intro}</p>
          <p className="mt-5 text-xs uppercase tracking-[0.12em] text-faint">
            Last updated {formatDateLong(page.updated)}
          </p>
        </div>
      </header>

      <div className="shell grid gap-12 py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <p className="kicker mb-3 text-faint">Sage &amp; Story</p>
          <ul className="space-y-2 text-sm">
            {sidebarPages.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${item.slug}`}
                  className={
                    item.slug === page.slug
                      ? "font-medium text-accent"
                      : "text-muted transition-colors hover:text-ink"
                  }
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg border border-line bg-surface-muted p-4 text-sm">
            <p className="font-medium text-ink">Spotted an error?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Corrections go to the front of the queue.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex text-xs font-medium text-ink underline decoration-accent underline-offset-4 hover:text-accent"
            >
              Contact the editors
            </Link>
          </div>
        </aside>

        <article className="max-w-[46rem]">
          {page.sections.map((section, index) => (
            <section key={section.heading} className={index === 0 ? "" : "mt-10"}>
              <h2 className="font-serif text-[1.4rem] font-semibold leading-snug text-ink">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3.5">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-[0.95rem] leading-[1.75] text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.list ? (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-muted">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </div>

      <NewsletterBand compact />
    </>
  );
}
