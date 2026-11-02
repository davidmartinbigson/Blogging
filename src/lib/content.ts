import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import type { ContentKind, Doc, DocSummary, FaqItem, Heading } from "./types";
import { countWords, readingTimeOf, slugify } from "./utils";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const FOLDERS: Record<ContentKind, string> = {
  post: "posts",
  story: "stories",
};

const isProduction = process.env.NODE_ENV === "production";
const memo = new Map<string, Doc[]>();

function folderFor(kind: ContentKind) {
  return path.join(CONTENT_ROOT, FOLDERS[kind]);
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function toFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const question = String(record.question ?? record.q ?? "").trim();
      const answer = String(record.answer ?? record.a ?? "").trim();
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is FaqItem => item !== null);
}

function normalizeDate(value: unknown, fallback: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  return fallback;
}

/**
 * Pull `##` and `###` headings out of the raw markdown so the table of
 * contents can be rendered on the server with matching anchor ids.
 */
function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  let insideFence = false;

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trimEnd();
    if (line.trimStart().startsWith("```")) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const match = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const level = match[1].length === 2 ? 2 : 3;
    const text = match[2].replace(/[*_`]/g, "").trim();
    if (!text) continue;

    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;
    headings.push({ id, text, level });
  }

  return headings;
}

function parseFile(kind: ContentKind, fileName: string): Doc | null {
  const fullPath = path.join(folderFor(kind), fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const slug = String(data.slug ?? fileName.replace(/\.mdx?$/, "")).trim();

  if (!data.title || !data.description || !data.category) {
    console.warn(`[content] Skipping ${fileName}: missing title, description or category.`);
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);
  const body = content.trim();

  return {
    slug,
    kind,
    title: String(data.title).trim(),
    description: String(data.description).trim(),
    date: normalizeDate(data.date, today),
    updated: data.updated ? normalizeDate(data.updated, today) : undefined,
    category: String(data.category).trim(),
    tags: toStringArray(data.tags),
    author: String(data.author ?? "editorial-desk").trim(),
    keywords: toStringArray(data.keywords),
    featured: Boolean(data.featured),
    trending: Boolean(data.trending),
    draft: Boolean(data.draft),
    image: data.image ? String(data.image) : undefined,
    imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
    faq: toFaq(data.faq),
    body,
    readingTime: readingTimeOf(body),
    wordCount: countWords(body),
    headings: extractHeadings(body),
  };
}

function readCollection(kind: ContentKind): Doc[] {
  const cacheKey = kind;
  if (isProduction && memo.has(cacheKey)) return memo.get(cacheKey)!;

  const dir = folderFor(kind);
  if (!fs.existsSync(dir)) return [];

  const docs = fs
    .readdirSync(dir)
    .filter((file) => /\.mdx?$/.test(file) && !file.startsWith("_"))
    .map((file) => parseFile(kind, file))
    .filter((doc): doc is Doc => doc !== null)
    .filter((doc) => isProduction ? !doc.draft : true)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

  if (isProduction) memo.set(cacheKey, docs);
  return docs;
}

const summary = (doc: Doc): DocSummary => {
  const { body: _body, ...rest } = doc;
  return rest;
};

export const getAllPosts = cache((): Doc[] => readCollection("post"));
export const getAllStories = cache((): Doc[] => readCollection("story"));

export const getAllDocs = cache((): Doc[] =>
  [...getAllPosts(), ...getAllStories()].sort((a, b) => (a.date < b.date ? 1 : -1)),
);

export const getAllPostsSummary = cache((): DocSummary[] => getAllPosts().map(summary));
export const getAllStoriesSummary = cache((): DocSummary[] => getAllStories().map(summary));
export const getAllDocsSummary = cache((): DocSummary[] => getAllDocs().map(summary));

export const getDoc = cache((kind: ContentKind, slug: string): Doc | undefined =>
  readCollection(kind).find((doc) => doc.slug === slug),
);

export function getPostsByCategory(category: string): Doc[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): Doc[] {
  return getAllPosts().filter((post) =>
    post.tags.some((item) => slugify(item) === slugify(tag)),
  );
}

export function getPostsByAuthor(author: string): Doc[] {
  return getAllDocs().filter((doc) => doc.author === author);
}

export function getAllTags(): { tag: string; slug: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, slug: slugify(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getFeatured(limit = 3): Doc[] {
  const posts = getAllPosts();
  const featured = posts.filter((post) => post.featured);
  const pool = featured.length >= limit ? featured : [...featured, ...posts.filter((p) => !p.featured)];
  return pool.slice(0, limit);
}

export function getTrending(limit = 5): Doc[] {
  const posts = getAllPosts();
  const trending = posts.filter((post) => post.trending);
  const pool = trending.length >= limit ? trending : [...trending, ...posts.filter((p) => !p.trending)];
  return pool.slice(0, limit);
}

export function getLatest(limit = 9, exclude: string[] = []): Doc[] {
  return getAllPosts()
    .filter((post) => !exclude.includes(post.slug))
    .slice(0, limit);
}

/**
 * Related posts: same category first, then shared tags, then recency.
 * Deterministic so the static build stays stable.
 */
export function getRelated(doc: Doc, limit = 3): DocSummary[] {
  const pool = doc.kind === "story" ? getAllStories() : getAllPosts();
  const scored = pool
    .filter((item) => item.slug !== doc.slug)
    .map((item) => {
      const sharedTags = item.tags.filter((tag) => doc.tags.includes(tag)).length;
      const score = (item.category === doc.category ? 3 : 0) + sharedTags * 2;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || (a.item.date < b.item.date ? 1 : -1));

  return scored.slice(0, limit).map(({ item }) => summary(item));
}

export function getNeighbours(doc: Doc) {
  const pool = doc.kind === "story" ? getAllStories() : getAllPosts();
  const index = pool.findIndex((item) => item.slug === doc.slug);
  return {
    previous: index > 0 ? summary(pool[index - 1]) : undefined,
    next: index >= 0 && index < pool.length - 1 ? summary(pool[index + 1]) : undefined,
  };
}

export function getArchive(): { year: string; docs: DocSummary[] }[] {
  const groups = new Map<string, DocSummary[]>();
  for (const doc of getAllDocs()) {
    const year = doc.date.slice(0, 4);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(summary(doc));
  }
  return [...groups.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([year, docs]) => ({ year, docs }));
}

/** Search index served to the client palette — intentionally tiny. */
export type SearchEntry = {
  t: string;
  d: string;
  u: string;
  c: string;
  k: string;
};

export function getSearchIndex(): SearchEntry[] {
  return getAllDocs().map((doc) => ({
    t: doc.title,
    d: doc.description,
    u: doc.kind === "story" ? `/stories/${doc.slug}` : `/blog/${doc.slug}`,
    c: doc.category,
    k: doc.tags.join(" "),
  }));
}
