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
    <section className="relative z-10 bg-[#eef1f6] py-20">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Promise only what actually happens. This section previously offered a
              "Free PDF cheat sheet" and told subscribers it was "on its way" — no such PDF
              existed and the app never sent any email. Do not reintroduce a deliverable
              here unless it exists AND something sends it. */}
          <div className="mb-4 text-5xl">🔥</div>
          <h2 className="mb-4 text-3xl font-bold text-[#1a1a1a]">
            Get new reviews in your inbox
          </h2>
          <p className="mb-8 text-[#55514a]">
            We publish honest, hands-on reviews of marketing and AI software. Drop your
            email and we&apos;ll send new ones as they go live. No spam, ever.
          </p>

          {status === "success" ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
              <p className="font-semibold text-emerald-400">
                You&apos;re subscribed — thanks!
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
                className="flex-1 rounded-xl border border-[#e6e2da] bg-white px-5 py-4 text-[#1a1a1a] placeholder-gray-500 outline-none focus:border-amber-500/50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-xl bg-[#b8460f] px-8 py-4 font-bold text-white transition hover:bg-[#9e3c0d] disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe →"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-400">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="mt-4 text-xs text-[#8a857c]">
            No spam. Unsubscribe anytime. We hate newsletters as much as you do.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
