import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Corrections, editorial questions, advertising and pitches. A person reads every message.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <header className="border-b border-line bg-paper-deep">
        <div className="shell py-12 md:py-16">
          <p className="kicker text-accent">Contact</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,1.5rem+2vw,3rem)] font-semibold leading-tight text-ink">
            Talk to the editors
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            There is no support bot and no ticket number. Messages go to a person, and the
            person who reads them also writes the articles.
          </p>
        </div>
      </header>

      <div className="shell grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="max-w-2xl">
          <ContactForm />
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-line bg-surface-muted p-5">
            <p className="kicker mb-2 text-faint">Email</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm font-medium text-ink underline decoration-accent underline-offset-4 hover:text-accent"
            >
              {siteConfig.email}
            </a>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Prefer email? That works too — same inbox, same response time.
            </p>
          </div>

          <div className="rounded-lg border border-line p-5">
            <p className="kicker mb-2 text-faint">Response times</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex justify-between gap-3">
                <span>Factual corrections</span>
                <span className="text-ink">Within 48h</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Editorial questions</span>
                <span className="text-ink">2–3 days</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Advertising</span>
                <span className="text-ink">3–5 days</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Pitches</span>
                <span className="text-ink">Weekly review</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-line p-5">
            <p className="kicker mb-2 text-accent">Write for us</p>
            <p className="text-sm leading-relaxed text-muted">
              We commission a small number of freelance pieces each month: practical guides
              with original reporting, 1,200–2,000 words. Send a one-paragraph pitch and two
              links to published work.
            </p>
            <Link
              href="/editorial-policy"
              className="mt-3 inline-flex text-xs font-medium text-ink underline decoration-accent underline-offset-4 hover:text-accent"
            >
              Read the standards first
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
