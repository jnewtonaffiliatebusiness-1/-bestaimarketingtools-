import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { getReviewsByCategory } from "@/lib/reviews";
import StarRating from "@/components/review/StarRating";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `Best ${category.name} Tools — ${category.productCount} Reviews`,
    description: `We reviewed ${category.productCount} ${category.name.toLowerCase()} tools. Find the best option for your business with our honest, in-depth analysis.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const reviews = getReviewsByCategory(slug);

  // Sort by rating desc
  const sorted = [...reviews].sort(
    (a, b) => b.frontmatter.rating - a.frontmatter.rating
  );
  const topPick = sorted[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/reviews" className="hover:text-white transition">Reviews</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="text-5xl mb-4">{category.icon}</div>
        <h1 className="mb-3 text-4xl font-black text-white md:text-5xl">
          Best {category.name} Tools
        </h1>
        <p className="text-lg text-gray-400">{category.description}</p>
        <p className="mt-2 text-sm text-gray-600">
          {reviews.length} tools reviewed — updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Top Pick Banner */}
      {topPick && (
        <div
          className="mb-10 rounded-2xl border p-6"
          style={{ borderColor: category.color + "40", backgroundColor: category.color + "10" }}
        >
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: category.color }}>
            Our Top Pick
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">
            {topPick.frontmatter.title.split(":")[0]}
          </h2>
          <StarRating rating={topPick.frontmatter.rating} size="sm" />
          <p className="mt-2 text-sm text-gray-400">{topPick.frontmatter.verdict}</p>
          <Link
            href={`/reviews/${topPick.frontmatter.slug}`}
            className="mt-4 inline-block rounded-lg px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            style={{ backgroundColor: category.color }}
          >
            Read Full Review →
          </Link>
        </div>
      )}

      {/* All reviews in category */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">All {category.name} Reviews</h2>
        <span className="text-sm text-gray-500">{sorted.length} tools</span>
      </div>

      <div className="space-y-4">
        {sorted.map((review, i) => (
          <Link
            key={review.frontmatter.slug}
            href={`/reviews/${review.frontmatter.slug}`}
            className="group flex items-center gap-6 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/8"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800 font-bold text-gray-400">
              #{i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white group-hover:text-amber-400 transition">
                {review.frontmatter.title.split(":")[0]}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                {review.frontmatter.verdict}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <StarRating rating={review.frontmatter.rating} size="sm" />
              <p className="mt-1 text-xs text-gray-600">
                From ${review.frontmatter.pricingStart}/{review.frontmatter.pricingUnit}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bonfire CTA */}
      <div className="mt-12 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white">
          Not satisfied with any of these?
        </h2>
        <p className="mb-6 text-gray-400">
          See why thousands of marketers choose Bonfire Terminal over every tool in this category.
        </p>
        <Link
          href={`https://www.digistore24.com/redir/300124/JNewton/aitoolshub?utm_source=reviewsite&utm_medium=category&utm_campaign=${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl bg-amber-500 px-8 py-4 font-bold text-black transition hover:bg-amber-400"
        >
          See Bonfire Terminal →
        </Link>
      </div>
    </div>
  );
}
