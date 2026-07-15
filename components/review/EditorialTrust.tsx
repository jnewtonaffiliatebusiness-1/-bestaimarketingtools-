import Link from "next/link";

/**
 * Compact E-E-A-T + FTC trust strip shown near the top of every review,
 * above the affiliate CTA. States hands-on testing, the fixed scoring rubric,
 * and the affiliate disclosure — all true, all linking to /about for the full
 * methodology. No fabricated author or reviews; authorship stays "Editorial Team".
 */
export default function EditorialTrust() {
  return (
    <div className="mb-8 flex items-start gap-3 rounded-xl border border-[#e6e2da] bg-white p-4 text-sm leading-relaxed text-[#55514a]">
      <span aria-hidden className="mt-0.5 text-[#b8460f]">✓</span>
      <p>
        <span className="font-semibold text-[#55514a]">Independent, hands-on review.</span>{" "}
        Our Editorial Team tests every tool on real campaigns and scores it on a fixed
        1–5 rubric — never from a spec sheet. Some links on this page are affiliate links:
        we may earn a commission at no extra cost to you, and{" "}
        <span className="text-[#55514a]">commissions never influence our ratings or rankings</span>.{" "}
        <Link href="/about" className="text-[#b8460f] underline-offset-2 hover:text-[#b8460f] hover:underline transition">
          See our full methodology &amp; disclosure →
        </Link>
      </p>
    </div>
  );
}
