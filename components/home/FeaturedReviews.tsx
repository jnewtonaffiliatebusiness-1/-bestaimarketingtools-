"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import StarRating from "@/components/review/StarRating";
import type { Review } from "@/lib/reviews";

interface Props {
  reviews: Review[];
}

export default function FeaturedReviews({ reviews }: Props) {
  if (reviews.length === 0) return null;

  return (
    <section className="relative z-10 bg-[#f7f6f2] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-[#1a1a1a] md:text-4xl">
              Featured Reviews
            </h2>
            <p className="mt-2 text-[#55514a]">Our most-read in-depth reviews</p>
          </div>
          <Link
            href="/reviews"
            className="text-sm text-[#b8460f] hover:text-[#b8460f] transition"
          >
            View all →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review.frontmatter.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={`/reviews/${review.frontmatter.slug}`}
                className="group block rounded-2xl border border-[#e6e2da] bg-white p-6 transition hover:border-[#1b3a6b]/40 hover:bg-[#eef1f6]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#eef1f6] flex items-center justify-center text-lg">
                    {review.frontmatter.logoImage ? "🔧" : "⚙️"}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#b8460f] transition text-sm">
                      {review.frontmatter.title.split(":")[0]}
                    </h3>
                    <p className="text-xs text-[#8a857c] capitalize">
                      {review.frontmatter.category.replace(/-/g, " ")}
                    </p>
                  </div>
                </div>

                <StarRating rating={review.frontmatter.rating} size="sm" showValue />

                <p className="mt-3 text-sm text-[#55514a] line-clamp-2">
                  {review.frontmatter.verdict}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#8a857c]">
                    From ${review.frontmatter.pricingStart}/{review.frontmatter.pricingUnit}
                  </span>
                  <span className="text-xs text-[#b8460f] group-hover:text-[#b8460f] transition">
                    Read review →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
