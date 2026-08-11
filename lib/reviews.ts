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

// Price display helpers live in lib/pricing.ts — this module imports `fs`, and
// client components ("use client") that import a real function from here fail
// the build with "Module not found: Can't resolve 'fs'".

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

/**
 * Sort key for review ordering.
 *
 * A missing datePublished used to produce `new Date(undefined).getTime()` =
 * NaN, and every NaN comparison is false — so the 25 hand-written pages (the 5
 * pillars and all 20 rewrites) sorted unpredictably against the 81 templated
 * ones. Those 25 are precisely the pages we want surfaced first. Dates have
 * since been backfilled from the real rewrite commits, and this guard keeps a
 * future frontmatter omission from silently scrambling the order again.
 */
function publishedTime(r: Review): number {
  const t = new Date(r.frontmatter.datePublished).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function getAllReviews(): Review[] {
  const slugs = getAllReviewSlugs();
  return slugs
    .map((slug) => getReviewBySlug(slug))
    .filter((r): r is Review => r !== null)
    .sort((a, b) => publishedTime(b) - publishedTime(a));
}

export function getReviewsByCategory(category: string): Review[] {
  return getAllReviews().filter((r) => r.frontmatter.category === category);
}

/**
 * Sibling reviews to link to from a review page, indexable ones first.
 *
 * Why the ordering matters: 80 of the 106 reviews are noindexed, so a plain
 * "first 6 in this category" was overwhelmingly likely to link a page we want
 * ranked to six pages we have told Google to ignore. GSC's dominant status on
 * this property is "Discovered - currently not indexed" (20 of 24 unindexed
 * pages, read 2026-08-11), and thin internal linking is one of the things that
 * produces it. Pointing the links at pages that CAN rank concentrates the
 * signal instead of spending it.
 *
 * Noindexed siblings are still used as filler when a category has too few
 * indexable pages — they carry `noindex, follow`, so the link is not wasted,
 * it is just worth less than an indexable one.
 */
export function getRelatedReviews(
  category: string,
  excludeSlug: string,
  limit = 6
): Review[] {
  const siblings = getReviewsByCategory(category).filter(
    (r) => r.frontmatter.slug !== excludeSlug
  );
  const indexable = siblings.filter((r) => !r.frontmatter.noindex);
  const rest = siblings.filter((r) => r.frontmatter.noindex);
  return [...indexable, ...rest].slice(0, limit);
}

export function getFeaturedReviews(limit = 6): Review[] {
  const all = getAllReviews();
  const featured = all.filter((r) => r.frontmatter.featured);
  return featured.length >= limit
    ? featured.slice(0, limit)
    : all.slice(0, limit);
}
