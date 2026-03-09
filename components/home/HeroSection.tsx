"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400"
        >
          100+ Honest Software Reviews — Updated 2025
        </motion.div>

        <motion.h1
          className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The Internet&apos;s Most{" "}
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Honest
          </span>{" "}
          Software Reviews
        </motion.h1>

        <motion.p
          className="mb-10 text-lg text-gray-400 md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          100+ unbiased reviews of AI marketing, email, SEO, social, and CRM tools.
          Find the right tool — or discover why{" "}
          <span className="text-amber-400">Bonfire Terminal</span> beats them all.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Link
            href="/reviews"
            className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Browse All Reviews
          </Link>
          <Link
            href="https://bonfireterminal.com?utm_source=reviewsite&utm_medium=hero&utm_campaign=homepage"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-xl bg-amber-500 px-8 py-4 font-bold text-black transition hover:bg-amber-400"
          >
            <span className="relative z-10">See Bonfire Terminal →</span>
            <div className="absolute inset-0 rounded-xl bg-amber-500 opacity-0 blur-xl transition-opacity group-hover:opacity-50" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-gray-600 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
