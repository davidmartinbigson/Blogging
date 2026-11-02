/**
 * Central site configuration.
 * Everything brand-related lives here so a rebrand is a one-file change.
 */

export const siteConfig = {
  name: "Sage & Story",
  shortName: "S&S",
  domain: "sageandstory.com",
  tagline: "Everyday wisdom, well told.",
  description:
    "Sage & Story publishes thoughtful, practical writing on food, health, money, home, technology and travel — plus original short fiction from our story studio.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://sageandstory.com").replace(/\/$/, ""),
  locale: "en_US",
  language: "en",
  email: "hello@sageandstory.com",
  publisher: "Sage & Story Media",
  foundingYear: 2026,
  twitter: "@sageandstory",
  instagram: "sageandstory",
  pinterest: "sageandstory",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  adsenseSlots: {
    inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE || "",
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "",
    footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || "",
  },
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
} as const;

export type Category = {
  slug: string;
  name: string;
  /** Short label used in tight navigation spaces. */
  shortName: string;
  description: string;
  /** Long-form intro shown at the top of the category archive (good for SEO). */
  intro: string;
  /** Two hex stops used by the generative cover art. */
  from: string;
  to: string;
  /** Emoji-free glyph shown in the category chip. */
  glyph: string;
  nav: boolean;
};

export const categories: Category[] = [
  {
    slug: "food",
    name: "Food & Recipes",
    shortName: "Food",
    description:
      "Weeknight recipes, pantry staples and food culture — tested in a normal kitchen, written for real schedules.",
    intro:
      "Good food does not need a long ingredient list or a special occasion. This is where we collect the recipes we actually cook on a Tuesday: one-pan dinners, slow weekend projects, small-batch baking and the food traditions that make a house feel lived in. Every recipe is written with weights, timings and substitutions, so it works the first time.",
    from: "#E86A33",
    to: "#B3310C",
    glyph: "◍",
    nav: true,
  },
  {
    slug: "health",
    name: "Health & Wellness",
    shortName: "Health",
    description:
      "Evidence-aware writing on sleep, movement, nutrition and mental health — without the hype.",
    intro:
      "Health writing has a credibility problem: too much certainty, too little evidence. We take the opposite approach. Every claim here is either well established, or clearly labelled as emerging. Expect practical routines, plain-language explanations of the research, and an honest note about what we still do not know.",
    from: "#2F9E7E",
    to: "#14624C",
    glyph: "❋",
    nav: true,
  },
  {
    slug: "money",
    name: "Money & Finance",
    shortName: "Money",
    description:
      "Saving, investing, debt and salary negotiation explained in plain language for people who were never taught this.",
    intro:
      "Personal finance is mostly a set of small, boring decisions repeated for decades. This section covers the mechanics — emergency funds, index funds, interest rates, tax basics, negotiating a raise — and the psychology that makes them hard. Educational information only; never personalised financial advice.",
    from: "#3E63DD",
    to: "#1B3A8F",
    glyph: "◆",
    nav: true,
  },
  {
    slug: "home",
    name: "Home & Living",
    shortName: "Home",
    description:
      "Small-space design, cleaning systems, repairs and the quiet pleasure of a well-run home.",
    intro:
      "A home is a system before it is a showpiece. Here we write about the unglamorous parts that actually change how a place feels: storage that works, a cleaning rhythm you can keep, repairs worth doing yourself, and the small design decisions that make a room restful.",
    from: "#A8763E",
    to: "#6B4620",
    glyph: "⌂",
    nav: true,
  },
  {
    slug: "tech",
    name: "Technology",
    shortName: "Tech",
    description:
      "Honest reviews, digital hygiene and AI literacy for people who use technology but do not live inside it.",
    intro:
      "Most technology coverage is written for enthusiasts. This one is written for everyone else: what a tool is actually for, what it costs you in attention, how to keep your data reasonably safe, and how to tell a genuine improvement from a marketing cycle.",
    from: "#6D5BD0",
    to: "#3A2A85",
    glyph: "◈",
    nav: true,
  },
  {
    slug: "travel",
    name: "Travel",
    shortName: "Travel",
    description:
      "Slower, cheaper, better-planned trips — itineraries, packing systems and city guides that respect your budget.",
    intro:
      "Travel writing is at its best when it is useful. These guides focus on the mechanics: how many days a place deserves, what to book early, where the money actually goes, and how to move through a city without treating it as a backdrop.",
    from: "#1F8A9E",
    to: "#0E4F5C",
    glyph: "✦",
    nav: true,
  },
  {
    slug: "work",
    name: "Work & Business",
    shortName: "Work",
    description:
      "Careers, freelancing, small business operations and the craft of doing focused work.",
    intro:
      "Work has changed shape faster than the advice about it. This section is about the durable parts: how to get good at something, how to price it, how to run a small operation without chaos, and how to protect the hours where the real work happens.",
    from: "#B4457A",
    to: "#7A1F4B",
    glyph: "◐",
    nav: true,
  },
];

export const storyCategory: Category = {
  slug: "stories",
  name: "Story Studio",
  shortName: "Stories",
  description:
    "Original short fiction written in collaboration with AI, edited by a human.",
  intro:
    "The Story Studio is our fiction wing: short, atmospheric pieces built around a single idea. Each story is drafted with AI assistance, then shaped, cut and fact-checked by our editor. Think of it as a magazine fiction page — two or three minutes long, and best read with the phone face down.",
  from: "#C7952B",
  to: "#7A5410",
  glyph: "✧",
  nav: true,
};

export const allCategories = [...categories, storyCategory];

export function getCategory(slug: string): Category | undefined {
  return allCategories.find((category) => category.slug === slug);
}

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  /** Initials used for the avatar fallback. */
  initials: string;
  from: string;
  to: string;
};

export const authors: Author[] = [
  {
    slug: "editorial-desk",
    name: "The Editorial Desk",
    role: "Research & writing",
    bio: "The Editorial Desk is the byline used for researched, editor-reviewed guides produced by the Sage & Story team. We combine AI-assisted drafting with human fact-checking, and we publish our sourcing standards in the editorial policy.",
    initials: "ED",
    from: "#2C2A26",
    to: "#6B5B45",
  },
  {
    slug: "story-studio",
    name: "Story Studio",
    role: "Fiction",
    bio: "Story Studio writes short fiction for Sage & Story. Drafts are generated with AI, then reworked by a human editor for pacing, voice and accuracy. Any resemblance to real people is coincidental.",
    initials: "SS",
    from: "#C7952B",
    to: "#7A5410",
  },
];

export function getAuthor(slug: string): Author {
  return (
    authors.find((author) => author.slug === slug) ??
    authors[0]
  );
}

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Food", href: "/category/food" },
  { label: "Health", href: "/category/health" },
  { label: "Money", href: "/category/money" },
  { label: "Home", href: "/category/home" },
  { label: "Tech", href: "/category/tech" },
  { label: "Travel", href: "/category/travel" },
  { label: "Stories", href: "/stories" },
];

export const footerNav = {
  explore: [
    { label: "All articles", href: "/blog" },
    { label: "Story Studio", href: "/stories" },
    { label: "Search", href: "/search" },
    { label: "Authors", href: "/authors" },
    { label: "RSS feed", href: "/rss.xml" },
  ],
  about: [
    { label: "About us", href: "/about" },
    { label: "Editorial policy", href: "/editorial-policy" },
    { label: "Contact", href: "/contact" },
    { label: "Write for us", href: "/contact" },
  ],
  legal: [
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Cookie policy", href: "/cookie-policy" },
    { label: "Terms of use", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Advertise", href: "/advertise" },
  ],
};
