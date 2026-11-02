"use client";

import { useState } from "react";
import { CheckIcon, FacebookIcon, LinkIcon, LinkedInIcon, PinterestIcon, XSocialIcon } from "./icons";
import { cn } from "@/lib/utils";

export function ShareButtons({
  url,
  title,
  className,
  compact = false,
}: {
  url: string;
  title: string;
  className?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const links = [
    {
      label: "Share on X",
      Icon: XSocialIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on Facebook",
      Icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on Pinterest",
      Icon: PinterestIcon,
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
    },
    {
      label: "Share on LinkedIn",
      Icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!compact ? (
        <span className="kicker mr-1 text-faint">Share</span>
      ) : null}
      {links.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          <Icon className="size-3.5" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
      >
        {copied ? <CheckIcon className="size-4 text-sage" /> : <LinkIcon className="size-4" />}
      </button>
    </div>
  );
}
