import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPairs, getPairBySlugs, getRelatedPairs, getDifferences, type Product } from "@/lib/vs";
import { formatStartingPrice } from "@/lib/pricing";
import StarRating from "@/components/review/StarRating";

interface Props {
  params: { slugs: string };
}

/**
 * Static generation is the point of the section — every /vs/ URL that exists is
 * one of the 50 in lib/vs.ts, and any other combination 404s.
 *
 * The old /compare/[slugs] route was fully dynamic, so it answered on ANY pair of
 * review slugs. That is an unbounded URL space of near-identical pages on a domain
 * whose dominant Search Console status is already "Discovered, currently not
 * indexed". Bounding it is half the experiment.
 */
export async function generateStaticParams() {
  return getPairs().map((p) => ({ slugs: p.slugs }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pair = getPairBySlugs(params.slugs);
  if (!pair) return {};
  const { a, b } = pair;
  return {
    title: `${a.name} vs ${b.name}: Pricing, Limits and Which to Pick`,
    description:
      `${a.name} vs ${b.name} — entry pricing, the limit that binds first on each, and the ` +
      `drawbacks of both, taken from our own reviews of the two.`,
    alternates: { canonical: `/vs/${pair.slugs}` },
  };
}

/** One product's column: the verdict, pros and cons from its own hand-written review. */
function ProductPanel({ product }: { product: Product }) {
  const fm = product.review.frontmatter;
  const price = formatStartingPrice(fm);
  return (
    <div className="rounded-2xl border border-[#e6e2da] bg-white p-6">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-bold text-[#1a1a1a]">{product.name}</h3>
        <span className="whitespace-nowrap text-sm text-[#8a857c]">
          {price ? `from ${price}` : "see site"}
        </span>
      </div>
      <StarRating rating={fm.rating} size="sm" />
      <p className="mt-3 text-sm text-[#55514a]">{fm.verdict}</p>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#0f766e]">
        What works
      </p>
      <ul className="mt-2 space-y-1.5">
        {fm.pros.map((p, i) => (
          <li key={i} className="text-sm text-[#55514a]">
            <span className="text-[#0f766e]">✓</span> {p}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#b8460f]">
        What does not
      </p>
      <ul className="mt-2 space-y-1.5">
        {fm.cons.map((c, i) => (
          <li key={i} className="text-sm text-[#55514a]">
            <span className="text-[#b8460f]">✗</span> {c}
          </li>
        ))}
      </ul>

      <Link
        href={`/reviews/${fm.slug}`}
        className="mt-5 inline-block text-sm font-medium text-[#b8460f] transition hover:text-[#9e3c0d]"
      >
        Read the full {product.name} review →
      </Link>
    </div>
  );
}

export default async function VsPage({ params }: Props) {
  const pair = getPairBySlugs(params.slugs);
  if (!pair) notFound();

  const { a, b, category } = pair;
  const fa = a.review.frontmatter;
  const fb = b.review.frontmatter;
  const differences = getDifferences(a, b);
  const related = getRelatedPairs(pair.slugs, category, 6);
  const categoryLabel = category.replace(/-/g, " ");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav className="mb-6 text-sm text-[#8a857c]">
        <Link href="/" className="transition hover:text-[#1a1a1a]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/vs" className="transition hover:text-[#1a1a1a]">Comparisons</Link>
        <span className="mx-2">/</span>
        <span className="text-[#55514a]">{a.name} vs {b.name}</span>
      </nav>

      <h1 className="mb-4 text-4xl font-black text-[#1a1a1a] md:text-5xl">
        {a.name} vs {b.name}
      </h1>

      {/*
        The lede is the two review TITLES, which on this site are written to BE the
        fact rather than to describe the page ("Copper's Basic Plan Holds 2,500
        Contacts But Only 25 Companies"). That makes the opening of every page in
        the section different by construction, instead of adjective-substitution
        into a shared sentence — which is precisely what got the previous 100
        template pages noindexed.
      */}
      <div className="mb-10 space-y-2 border-l-2 border-[#e6e2da] pl-5">
        <p className="text-lg text-[#55514a]">{fa.title}</p>
        <p className="text-lg text-[#55514a]">{fb.title}</p>
      </div>

      <section className="mb-10 rounded-2xl border border-[#e6e2da] bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold text-[#1a1a1a]">The short answer</h2>
        <dl className="space-y-4">
          {differences.map((d) => (
            <div key={d.label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[#8a857c]">
                {d.label}
              </dt>
              <dd className="mt-1 text-[#55514a]">{d.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <ProductPanel product={a} />
        <ProductPanel product={b} />
      </div>

      {/*
        Built from each product's own first pro and first con. No sentence here
        asserts anything the two reviews do not already say — the page's job is to
        put them side by side, not to invent a tiebreak.
      */}
      <section className="mb-10 rounded-2xl border border-[#e6e2da] bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold text-[#1a1a1a]">Who should pick which</h2>
        <p className="mb-4 text-[#55514a]">
          <strong className="text-[#1a1a1a]">Pick {a.name}</strong> if this matters most to
          you: {fa.pros[0].charAt(0).toLowerCase() + fa.pros[0].slice(1)}. The thing that most
          often rules it out: {fa.cons[0].charAt(0).toLowerCase() + fa.cons[0].slice(1)}.
        </p>
        <p className="text-[#55514a]">
          <strong className="text-[#1a1a1a]">Pick {b.name}</strong> if this matters most to
          you: {fb.pros[0].charAt(0).toLowerCase() + fb.pros[0].slice(1)}. The thing that most
          often rules it out: {fb.cons[0].charAt(0).toLowerCase() + fb.cons[0].slice(1)}.
        </p>
      </section>

      {/*
        Kept deliberately short. This block is identical on all 50 pages, so every
        word of it is duplicate text across the section — see
        scripts/vs_shingle_gate.js. The first draft ran 90 words and pushed the
        tranche's mean overlap above the gate on its own.
      */}
      <p className="mb-10 text-sm leading-relaxed text-[#8a857c]">
        Figures come from our review of each product, checked against the vendor&apos;s own
        pricing page. We do not convert currencies or rank prices quoted on different billing
        periods — where that applies it is said above, not quietly resolved.
      </p>

      {/*
        SPONSORED BLOCK — deliberately says nothing about what these two products ARE.

        The /compare route this section replaces had already been through this once:
        its original copy claimed Bonfire was "purpose-built to solve the exact
        problems that make users switch between" whichever two tools the page
        happened to compare — asserted about every pair, true of none by design. The
        replacement copy said "{a} and {b} are both cloud subscriptions you pay for
        monthly", which is the same mistake with a smaller blast radius: Screaming
        Frog is a desktop licence, and Rank Math and Yoast are WordPress plugins.

        So this block states only what is true of Bonfire Terminal itself, which
        holds regardless of which pair the reader arrived on.
      */}
      <section className="mb-10 rounded-2xl border border-[#1b3a6b]/40 bg-[#eef1f6] p-8">
        <div className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#b8460f]">
          Sponsored · affiliate link
        </div>
        <h2 className="mb-4 text-2xl font-bold text-[#1a1a1a]">
          A third option, and what it is not
        </h2>
        {/*
          Every disclosure the site requires is still here — the label above, what
          the product is not, the $27, the 21 days, the $5,000 and the commission.
          Only the prose around them was cut, to hold the section under the
          duplicate-content gate.
        */}
        <p className="mb-6 text-[#55514a]">
          Bonfire Terminal is an AI agent that runs as a{" "}
          <strong className="text-[#1a1a1a]">desktop app on your own machine</strong> — no cloud,
          nothing you type leaves your computer. It does not do what {a.name} or {b.name} do, and
          we will not pretend it does. If either is doing its job for you, keep it.
        </p>
        <Link
          href={`/ai-marketers-club?from=vs-${pair.slugs}`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#b8460f] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#9e3c0d]"
        >
          What the $27 actually gets you
          <span>→</span>
        </Link>
        <p className="mt-4 text-xs leading-relaxed text-[#8a857c]">
          The way in is the AI Marketers Club — $27 one-time, including <strong>21 days</strong>{" "}
          of access. Keeping it after that is a separate purchase; the vendor&apos;s FAQ states
          Bonfire Terminal starts at $5,000. We earn a commission at no extra cost to you, which
          is why both tools&apos; drawbacks are printed in full above and the $5,000 is here
          rather than left for you to find later.
        </p>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-[#1a1a1a]">
            Other {categoryLabel} comparisons
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((p) => (
              <li key={p.slugs}>
                <Link
                  href={`/vs/${p.slugs}`}
                  className="block rounded-xl border border-[#e6e2da] bg-white px-4 py-3 text-sm text-[#55514a] transition hover:border-[#b8460f] hover:text-[#1a1a1a]"
                >
                  {p.a.name} vs {p.b.name} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
