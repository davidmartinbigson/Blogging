#!/usr/bin/env node
/**
 * Pre-publish SEO check for every MDX file in content/.
 *
 *   npm run seo:check
 *
 * Exits non-zero when a file has blocking problems, so it can be wired into CI.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");
const FOLDERS = ["posts", "stories"];

const errors = [];
const warnings = [];

function add(list, file, message) {
  list.push({ file, message });
}

function words(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

for (const folder of FOLDERS) {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));

  for (const name of files) {
    const file = path.join(dir, name);
    const short = `content/${folder}/${name}`;
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const isStory = folder === "stories";

    if (!data.title) add(errors, short, "missing title");
    if (!data.description) add(errors, short, "missing description");
    if (!data.category) add(errors, short, "missing category");
    if (!data.date) add(errors, short, "missing date");
    if (!data.author) add(warnings, short, "missing author (falls back to editorial desk)");

    const title = String(data.title ?? "");
    if (title.length > 62) add(warnings, short, `title is ${title.length} chars — keep under 62 for SERP display`);
    if (title.length < 20) add(warnings, short, "title is very short");

    const description = String(data.description ?? "");
    if (description.length < 120) add(warnings, short, `description is ${description.length} chars — aim for 140–160`);
    if (description.length > 165) add(warnings, short, `description is ${description.length} chars — it will be truncated`);

    const keywords = Array.isArray(data.keywords) ? data.keywords : [];
    if (keywords.length < 3) add(warnings, short, "add at least 3 keywords");

    const tags = Array.isArray(data.tags) ? data.tags : [];
    if (tags.length < 2) add(warnings, short, "add at least 2 tags");

    const h2s = (content.match(/^##\s+/gm) ?? []).length;
    const h3s = (content.match(/^###\s+/gm) ?? []).length;
    if (h2s < (isStory ? 1 : 3)) add(warnings, short, `only ${h2s} H2 headings — structure helps search and scanning`);

    const count = words(content);
    if (!isStory && count < 700) add(warnings, short, `${count} words — thin pages rarely rank; aim for 900+`);
    if (isStory && count < 500) add(warnings, short, `${count} words — is it finished?`);

    const faq = Array.isArray(data.faq) ? data.faq : [];
    if (!isStory && faq.length === 0) add(warnings, short, "no FAQ items — they earn extra SERP real estate");

    // Every referenced public image must exist on disk.
    const referenced = [
      ...(data.image ? [String(data.image)] : []),
      ...[...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]),
      ...[...content.matchAll(/<Figure[^>]*src="([^"]+)"/g)].map((m) => m[1]),
    ].filter((src) => src.startsWith("/"));

    for (const src of new Set(referenced)) {
      const asset = path.join(process.cwd(), "public", src.replace(/^\//, "").split("?")[0]);
      if (!fs.existsSync(asset)) add(errors, short, `missing image file: public${src}`);
    }

    if (!data.image) add(warnings, short, "no hero image — cards fall back to generated art");

    if (data.draft === true) add(warnings, short, "still marked draft:true (hidden in production)");
    if (/TODO|lorem ipsum|TK\b/i.test(content)) add(errors, short, "contains placeholder text (TODO / lorem ipsum)");

    console.log(
      `${short.padEnd(52)} ${String(count).padStart(4)}w  H2:${h2s}  faq:${faq.length}  img:${data.image ? "yes" : "no "}  ${data.draft ? "DRAFT" : "live"}`,
    );
  }
}

console.log("");

if (warnings.length > 0) {
  console.log(`⚠  ${warnings.length} warning(s):`);
  for (const item of warnings) console.log(`   ${item.file} — ${item.message}`);
  console.log("");
}

if (errors.length > 0) {
  console.log(`✖  ${errors.length} error(s):`);
  for (const item of errors) console.log(`   ${item.file} — ${item.message}`);
  process.exit(1);
}

console.log("✔  No blocking SEO problems found.");
