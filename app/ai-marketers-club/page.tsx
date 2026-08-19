import type { Metadata } from "next";
import Link from "next/link";
import { CLUB, CLUB_INCLUDES, clubUrl } from "@/lib/offer";
import { getAllReviewSlugs } from "@/lib/reviews";
import ClubCta from "@/components/offer/ClubCta";

/**
 * The offer page for AI Marketers Club.
 *
 * PLATFORM (2026-08-07): ClickBank — affiliate `jzoolu`, vendor `j1r2c`. It ran on
 * Digistore24 (product 300124) until 08-07; that link paid the FRONT END ONLY.
 * The Digistore references below are HISTORY, not the live wiring.
 *
 * UPDATED 2026-08-12: Digistore was un-retired as a SECOND NETWORK ("we want
 * both"), so it is no longer banned across the site. It remains banned for THIS
 * product. Same product, same vendor, both networks — but Digistore pays the
 * front end only ($17.90/buyer) against ClickBank's $20.25 + $110.25 + $447.75.
 * `scripts/affiliate_guard.js` blocks the build if product 300124 ever appears
 * on a Digistore link, and separately checks that any other Digistore link names
 * our payee (JNewton) rather than a stranger's.
 *
 * WHY THIS EXISTS (2026-08-06): the affiliate link was live in 5 places on this
 * site — nav, footer, /best, /category, /compare — and every one of them threw
 * the visitor straight at a third-party checkout. Digistore24 measured 20 clicks
 * and 0 order-form visitors. Nothing on this site was doing any selling before
 * the handoff, and there was no page for search or social to land on.
 *
 * WHY IT READS THE WAY IT DOES: we have not taken this course. So this page does
 * not pretend to a hands-on verdict, does not carry a star rating, and does not
 * repeat the vendor's marketing numbers (member counts, press logos, the "$2,924
 * total value" stack, "TODAY ONLY") as if we had checked them. What it does
 * instead is explain the offer's structure accurately — including the two things
 * the sales page states but does not emphasise: the Bonfire access expires after
 * 21 days, and the "$1,000 commissions" headline refers to selling a $5,000
 * product. Both come from the vendor's own FAQ.
 *
 * That is the honest version, and it is also the version that converts a reader
 * who has been burned before. Do not "optimise" it by adding claims we cannot
 * stand behind. See /disclosure and the 2026-07-14 integrity audit.
 */

const PAGE_TITLE = "AI Marketers Club Review: What You Actually Get for $27";
const PAGE_DESC =
  "An honest breakdown of John Crestani's AI Marketers Club — everything the $27 includes, what expires after 21 days, and what the “$1,000+ commissions” headline actually refers to.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: "/ai-marketers-club" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "article",
  },
};

/**
 * Product + Offer, deliberately with NO aggregateRating and no Review node.
 * Rating markup would assert an editorial verdict we have not earned on this
 * product. Price is the advertised $27.
 */
function OfferJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: CLUB.name,
    description:
      "A $27 one-time affiliate-marketing training membership presented by John Crestani, including an 11-module course, twice-weekly live webinars, a bonus vault, and 21 days of Bonfire Terminal access.",
    brand: { "@type": "Organization", name: CLUB.vendor },
    offers: {
      "@type": "Offer",
      price: CLUB.price.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: "https://www.aitoolsreviewshub.com/ai-marketers-club",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * The hop button.
 *
 * Was a plain <Link href={clubUrl("offerpage", campaign)}>. Every review on the
 * site links here as `/ai-marketers-club?from=<slug>`, and that value was read
 * by nothing — so every sale arrived in ClickBank tagged `offerpage_glance`
 * whatever page produced it. ClubCta keeps the server-rendered href identical
 * and upgrades it to a source-tagged tid in the browser. See lib/offer.ts.
 */
function CtaButton({
  campaign,
  knownSlugs,
  children,
}: {
  campaign: string;
  knownSlugs: string[];
  children: React.ReactNode;
}) {
  return (
    <ClubCta
      placement={campaign}
      knownSlugs={knownSlugs}
      className="inline-flex items-center gap-2 rounded-xl bg-[#b8460f] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#9e3c0d] hover:shadow-lg hover:shadow-amber-500/25"
    >
      {children}
      <span aria-hidden>→</span>
    </ClubCta>
  );
}

export default function AiMarketersClubPage() {
  // Passed to every CTA so a hostile ?from= cannot inject a tid we never published.
  const knownSlugs = getAllReviewSlugs();
  const checkedOn = new Date(CLUB.verifiedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <OfferJsonLd />

      <article className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#8a857c]">
          <Link href="/" className="transition hover:text-[#1a1a1a]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#55514a]">AI Marketers Club</span>
        </nav>

        <h1 className="mb-6 text-3xl font-black leading-tight text-[#1a1a1a] md:text-5xl">
          {PAGE_TITLE}
        </h1>

        {/* FTC + method disclosure, above everything. Specific to this page —
            we cannot claim the hands-on testing our tool reviews claim. */}
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-[#e6e2da] bg-white p-4 text-sm leading-relaxed text-[#55514a]">
          <span aria-hidden className="mt-0.5 text-[#b8460f]">
            ✓
          </span>
          <p>
            <span className="font-semibold">How we put this page together.</span>{" "}
            Every fact below was read off the vendor&apos;s own sales page and FAQ on{" "}
            {checkedOn}, and we say who is making a claim whenever we repeat one.{" "}
            <span className="font-semibold">
              We have not completed this course ourselves
            </span>
            , so you will not find a star rating or a &ldquo;we tested it&rdquo;
            verdict here — those belong on our{" "}
            <Link
              href="/reviews"
              className="text-[#b8460f] underline-offset-2 transition hover:underline"
            >
              hands-on tool reviews
            </Link>
            . The links on this page are affiliate links: we earn a commission if
            you join, at no extra cost to you.{" "}
            <Link
              href="/disclosure"
              className="text-[#b8460f] underline-offset-2 transition hover:underline"
            >
              Full disclosure →
            </Link>
          </p>
        </div>

        {/* At-a-glance */}
        <section className="mb-12 rounded-2xl border border-[#1b3a6b]/40 bg-[#eef1f6] p-8">
          <h2 className="mb-4 text-2xl font-bold text-[#1a1a1a]">
            What it is, in one paragraph
          </h2>
          <p className="mb-6 leading-relaxed text-[#55514a]">
            The {CLUB.name} is a <strong className="text-[#1a1a1a]">${CLUB.price} one-time</strong>{" "}
            affiliate-marketing training membership presented by {CLUB.presenter} and sold by{" "}
            {CLUB.vendor}. You get a video course, two live webinars a week with a
            replay archive, a library of AI prompts and templates, and a{" "}
            {CLUB.bonfireTrialDays}-day trial of Bonfire Terminal — a local AI
            agent that runs on your own machine. It is delivered as a{" "}
            {CLUB.deliveryPlatform} community.{" "}
            <strong className="text-[#1a1a1a]">
              It is an entry-level product for beginners
            </strong>
            , and it is the front door to a considerably more expensive one.
          </p>

          <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            {[
              { k: "Price", v: `$${CLUB.price} one-time` },
              { k: "Guarantee", v: `${CLUB.guaranteeDays}-day money-back` },
              { k: "Sold by", v: CLUB.vendor },
              { k: "Checkout", v: CLUB.processor },
            ].map((d) => (
              <div key={d.k} className="rounded-xl bg-white p-4">
                <dt className="mb-1 text-xs uppercase tracking-wider text-[#8a857c]">
                  {d.k}
                </dt>
                <dd className="font-semibold text-[#1a1a1a]">{d.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <CtaButton campaign="glance" knownSlugs={knownSlugs}>Join the club — ${CLUB.price}</CtaButton>
            <p className="mt-3 text-xs text-[#8a857c]">
              {CLUB.guaranteeDays}-day money-back guarantee, handled by{" "}
              {CLUB.processor}. Affiliate link.
            </p>
          </div>
        </section>

        {/* What's included */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-[#1a1a1a]">
            What the ${CLUB.price} includes
          </h2>
          <p className="mb-6 text-[#55514a]">
            This is the vendor&apos;s own list of what lands in your account. We have
            not audited the contents of the vault or the course.
          </p>
          <ul className="space-y-4">
            {CLUB_INCLUDES.map((inc) => (
              <li
                key={inc.item}
                className="rounded-xl border border-[#e6e2da] bg-white p-5"
              >
                <p className="mb-1 font-semibold text-[#1a1a1a]">{inc.item}</p>
                <p className="text-sm leading-relaxed text-[#55514a]">
                  {inc.detail}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* The honest core */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-[#1a1a1a]">
            Three things worth knowing before you buy
          </h2>
          <p className="mb-6 text-[#55514a]">
            None of this is hidden — all three are stated on the vendor&apos;s own
            page. But they sit in the FAQ rather than the headline, and they are
            the parts that decide whether ${CLUB.price} is well spent for you.
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border-l-4 border-[#b8460f] bg-white p-6">
              <h3 className="mb-2 text-lg font-bold text-[#1a1a1a]">
                1. The Bonfire Terminal access expires, and the full product costs
                ${CLUB.bonfirePriceFrom.toLocaleString()}
              </h3>
              <p className="leading-relaxed text-[#55514a]">
                Bonfire Terminal is the most eye-catching thing in the bundle, and
                your access to it runs for {CLUB.bonfireTrialDays} days. After
                that it stops. The vendor&apos;s FAQ is explicit that continuing
                &ldquo;requires a separate Bonfire Terminal purchase&rdquo;, and that{" "}
                <strong className="text-[#1a1a1a]">
                  Bonfire Terminal starts at $
                  {CLUB.bonfirePriceFrom.toLocaleString()}
                </strong>
                . So treat the ${CLUB.price} as buying the course, the community
                and a three-week look at the software —{" "}
                <strong className="text-[#1a1a1a]">not as buying the software</strong>.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-[#b8460f] bg-white p-6">
              <h3 className="mb-2 text-lg font-bold text-[#1a1a1a]">
                2. What the &ldquo;$1,000+ commissions&rdquo; headline actually
                refers to
              </h3>
              <p className="mb-3 leading-relaxed text-[#55514a]">
                The sales page leads with people earning $1,000+ commissions, and
                the FAQ explains where that figure comes from: members can promote
                Bonfire Terminal for{" "}
                {CLUB.memberAffiliateCommissionPct}% commission, and{" "}
                {CLUB.memberAffiliateCommissionPct}% of $
                {CLUB.bonfirePriceFrom.toLocaleString()} is about $1,000.
              </p>
              <p className="leading-relaxed text-[#55514a]">
                That is a real business model and the maths is sound. But be clear
                about what it asks of you:{" "}
                <strong className="text-[#1a1a1a]">
                  earning that $1,000 means persuading someone else to spend $
                  {CLUB.bonfirePriceFrom.toLocaleString()}
                </strong>
                . It is a high-ticket sale, not a passive one, and nothing about
                joining makes it happen on its own. The vendor&apos;s own income
                disclaimer says results are not typical and that the average
                participant earns significantly less or nothing at all.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-[#b8460f] bg-white p-6">
              <h3 className="mb-2 text-lg font-bold text-[#1a1a1a]">
                3. The &ldquo;total value&rdquo; figure is the seller&apos;s own
                valuation
              </h3>
              <p className="leading-relaxed text-[#55514a]">
                The page prices the bundle at $2,924+ by assigning a dollar value
                to each component. Those prices are set by the seller, not by a
                market — none of these items is separately sold at those figures
                as far as we can establish. It is a presentation device. Judge the{" "}
                ${CLUB.price} on whether the course and community are worth $
                {CLUB.price} to you, which is a much easier question to answer
                honestly.
              </p>
            </div>
          </div>
        </section>

        {/* Fit */}
        <section className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[#e6e2da] bg-white p-6">
            <h3 className="mb-3 font-bold text-[#1a1a1a]">
              Reasonable buy if…
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed text-[#55514a]">
              <li>
                • You are new to affiliate marketing and want a structured course
                plus live sessions rather than scattered free videos
              </li>
              <li>
                • You will actually turn up to a Monday or Thursday webinar, or
                work through the replay archive
              </li>
              <li>
                • You want to look at a local, offline AI agent for three weeks
                before deciding whether that category interests you
              </li>
              <li>
                • ${CLUB.price} is an amount you are comfortable treating as a
                learning cost with no guaranteed return
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-[#e6e2da] bg-white p-6">
            <h3 className="mb-3 font-bold text-[#1a1a1a]">Skip it if…</h3>
            <ul className="space-y-2 text-sm leading-relaxed text-[#55514a]">
              <li>
                • You are buying it to keep Bonfire Terminal — you are not; that
                is a $
                {CLUB.bonfirePriceFrom.toLocaleString()} product and this is a{" "}
                {CLUB.bonfireTrialDays}-day trial
              </li>
              <li>
                • You are counting on the $1,000 commissions to arrive — that
                requires making high-ticket sales you have not made yet
              </li>
              <li>
                • You already run affiliate campaigns profitably; this is
                pitched at beginners
              </li>
              <li>
                • You need the ${CLUB.price} back. Refunds are available for{" "}
                {CLUB.guaranteeDays} days, but do not spend money you cannot
                afford to lose on any income-related product
              </li>
            </ul>
          </div>
        </section>

        {/* Limits of this page */}
        <section className="mb-12 rounded-xl border border-[#e6e2da] bg-[#eef1f6] p-6">
          <h2 className="mb-3 text-xl font-bold text-[#1a1a1a]">
            What we cannot tell you
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-[#55514a]">
            <li>
              • <strong>Whether the course is any good.</strong> We have not
              completed it. Anyone claiming a verdict on 11 modules they have not
              watched is guessing at you.
            </li>
            <li>
              • <strong>What members typically earn.</strong> There is no
              independent outcome data. The vendor states results are not typical;
              treat any specific figure, from them or from us, with that in mind.
            </li>
            <li>
              • <strong>Whether the member count is accurate.</strong> The page
              says 3,200+ members. That is the vendor&apos;s number and we have no
              way to verify it, so we are not repeating it as a fact.
            </li>
          </ul>
        </section>

        {/* Guarantee + final CTA */}
        <section className="rounded-2xl border border-[#1b3a6b]/40 bg-[#eef1f6] p-8">
          <div className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#b8460f]">
            Affiliate link
          </div>
          <h2 className="mb-4 text-2xl font-bold text-[#1a1a1a] md:text-3xl">
            The {CLUB.guaranteeDays}-day guarantee is the thing that makes this
            decidable
          </h2>
          <p className="mb-6 leading-relaxed text-[#55514a]">
            At ${CLUB.price} with {CLUB.guaranteeDays} days to change your mind,
            the honest framing is that you can look inside and decide for
            yourself, which is more than most information products in this
            category allow. The vendor states refunds are handled by{" "}
            {CLUB.processor} and requested by emailing{" "}
            <span className="font-mono text-[#1a1a1a]">{CLUB.supportEmail}</span>.
            Read their refund policy before you buy, not after.
          </p>
          <CtaButton campaign="footer" knownSlugs={knownSlugs}>
            Join the {CLUB.name} — ${CLUB.price}
          </CtaButton>
          <p className="mt-4 text-xs leading-relaxed text-[#8a857c]">
            We earn a commission if you join through this link, at no extra cost
            to you. That is exactly why the three caveats above are printed in
            full, at the same size as everything else. If this is not right for
            you, don&apos;t buy it.
          </p>
        </section>

        {/* Sources */}
        <section className="mt-12 border-t border-[#e6e2da] pt-6 text-xs leading-relaxed text-[#8a857c]">
          <p className="mb-2 font-semibold text-[#55514a]">Sources</p>
          <p>
            All product facts, prices, inclusions, webinar times, guarantee terms
            and the Bonfire Terminal pricing quoted above were taken from the
            vendor&apos;s own sales page and FAQ at{" "}
            <span className="text-[#55514a]">{CLUB.sourceUrl}</span>, checked on{" "}
            {checkedOn}. Prices and contents can change without notice — the
            vendor&apos;s page is authoritative, this one is not. The advertised
            price is ${CLUB.price}; the {CLUB.processor} checkout may display a
            marginally different figure.
          </p>
        </section>
      </article>
    </>
  );
}
