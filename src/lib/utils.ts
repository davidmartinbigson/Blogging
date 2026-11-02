import { siteConfig } from "./site";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Mirrors github-slugger closely enough for our heading set. */
export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[’'"]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

const WORDS_PER_MINUTE = 220;

export function countWords(text: string) {
  const cleaned = text.replace(/```[\s\S]*?```/g, " ").replace(/[#*_>`|-]/g, " ");
  const words = cleaned.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word));
  return words.length;
}

export function readingTimeOf(text: string) {
  return Math.max(1, Math.round(countWords(text) / WORDS_PER_MINUTE));
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateLong(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function isoDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toISOString();
}

export function relativeDate(iso: string) {
  const then = new Date(`${iso}T12:00:00Z`).getTime();
  const now = Date.now();
  const days = Math.round((now - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(iso);
}

/** Deterministic 0..1 value from a string — used for stable generated art. */
export function seed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000;
}

export function titleCase(input: string) {
  return input.replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}

export function excerpt(text: string, length = 160) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).replace(/\s+\S*$/, "")}…`;
}
