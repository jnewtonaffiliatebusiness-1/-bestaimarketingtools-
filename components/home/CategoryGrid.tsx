"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryGrid() {
  return (
    <section className="relative z-10 bg-gray-950 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            5 Categories. 100 Reviews.
          </h2>
          <p className="text-gray-400">
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
                className="group block rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-4 text-4xl">{cat.icon}</div>
                <h3 className="mb-2 font-bold text-white group-hover:text-amber-400 transition">
                  {cat.name}
                </h3>
                <p className="mb-4 text-sm text-gray-400">{cat.description}</p>
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
                  <span className="text-gray-600 transition group-hover:text-amber-400">
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
              className="group block rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 transition hover:border-amber-500/50 hover:bg-amber-500/10"
            >
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="mb-2 font-bold text-amber-400">View All 100 Reviews</h3>
              <p className="mb-4 text-sm text-gray-400">
                Browse the complete database, filter by rating, price, or category.
              </p>
              <span className="text-amber-600 transition group-hover:text-amber-400">
                Browse all →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
