import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { getAllPosts, getDoc, getNeighbours, getRelated } from "@/lib/content";
import { getCategory } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getDoc("post", slug);
  if (!post) return { title: "Article not found" };

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
    keywords: [...post.keywords, ...post.tags],
    image: post.image,
  });
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getDoc("post", slug);
  if (!post) notFound();

  const related = getRelated(post, 3);
  const neighbours = getNeighbours(post);
  const category = getCategory(post.category);

  return (
    <ArticleView
      doc={post}
      related={related}
      neighbours={neighbours}
      basePath="/blog"
      sectionName={category?.name ?? "Article"}
    />
  );
}
