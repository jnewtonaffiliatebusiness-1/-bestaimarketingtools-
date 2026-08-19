"use client";

import { useEffect, useState } from "react";
import { clubUrl, clubUrlWithSource } from "@/lib/offer";

/**
 * The offer-page CTA, with source attribution bolted on WITHOUT making the page
 * dynamic.
 *
 * WHY THIS IS A CLIENT COMPONENT AND NOT `searchParams`
 * Reading `searchParams` in the page would work and would also opt the whole
 * offer page out of static rendering — every visit becomes a server render of
 * the one page we most want cached and fast. The `?from=` value only has to
 * survive as far as an href, so it is read in the browser instead and the page
 * stays static.
 *
 * PROGRESSIVE, NOT REPLACING
 * The server renders `clubUrl("offerpage", placement)` — byte-identical to the
 * link that is already verified working end-to-end in ClickBank's TID report
 * (a self-click showed up as `offerpage_glance`). The source-tagged href only
 * replaces it after hydration, when we actually know where the visitor came
 * from. A no-JS client, a crawler, or a direct visitor gets exactly today's
 * behaviour rather than a broken or untagged link.
 *
 * ⛔ THE `from` VALUE IS UNTRUSTED — it is a query parameter, so anyone can put
 * anything in it. `clubUrlWithSource` runs it through `sourceKey()`, which
 * strips to [a-z0-9_] and truncates to 22, so the worst a hostile value can do
 * is produce a tid that matches no review. We additionally require it to match a
 * slug we actually published, so junk never reaches ClickBank's report at all.
 */
export default function ClubCta({
  placement,
  knownSlugs,
  className,
  children,
}: {
  placement: string;
  /** Published review slugs. A `from` outside this list is ignored. */
  knownSlugs: string[];
  className?: string;
  children: React.ReactNode;
}) {
  const [href, setHref] = useState(() => clubUrl("offerpage", placement));

  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    if (!from) return;
    if (!knownSlugs.includes(from)) return;
    setHref(clubUrlWithSource(from, placement));
  }, [placement, knownSlugs]);

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
