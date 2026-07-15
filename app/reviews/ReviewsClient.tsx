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
        <h1 className="mb-2 text-4xl font-black text-[#1a1a1a]">All Reviews</h1>
        <p className="text-[#55514a]">
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
          className="flex-1 rounded-xl border border-[#e6e2da] bg-white px-4 py-3 text-[#1a1a1a] placeholder-gray-500 outline-none focus:border-amber-500/50"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-[#e6e2da] bg-[#eef1f6] px-4 py-3 text-[#55514a] outline-none focus:border-amber-500/50"
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
          className="rounded-xl border border-[#e6e2da] bg-[#eef1f6] px-4 py-3 text-[#55514a] outline-none focus:border-amber-500/50"
        >
          <option value="date">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price">Lowest Price</option>
        </select>
      </div>

      <p className="mb-6 text-sm text-[#8a857c]">
        Showing {filtered.length} of {reviews.length} reviews
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((review) => (
          <Link
            key={review.frontmatter.slug}
            href={`/reviews/${review.frontmatter.slug}`}
            className="group block rounded-xl border border-[#e6e2da] bg-white p-5 transition hover:border-[#1b3a6b]/40 hover:bg-[#eef1f6]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-[#eef1f6] px-2 py-0.5 text-xs text-[#55514a] capitalize">
                {review.frontmatter.category.replace(/-/g, " ")}
              </span>
              <span className="text-xs text-[#8a857c]">
                ${review.frontmatter.pricingStart}/{review.frontmatter.pricingUnit}
              </span>
            </div>
            <h3 className="mb-2 text-sm font-bold leading-snug text-[#1a1a1a] group-hover:text-[#b8460f] transition">
              {review.frontmatter.title.split(":")[0]}
            </h3>
            <StarRating rating={review.frontmatter.rating} size="sm" />
            <p className="mt-2 line-clamp-2 text-xs text-[#8a857c]">
              {review.frontmatter.verdict}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-[#8a857c]">
          No reviews match your filters.
        </div>
      )}
    </div>
  );
}
