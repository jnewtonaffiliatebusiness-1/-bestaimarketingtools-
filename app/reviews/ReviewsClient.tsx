"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import StarRating from "@/components/review/StarRating";
import { CATEGORIES } from "@/lib/categories";
import type { Review } from "@/lib/reviews";

interface Props {
  reviews: Review[];
}

export default function ReviewsClient({ reviews }: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"rating" | "date" | "price">("date");

  const filtered = useMemo(() => {
    let result = reviews;
    if (categoryFilter !== "all") {
      result = result.filter((r) => r.frontmatter.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.frontmatter.title.toLowerCase().includes(q) ||
          r.frontmatter.verdict.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      if (sortBy === "rating") return b.frontmatter.rating - a.frontmatter.rating;
      if (sortBy === "price") return a.frontmatter.pricingStart - b.frontmatter.pricingStart;
      return (
        new Date(b.frontmatter.datePublished).getTime() -
        new Date(a.frontmatter.datePublished).getTime()
      );
    });
  }, [reviews, search, categoryFilter, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-black text-white">All Reviews</h1>
        <p className="text-gray-400">
          {reviews.length} honest reviews across 5 categories. No BS, no paid placements.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-amber-500/50"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-gray-300 outline-none focus:border-amber-500/50"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-gray-300 outline-none focus:border-amber-500/50"
        >
          <option value="date">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price">Lowest Price</option>
        </select>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        Showing {filtered.length} of {reviews.length} reviews
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((review) => (
          <Link
            key={review.frontmatter.slug}
            href={`/reviews/${review.frontmatter.slug}`}
            className="group block rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-amber-500/30 hover:bg-white/10"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400 capitalize">
                {review.frontmatter.category.replace(/-/g, " ")}
              </span>
              <span className="text-xs text-gray-600">
                ${review.frontmatter.pricingStart}/{review.frontmatter.pricingUnit}
              </span>
            </div>
            <h3 className="mb-2 text-sm font-bold leading-snug text-white group-hover:text-amber-400 transition">
              {review.frontmatter.title.split(":")[0]}
            </h3>
            <StarRating rating={review.frontmatter.rating} size="sm" />
            <p className="mt-2 line-clamp-2 text-xs text-gray-500">
              {review.frontmatter.verdict}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          No reviews match your filters.
        </div>
      )}
    </div>
  );
}
