import type { Metadata } from "next";
import Link from "next/link";
import { getPairs } from "@/lib/vs";
import { formatStartingPrice } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Tool Comparisons: Side-by-Side Pricing and Limits",
  description:
    "Head-to-head comparisons of marketing, CRM, email and SEO tools — entry pricing, the " +
    "limit that binds first, and the drawbacks of both, taken from our own reviews.",
  alternates: { canonical: "/vs" },
};

/**
 * The index exists for crawlers as much as for readers.
 *
 * On 2026-08-11 GSC reported 20 of this domain's 24 unindexed pages as
 * "Discovered, currently not indexed", and thin internal linking is one of the
 * things that produces that status. Fifty pages reachable only from the sitemap
 * would be fifty orphans; every one of them is linked from here, and each links
 * to up to six siblings in its own category.
 */
export default function VsIndexPage() {
  const pairs = getPairs();

  const byCategory = new Map<string, typeof pairs>();
  for (const p of pairs) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav className="mb-6 text-sm text-[#8a857c]">
        <Link href="/" className="transition hover:text-[#1a1a1a]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[#55514a]">Comparisons</span>
      </nav>

      <h1 className="mb-4 text-4xl font-black text-[#1a1a1a] md:text-5xl">Tool comparisons</h1>
      <p className="mb-10 max-w-2xl text-lg text-[#55514a]">
        {pairs.length} head-to-head pages, each built from our own reviews of the two products.
        Entry pricing, our rating, and the drawbacks of both — including the cases where two
        prices cannot honestly be ranked against each other.
      </p>

      {[...byCategory.entries()].map(([category, list]) => (
        <section key={category} className="mb-10">
          <h2 className="mb-4 text-xl font-bold capitalize text-[#1a1a1a]">
            {category.replace(/-/g, " ")}{" "}
            <span className="text-sm font-normal text-[#8a857c]">({list.length})</span>
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {list.map((p) => {
              const pa = formatStartingPrice(p.a.review.frontmatter);
              const pb = formatStartingPrice(p.b.review.frontmatter);
              return (
                <li key={p.slugs}>
                  <Link
                    href={`/vs/${p.slugs}`}
                    className="block rounded-xl border border-[#e6e2da] bg-white px-4 py-3 transition hover:border-[#b8460f]"
                  >
                    <span className="block text-sm font-medium text-[#1a1a1a]">
                      {p.a.name} vs {p.b.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#8a857c]">
                      {pa ?? "see site"} · {pb ?? "see site"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
