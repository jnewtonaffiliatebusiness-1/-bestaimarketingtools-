import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getReviewBySlug, getAllReviewSlugs, type ReviewFrontmatter } from "@/lib/reviews";
import { getCategoryBySlug } from "@/lib/categories";
import ReviewHero from "@/components/review/ReviewHero";
import BonfireTerminalCTA from "@/components/review/BonfireTerminalCTA";
import EditorialTrust from "@/components/review/EditorialTrust";
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
  return {
    title: fm.title,
    description:
      fm.metaDescription ||
      `Read our honest ${fm.title}. We cover pricing, features, pros & cons, and whether it's worth it in 2025.`,
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
      name: fm.title.split(" Review")[0].split(":")[0].trim(),
      applicationCategory: "BusinessApplication",
      offers: {
        "@type": "Offer",
        price: fm.pricingStart.toString(),
        priceCurrency: "USD",
      },
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
  // Collect list items into ul blocks
  const withLists = md.replace(/((?:^- .+\n?)+)/gm, (block) => {
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
      if (t.startsWith("<h") || t.startsWith("<ul") || t.startsWith("<li")) return t;
      return `<p>${t}</p>`;
    })
    .join("\n");
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = params;
  const review = getReviewBySlug(slug);
  if (!review) notFound();

  const { frontmatter: fm, content } = review;
  const category = getCategoryBySlug(fm.category);

  const defaultComparisonRows = [
    { feature: "Ease of Use", product: "Moderate learning curve", bonfire: "Simple & intuitive" },
    { feature: "AI Features", product: "Basic or add-on", bonfire: "AI-native built in" },
    { feature: "Integrations", product: "Limited ecosystem", bonfire: "100+ native integrations" },
    { feature: "Support", product: "Email / async only", bonfire: "24/7 live support" },
    {
      feature: "Price",
      product: `$${fm.pricingStart}/${fm.pricingUnit}`,
      bonfire: "Competitive & transparent",
    },
    { feature: "All-in-one", product: "Partial — gaps remain", bonfire: "Complete stack" },
  ];

  const defaultWeaknesses = [
    `${fm.title.split(" Review")[0].split(":")[0].trim()} has a learning curve that slows teams down`,
    "Pricing scales aggressively — costs balloon as usage grows",
    "Missing AI-native features that modern marketing teams need",
  ];

  // Parse markdown content into sections for structured rendering
  const sections = content.split(/^## /m).filter(Boolean).slice(1); // skip preamble

  return (
    <>
      <ReviewJsonLd fm={fm} />

      <article className="mx-auto max-w-4xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/reviews" className="hover:text-white transition">Reviews</Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/category/${category.slug}`} className="hover:text-white transition">
                {category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-400">{fm.title.split(":")[0]}</span>
        </nav>

        {/* Title */}
        <h1 className="mb-6 text-3xl font-black text-white md:text-5xl leading-tight">
          {fm.title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>By {fm.author}</span>
          <span>
            Published:{" "}
            {new Date(fm.datePublished).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>
            Updated:{" "}
            {new Date(fm.dateModified).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* E-E-A-T + FTC trust strip — above the affiliate CTA */}
        <EditorialTrust />

        {/* Review Hero: rating, verdict, pros/cons */}
        <ReviewHero frontmatter={fm} />

        {/* Structured content sections */}
        <div className="mt-12 space-y-8 text-gray-300">
          {sections.map((section, i) => {
            const lines = section.split("\n");
            const heading = lines[0].replace(/\n$/, "");
            const body = lines.slice(1).join("\n").trim();

            return (
              <section key={i}>
                <h2 className="mb-4 text-2xl font-bold text-white">{heading}</h2>
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
          productName={fm.title.split(" Review")[0].split(":")[0].trim()}
          productWeaknesses={fm.productWeaknesses ?? defaultWeaknesses}
          comparisonRows={fm.comparisonRows ?? defaultComparisonRows}
          testimonial={fm.testimonial}
          utmCampaign={slug}
        />

        {/* Related navigation */}
        {category && (
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="mb-4 text-sm text-gray-500">More reviews in {category.name}:</p>
            <Link
              href={`/category/${category.slug}`}
              className="text-amber-400 hover:text-amber-300 transition text-sm"
            >
              View all {category.productCount} {category.name} reviews →
            </Link>
          </div>
        )}
      </article>
    </>
  );
}
