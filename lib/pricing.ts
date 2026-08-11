/**
 * Price display helpers.
 *
 * These live apart from lib/reviews.ts on purpose. That module imports `fs` to
 * read the MDX files, so a client component ("use client") that imports a real
 * function from it fails the build with "Module not found: Can't resolve 'fs'".
 * Importing only a *type* was fine because types are erased; importing
 * formatStartingPrice was not. FeaturedReviews and ReviewsClient are both client
 * components, so the helpers had to move somewhere with no Node built-ins.
 *
 * Structural types rather than Pick<ReviewFrontmatter, …> keeps this module free
 * of any import from lib/reviews.ts, so the dependency runs one way only.
 */

export interface PriceFields {
  pricingStart: number;
  pricingUnit: string;
  pricingCurrency?: string;
}

/**
 * The single place a starting price becomes display text.
 *
 * Two failures this exists to prevent, both of which were live:
 *   1. a hardcoded "$" in front of a £ or € figure — Screaming Frog is
 *      £199/year and rendered as "$199";
 *   2. "Starting at $0/month" on every tool whose entry tier is free, because
 *      pricingStart: 0 was rendered rather than treated as "no paid floor".
 *
 * Returns null when there is no meaningful starting price, so callers can omit
 * the line or choose their own wording. Callers must NOT default that to
 * "Free plan available": across the corpus pricingStart: 0 means both a real
 * free tier (rank-math, screaming-frog) and an unpublished enterprise price
 * (brandwatch, conductor-seo, emplifi), so any fixed string is false for one
 * group. "See site" is the safe neutral.
 */
export function formatStartingPrice(fm: PriceFields): string | null {
  if (!fm.pricingStart || fm.pricingStart <= 0) return null;
  const currency = fm.pricingCurrency ?? "$";
  const unit = fm.pricingUnit ?? "month";
  return `${currency}${fm.pricingStart}/${unit}`;
}

const CURRENCY_CODES: Record<string, string> = {
  $: "USD",
  "£": "GBP",
  "€": "EUR",
};

/**
 * ISO 4217 code for the Offer.priceCurrency in the Review JSON-LD.
 *
 * This has to track pricingCurrency. The structured data previously hardcoded
 * "USD", so publishing a GBP price without changing it would have told Google
 * that £199 was $199 — a wrong price in a rich result, which is a worse failure
 * than the wrong symbol on the page itself.
 */
export function priceCurrencyCode(fm: Pick<PriceFields, "pricingCurrency">): string {
  return CURRENCY_CODES[fm.pricingCurrency ?? "$"] ?? "USD";
}

/**
 * Whether two starting prices can honestly be ranked against each other.
 *
 * Requires both to be real (a zero is either a free tier or an unpublished
 * enterprise price, and neither is "cheapest"), in the same currency, and on
 * the same billing period — £199/year is not larger than $15/month.
 */
export function priceComparable(a: PriceFields, b: PriceFields): boolean {
  if (!a.pricingStart || !b.pricingStart) return false;
  if (a.pricingStart <= 0 || b.pricingStart <= 0) return false;
  if ((a.pricingCurrency ?? "$") !== (b.pricingCurrency ?? "$")) return false;
  return (a.pricingUnit ?? "month") === (b.pricingUnit ?? "month");
}
