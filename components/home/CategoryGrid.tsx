"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryGrid() {
  return (
    <section className="relative z-10 bg-[#f7f6f2] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-[#1a1a1a] md:text-4xl">
            5 Categories. 100 Reviews.
          </h2>
          <p className="text-[#55514a]">
            Deep-dive reviews of every major marketing software category.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/category/${cat.slug}`}
                className="group block rounded-2xl border border-[#e6e2da] bg-white p-6 transition hover:border-[#1b3a6b]/30 hover:bg-[#eef1f6]"
              >
                <div className="mb-4 text-4xl">{cat.icon}</div>
                <h3 className="mb-2 font-bold text-[#1a1a1a] group-hover:text-[#b8460f] transition">
                  {cat.name}
                </h3>
                <p className="mb-4 text-sm text-[#55514a]">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: cat.color + "20",
                      color: cat.color,
                    }}
                  >
                    {cat.productCount} reviews
                  </span>
                  <span className="text-[#8a857c] transition group-hover:text-[#b8460f]">
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Bonus card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              href="/reviews"
              className="group block rounded-2xl border border-[#1b3a6b]/40 bg-[#eef1f6] p-6 transition hover:border-amber-500/50 hover:bg-[#eef1f6]"
            >
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="mb-2 font-bold text-[#b8460f]">View All 100 Reviews</h3>
              <p className="mb-4 text-sm text-[#55514a]">
                Browse the complete database, filter by rating, price, or category.
              </p>
              <span className="text-amber-600 transition group-hover:text-[#b8460f]">
                Browse all →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
