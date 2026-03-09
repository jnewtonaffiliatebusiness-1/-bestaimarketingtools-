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
  comparisonRows?: { feature: string; product: string; bonfire: string }[];
  productWeaknesses?: string[];
  testimonial?: string;
  featured?: boolean;
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
