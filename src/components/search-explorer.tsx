"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/content";
import { cn } from "@/lib/utils";
import { SearchIcon } from "./icons";

const sections = ["All", "Food", "Health", "Money", "Home", "Technology", "Travel", "Work", "Story Studio"];

export function SearchExplorer({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [section, setSection] = useState("All");
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchEntry[]) => {
        if (!cancelled) setIndex(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    const words = term ? term.split(/\s+/) : [];

    return index
      .filter((entry) => section === "All" || entry.c === section)
      .map((entry) => {
        if (words.length === 0) return { entry, score: 1 };
        const haystack = `${entry.t} ${entry.d} ${entry.k}`.toLowerCase();
        const score = words.reduce((total, word) => {
          if (entry.t.toLowerCase().includes(word)) return total + 3;
          if (entry.k.toLowerCase().includes(word)) return total + 2;
          if (haystack.includes(word)) return total + 1;
          return total;
        }, 0);
        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.entry);
  }, [index, query, section]);

  return (
    <div>
      <div className="flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-3 shadow-card focus-within:border-accent">
        <SearchIcon className="size-4 shrink-0 text-faint" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “budget”, “sleep”, “one-pan dinner”, “index funds”…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
          aria-label="Search"
          autoFocus
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="shrink-0 text-xs text-faint hover:text-ink"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {sections.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSection(item)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              section === item
                ? "border-transparent bg-ink text-paper"
                : "border-line text-ink-soft hover:border-line-strong",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.12em] text-faint" aria-live="polite">
        {loading ? "Loading index…" : `${results.length} result${results.length === 1 ? "" : "s"}`}
      </p>

      <ul className="mt-3 divide-y divide-line border-y border-line">
        {results.map((entry) => (
          <li key={entry.u}>
            <Link href={entry.u} className="group flex items-start justify-between gap-6 py-5">
              <span className="min-w-0">
                <span className="block font-serif text-lg font-semibold leading-snug text-ink group-hover:text-accent">
                  {entry.t}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{entry.d}</span>
              </span>
              <span className="kicker shrink-0 pt-1 text-faint">{entry.c}</span>
            </Link>
          </li>
        ))}
      </ul>

      {!loading && results.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-serif text-lg text-ink">Nothing matched that.</p>
          <p className="mt-2 text-sm text-muted">
            Try a shorter phrase, or{" "}
            <Link href="/blog" className="underline decoration-accent underline-offset-4 hover:text-ink">
              browse every article
            </Link>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
