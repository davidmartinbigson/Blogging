import Script from "next/script";
import { siteConfig } from "@/lib/site";

/**
 * Analytics is opt-in: nothing loads until an ID exists in the environment.
 * GA is loaded after hydration with `afterInteractive` so it never blocks
 * the largest contentful paint.
 */
export function Analytics() {
  return (
    <>
      {siteConfig.gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${siteConfig.gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {siteConfig.plausibleDomain ? (
        <Script
          defer
          data-domain={siteConfig.plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
