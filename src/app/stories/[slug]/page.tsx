import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { getAllStories, getDoc, getNeighbours, getRelated } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const story = getDoc("story", slug);
  if (!story) return { title: "Story not found" };

  return buildMetadata({
    title: story.title,
    description: story.description,
    path: `/stories/${story.slug}`,
    type: "article",
    publishedTime: story.date,
    modifiedTime: story.updated ?? story.date,
    keywords: [...story.keywords, ...story.tags],
    image: story.image,
  });
}

export default async function StoryPage({ params }: Params) {
  const { slug } = await params;
  const story = getDoc("story", slug);
  if (!story) notFound();

  return (
    <ArticleView
      doc={story}
      related={getRelated(story, 3)}
      neighbours={getNeighbours(story)}
      basePath="/stories"
      sectionName="Story Studio"
    />
  );
}
