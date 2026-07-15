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
            <strong>Hands-on Testing:</strong> We create real accounts and run actual campaigns,
            sequences, or workflows — not demos.
          </li>
          <li>
            <strong>Feature Verification:</strong> We cross-reference every feature claim against
            the official documentation and our own testing.
          </li>
          <li>
            <strong>Pricing Research:</strong> We document all pricing tiers as of the review date
            and flag any hidden fees or gotchas.
          </li>
          <li>
            <strong>User Sentiment:</strong> We aggregate feedback from G2, Capterra, Trustpilot,
            and Reddit to supplement our own findings.
          </li>
          <li>
            <strong>Comparison Analysis:</strong> Every review includes competitive context.
          </li>
        </ol>

        <h2>Our Rating System</h2>
        <p>
          Ratings are on a 1–5 scale and reflect a weighted average of:
        </p>
        <ul>
          <li>Ease of use (20%)</li>
          <li>Feature depth (30%)</li>
          <li>Value for money (25%)</li>
          <li>Customer support (15%)</li>
          <li>Reliability & performance (10%)</li>
        </ul>

        <h2>Affiliate Disclosure</h2>
        <p>
          Some links on this site are affiliate links — meaning we may earn a commission if you
          purchase through them, at no additional cost to you. This revenue helps fund our
          research and keeps the site running.
        </p>
        <p>
          <strong>Affiliate relationships never influence our ratings.</strong> We have given
          low scores to tools that pay us affiliate commissions, and high scores to tools with
          no affiliate program. Our editorial opinions are based solely on our testing and analysis.
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
