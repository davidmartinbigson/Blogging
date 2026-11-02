import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { getPostsByAuthor } from "@/lib/content";
import { authors, getAuthor } from "@/lib/site";
import { buildMetadata, graph, personSchema } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!authors.some((item) => item.slug === slug)) return { title: "Author not found" };
  return buildMetadata({
    title: `${author.name} — ${author.role}`,
    description: author.bio,
    path: `/authors/${author.slug}`,
  });
}

export default async function AuthorPage({ params }: Params) {
  const { slug } = await params;
  if (!authors.some((item) => item.slug === slug)) notFound();

  const author = getAuthor(slug);
  const pieces = getPostsByAuthor(slug);

  return (
    <>
      <JsonLd data={graph([personSchema(author.slug)])} />

      <header className="border-b border-line bg-paper-deep">
        <div className="shell py-12 md:py-16">
          <div className="flex flex-wrap items-start gap-6">
            <span
              className="grid size-16 shrink-0 place-items-center rounded-full font-serif text-xl text-white"
              style={{ background: `linear-gradient(140deg, ${author.from}, ${author.to})` }}
              aria-hidden
            >
              {author.initials}
            </span>
            <div className="max-w-2xl">
              <p className="kicker text-accent">{author.role}</p>
              <h1 className="mt-2 font-serif text-[clamp(1.9rem,1.5rem+1.8vw,2.7rem)] font-semibold leading-tight text-ink">
                {author.name}
              </h1>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{author.bio}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-faint">
                {pieces.length} published {pieces.length === 1 ? "piece" : "pieces"} ·{" "}
                <Link href="/editorial-policy" className="hover:text-ink">
                  Editorial policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="shell py-12">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {pieces.map((doc) => (
            <PostCard key={`${doc.kind}-${doc.slug}`} doc={doc} />
          ))}
        </div>
        {pieces.length === 0 ? (
          <p className="text-sm text-muted">Nothing published under this byline yet.</p>
        ) : null}
      </div>
    </>
  );
}
