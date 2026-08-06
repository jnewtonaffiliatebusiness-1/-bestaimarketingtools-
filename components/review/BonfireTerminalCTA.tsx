import Link from "next/link";
import ComparisonTable from "./ComparisonTable";

interface ComparisonRow {
  feature: string;
  product: string;
  bonfire: string;
}

interface Props {
  productName: string;
  comparisonRows: ComparisonRow[];
  utmCampaign: string;
}

/**
 * Sponsored placement for Bonfire Terminal.
 *
 * REWRITTEN 2026-07-14 after the integrity audit. What was here before:
 *   - a "The Better Alternative" badge on all 101 reviews, asserting it beats every tool
 *   - "Why {product} users switch to Bonfire Terminal" — nobody switched; no user said this
 *   - "built specifically to address these gaps" — it wasn't; it's a local AI agent, not an
 *     Ahrefs/HubSpot/Salesforce competitor
 *   - a fabricated testimonial, and a comparison table claiming "100+ native integrations" and
 *     "24/7 live support" for a product whose vendor says it is a LOCAL app with NO cloud
 *   - an affiliate link with no disclosure
 *
 * What it says now is what is actually true and checkable: Bonfire Terminal is a local,
 * private AI desktop agent bundled with affiliate-marketing training. That is a real
 * differentiator against cloud SaaS — it does not need an invented claim to stand up.
 * It is NOT a like-for-like replacement, and we say so.
 */
export default function BonfireTerminalCTA({
  productName,
  comparisonRows,
  utmCampaign,
}: Props) {
  // Goes to OUR offer page, not straight to the third-party checkout (changed
  // 2026-08-06). This block sits on 100+ reviews and was the site's highest-volume
  // placement, yet it handed cold readers to a cart with nothing selling in
  // between. `?from=` keeps the originating review attributable in GA4; the offer
  // page sets its own canonical so the parameter costs nothing in search.
  const offerUrl = `/ai-marketers-club?from=${utmCampaign}`;

  return (
    <section className="mt-16 rounded-2xl border border-[#1b3a6b]/40 bg-[#eef1f6] p-8">
      {/* FTC: label the placement before any selling, not in a footer. */}
      <div className="mb-3 inline-block rounded-full bg-[#eef1f6] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#b8460f]">
        Sponsored · affiliate link
      </div>

      <h2 className="mb-4 text-2xl font-bold text-[#1a1a1a] md:text-3xl">
        A different approach: Bonfire Terminal
      </h2>

      <p className="mb-4 text-[#55514a]">
        {productName} runs in the vendor&apos;s cloud — your data is processed on their
        servers, and you pay every month for as long as you use it. Bonfire Terminal is a
        different kind of tool: an AI agent that runs as a{" "}
        <strong className="text-[#1a1a1a]">desktop app on your own machine</strong>. No cloud, no
        API credits, and nothing you type leaves your computer.
      </p>

      <p className="mb-6 text-sm text-[#55514a]">
        <strong className="text-[#55514a]">To be straight with you:</strong> it is not a
        drop-in replacement for {productName}, and we are not going to pretend it is — they
        do different jobs. It is worth a look if the cloud-subscription model itself is what
        you want out of, or if you want an AI agent that works privately and offline. If
        {" "}{productName} is doing its job for you, keep it.
      </p>

      {comparisonRows.length > 0 && (
        <div className="mb-6">
          <ComparisonTable productName={productName} rows={comparisonRows} />
        </div>
      )}

      <Link
        href={offerUrl}
        className="inline-flex items-center gap-2 rounded-xl bg-[#b8460f] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#9e3c0d] hover:shadow-lg hover:shadow-amber-500/25"
      >
        See what Bonfire Terminal is
        <span>→</span>
      </Link>

      <p className="mt-4 text-xs leading-relaxed text-[#8a857c]">
        The way in is the AI Marketers Club — $27 one-time, which includes{" "}
        <strong>21 days</strong> of Bonfire Terminal access. Keeping it after that is a
        separate purchase, and the vendor&apos;s FAQ states Bonfire Terminal starts at
        $5,000. We earn a commission if you join, at no extra cost to you — which is
        exactly why our criticisms of {productName} are printed in full above, why we have
        told you what this is not, and why the $5,000 is in this sentence rather than left
        for you to discover later.
      </p>
    </section>
  );
}
