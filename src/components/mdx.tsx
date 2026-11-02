import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/**
 * Elements we override inside article bodies.
 * Everything else falls back to the typographic defaults in globals.css.
 */
export const mdxComponents: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },

  /** Callout box: <Note title="Good to know">…</Note> */
  Note: ({ title = "Good to know", children }: { title?: string; children: React.ReactNode }) => (
    <div className="lede-note">
      <strong>{title}</strong>
      {children}
    </div>
  ),

  /** Pull quote with optional attribution. */
  PullQuote: ({ children, cite }: { children: React.ReactNode; cite?: string }) => (
    <blockquote>
      <p>{children}</p>
      {cite ? <cite>{cite}</cite> : null}
    </blockquote>
  ),

  /** Recipe card table helper. */
  KeyValue: ({ items }: { items: Array<{ label: string; value: string }> }) => (
    <dl className="not-prose my-7 grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-line bg-surface-muted p-5 font-sans text-sm sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="kicker text-[0.6rem] text-faint">{item.label}</dt>
          <dd className="mt-0.5 text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  ),
};
