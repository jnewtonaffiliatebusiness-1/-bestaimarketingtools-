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
    <section className="relative z-10 bg-gray-950 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Featured Reviews
            </h2>
            <p className="mt-2 text-gray-400">Our most-read in-depth reviews</p>
          </div>
          <Link
            href="/reviews"
            className="text-sm text-amber-400 hover:text-amber-300 transition"
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
                className="group block rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-500/30 hover:bg-white/10"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg">
                    {review.frontmatter.logoImage ? "🔧" : "⚙️"}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-amber-400 transition text-sm">
                      {review.frontmatter.title.split(":")[0]}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {review.frontmatter.category.replace(/-/g, " ")}
                    </p>
                  </div>
                </div>

                <StarRating rating={review.frontmatter.rating} size="sm" showValue />

                <p className="mt-3 text-sm text-gray-400 line-clamp-2">
                  {review.frontmatter.verdict}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    From ${review.frontmatter.pricingStart}/{review.frontmatter.pricingUnit}
                  </span>
                  <span className="text-xs text-amber-500 group-hover:text-amber-400 transition">
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
