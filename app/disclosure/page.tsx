import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How Best AI Marketing Tools earns money, which links are affiliate links, and our promise that affiliate relationships never influence our ratings.",
  alternates: { canonical: "/disclosure" },
};

export default function DisclosurePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <nav className="mb-6 text-sm text-[#8a857c]">
        <Link href="/" className="hover:text-[#1a1a1a] transition">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[#55514a]">Affiliate Disclosure</span>
      </nav>

      <h1 className="mb-6 text-3xl font-black text-[#1a1a1a] md:text-4xl">Affiliate Disclosure</h1>

      <div className="prose-content space-y-5 leading-relaxed text-[#55514a]">
        <p>
          <strong>Last updated:</strong>{" "}
          {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <p>
          Best AI Marketing Tools is a reader-supported publication. Some of the links on this site are
          <strong> affiliate links</strong>, which means that if you click one and go on to purchase a
          product, we may earn a commission — at <strong>no additional cost to you</strong>. This is a
          common way independent review sites fund the work of testing and writing about software.
        </p>

        <h2 className="pt-2 text-2xl font-bold text-[#1a1a1a]">Our promise</h2>
        <p>
          Affiliate relationships <strong>never</strong> influence our ratings, rankings, or the things we
          say about a product. We call it like we see it. A tool does not get a higher score, a better
          placement, or softer criticism because it pays a commission — and plenty of the tools we cover
          have no affiliate program at all.
        </p>

        <h2 className="pt-2 text-2xl font-bold text-[#1a1a1a]">Which links earn a commission</h2>
        <p>
          We aim to label sponsored and affiliate links clearly where they appear. As a general rule,
          outbound links to a product&rsquo;s own website or sign-up page may be affiliate links. Links to
          other pages on this site, and links used purely as citations or references, are not.
        </p>

        <h2 className="pt-2 text-2xl font-bold text-[#1a1a1a]">FTC compliance</h2>
        <p>
          In accordance with the U.S. Federal Trade Commission&rsquo;s guidelines, we disclose that we have
          a financial relationship with some of the companies whose products we review. We provide this
          disclosure so you can weigh our recommendations with full information.
        </p>

        <h2 className="pt-2 text-2xl font-bold text-[#1a1a1a]">Questions?</h2>
        <p>
          Read more about how we test and score tools on our{" "}
          <Link href="/about" className="text-[#b8460f] hover:underline">About &amp; Methodology</Link>{" "}
          page, or browse our{" "}
          <Link href="/reviews" className="text-[#b8460f] hover:underline">full list of reviews</Link>.
        </p>
      </div>
    </article>
  );
}
