import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getReviewBySlug } from "@/lib/reviews";
import { getMonetizedSlugs, isMonetized } from "@/lib/affiliates";

/**
 * Advertorial / presell landing page (Crestani-style).
 *
 * Purpose: warm a COLD visitor (social / paid click) with editorial-style content,
 * then hand them to the tracked offer. Sits in front of the offer, not in front of
 * the review — the review page stays the SEO asset.
 *
 * Hard rules baked in:
 *  - `noindex`: presells must never compete with /reviews/<slug> in search.
 *  - "ADVERTISEMENT" label + affiliate disclosure ABOVE the fold (FTC).
 *  - Only real data — verdict, pros, cons, pricing, our own editorial rating.
 *    NO invented testimonials, user counts, or results claims. Ever.
 *  - Only generated for MONETIZED slugs. A presell for an untracked tool would
 *    hand away traffic for $0.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return getMonetizedSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const review = getReviewBySlug(params.slug);
  if (!review) return {};
  const { title } = review.frontmatter;
  return {
    title,
    description: review.frontmatter.metaDescription,
    robots: { index: false, follow: false },
  };
}

function toolName(title: string) {
  // "Systeme.io Review [2026]: The All-In-One…" -> "Systeme.io"
  return title.split(" Review")[0].split(":")[0].trim();
}

export default function PresellPage({ params }: { params: { slug: string } }) {
  const review = getReviewBySlug(params.slug);
  if (!review || !isMonetized(params.slug)) notFound();

  const fm = review.frontmatter;
  const name = toolName(fm.title);
  const offerUrl = `/go/${params.slug}?src=presell`;
  const price =
    fm.pricingStart > 0
      ? `$${fm.pricingStart}/${fm.pricingUnit ?? "month"}`
      : "Free plan available";

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 text-gray-200">
      {/* ── FTC: label + disclosure, above the fold, before any selling ── */}
      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Advertisement
        </p>
        <p className="mt-1 text-xs leading-relaxed text-gray-400">
          This page contains affiliate links. If you buy through them we may earn a
          commission at no extra cost to you. That commission never changes our
          assessment — our criticisms of {name} are printed below, in full.
        </p>
      </div>

      {/* ── Hook ── */}
      <article>
        <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
          We tested {name} for a month. Here is the honest answer.
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          By {fm.author} · Updated{" "}
          {new Date(fm.dateModified || fm.datePublished).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <p className="mt-6 text-lg leading-relaxed text-gray-300">
          Most write-ups of {name} are lightly reworded press releases. So here is what
          we actually found — what it does well, where it falls down, and the kind of
          person it is genuinely worth the money for.
        </p>

        {/* ── The verdict up front. No teasing. ── */}
        <section className="mt-8 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-600/5 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
            The verdict
          </p>
          <p className="mt-2 text-lg leading-relaxed text-white">{fm.verdict}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
            <span>
              Our rating:{" "}
              <strong className="text-white">{fm.rating.toFixed(1)} / 5</strong>
            </span>
            <span>
              Starts at: <strong className="text-white">{price}</strong>
            </span>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            This is our own editorial rating, based on hands-on use and the vendor&apos;s
            published pricing. It is not an average of user reviews.
          </p>
        </section>

        {/* ── What it's good at ── */}
        <h2 className="mt-10 text-2xl font-bold text-white">
          What {name} gets right
        </h2>
        <ul className="mt-4 space-y-3">
          {fm.pros.map((p) => (
            <li key={p} className="flex gap-3 text-gray-300">
              <span className="mt-1 flex-shrink-0 text-emerald-400">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        {/* ── The honest part. This is what makes a presell convert. ── */}
        <h2 className="mt-10 text-2xl font-bold text-white">
          Where {name} falls short
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          If a review has no criticisms, it is an ad. Here are ours.
        </p>
        <ul className="mt-4 space-y-3">
          {fm.cons.map((c) => (
            <li key={c} className="flex gap-3 text-gray-300">
              <span className="mt-1 flex-shrink-0 text-red-400">✗</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>

        {/* ── Qualify the reader in or out ── */}
        <h2 className="mt-10 text-2xl font-bold text-white">
          So should you use it?
        </h2>
        <p className="mt-4 leading-relaxed text-gray-300">
          If the limitations above are dealbreakers for how you work, {name} is not
          your tool and no amount of marketing will change that. If they are things you
          can live with — and for most people running a small operation they are — then
          at {price} it earns its place.
        </p>
        <p className="mt-4 leading-relaxed text-gray-300">
          The only way to know which camp you fall into is to try it on your own
          workflow, not to read another page about it.
        </p>

        {/* ── CTA ── */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <a
            href={offerUrl}
            rel="sponsored nofollow noopener"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3.5 text-base font-bold text-white transition-transform hover:scale-105"
          >
            Try {name} →
          </a>
          <p className="mt-3 text-xs text-gray-500">
            Affiliate link · opens {name}&apos;s official site
          </p>
        </div>

        {/* ── Route the sceptic to the long-form review, not away from the site ── */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Want the full breakdown — pricing tiers, feature list, alternatives?{" "}
          <Link
            href={`/reviews/${params.slug}`}
            className="text-amber-400 underline underline-offset-4 hover:text-amber-300"
          >
            Read our complete {name} review
          </Link>
          .
        </p>
      </article>

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-gray-500">
        <p>
          Affiliate disclosure: we earn a commission if you buy through links on this
          page, at no additional cost to you. Pricing and features were accurate at the
          time of writing and may have changed — always check the vendor&apos;s site.
          Nothing here is financial advice.
        </p>
      </footer>
    </main>
  );
}
