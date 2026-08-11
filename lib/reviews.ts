import fs from "fs";
import path from "path";
import matter from "gray-matter";

const REVIEWS_DIR = path.join(process.cwd(), "content/reviews");

export interface ReviewFrontmatter {
  title: string;
  slug: string;
  category: string;
  rating: number;
  pricingStart: number;
  pricingUnit: string;
  affiliateUrl: string;
  heroImage: string;
  logoImage: string;
  verdict: string;
  pros: string[];
  cons: string[];
  datePublished: string;
  dateModified: string;
  author: string;
  metaDescription?: string;
  /**
   * The product being reviewed, e.g. "GoHighLevel".
   *
   * Without this, the name is derived from the title by splitting on " Review"
   * and ":" — which works for the templated "X Review: …" titles but produces
   * nonsense for editorial headlines. "What a 15-Client Agency Actually Pays for
   * GoHighLevel" derived to itself, and surfaced verbatim in the sponsored CTA
   * ("our criticisms of What a 15-Client Agency Actually Pays for GoHighLevel")
   * and in the itemReviewed name of the Review JSON-LD. Set it explicitly on any
   * review whose title is not "<Product> Review: …".
   */
  productName?: string;
  comparisonRows?: { feature: string; product: string; bonfire: string }[];
  productWeaknesses?: string[];
  testimonial?: string;
  featured?: boolean;
  /**
   * Set on the 100 template-generated reviews (2026-08-01). They were 76%
   * byte-identical to each other, which suppressed the whole domain — GSC
   * showed 0 clicks / 2 impressions in 3 months. Emits robots noindex and
   * excludes the page from the sitemap. Remove the flag to re-index.
   */
  noindex?: boolean;
  /**
   * Currency symbol for pricingStart, e.g. "£" or "€". Defaults to "$".
   *
   * Every price render site used to hardcode a "$", so a tool priced in another
   * currency displayed a real number against the wrong symbol — Screaming Frog
   * is £199/year and rendered as "$199". Set this whenever the vendor's own
   * pricing page does not quote USD.
   */
  pricingCurrency?: string;
}

/**
 * The single place a starting price becomes display text.
 *
 * Two failures this exists to prevent, both of which were live:
 *   1. a hardcoded "$" in front of a £ or € figure;
 *   2. "Starting at $0/month" on every tool whose entry tier is free, because
 *      pricingStart: 0 was rendered rather than treated as "no paid floor".
 *
 * Returns null when there is no meaningful starting price, so callers can omit
 * the line entirely instead of printing a zero. Callers that need prose for the
 * zero case should supply their own — see the comparison row in
 * app/reviews/[slug]/page.tsx.
 */
export function formatStartingPrice(
  fm: Pick<ReviewFrontmatter, "pricingStart" | "pricingUnit" | "pricingCurrency">
): string | null {
  if (!fm.pricingStart || fm.pricingStart <= 0) return null;
  const currency = fm.pricingCurrency ?? "$";
  const unit = fm.pricingUnit ?? "month";
  return `${currency}${fm.pricingStart}/${unit}`;
}

export interface Review {
  frontmatter: ReviewFrontmatter;
  content: string;
}

export function getAllReviewSlugs(): string[] {
  if (!fs.existsSync(REVIEWS_DIR)) return [];
  return fs
    .readdirSync(REVIEWS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

export function getReviewBySlug(slug: string): Review | null {
  const filePath = path.join(REVIEWS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as ReviewFrontmatter, content };
}

export function getAllReviews(): Review[] {
  const slugs = getAllReviewSlugs();
  return slugs
    .map((slug) => getReviewBySlug(slug))
    .filter((r): r is Review => r !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.datePublished).getTime() -
        new Date(a.frontmatter.datePublished).getTime()
    );
}

export function getReviewsByCategory(category: string): Review[] {
  return getAllReviews().filter((r) => r.frontmatter.category === category);
}

export function getFeaturedReviews(limit = 6): Review[] {
  const all = getAllReviews();
  const featured = all.filter((r) => r.frontmatter.featured);
  return featured.length >= limit
    ? featured.slice(0, limit)
    : all.slice(0, limit);
}
