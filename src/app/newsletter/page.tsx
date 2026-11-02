import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "The Sunday Letter",
  description:
    "One useful idea from the archive every Sunday. Free, short, and one click to leave.",
  path: "/newsletter",
});

const faqs = [
  {
    q: "How often does it arrive?",
    a: "Once a week, on Sunday morning. Occasionally we skip a week rather than send filler.",
  },
  {
    q: "What is actually in it?",
    a: "One piece from the archive worth re-reading, one practical thing to try — a recipe, a routine, a checklist — and a short note from the editors. That is the whole format.",
  },
  {
    q: "Will you sell my address?",
    a: "No. The list is not rented, sold or shared. Every issue has a one-click unsubscribe, and deleting your address takes effect immediately.",
  },
  {
    q: "Is it free?",
    a: "Yes. The site is supported by display advertising and affiliate links, which is why the newsletter does not need to sell you anything.",
  },
];

export default function NewsletterPage() {
  return (
    <>
      <header className="border-b border-line bg-paper-deep">
        <div className="shell py-14 md:py-20">
          <div className="max-w-2xl">
            <p className="kicker text-accent">The Sunday Letter</p>
            <h1 className="mt-3 font-serif text-[clamp(2.1rem,1.5rem+2.4vw,3.2rem)] font-semibold leading-[1.08] text-ink">
              One good idea, once a week
            </h1>
            <p className="mt-5 text-[1rem] leading-relaxed text-muted">
              A short Sunday read from {siteConfig.name}: one piece from the archive, one
              thing worth trying, and nothing else. No sponsorships disguised as advice.
            </p>
            <NewsletterForm className="mt-7 max-w-lg" cta="Subscribe free" />
            <p className="mt-3 text-xs text-faint">
              Free forever · Unsubscribe in one click ·{" "}
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-ink">
                Privacy policy
              </Link>
            </p>
          </div>
        </div>
      </header>

      <div className="shell grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="max-w-2xl">
          <h2 className="font-serif text-2xl font-semibold text-ink">What a typical issue looks like</h2>
          <div className="mt-5 rounded-xl border border-line bg-surface p-6 shadow-card">
            <p className="text-xs uppercase tracking-[0.12em] text-faint">Sunday, 8:00</p>
            <p className="mt-2 font-serif text-xl font-semibold text-ink">The forty-minute rule</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This week: why the most useful kitchen habit is not a recipe but a timer — plus a
              pantry list that survives a bad week, and a story about a lighthouse keeper who
              counted ships instead of sheep.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
              <li>→ Read: “The forty-minute rule” (6 min)</li>
              <li>→ Try: the ten-item pantry list</li>
              <li>→ Fiction: “The keeper’s arithmetic” (3 min)</li>
            </ul>
          </div>

          <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">Questions</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-sm font-medium text-ink">{faq.q}</span>
                  <span className="text-faint transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-line bg-surface-muted p-5">
            <p className="kicker mb-2 text-faint">By the numbers</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex justify-between">
                <span>Issues sent</span>
                <span className="text-ink">Weekly</span>
              </li>
              <li className="flex justify-between">
                <span>Average read time</span>
                <span className="text-ink">3 min</span>
              </li>
              <li className="flex justify-between">
                <span>Pop-ups</span>
                <span className="text-ink">Zero</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-line p-5 text-sm leading-relaxed text-muted">
            <p className="kicker mb-2 text-accent">Prefer RSS?</p>
            <p>
              Every article is in the feed, no email required:{" "}
              <Link href="/rss.xml" className="text-ink underline decoration-accent underline-offset-4 hover:text-accent">
                /rss.xml
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
