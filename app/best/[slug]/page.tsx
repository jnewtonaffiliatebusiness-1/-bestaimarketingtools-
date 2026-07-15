import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getReviewsByCategory } from "@/lib/reviews";
import { CATEGORIES } from "@/lib/categories";
import StarRating from "@/components/review/StarRating";

const BEST_OF_CONFIG: Record<string, { category: string; title: string; desc: string }> = {
  "best-ai-marketing-tools": {
    category: "ai-marketing-automation",
    title: "Best AI Marketing Automation Tools",
    desc: "The top AI marketing tools reviewed and ranked for cold outreach, content generation, and ad creative.",
  },
  "best-email-marketing-platforms": {
    category: "email-marketing",
    title: "Best Email Marketing Platforms",
    desc: "We tested every major email marketing platform. Here are the best options for every use case and budget.",
  },
  "best-seo-tools": {
    category: "seo-content-tools",
    title: "Best SEO Tools",
    desc: "From keyword research to technical audits: the best SEO tools ranked by our team after hands-on testing.",
  },
  "best-social-media-tools": {
    category: "social-media-analytics",
    title: "Best Social Media Tools",
    desc: "Scheduling, analytics, monitoring — the best social media tools for teams of every size.",
  },
  "best-crm-tools": {
    category: "crm-sales-automation",
    title: "Best CRM & Sales Automation Tools",
    desc: "The best CRM systems ranked for ease of use, features, and value. Find the right CRM for your team.",
  },
};

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return Object.keys(BEST_OF_CONFIG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const config = BEST_OF_CONFIG[slug];
  if (!config) return {};
  return {
    title: `${config.title} (2025) — Ranked & Reviewed`,
    description: config.desc,
    alternates: { canonical: `/best/${slug}` },
  };
}

export default async function BestOfPage({ params }: Props) {
  const { slug } = params;
  const config = BEST_OF_CONFIG[slug];
  if (!config) notFound();

  const category = CATEGORIES.find((c) => c.slug === config.category);
  const reviews = getReviewsByCategory(config.category);
  const ranked = [...reviews].sort((a, b) => b.frontmatter.rating - a.frontmatter.rating);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[#8a857c]">
        <Link href="/" className="hover:text-[#1a1a1a] transition">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/best" className="hover:text-[#1a1a1a] transition">Best Of</Link>
        <span className="mx-2">/</span>
        <span className="text-[#55514a]">{config.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-3 inline-block rounded-full bg-[#eef1f6] px-3 py-1 text-xs font-semibold text-[#b8460f]">
        {new Date().getFullYear()} Rankings
      </div>
      <h1 className="mb-4 text-4xl font-black text-[#1a1a1a] md:text-5xl">
        {config.title}
      </h1>
      <p className="mb-8 text-lg text-[#55514a]">{config.desc}</p>

      {/* Ranked list */}
      <div className="space-y-6">
        {ranked.map((review, i) => {
          const name = review.frontmatter.title.split(" Review")[0].split(":")[0].trim();
          const medals = ["🥇", "🥈", "🥉"];
          const medal = i < 3 ? medals[i] : `#${i + 1}`;

          return (
            <div
              key={review.frontmatter.slug}
              className={`rounded-2xl border p-6 ${
                i === 0
                  ? "border-amber-500/40 bg-[#eef1f6]"
                  : "border-[#e6e2da] bg-white"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{medal}</span>
                  <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">{name}</h2>
                    <StarRating rating={review.frontmatter.rating} size="sm" />
                    <p className="mt-2 text-sm text-[#55514a]">{review.frontmatter.verdict}</p>
                    <div className="mt-3 space-y-1">
                      {review.frontmatter.pros.slice(0, 2).map((p, j) => (
                        <p key={j} className="text-xs text-emerald-400">✓ {p}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-right md:shrink-0">
                  <p className="text-sm text-[#55514a]">
                    From ${review.frontmatter.pricingStart}/{review.frontmatter.pricingUnit}
                  </p>
                  <Link
                    href={`/reviews/${review.frontmatter.slug}`}
                    className="rounded-lg border border-[#1b3a6b]/40 px-4 py-2 text-sm font-medium text-[#b8460f] hover:bg-[#eef1f6] transition"
                  >
                    Read Review →
                  </Link>
                  {review.frontmatter.affiliateUrl && (
                    <Link
                      href={review.frontmatter.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="rounded-lg bg-[#eef1f6] px-4 py-2 text-sm text-[#55514a] hover:bg-[#eef1f6] transition"
                    >
                      Visit Site →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonfire CTA */}
      <div className="mt-12 rounded-2xl border border-[#1b3a6b]/40 bg-[#eef1f6] p-8 text-center">
        <h2 className="mb-3 text-2xl font-bold text-[#1a1a1a]">
          Our #0 Recommendation
        </h2>
        <p className="mb-6 text-[#55514a]">
          Before you subscribe to any of the tools above, see Bonfire Terminal — the platform
          built to outperform this entire category.
        </p>
        <Link
          href={`https://www.digistore24.com/redir/300124/JNewton/aitoolshub?utm_source=reviewsite&utm_medium=bestof&utm_campaign=${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl bg-[#b8460f] px-10 py-4 font-bold text-white transition hover:bg-[#9e3c0d]"
        >
          See Bonfire Terminal →
        </Link>
      </div>
    </div>
  );
}
