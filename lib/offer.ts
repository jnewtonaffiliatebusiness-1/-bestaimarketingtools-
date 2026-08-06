/**
 * THE OFFER — AI Marketers Club (Digistore24 product 300124).
 *
 * This is the one product this site earns a commission on directly, so the
 * affiliate URL lives here and NOWHERE else. It was previously copy-pasted as a
 * string literal in 7 files (nav, footer, hero, review CTA, /best, /category,
 * /compare). A single mistyped affiliate ID in any one of those pays a stranger,
 * and it fails silently — the link still works, the page still looks right.
 *
 * Build `clubUrl()` instead of writing the URL again.
 *
 * ── Affiliate ID is in the PATH, not a query param ──────────────────────────
 *   https://www.digistore24.com/redir/{PRODUCT}/{AFFILIATE}/{CAMPAIGN_KEY}
 * scripts/affiliate_guard.js checks this shape specifically. Do not "simplify"
 * the path segments below into one string — the guard reads them separately.
 */

export const CLUB_PRODUCT_ID = "300124";
export const CLUB_AFFILIATE_ID = "JNewton";
export const CLUB_CAMPAIGN_KEY = "aitoolshub";

/** Where a click goes. Nothing else in the codebase should build this string. */
export function clubUrl(medium: string, campaign: string): string {
  const url = new URL(
    `https://www.digistore24.com/redir/${CLUB_PRODUCT_ID}/${CLUB_AFFILIATE_ID}/${CLUB_CAMPAIGN_KEY}`
  );
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
  processor: "Digistore24",
  /** Advertised price. The Digistore24 checkout itself renders $25.80. */
  price: 27,
  /** Vendor FAQ: "$27 is a one-time payment for lifetime access". */
  billing: "one-time" as const,
  /** Vendor FAQ: full refund within 60 days, handled by Digistore24. */
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
