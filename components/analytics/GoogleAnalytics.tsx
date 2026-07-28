"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * GA4 for the App Router.
 *
 * WHY THIS EXISTS: NEXT_PUBLIC_GA_MEASUREMENT_ID had been set in Vercel for ~6 weeks with no
 * gtag code anywhere in the repo, so the site collected NOTHING. The measurement ID was never
 * the blocker — this file was.
 *
 * Two deliberate choices:
 *
 * 1. `gtag('config')` sends the FIRST page_view itself; the effect below skips its initial run
 *    and only fires on subsequent route changes. Setting `send_page_view: false` and firing
 *    everything from the effect looks tidier but loses the initial view, because the effect can
 *    run before the afterInteractive script has defined window.gtag.
 *
 * 2. It reads `usePathname` only — NOT `useSearchParams`. In Next 14, useSearchParams without a
 *    Suspense boundary opts every consuming route out of static rendering, which would turn 123
 *    prerendered pages dynamic. UTMs are not lost: gtag reads the full URL from
 *    window.location, so ?utm_campaign=... from the FB/IG posts is still captured.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!GA_ID) return;
    // The initial page_view comes from gtag('config') — don't double-count it.
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  // No ID configured (local dev, previews) — render nothing rather than a broken tag.
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
