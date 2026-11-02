import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export function SectionHeading({
  kicker,
  title,
  href,
  linkLabel = "View all",
  description,
  aligned = "between",
}: {
  kicker?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  description?: string;
  aligned?: "between" | "center";
}) {
  if (aligned === "center") {
    return (
      <div className="mx-auto max-w-2xl text-center">
        {kicker ? <p className="kicker text-accent">{kicker}</p> : null}
        <h2 className="mt-2 font-serif text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] font-semibold text-ink">
          {title}
        </h2>
        {description ? <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
    );
  }

  return (
    <div className="mb-7 flex items-end justify-between gap-6 border-b border-line pb-4">
      <div>
        {kicker ? <p className="kicker text-accent">{kicker}</p> : null}
        <h2 className="mt-1.5 font-serif text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-semibold leading-tight text-ink">
          {title}
        </h2>
        {description ? <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group hidden shrink-0 items-center gap-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-accent sm:flex"
        >
          {linkLabel}
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
