export type ContentKind = "post" | "story";

export type FaqItem = {
  question: string;
  answer: string;
};

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type Doc = {
  slug: string;
  kind: ContentKind;
  title: string;
  description: string;
  /** ISO date string. */
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  author: string;
  keywords: string[];
  featured: boolean;
  trending: boolean;
  draft: boolean;
  /** Optional hero image path inside /public. Cover art is used when absent. */
  image?: string;
  imageAlt?: string;
  faq: FaqItem[];
  /** Raw MDX body (frontmatter stripped). */
  body: string;
  readingTime: number;
  wordCount: number;
  headings: Heading[];
};

export type DocSummary = Omit<Doc, "body">;
