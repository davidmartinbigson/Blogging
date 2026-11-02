"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CloseIcon, SearchIcon } from "./icons";

type Props = { open: boolean; onClose: () => void };

let cache: SearchEntry[] | null = null;

async function loadIndex(): Promise<SearchEntry[]> {
  if (cache) return cache;
  const res = await fetch("/search-index.json", { cache: "force-cache" });
  if (!res.ok) throw new Error("Search index unavailable");
  cache = (await res.json()) as SearchEntry[];
  return cache;
}

export function SearchDialog({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[]>(cache ?? []);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    if (!cache) {
      setLoading(true);
      loadIndex()
        .then((data) => {
          if (!cancelled) setIndex(data);
        })
        .catch(() => undefined)
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return index.slice(0, 6);
    const words = term.split(/\s+/);
    return index
      .map((entry) => {
        const haystack = `${entry.t} ${entry.d} ${entry.c} ${entry.k}`.toLowerCase();
        const score = words.reduce((total, word) => {
          if (entry.t.toLowerCase().includes(word)) return total + 3;
          if (entry.c.toLowerCase().includes(word)) return total + 2;
          if (haystack.includes(word)) return total + 1;
          return total;
        }, 0);
        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.entry);
  }, [index, query]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((value) => Math.min(value + 1, results.length - 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((value) => Math.max(value - 1, 0));
      }
      if (event.key === "Enter" && results[active]) {
        event.preventDefault();
        router.push(results[active].u);
        onClose();
      }
    },
    [active, onClose, results, router],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-lift fade-up"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <SearchIcon className="size-[18px] shrink-0 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            placeholder="Search recipes, guides and stories…"
            className="w-full bg-transparent py-4 text-[0.95rem] text-ink outline-none placeholder:text-faint"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onClose}
            className="grid size-7 shrink-0 place-items-center rounded-md text-faint transition-colors hover:bg-surface-muted hover:text-ink"
            aria-label="Close"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {loading && results.length === 0 ? (
            <div className="space-y-2 p-2">
              {[0, 1, 2].map((key) => (
                <div key={key} className="skeleton h-12 rounded-md" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">
              No matches for “{query}”. Try a broader word.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {results.map((entry, position) => (
                <li key={entry.u}>
                  <Link
                    href={entry.u}
                    onClick={onClose}
                    onMouseEnter={() => setActive(position)}
                    className={cn(
                      "flex items-start justify-between gap-4 rounded-md px-3 py-2.5 transition-colors",
                      position === active ? "bg-surface-muted" : "hover:bg-surface-muted",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">{entry.t}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{entry.d}</span>
                    </span>
                    <span className="kicker shrink-0 pt-1 text-faint">{entry.c}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line bg-surface-muted px-4 py-2 text-[0.65rem] text-faint">
          <span>↑↓ to move · Enter to open · Esc to close</span>
          <span className="hidden sm:inline">Sage &amp; Story index</span>
        </div>
      </div>
    </div>
  );
}
