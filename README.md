# Sage & Story

A fast, SEO-first publishing platform built with **Next.js 16**, **React 19**, **Tailwind CSS 4** and **MDX**. Content lives in the repository as markdown files, so a post is a commit and a deploy — no database, no CMS bill, no admin panel to secure.

- 100% static pages (82 prerendered in the demo), served from Vercel's edge
- Zero client-side JavaScript for article text; ~90 KB of JS total on an article page
- Article, FAQ, breadcrumb, item-list and organisation structured data on every page
- AdSense-ready: fixed ad slots that stay invisible until you are approved
- Dark mode, reader-focused typography, generated cover art (no image payload)
- A Story Studio section for AI-assisted short fiction, clearly labelled

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional — the site runs without it
npm run dev                    # http://localhost:3000
```

Build and preview the production output:

```bash
npm run build && npm start
```

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also runs TypeScript) |
| `npm run new -- --title "..." --category food` | Scaffold a new article |
| `npm run seo:check` | Pre-publish audit of every MDX file |
| `npm run typecheck` | Types only |

---

## Writing an article

Every piece is one `.mdx` file in `content/posts/`. The file name becomes the URL slug.

```bash
npm run new -- --title "How to Sharpen a Kitchen Knife" --category food --tags "knife skills,kitchen"
```

That creates `content/posts/how-to-sharpen-a-kitchen-knife.mdx` with `draft: true`. Fill in the body, flip `draft` to `false`, run `npm run seo:check`, commit.

```mdx
---
title: "How to Sharpen a Kitchen Knife"
description: "A 150-character summary that becomes the meta description. Keep it between 140 and 160 characters."
date: "2026-11-02"
updated: "2026-11-09"
category: "food"
tags: ["knife skills", "kitchen"]
author: "editorial-desk"
keywords: ["how to sharpen a knife", "whetstone vs honing steel"]
featured: false
trending: true
draft: false
faq:
  - question: "How often should I sharpen a knife?"
    answer: "A home cook usually needs a full sharpening two to four times a year, with honing in between."
---

Opening paragraph — this one gets a drop cap automatically.

## A section heading

Body copy. **Bold** the key phrase in each section.
```

### Components available inside MDX

```mdx
<Note title="Good to know">
A shaded callout for caveats, safety notes and “don’t skip this” moments.
</Note>

<PullQuote cite="Optional attribution">
A pulled-out line for emphasis.
</PullQuote>

<KeyValue items={[{ label: "Prep", value: "10 min" }, { label: "Serves", value: "4" }]} />
```

Tables, lists, blockquotes, code blocks and images all work through standard markdown. Links starting with `/` are routed client-side automatically.

### Frontmatter reference

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Keep under 62 characters so it does not truncate in Google |
| `description` | yes | 140–160 characters; used for meta description, cards and social |
| `date` | yes | `YYYY-MM-DD` |
| `updated` | no | Shows an “Updated …” mark in the byline |
| `category` | yes | `food`, `health`, `money`, `home`, `tech`, `travel`, `work`, or `stories` |
| `tags` | no | Powers tag pages and related articles |
| `author` | no | `editorial-desk` (default) or `story-studio` |
| `keywords` | no | Extra search terms for the `keywords` meta tag and schema |
| `featured` | no | Appears in the homepage lead slot |
| `trending` | no | Appears in “Trending now” |
| `draft` | no | Drafts are visible in dev, hidden in production |
| `faq` | no | Renders an accordion **and** FAQ structured data |

### Stories

Fiction goes in `content/stories/` with `category: "stories"`. Use:

```bash
npm run new -- --title "The Quiet Hour" --story
```

Stories render with a centred, gold-accented layout and are labelled as AI-assisted fiction.

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel: **Add New → Project → Import** the repository. The framework is detected automatically; no build settings are needed.
3. Add environment variables from `.env.example` (at minimum `NEXT_PUBLIC_SITE_URL`).
4. Deploy, then point your domain at the project (**Settings → Domains**).
5. Every push to the main branch redeploys — that is your publishing mechanism.

Canonical URLs, the sitemap, RSS and structured data resolve in this order: `NEXT_PUBLIC_SITE_URL` → Vercel's own `VERCEL_PROJECT_PRODUCTION_URL` → a placeholder. So a first deploy is already correct on the `*.vercel.app` domain; add `NEXT_PUBLIC_SITE_URL` once you attach a custom domain and redeploy.

---

## Google AdSense setup

The site is built to pass review: original long-form content, visible authorship, an editorial policy, privacy, cookies, terms, disclaimer, a contact page and a real navigation structure.

**Order of operations**

1. Deploy with **no** AdSense variables set. The site runs clean, with no empty ad boxes.
2. Submit `https://yourdomain.com/sitemap.xml` in Google Search Console and request indexing for the top pages.
3. Apply to AdSense with the domain. Wait for approval.
4. Add these to Vercel → Settings → Environment Variables, then redeploy:

```
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=1234567891
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=1234567892
```

The loader script, the three ad slots and `/ads.txt` switch on automatically. Before that, `AdSlot` renders nothing at all.

**Placement** — one in-article unit after the body, one sidebar unit on wide screens, one horizontal unit near the end of the homepage. No interstitials, no anchor ads, no auto-inserted units inside the first paragraph. This keeps Core Web Vitals intact, which is a ranking factor and a revenue factor.

**Important:** AdSense requires the content to exist before you apply. Publish 15–25 original articles first. Twelve are included here as a starting point — replace or expand them with your own.

---

## SEO checklist (built in)

- Canonical URLs on every page, `metadataBase` from `NEXT_PUBLIC_SITE_URL`
- JSON-LD: `Organization`, `WebSite` + `SearchAction`, `Article`/`ShortStory`, `BreadcrumbList`, `FAQPage`, `ItemList` for archives
- `hreflang`-ready single-language setup (`en`)
- Dynamic Open Graph images generated at `/og?title=…` — no design work per post
- `sitemap.xml`, `robots.txt`, `rss.xml` generated from content
- Semantic headings, one `h1` per page, table of contents built from `##` headings
- Visible publish date, last-updated date and byline (E-E-A-T signals)
- `loading` strategy: system fonts, CSS-only cover art, no layout shift, no font downloads
- `scripts/seo-check.mjs` fails the build if a file is missing a title, description or category

Run `npm run seo:check` before every commit. Wire it into CI:

```yaml
# .github/workflows/seo.yml
name: Content QA
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run seo:check
      - run: npm run build
```

---

## Performance notes

- Content is compiled at build time; readers download HTML, not a markdown parser.
- Cover art is generated with CSS gradients and SVG — no image requests, no LCP penalty.
- The search index is a separate JSON file fetched **only** when the search dialog opens.
- The only client components are the header menu, search, theme toggle, share buttons, TOC and forms.
- Fonts are system stacks. If you want a custom typeface, use `next/font/local` with `.woff2` files in `src/fonts/` — self-hosted, subset, `display: swap`.

---

## Customising

| What | Where |
| --- | --- |
| Brand name, tagline, domain, socials, email | `src/lib/site.ts` |
| Categories, colours, glyphs, section copy | `src/lib/site.ts` |
| Authors and bylines | `src/lib/site.ts` |
| Colour palette, dark mode, article typography | `src/app/globals.css` |
| Navigation and footer | `src/components/site-header.tsx`, `site-footer.tsx` |
| Policy / about pages | `src/lib/pages.ts` |
| Social card design | `src/app/og/route.tsx` |

### Adding a category

Add an entry to `categories` in `src/lib/site.ts` (slug, name, description, two hex colours, glyph), then create `content/posts/` files with that `category`. The nav, sitemap, category page and homepage tiles all pick it up automatically.

### Newsletter and contact

Both forms post to `/api/subscribe` and `/api/contact`, which validate input, rate-limit by IP and forward to whatever endpoint you set (`NEWSLETTER_ENDPOINT`, `CONTACT_ENDPOINT`). Without an endpoint they accept the submission and log it to the function logs, so you can wire up a provider later without touching the UI.

---

## Content strategy that actually earns with AdSense

AdSense pays per impression and per click, so revenue is `traffic × RPM`. Traffic comes from ranking, and ranking comes from satisfying a search intent completely. In practice:

1. **One topic per URL.** “How to sharpen a knife” beats “kitchen tips”.
2. **Answer in the first 100 words**, then explain. This earns the featured snippet.
3. **900–1,600 words** for guides, with an FAQ block at the end.
4. **Internal links**: every article links to at least two others in the same category.
5. **Topical clusters**: 8–12 articles per category before moving on. Authority is per-topic, not per-site.
6. **Update, do not duplicate.** A revised article with a new `updated` date outperforms a second article on the same keyword.
7. **Avoid the restricted categories** for a new account: medical treatment claims, cryptocurrency, gambling, weapons, “get rich quick”.
8. **Never publish AI text unedited.** The policy here is AI-assisted drafting plus human fact-checking, and every page says so.

---

## Project structure

```
content/
  posts/            # guides (MDX)
  stories/          # fiction (MDX)
scripts/
  new-post.mjs      # scaffolding
  seo-check.mjs     # pre-publish audit
src/
  app/              # routes, metadata, sitemap, robots, rss, og
  components/       # layout + article UI
  lib/
    content.ts      # MDX loader, queries, search index
    seo.ts          # metadata + JSON-LD builders
    site.ts         # brand, categories, authors
    pages.ts        # about / policy copy
```

---

## License

Code: MIT. Content in `content/` and the written copy in `src/lib/pages.ts` are © the publisher — replace them with your own before going live.
