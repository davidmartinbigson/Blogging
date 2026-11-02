#!/usr/bin/env node
/**
 * Scaffold a new article or story.
 *
 *   npm run new -- --title "How to Sharpen a Knife" --category food
 *   npm run new -- --title "The Quiet Hour" --story
 *
 * Options:
 *   --title     required
 *   --category  food | health | money | home | tech | travel | work   (default: food)
 *   --story     create a Story Studio piece instead of a guide
 *   --tags      comma separated
 *   --featured  mark as featured
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function flag(name) {
  return args.includes(`--${name}`);
}

function value(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

const title = value("title").trim();
if (!title) {
  console.error('Missing --title. Example: npm run new -- --title "How to Sharpen a Knife" --category food');
  process.exit(1);
}

const isStory = flag("story");
const category = isStory ? "stories" : value("category", "food").trim();
const known = ["food", "health", "money", "home", "tech", "travel", "work"];
if (!isStory && !known.includes(category)) {
  console.error(`Unknown category "${category}". Use one of: ${known.join(", ")}`);
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-")
  .slice(0, 70);

const date = new Date().toISOString().slice(0, 10);
const folder = isStory ? "stories" : "posts";
const file = path.join(process.cwd(), "content", folder, `${slug}.mdx`);

if (fs.existsSync(file)) {
  console.error(`Already exists: content/${folder}/${slug}.mdx`);
  process.exit(1);
}

const tags = value("tags")
  .split(",")
  .map((tag) => tag.trim())
  .filter(Boolean);
const tagList = tags.length > 0 ? tags : ["topic one", "topic two"];

const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "Write a 140–160 character summary here. It becomes the meta description and the card text."
date: "${date}"
category: "${category}"
tags: [${tagList.map((tag) => `"${tag}"`).join(", ")}]
author: "${isStory ? "story-studio" : "editorial-desk"}"
keywords: ["primary keyword", "secondary keyword", "long tail question"]
featured: ${flag("featured") ? "true" : "false"}
trending: false
draft: true
faq:
  - question: "A question a reader would actually search for?"
    answer: "A direct, two or three sentence answer that stands on its own."
  - question: "A second question?"
    answer: "Keep answers under 60 words; they are eligible for FAQ rich results."
---

Open with the reader's problem in one short paragraph. No throat-clearing.

## What you will need

- First item
- Second item
- Third item

## The method

Explain the steps in order. Use short paragraphs and bold the key phrase in each step.

<Note title="Good to know">
Callout boxes break up long guides and keep mobile readers scrolling.
</Note>

## A common mistake

Describe the failure mode, then the fix.

## Frequently asked questions

Add two or three sentences that summarise the article without repeating it.

---

*Draft notes (delete before publishing): target 900–1,400 words, at least three H2s, one internal link to a related article, and a 140–160 character description.*
`;

fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, frontmatter, "utf8");

console.log(`Created content/${folder}/${slug}.mdx`);
console.log("It is marked draft:true, so it will not appear in production builds until you flip it.");
