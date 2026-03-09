import Link from "next/link";
import StarRating from "./StarRating";
import ProsConsList from "./ProsConsList";
import type { ReviewFrontmatter } from "@/lib/reviews";

interface Props {
  frontmatter: ReviewFrontmatter;
}

export default function ReviewHero({ frontmatter }: Props) {
  const { title, rating, verdict, pros, cons, affiliateUrl, pricingStart, pricingUnit } = frontmatter;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <StarRating rating={rating} size="lg" />
          <p className="mt-1 text-sm text-amber-400">
            Starting at ${pricingStart}/{pricingUnit}
          </p>
        </div>
        {affiliateUrl && (
          <Link
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Visit Site →
          </Link>
        )}
      </div>

      <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="font-medium text-amber-300">
          <span className="text-amber-500">Verdict: </span>
          {verdict}
        </p>
      </div>

      <ProsConsList pros={pros} cons={cons} />
    </div>
  );
}
