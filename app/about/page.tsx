import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About & Editorial Methodology",
  description:
    "Learn how we research, test, and write our software reviews. Our methodology for ratings, disclosure policy, and editorial independence.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-black text-[#1a1a1a]">About & Methodology</h1>

      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-[#1a1a1a] prose-p:text-[#55514a] prose-a:text-[#b8460f]">
        <h2>Who We Are</h2>
        <p>
          Best AI Marketing Tools is an independent review publication focused on helping
          marketers, founders, and growth teams find the right software for their needs.
          We cover AI marketing, email platforms, SEO tools, social media software, and CRM systems.
        </p>

        <h2>How We Review</h2>
        <p>
          Every tool we review goes through a structured evaluation process:
        </p>
        <ol>
          <li>
            <strong>Primary-source pricing.</strong> Every price, tier, limit and fee we publish
            is taken from the vendor&apos;s own pricing page or documentation on the date shown
            on the review — not from a competitor&apos;s comparison table and not from another
            review site. Where a cost is easy to miss, such as usage billing or per-seat
            add-ons, we work out what it comes to at a realistic scale and show that arithmetic.
          </li>
          <li>
            <strong>We say where a number came from.</strong> If a figure is the vendor&apos;s
            claim, we attribute it to them rather than repeating it in our own voice.
          </li>
          <li>
            <strong>Comparison in context.</strong> Reviews are written to be useful next to the
            alternatives — including the ones that pay us nothing.
          </li>
        </ol>
        <p>
          <strong>What we do not claim.</strong> We do not run hands-on trials of all 100+ tools
          listed here, and we will not pretend otherwise. Where a page is built from a
          vendor&apos;s documentation rather than from use, the page says so and names the
          source. If we have used a tool ourselves, that is stated on that specific page rather
          than asserted across the whole site.
        </p>

        <h2>Our Rating System</h2>
        <p>
          Ratings are on a 1–5 scale and are an editorial judgement, not the output of a formula.
          What we weigh: feature depth, value for money, how the pricing behaves as you grow, and
          how much of your data and workflow the vendor ends up holding.
        </p>
        <p>
          Treat a rating as one publication&apos;s opinion, useful for orientation. The parts of a
          review worth acting on are the sourced pricing and the specific trade-offs — not the
          number at the top.
        </p>

        <h2>Affiliate Disclosure</h2>
        <p>
          Some links on this site are affiliate links — meaning we may earn a commission if you
          purchase through them, at no additional cost to you. This revenue helps fund our
          research and keeps the site running.
        </p>
        <p>
          <strong>So you can judge that rather than take our word for it:</strong> only two of the
          tools on this site currently pay us a commission — GoHighLevel and Systeme.io — plus one
          training product, the AI Marketers Club, which is labelled sponsored wherever it appears.
          Everything else here earns us nothing. The two that do pay are not our lowest-scored
          tools and we are not going to claim they are; what we do instead is print their drawbacks
          in full on the same page as the link. That is where to look for whether the commission is
          doing the talking.
        </p>

        <h2>Updates & Accuracy</h2>
        <p>
          Software changes quickly. We update reviews whenever pricing, features, or ownership
          changes significantly. The &quot;dateModified&quot; field on each review reflects the last
          verified update.
        </p>

        <h2>Contact</h2>
        <p>
          For corrections, tool submissions, or partnership inquiries:{" "}
          <Link href="mailto:editorial@aitoolsreviewshub.com">
            editorial@aitoolsreviewshub.com
          </Link>
        </p>
      </div>
    </div>
  );
}
