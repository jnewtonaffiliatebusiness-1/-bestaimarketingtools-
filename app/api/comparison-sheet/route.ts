import { NextResponse } from "next/server";
import { getAllReviews } from "@/lib/reviews";
import { getCategoryBySlug } from "@/lib/categories";

/**
 * Lead magnet: a downloadable CSV comparison of every tool we've reviewed,
 * generated live from the review content so it's always in sync with the site.
 * Link it from the welcome email or a "Download the comparison sheet" CTA.
 */
function csvCell(v: string | number | undefined): string {
  const s = String(v ?? "");
  // RFC-4180 quoting
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toolName(title: string): string {
  return title.split(" Review")[0].split(":")[0].trim();
}

export function GET() {
  const ranked = getAllReviews()
    .filter((r) => r.frontmatter.rating > 0)
    .sort((a, b) => b.frontmatter.rating - a.frontmatter.rating);

  const headers = [
    "Rank",
    "Tool",
    "Category",
    "Rating (/5)",
    "Starting Price",
    "Verdict",
    "Read the review",
  ];

  const rows = ranked.map((r, i) => {
    const fm = r.frontmatter;
    const category = getCategoryBySlug(fm.category)?.name || fm.category;
    const price = fm.pricingStart ? `$${fm.pricingStart}/${fm.pricingUnit}` : "See site";
    return [
      i + 1,
      toolName(fm.title),
      category,
      fm.rating,
      price,
      fm.verdict,
      `https://www.aitoolsreviewshub.com/reviews/${fm.slug}`,
    ];
  });

  const csv =
    [headers, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") +
    "\r\n\r\nCompiled by aitoolsreviewshub.com — independent, hands-on reviews. No vendor pays for placement.";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="ai-marketing-tools-comparison-2026.csv"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
