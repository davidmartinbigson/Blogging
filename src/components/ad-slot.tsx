"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type Placement = "inArticle" | "sidebar" | "footer";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Google AdSense slot.
 * Renders nothing when AdSense is not configured, so a site awaiting
 * approval never looks broken or pushes ads into the layout.
 */
export function AdSlot({
  placement,
  className,
  format = "auto",
  minHeight = 250,
  label = "Advertisement",
}: {
  placement: Placement;
  className?: string;
  format?: string;
  minHeight?: number;
  label?: string;
}) {
  const slot = siteConfig.adsenseSlots[placement];
  const client = siteConfig.adsenseClient;
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* blocked by an ad blocker — nothing to do */
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <aside className={cn("w-full", className)} aria-label={label}>
      <div className="kicker mb-2 text-center text-[0.6rem] text-faint">{label}</div>
      <div style={{ minHeight }} className="overflow-hidden rounded-lg bg-surface-muted">
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
