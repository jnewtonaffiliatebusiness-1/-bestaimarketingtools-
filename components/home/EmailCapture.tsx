"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative z-10 bg-gray-900 py-20">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 text-5xl">🔥</div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            Get the 2025 AI Marketing Stack Cheat Sheet
          </h2>
          <p className="mb-8 text-gray-400">
            Free PDF: the exact tools stack top marketers use in 2025, with pricing
            comparisons and our top recommendations. No spam, ever.
          </p>

          {status === "success" ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
              <p className="font-semibold text-emerald-400">
                Check your email! Your cheat sheet is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-gray-500 outline-none focus:border-amber-500/50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-xl bg-amber-500 px-8 py-4 font-bold text-black transition hover:bg-amber-400 disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Get Free PDF →"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-400">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="mt-4 text-xs text-gray-600">
            No spam. Unsubscribe anytime. We hate newsletters as much as you do.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
