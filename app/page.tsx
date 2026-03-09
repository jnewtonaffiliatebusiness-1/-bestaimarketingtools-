import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedReviews from "@/components/home/FeaturedReviews";
import EmailCapture from "@/components/home/EmailCapture";
import { getFeaturedReviews } from "@/lib/reviews";

// Dynamic import to avoid SSR issues with Three.js
const GalaxyScene = dynamic(() => import("@/components/three/GalaxyScene"), {
  ssr: false,
});

export default function HomePage() {
  const featured = getFeaturedReviews(6);

  return (
    <>
      {/* Three.js Hero */}
      <div className="relative h-screen overflow-hidden bg-gray-950">
        {/* Gradient background fallback */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />

        {/* Galaxy canvas */}
        <GalaxyScene />

        {/* Hero text over canvas */}
        <HeroSection />
      </div>

      {/* Below-fold sections */}
      <CategoryGrid />
      <FeaturedReviews reviews={featured} />
      <EmailCapture />

      {/* Trust section */}
      <section className="relative z-10 border-t border-white/5 bg-gray-950 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Why Trust Our Reviews?
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: "🔬",
                title: "Hands-on Testing",
                desc: "Every tool reviewed by our team using real accounts — not trial versions.",
              },
              {
                icon: "📊",
                title: "Verified Data",
                desc: "Pricing and features verified directly from official sources and updated regularly.",
              },
              {
                icon: "⚖️",
                title: "Editorial Independence",
                desc: "Affiliate relationships never influence our ratings. We call it like we see it.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
