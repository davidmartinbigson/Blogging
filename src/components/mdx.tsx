import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

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
    const isSource = /\.(gov|edu|org)\b|who\.int|un\.org|europa\.eu/.test(href);
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
        {...(isSource ? { className: "source-link" } : {})}
      >
        {children}
      </a>
    );
  },

  /** Full-width figure with caption: <Figure src="/images/x.jpg" alt="…" caption="…" /> */
  Figure: ({
    src,
    alt,
    caption,
    width = 1600,
    height = 900,
    priority = false,
  }: {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
    priority?: boolean;
  }) => (
    <figure className="my-9">
      <div className="relative overflow-hidden rounded-xl border border-line">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(min-width: 1024px) 46rem, 100vw"
          className="h-auto w-full object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2.5 text-center font-sans text-[0.78rem] leading-relaxed text-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  ),

  /** Key takeaways box — children are a markdown list. */
  Takeaways: ({ children, title = "Key takeaways" }: { children: React.ReactNode; title?: string }) => (
    <div className="takeaways">
      <p className="takeaways-title">{title}</p>
      {children}
    </div>
  ),

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

  /** Numbered step list with big numerals. */
  Steps: ({ children }: { children: React.ReactNode }) => (
    <ol className="not-prose my-8 space-y-5 border-l border-line pl-6">{children}</ol>
  ),
  Step: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <li className="relative">
      <span className="absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full border-2 border-accent bg-paper" aria-hidden />
      <p className="font-sans text-[0.95rem] font-semibold text-ink">{title}</p>
      <div className="mt-1 text-[0.95rem] leading-relaxed text-muted">{children}</div>
    </li>
  ),
};
