import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getReviewBySlug } from "@/lib/reviews";
import StarRating from "@/components/review/StarRating";

interface Props {
  params: { slugs: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = params;
  const parts = slugs.split("-vs-");
  if (parts.length !== 2) return {};
  const [aSlug, bSlug] = parts;
  const a = getReviewBySlug(aSlug);
  const b = getReviewBySlug(bSlug);
  if (!a || !b) return {};
  const aName = a.frontmatter.title.split(" Review")[0].split(":")[0].trim();
  const bName = b.frontmatter.title.split(" Review")[0].split(":")[0].trim();
  return {
    title: `${aName} vs ${bName}: Which Is Better in 2025?`,
    description: `${aName} vs ${bName} — side-by-side comparison of features, pricing, pros & cons. Find out which tool wins for your use case.`,
    alternates: { canonical: `/compare/${slugs}` },
  };
}

export default async function ComparePage({ params }: Props) {
  const { slugs } = params;
  const parts = slugs.split("-vs-");
  if (parts.length !== 2) notFound();

  const [aSlug, bSlug] = parts;
  const reviewA = getReviewBySlug(aSlug);
  const reviewB = getReviewBySlug(bSlug);
  if (!reviewA || !reviewB) notFound();

  const a = reviewA.frontmatter;
  const b = reviewB.frontmatter;
  const aName = a.title.split(" Review")[0].split(":")[0].trim();
  const bName = b.title.split(" Review")[0].split(":")[0].trim();

  const rows = [
    { label: "Rating", a: `${a.rating}/5`, b: `${b.rating}/5`, winner: a.rating >= b.rating ? "a" : "b" },
    { label: "Starting Price", a: `$${a.pricingStart}/${a.pricingUnit}`, b: `$${b.pricingStart}/${b.pricingUnit}`, winner: a.pricingStart <= b.pricingStart ? "a" : "b" },
    { label: "Category", a: a.category.replace(/-/g, " "), b: b.category.replace(/-/g, " "), winner: null },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/reviews" className="hover:text-white transition">Reviews</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">{aName} vs {bName}</span>
      </nav>

      <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">
        {aName} vs {bName}
      </h1>
      <p className="mb-10 text-lg text-gray-400">
        Side-by-side comparison: features, pricing, pros & cons — so you can pick the right tool.
      </p>

      {/* Quick comparison */}
      <div className="mb-10 grid grid-cols-2 gap-6">
        {[{ review: reviewA, name: aName }, { review: reviewB, name: bName }].map(({ review, name }) => (
          <div
            key={review.frontmatter.slug}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h2 className="mb-3 text-xl font-bold text-white">{name}</h2>
            <StarRating rating={review.frontmatter.rating} size="sm" />
            <p className="mt-3 text-sm text-gray-400">{review.frontmatter.verdict}</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-gray-500">
                <span className="text-gray-400 font-medium">Price: </span>
                From ${review.frontmatter.pricingStart}/{review.frontmatter.pricingUnit}
              </p>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs text-emerald-400 font-medium">Pros:</p>
              {review.frontmatter.pros.slice(0, 3).map((p, i) => (
                <p key={i} className="text-xs text-gray-400">✓ {p}</p>
              ))}
            </div>
            <Link
              href={`/reviews/${review.frontmatter.slug}`}
              className="mt-4 inline-block text-xs text-amber-400 hover:text-amber-300 transition"
            >
              Full review →
            </Link>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mb-10 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-5 py-3 text-left text-gray-400 text-sm">Feature</th>
              <th className="px-5 py-3 text-left text-white text-sm">{aName}</th>
              <th className="px-5 py-3 text-left text-white text-sm">{bName}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-white/5">
                <td className="px-5 py-3 text-sm text-gray-500">{row.label}</td>
                <td className={`px-5 py-3 text-sm ${row.winner === "a" ? "font-semibold text-amber-400" : "text-gray-300"}`}>
                  {row.a}
                </td>
                <td className={`px-5 py-3 text-sm ${row.winner === "b" ? "font-semibold text-amber-400" : "text-gray-300"}`}>
                  {row.b}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verdict */}
      <div className="mb-10 rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-3 text-xl font-bold text-white">Our Verdict</h2>
        <p className="text-gray-400">
          Both {aName} and {bName} are solid choices, but the right pick depends on your specific
          needs. {a.rating >= b.rating ? aName : bName} scores higher in our testing with a{" "}
          {Math.max(a.rating, b.rating).toFixed(1)}/5 rating.
        </p>
        <p className="mt-3 text-gray-400">
          Before committing to either, consider whether Bonfire Terminal might be a better fit —
          it outperforms most tools in this category at a competitive price.
        </p>
      </div>

      {/* Bonfire CTA */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-white">
          There&apos;s a third option worth considering
        </h2>
        <p className="mb-6 text-gray-400">
          Bonfire Terminal was purpose-built to solve the exact problems that make users switch
          between tools like {aName} and {bName}.
        </p>
        <Link
          href={`https://bonfireterminal.com?utm_source=reviewsite&utm_medium=compare&utm_campaign=${slugs}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl bg-amber-500 px-8 py-4 font-bold text-black transition hover:bg-amber-400"
        >
          Try Bonfire Terminal Free →
        </Link>
      </div>
    </div>
  );
}
