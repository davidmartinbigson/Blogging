"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: [0, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="kicker mb-3 text-faint">In this article</p>
      <ul className="space-y-1.5 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 leading-snug transition-colors",
                heading.level === 2 ? "pl-3" : "pl-6 text-[0.82rem]",
                active === heading.id
                  ? "border-accent text-ink"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Mobile version: a collapsible summary at the top of the article. */
export function TableOfContentsMobile({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;
  return (
    <details className="group mb-8 rounded-lg border border-line bg-surface-muted px-4 py-3 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-ink">
        In this article
        <span className="text-faint transition-transform group-open:rotate-180" aria-hidden>
          ⌄
        </span>
      </summary>
      <ul className="mt-3 space-y-1.5 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
            <a href={`#${heading.id}`} className="text-muted hover:text-ink">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
