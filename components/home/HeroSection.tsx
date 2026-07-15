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
          className="mb-6 inline-block rounded-full border border-[#1b3a6b]/40 bg-[#eef1f6] px-4 py-2 text-sm font-medium text-[#b8460f]"
        >
          100+ Trusted Software Reviews — Updated 2025
        </motion.div>

        <motion.h1
          className="mb-6 text-4xl font-black leading-tight text-[#1a1a1a] md:text-6xl lg:text-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The Internet&apos;s Most{" "}
          <span className="text-[#b8460f]">Trusted</span>{" "}
          Software Reviews
        </motion.h1>

        <motion.p
          className="mb-10 text-lg text-[#55514a] md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          100+ unbiased reviews of AI marketing, email, SEO, social, and CRM tools.
          Find the right tool — or discover why{" "}
          <span className="text-[#b8460f]">Bonfire Terminal</span> beats them all.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Link
            href="/reviews"
            className="rounded-xl border border-[#d9d4c8] bg-white px-8 py-4 font-semibold text-[#1a1a1a] transition hover:bg-[#eef1f6]"
          >
            Browse All Reviews
          </Link>
          <Link
            href="https://www.digistore24.com/redir/300124/JNewton/aitoolshub?utm_source=reviewsite&utm_medium=hero&utm_campaign=homepage"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-xl bg-[#b8460f] px-8 py-4 font-bold text-white transition hover:bg-[#9e3c0d]"
          >
            <span className="relative z-10">See Bonfire Terminal →</span>
            <div className="absolute inset-0 rounded-xl bg-[#b8460f] opacity-0 blur-xl transition-opacity group-hover:opacity-50" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2 text-[#8a857c]">
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-[#b8a98a] to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
