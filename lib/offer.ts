/**
 * THE OFFER — AI Marketers Club.
 *
 * This is the one product this site earns a commission on directly, so the
 * affiliate URL lives here and NOWHERE else. It was previously copy-pasted as a
 * string literal in 7 files (nav, footer, hero, review CTA, /best, /category,
 * /compare). A single mistyped affiliate ID in any one of those pays a stranger,
 * and it fails silently — the link still works, the page still looks right.
 *
 * Build `clubUrl()` instead of writing the URL again.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SWITCHED DIGISTORE24 → CLICKBANK, 2026-08-07. Why, in one table:
 *
 *              Digistore24 (old)        ClickBank (now)
 *   Front end  $25.80 → $17.90 (90%)    $27  → $20.25  (75%)
 *   OTO1       not paid to us           $147 → $110.25 (75%)
 *   OTO2       not paid to us           $597 → $447.75 (75%)
 *   MAX/BUYER  $17.90                   $578.25
 *
 * Same product, same vendor (M3M3TIC LLC), two platforms. The Digistore24 link
 * paid the FRONT END ONLY; the ClickBank programme pays 75% across the whole
 * funnel. Source: the vendor's own affiliate portal, joinaimarketers.club/cb/affiliates/
 * (reached via a redirect from bonfireterminal.com/affiliates/), read 2026-08-07.
 *
 * ⚠️ 60-day cookie AND a 60-day refund window. $578.25 is a CEILING, not an
 *    expectation — a commission can be clawed back for two months. Front-end
 *    refunds measured 27.8% on Digistore24.
 *
 * ── Affiliate ID is a QUERY PARAM here, not a path segment ──────────────────
 *   https://hop.clickbank.net/?affiliate={NICKNAME}&vendor={VENDOR}
 *
 * 🔑 VERIFIED, NOT GUESSED (2026-08-07). The classic subdomain hoplink form
 *    `jzoolu.j1r2c.hop.clickbank.net` returns HTTP 000 — it does NOT resolve.
 *    Only the query form works. Controls were run both ways:
 *      affiliate=jzoolu               → joinaimarketers.club/cb/?hop=jzoolu   ✅
 *      affiliate=notarealnickname9x7q → errCode=invalidnickname, hop=0        ✅ rejected
 *      vendor=notavendor9x7q          → errCode=invalidvendornickname         ✅ rejected
 *    So a 200 here genuinely means the nickname is live.
 *
 * ⚠️ `tid` is sent but COULD NOT BE VERIFIED externally — it does not appear in
 *    the landing URL (only `?hop=` and a random `hopId`). ClickBank documents tid
 *    as visible in its own reporting; that has NOT been confirmed from a real
 *    click yet. Do not build per-campaign attribution on it until a sale proves it.
 */

export const CLUB_AFFILIATE_ID = "jzoolu";   // ClickBank nickname
export const CLUB_VENDOR_ID = "j1r2c";       // ClickBank vendor for AI Marketers Club

/** ClickBank TIDs allow lowercase letters, numbers and underscores only — no dashes. */
function toTid(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 24);
}

/** Where a click goes. Nothing else in the codebase should build this string. */
export function clubUrl(medium: string, campaign: string): string {
  const url = new URL("https://hop.clickbank.net/");
  url.searchParams.set("affiliate", CLUB_AFFILIATE_ID);
  url.searchParams.set("vendor", CLUB_VENDOR_ID);
  url.searchParams.set("tid", toTid(`${medium}_${campaign}`));
  url.searchParams.set("utm_source", "reviewsite");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

/**
 * ── OFFER FACTS ─────────────────────────────────────────────────────────────
 * Every value below was read off the vendor's own live sales page and FAQ at
 * https://joinaimarketers.club/ds24/ on 2026-08-06 (checked by expanding all
 * eight FAQ accordions, not just the visible copy).
 *
 * RULE FOR THIS FILE: only facts the vendor states about what a buyer receives.
 * Marketing claims — member counts, press mentions, earnings headlines, the
 * "total value" stack — are deliberately NOT here. If a number cannot be
 * checked, it does not get repeated on our page as though it can.
 */
export const CLUB = {
  name: "AI Marketers Club",
  vendor: "M3M3TIC LLC",
  presenter: "John Crestani",
  /** Switched 2026-08-07 — see the header. ClickBank pays the whole funnel. */
  processor: "ClickBank",
  price: 27,
  /** Vendor FAQ: "$27 is a one-time payment for lifetime access". */
  billing: "one-time" as const,
  /** 60-day refund window — same on both platforms. */
  guaranteeDays: 60,
  supportEmail: "support@m3m3tic.com",
  /** Where the product is actually delivered after purchase. */
  deliveryPlatform: "Circle (courses.johncrestani.com)",
  /** Vendor FAQ: Bonfire Terminal access is a trial, then it stops. */
  bonfireTrialDays: 21,
  /**
   * Vendor FAQ, verbatim: "Bonfire Terminal starts at $5,000, so your commission
   * is approximately $1,000 per sale." This is the number that explains the
   * headline claim, and the vendor is the source for both halves of it.
   */
  bonfirePriceFrom: 5000,
  memberAffiliateCommissionPct: 20,
  sourceUrl: "https://joinaimarketers.club/ds24/",
  verifiedAt: "2026-08-06",
} as const;

/** What the vendor lists as included. Left column = their label, verbatim. */
export const CLUB_INCLUDES: { item: string; detail: string }[] = [
  {
    item: "11-module video course",
    detail: "Niche selection through to scaling with paid traffic.",
  },
  {
    item: "2× weekly live webinars",
    detail:
      "Mondays 3–5pm PT (Super Affiliate Sessions) and Thursdays 1–3pm PT (Bonfire Terminal onboarding). The vendor states 55+ sessions are archived as replays going back to 2024.",
  },
  {
    item: "30+ AI marketing personas",
    detail: "Pre-built AI agent prompts organised by niche.",
  },
  {
    item: "Bonus Vault — 32 items",
    detail:
      "Resellable course videos, pre-built affiliate landing pages, copywriting trainings, AI video tools, quickstart and prompting guide PDFs.",
  },
  {
    item: "21-day Bonfire Terminal access",
    detail:
      "A trial, activated automatically on your Circle membership. It expires — see below.",
  },
  {
    item: "High-ticket affiliate program access",
    detail:
      "The right to promote Bonfire Terminal for 20% commission, plus the vendor's promotional assets.",
  },
];
