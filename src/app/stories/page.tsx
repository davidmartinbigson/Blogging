import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { PostCard } from "@/components/post-card";
import { getAllStories } from "@/lib/content";
import { buildMetadata, graph, itemListSchema } from "@/lib/seo";
import { siteConfig, storyCategory } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Story Studio — short fiction",
  description: storyCategory.description,
  path: "/stories",
});

export default function StoriesPage() {
  const stories = getAllStories();
  const [lead, ...rest] = stories;

  return (
    <>
      <JsonLd
        data={graph([
          itemListSchema(stories, "Story Studio", "/stories"),
          {
            "@type": "CollectionPage",
            "@id": `${siteConfig.url}/stories#collection`,
            name: storyCategory.name,
            description: storyCategory.intro,
            isPartOf: { "@id": `${siteConfig.url}/#website` },
          },
        ])}
      />

      <header className="relative overflow-hidden bg-[#14110d] text-[#f4eee4]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #C7952B33, transparent 45%), radial-gradient(circle at 85% 60%, #C7952B22, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="shell relative py-16 md:py-20">
          <p className="kicker text-[#d8a74a]">The Story Studio</p>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.1rem,1.5rem+2.6vw,3.4rem)] font-semibold leading-[1.05]">
            Short fiction for a short attention span
          </h1>
          <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-[#bfb5a6]">
            {storyCategory.intro}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#8f8677]">
            <span>{stories.length} stories</span>
            <span aria-hidden>·</span>
            <span>2–4 minutes each</span>
            <span aria-hidden>·</span>
            <Link href="/editorial-policy" className="text-[#d8a74a] hover:opacity-80">
              How these are made
            </Link>
          </div>
        </div>
      </header>

      <div className="shell py-12">
        {stories.length === 0 ? (
          <p className="text-sm text-muted">The first story is being edited. Check back soon.</p>
        ) : (
          <>
            {lead ? (
              <section className="border-b border-line pb-12">
                <PostCard doc={lead} variant="hero" />
              </section>
            ) : null}

            <section className="grid gap-x-8 gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((story) => (
                <PostCard key={story.slug} doc={story} />
              ))}
            </section>

            <aside className="mt-14 rounded-xl border border-gold/25 bg-gold/[0.04] p-6 text-sm leading-relaxed text-muted">
              <p className="kicker mb-2 text-gold">A note on how these are written</p>
              <p>
                Each story starts with a single image or question. Drafts are produced with AI
                assistance, then edited by a human for pacing, dialogue and consistency. We
                publish a story only when it would hold up without the technology behind it.
                <Link href="/editorial-policy" className="ml-1 text-ink underline decoration-gold underline-offset-4 hover:text-gold">
                  Read the full policy
                </Link>
                .
              </p>
            </aside>
          </>
        )}
      </div>
    </>
  );
}
