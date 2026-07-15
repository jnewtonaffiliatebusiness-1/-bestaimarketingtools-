import Link from "next/link";
import StarRating from "./StarRating";
import ProsConsList from "./ProsConsList";
import type { ReviewFrontmatter } from "@/lib/reviews";

interface Props {
  frontmatter: ReviewFrontmatter;
}

export default function ReviewHero({ frontmatter }: Props) {
  const { title, rating, verdict, pros, cons, affiliateUrl, pricingStart, pricingUnit, heroImage } = frontmatter;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6e2da] bg-white backdrop-blur-sm">
      {heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroImage}
          alt={`${title.split(" Review")[0].split(":")[0].trim()} — honest review`}
          width={1200}
          height={630}
          className="w-full border-b border-[#e6e2da]"
        />
      )}
      <div className="p-8">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <StarRating rating={rating} size="lg" />
          <p className="mt-1 text-sm text-[#b8460f]">
            Starting at ${pricingStart}/{pricingUnit}
          </p>
        </div>
        {affiliateUrl && (
          <Link
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="rounded-lg bg-[#b8460f] px-6 py-3 font-semibold text-white transition hover:bg-[#9e3c0d]"
          >
            Visit Site →
          </Link>
        )}
      </div>

      <div className="mb-6 rounded-lg border border-[#1b3a6b]/30 bg-[#eef1f6] p-4">
        <p className="font-medium text-[#b8460f]">
          <span className="text-[#b8460f]">Verdict: </span>
          {verdict}
        </p>
      </div>

      <ProsConsList pros={pros} cons={cons} />
      </div>
    </div>
  );
}
