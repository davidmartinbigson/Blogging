import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryHeader, NewsletterBand } from "@/components/article-parts";
import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { getPostsByCategory } from "@/lib/content";
import { allCategories, getCategory, siteConfig } from "@/lib/site";
import { buildMetadata, breadcrumbSchema, graph, itemListSchema } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allCategories
    .filter((category) => category.slug !== "stories")
    .map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Section not found" };
  return buildMetadata({
    title: `${category.name} — guides, recipes and explainers`,
    description: category.description,
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category || category.slug === "stories") notFound();

  const posts = getPostsByCategory(slug);
  const [lead, ...rest] = posts;
  const others = allCategories.filter((item) => item.slug !== slug);

  return (
    <>
      <JsonLd
        data={graph([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: category.name, path: `/category/${category.slug}` },
          ]),
          itemListSchema(posts, category.name, `/category/${category.slug}`),
          {
            "@type": "CollectionPage",
            "@id": `${siteConfig.url}/category/${category.slug}#collection`,
            name: category.name,
            description: category.intro,
            isPartOf: { "@id": `${siteConfig.url}/#website` },
          },
        ])}
      />

      <CategoryHeader
        slug={slug}
        count={posts.length}
        latestDate={posts[0]?.date}
        cover={posts.find((post) => post.image)}
      />

      <div className="shell py-12">
        {posts.length === 0 ? (
          <p className="text-sm text-muted">
            Nothing published in this section yet.{" "}
            <Link href="/blog" className="text-accent underline underline-offset-4">
              Browse everything
            </Link>
            .
          </p>
        ) : (
          <>
            {lead ? (
              <section className="border-b border-line pb-12" aria-label="Latest in section">
                <PostCard doc={lead} variant="hero" priority />
              </section>
            ) : null}

            <section className="grid gap-x-10 gap-y-12 pt-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
                {rest.map((doc) => (
                  <PostCard key={doc.slug} doc={doc} />
                ))}
              </div>

              <aside className="space-y-8">
                <div className="rounded-lg border border-line bg-surface-muted p-5">
                  <p className="kicker mb-2 text-faint">About this section</p>
                  <p className="text-sm leading-relaxed text-muted">{category.description}</p>
                </div>
                <AdSlot placement="sidebar" minHeight={250} />
                <div className="rounded-lg border border-line p-5">
                  <p className="kicker mb-3 text-faint">Other sections</p>
                  <ul className="space-y-2 text-sm">
                    {others.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={item.slug === "stories" ? "/stories" : `/category/${item.slug}`}
                          className="flex items-center justify-between text-muted transition-colors hover:text-accent"
                        >
                          {item.name}
                          <span className="text-faint" aria-hidden>
                            {item.glyph}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>

      <NewsletterBand compact />
    </>
  );
}
