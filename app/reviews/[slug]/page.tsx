import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getReviewBySlug, getAllReviewSlugs, getReviewsByCategory, getRelatedReviews, type ReviewFrontmatter } from "@/lib/reviews";
import { formatStartingPrice, priceCurrencyCode } from "@/lib/pricing";
import { getCategoryBySlug } from "@/lib/categories";
import ReviewHero from "@/components/review/ReviewHero";
import BonfireTerminalCTA from "@/components/review/BonfireTerminalCTA";
import EditorialTrust from "@/components/review/EditorialTrust";
import { getPairsForProduct, productSlug } from "@/lib/vs";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllReviewSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const review = getReviewBySlug(slug);
  if (!review) return {};
  const { frontmatter: fm } = review;

  // ── noindex (2026-08-01) ────────────────────────────────────────────────
  // GSC measured 0 clicks / 2 impressions across 117 pages over 3 months.
  // Cause: 100 of these reviews were generated from one template — 76% of any
  // page was byte-identical to any other (152 of 199 lines between the Jasper
  // and Copy.ai reviews), with the same title formula on ~99 of 100. That is
  // the scaled-content profile Google answers with silence, and it was
  // suppressing the whole domain including the pages worth ranking.
  //
  // Those 100 carry `noindex: true` in frontmatter. They stay reachable so
  // Google can crawl and honour the directive — deleting them would produce
  // 404s and Google would never see the signal. They are also excluded from
  // the sitemap (next-sitemap.config.js).
  //
  // Reversible: remove the frontmatter flag. Backup of the originals is at
  // content/reviews_BACKUP_20260801.
  const noindex = fm.noindex === true;

  return {
    title: fm.title,
    description:
      fm.metaDescription ||
      `Read our honest ${fm.title}. We cover pricing, features, pros & cons, and whether it's worth it.`,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fm.title,
      description: fm.metaDescription || fm.verdict,
      images: fm.heroImage ? [fm.heroImage] : [],
    },
    alternates: {
      canonical: `/reviews/${slug}`,
    },
  };
}

/**
 * The product a review is about. Prefers the explicit `productName` frontmatter
 * field; falls back to the old title-splitting heuristic, which is correct only
 * for "<Product> Review: …" titles. See ReviewFrontmatter.productName.
 */
function productNameOf(fm: ReviewFrontmatter): string {
  return fm.productName ?? fm.title.split(" Review")[0].split(":")[0].trim();
}

function ReviewJsonLd({ fm }: { fm: ReviewFrontmatter }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: fm.title,
    reviewRating: {
      "@type": "Rating",
      ratingValue: fm.rating.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Organization",
      name: "Best AI Marketing Tools",
    },
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: productNameOf(fm),
      applicationCategory: "BusinessApplication",
      // The Offer is omitted entirely when there is no real starting price.
      // It used to emit price: "0", which tells Google the software is free —
      // false for the enterprise reviews where pricingStart: 0 means the vendor
      // does not publish a price (brandwatch, conductor-seo, emplifi). A wrong
      // price in a rich result is worse than no price at all.
      ...(fm.pricingStart > 0
        ? {
            offers: {
              "@type": "Offer",
              price: fm.pricingStart.toString(),
              priceCurrency: priceCurrencyCode(fm),
            },
          }
        : {}),
    },
    datePublished: fm.datePublished,
    dateModified: fm.dateModified,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Simple markdown to HTML converter
function mdToHtml(md: string): string {
  // ── Tables ────────────────────────────────────────────────────────────────
  // Added 2026-08-18. This converter had no table support, so every markdown
  // table in every hand-written review reached the reader as raw pipes —
  // "| Free plan | | |---|---| | Contacts | 250 |" — inside a single <p>.
  // That was live on the BENCHMARK pages, the ones carrying the numbers the
  // reviews are built on, and it had to be the worst-looking part of the pages
  // we most want indexed. Runs FIRST so the paragraph splitter below never
  // sees a pipe block.
  //
  // Classes are emitted inline rather than added to globals.css: this HTML goes
  // in through dangerouslySetInnerHTML, so a `.prose-editorial table` rule would
  // have to be written blind against markup no stylesheet author can see.
  const cell = (s: string) => s.trim();
  const splitRow = (line: string) =>
    line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(cell);

  const withTables = md.replace(
    /^[ \t]*\|.*\|[ \t]*\r?\n[ \t]*\|[\s:|-]*-[\s:|-]*\|[ \t]*\r?\n(?:[ \t]*\|.*\|[ \t]*\r?\n?)*/gm,
    (block) => {
      const lines = block.trim().split(/\r?\n/);
      if (lines.length < 2) return block;
      const headers = splitRow(lines[0]);
      const rows = lines.slice(2).map(splitRow);
      const th = headers
        .map(
          (h) =>
            `<th class="border-b-2 border-[#1a1a1a] px-3 py-2 text-left font-semibold text-[#1a1a1a]">${h}</th>`,
        )
        .join("");
      const tb = rows
        .map(
          (r) =>
            `<tr>${r
              .map(
                (c) =>
                  `<td class="border-b border-[#e6e2da] px-3 py-2 align-top text-[#55514a]">${c}</td>`,
              )
              .join("")}</tr>`,
        )
        .join("");
      // The wrapper scrolls instead of the page — a five-column pricing table
      // must not force horizontal scroll on a phone.
      return `<div class="my-6 overflow-x-auto"><table class="w-full border-collapse text-sm"><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>\n`;
    },
  );

  // ── Blockquotes ───────────────────────────────────────────────────────────
  // Same failure as tables: "> quoted vendor policy" rendered with the ">"
  // visible. Consecutive > lines collapse into one quote.
  const withQuotes = withTables.replace(/((?:^>[ \t]?.*\r?\n?)+)/gm, (block) => {
    const text = block
      .trim()
      .split(/\r?\n/)
      .map((l) => l.replace(/^>[ \t]?/, ""))
      .join(" ");
    return `<blockquote class="my-6 border-l-4 border-[#b8460f] bg-[#f7f6f2] px-5 py-3 italic text-[#55514a]">${text}</blockquote>\n`;
  });

  // Collect list items into ul blocks
  const withLists = withQuotes.replace(/((?:^- .+\n?)+)/gm, (block) => {
    const items = block
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^- /, "")}</li>`)
      .join("");
    return `<ul>${items}</ul>\n`;
  });

  return withLists
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .split(/\n\n+/)
    .map((block) => {
      const t = block.trim();
      if (!t) return "";
      if (
        t.startsWith("<h") ||
        t.startsWith("<ul") ||
        t.startsWith("<li") ||
        t.startsWith("<div") ||
        t.startsWith("<table") ||
        t.startsWith("<blockquote")
      )
        return t;
      return `<p>${t}</p>`;
    })
    .join("\n");
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = params;
  const review = getReviewBySlug(slug);
  if (!review) {
    // Google indexed old, suffix-less URLs (e.g. /reviews/activecampaign) from before the slug
    // format gained the "-review" suffix. 308-redirect those to the real page instead of 404ing.
    if (!slug.endsWith("-review") && getReviewBySlug(`${slug}-review`)) {
      permanentRedirect(`/reviews/${slug}-review`);
    }
    notFound();
  }

  const { frontmatter: fm, content } = review;
  const category = getCategoryBySlug(fm.category);
  const related = getRelatedReviews(fm.category, fm.slug, 6);

  // Head-to-head pages featuring this product. See getPairsForProduct() in
  // lib/vs.ts for why this link exists: without it the entire /vs section had no
  // inbound edge from the crawled part of the site, and all 50 pages read back
  // "URL is unknown to Google" three days after launch.
  //
  // Rendered on noindexed reviews too, deliberately. Those pages carry
  // `robots: index:false, follow:true`, so Google still crawls their links —
  // which makes them useful as discovery paths even though they must not rank
  // themselves. That is the opposite direction from the 2026-08-11 bug, where
  // pages we wanted ranked were spending their links ON noindexed pages.
  const comparisons = getPairsForProduct(productSlug(productNameOf(fm)));

  // Fallback comparison rows, used only if a review has none of its own.
  //
  // The previous version of this fallback asserted "100+ native integrations" and
  // "24/7 live support" for Bonfire Terminal (a LOCAL desktop app with no cloud), and
  // canned put-downs — "Moderate learning curve", "Email / async only" — about whichever
  // named company the page happened to be reviewing. All of it was invented. It was also
  // a landmine: any new review without its own table would have silently regenerated it.
  //
  // Everything below is sourced: the product side from this review's own frontmatter,
  // the Bonfire side from the vendor's own description of the product.
  const CATEGORY_LABEL: Record<string, string> = {
    "ai-marketing-automation": "Cloud marketing-automation SaaS",
    "crm-sales-automation": "Cloud CRM / sales SaaS",
    "email-marketing": "Cloud email-marketing SaaS",
    "seo-content-tools": "Cloud SEO / content SaaS",
    "social-media-analytics": "Cloud social-media SaaS",
  };

  const defaultComparisonRows = [
    {
      feature: "What it is",
      product: CATEGORY_LABEL[fm.category] ?? "Cloud SaaS tool",
      bonfire: "Local AI desktop agent (Rust), bundled with affiliate-marketing training",
    },
    {
      feature: "Where it runs",
      product: "Vendor’s cloud — your data is processed on their servers",
      bonfire: "On your own machine — no cloud, no API credits, no data leaves your computer",
    },
    {
      feature: "What you pay",
      product:
        formatStartingPrice(fm)
          ? `From ${formatStartingPrice(fm)}`
          // Was "Free plan available; paid tiers vary" — false on the enterprise
          // reviews where pricingStart: 0 means the vendor does not publish a
          // price at all (brandwatch, conductor-seo, emplifi).
          : "See the vendor’s own pricing page",
      bonfire: "$27 entry (AI Marketers Club) — includes 21-day Bonfire Terminal access",
    },
    {
      feature: "Guarantee",
      product: "See the vendor’s own terms",
      bonfire: "60-day money-back guarantee",
    },
  ];

  // Parse markdown content into sections for structured rendering
  const sections = content.split(/^## /m).filter(Boolean).slice(1); // skip preamble

  return (
    <>
      <ReviewJsonLd fm={fm} />

      <article className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#8a857c]">
          <Link href="/" className="hover:text-[#1a1a1a] transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/reviews" className="hover:text-[#1a1a1a] transition">Reviews</Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/category/${category.slug}`} className="hover:text-[#1a1a1a] transition">
                {category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-[#55514a]">{fm.title.split(":")[0]}</span>
        </nav>

        {/* Title */}
        <h1 className="mb-6 text-3xl font-black text-[#1a1a1a] md:text-5xl leading-tight">
          {fm.title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm text-[#8a857c]">
          <span>By {fm.author}</span>
          <span>
            Published:{" "}
            {/* timeZone UTC: a bare "YYYY-MM-DD" parses as UTC midnight, so rendering in a
                negative-offset local zone shifted every date back a day and contradicted the
                datePublished in the JSON-LD directly above. */}
            {new Date(fm.datePublished).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </span>
          <span>
            Updated:{" "}
            {new Date(fm.dateModified).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </span>
        </div>

        {/* E-E-A-T + FTC trust strip — above the affiliate CTA */}
        <EditorialTrust />

        {/* Review Hero: rating, verdict, pros/cons */}
        <ReviewHero frontmatter={fm} />

        {/* Structured content sections */}
        <div className="mt-12 space-y-8 text-[#55514a]">
          {sections.map((section, i) => {
            const lines = section.split("\n");
            const heading = lines[0].replace(/\n$/, "");
            const body = lines.slice(1).join("\n").trim();

            return (
              <section key={i}>
                <h2 className="mb-4 text-2xl font-bold text-[#1a1a1a]">{heading}</h2>
                <div
                  className="prose-content leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(body) }}
                />
              </section>
            );
          })}
        </div>

        {/* Bonfire Terminal CTA — always last */}
        <BonfireTerminalCTA
          productName={productNameOf(fm)}
          comparisonRows={fm.comparisonRows ?? defaultComparisonRows}
          utmCampaign={slug}
        />

        {/* Head-to-head comparisons featuring this product.
            This is the /vs section's only inbound edge from the crawled part of
            the site — see the note on `comparisons` above. */}
        {comparisons.length > 0 && (
          <div className="mt-12 border-t border-[#e6e2da] pt-8">
            <p className="mb-4 text-sm font-semibold text-[#1a1a1a]">
              Compare {productNameOf(fm)} head-to-head:
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {comparisons.map(({ pair, other }) => (
                <li key={pair.slugs}>
                  <Link
                    href={`/vs/${pair.slugs}`}
                    className="text-sm text-[#b8460f] hover:underline"
                  >
                    {productNameOf(fm)} vs {other.name} →
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/vs"
              className="mt-5 inline-block text-sm text-[#55514a] transition hover:text-[#1a1a1a]"
            >
              All tool comparisons →
            </Link>
          </div>
        )}

        {/* Related reviews — internal links to sibling reviews (crawl depth + UX) */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-[#e6e2da] pt-8">
            <p className="mb-4 text-sm font-semibold text-[#1a1a1a]">
              More {category?.name ?? ""} reviews:
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.frontmatter.slug}>
                  <Link
                    href={`/reviews/${r.frontmatter.slug}`}
                    className="text-sm text-[#b8460f] hover:underline"
                  >
                    {r.frontmatter.title.split(":")[0]} →
                  </Link>
                </li>
              ))}
            </ul>
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="mt-5 inline-block text-sm text-[#55514a] hover:text-[#1a1a1a] transition"
              >
                View all {category.productCount} {category.name} reviews →
              </Link>
            )}
          </div>
        )}
      </article>
    </>
  );
}
