import Link from "next/link";
import { categories, footerNav, siteConfig } from "@/lib/site";
import { NewsletterForm } from "./newsletter-form";
import { FacebookIcon, LinkedInIcon, PinterestIcon, RssIcon, XSocialIcon } from "./icons";

const socials = [
  { label: "X (Twitter)", href: `https://x.com/${siteConfig.twitter.replace("@", "")}`, Icon: XSocialIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Pinterest", href: `https://pinterest.com/${siteConfig.pinterest}`, Icon: PinterestIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInIcon },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-paper-deep">
      <div className="shell py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-baseline gap-1.5" aria-label={`${siteConfig.name} home`}>
              <span className="font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">Sage</span>
              <span className="font-serif text-2xl font-semibold text-accent">&amp;</span>
              <span className="font-serif text-2xl font-semibold tracking-[-0.03em] text-ink">Story</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">{siteConfig.description}</p>

            <div className="mt-6">
              <p className="kicker mb-2 text-faint">The Sunday Letter</p>
              <p className="mb-3 text-sm text-muted">
                One useful idea from the archive, every Sunday. No noise.
              </p>
              <NewsletterForm cta="Join" />
            </div>

            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
              <Link
                href="/rss.xml"
                aria-label="RSS feed"
                className="grid size-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <RssIcon className="size-3.5" />
              </Link>
            </div>
          </div>

          <FooterColumn title="Sections">
            {categories.map((category) => (
              <FooterLink key={category.slug} href={`/category/${category.slug}`}>
                {category.name}
              </FooterLink>
            ))}
            <FooterLink href="/stories">Story Studio</FooterLink>
          </FooterColumn>

          <FooterColumn title="Explore">
            {footerNav.explore.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <div className="grid gap-10">
            <FooterColumn title="Company">
              {footerNav.about.map((item) => (
                <FooterLink key={item.label} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn title="Legal">
              {footerNav.legal.map((item) => (
                <FooterLink key={item.label} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.publisher}. All rights reserved.
          </p>
          <p className="max-w-xl leading-relaxed sm:text-right">
            Editorial content is for general information only and is not medical, legal or
            financial advice. Some links may be affiliate links; this never changes what we
            recommend.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="kicker mb-4 text-faint">{title}</h3>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-muted transition-colors hover:text-ink">
        {children}
      </Link>
    </li>
  );
}
