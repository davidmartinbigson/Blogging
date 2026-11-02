import type { MetadataRoute } from "next";
import { getAllPosts, getAllStories, getAllTags } from "@/lib/content";
import { allCategories, authors } from "@/lib/site";
import { staticPages } from "@/lib/pages";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const stories = getAllStories();
  const tags = getAllTags();

  const newest = posts[0]?.updated ?? posts[0]?.date ?? new Date().toISOString().slice(0, 10);
  const asDate = (value: string) => new Date(`${value}T12:00:00Z`);

  const core: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: asDate(newest), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/blog"), lastModified: asDate(newest), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/stories"), lastModified: asDate(newest), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/archive"), lastModified: asDate(newest), changeFrequency: "weekly", priority: 0.5 },
    { url: absoluteUrl("/authors"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/newsletter"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = allCategories.map((category) => ({
    url: absoluteUrl(category.slug === "stories" ? "/stories" : `/category/${category.slug}`),
    lastModified: asDate(newest),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: asDate(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const storyEntries: MetadataRoute.Sitemap = stories.map((story) => ({
    url: absoluteUrl(`/stories/${story.slug}`),
    lastModified: asDate(story.updated ?? story.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: absoluteUrl(`/tag/${tag.slug}`),
    lastModified: asDate(newest),
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const authorEntries: MetadataRoute.Sitemap = authors.map((author) => ({
    url: absoluteUrl(`/authors/${author.slug}`),
    changeFrequency: "monthly",
    priority: 0.3,
  }));

  const pageEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: absoluteUrl(`/${page.slug}`),
    lastModified: asDate(page.updated),
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [
    ...core,
    ...categoryEntries,
    ...postEntries,
    ...storyEntries,
    ...tagEntries,
    ...authorEntries,
    ...pageEntries,
  ];
}
