import Link from "next/link";

/**
 * Compact E-E-A-T + FTC trust strip shown near the top of every review.
 *
 * REWRITTEN 2026-08-05. What it used to say:
 *   "Our Editorial Team tests every tool on real campaigns and scores it on a
 *    fixed 1–5 rubric — never from a spec sheet."
 *
 * That was not true and the reviews themselves contradicted it. The six
 * hand-written pages — the only indexed ones — openly cite their sources as
 * "Straight from HighLevel's own pricing page" and "HighLevel's pricing page
 * states", which is precisely the spec sheet the strip disclaimed. And "every
 * tool" was a claim about 101 products, ~99 of which nobody has opened.
 *
 * The claim it replaces is weaker-sounding and actually defensible: primary-source
 * pricing, attributed vendor claims, and a stated commercial interest. A reader who
 * checks a price against the vendor's page will find it matches — which is worth
 * more than an unverifiable assertion of hands-on testing.
 *
 * If a specific review IS based on hands-on use, say so in that review, not here.
 * Never restore a site-wide testing claim.
 */
export default function EditorialTrust() {
  return (
    <div className="mb-8 flex items-start gap-3 rounded-xl border border-[#e6e2da] bg-white p-4 text-sm leading-relaxed text-[#55514a]">
      <span aria-hidden className="mt-0.5 text-[#b8460f]">✓</span>
      <p>
        <span className="font-semibold text-[#55514a]">How this review was built.</span>{" "}
        Pricing, tiers and limits come from the vendor&apos;s own pricing page and
        documentation as of the date above — and where a figure is the vendor&apos;s claim,
        we say so rather than repeat it as fact. Some links on this page are affiliate links:
        we may earn a commission at no extra cost to you, which is why the drawbacks are
        printed in full on this page rather than left for you to find later.{" "}
        <Link href="/about" className="text-[#b8460f] underline-offset-2 hover:text-[#b8460f] hover:underline transition">
          See our full methodology &amp; disclosure →
        </Link>
      </p>
    </div>
  );
}
