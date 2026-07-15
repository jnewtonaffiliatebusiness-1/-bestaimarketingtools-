import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedReviews from "@/components/home/FeaturedReviews";
import EmailCapture from "@/components/home/EmailCapture";
import { getFeaturedReviews } from "@/lib/reviews";

export default function HomePage() {
  const featured = getFeaturedReviews(6);

  return (
    <>
      {/* Scholarly paper hero (replaced the dark Three.js galaxy). */}
      <div className="relative overflow-hidden border-b border-[#e6e2da] bg-[#f7f6f2]">
        <HeroSection />
      </div>

      {/* Below-fold sections */}
      <CategoryGrid />
      <FeaturedReviews reviews={featured} />
      <EmailCapture />

      {/* Trust section */}
      <section className="relative z-10 border-t border-[#e6e2da] bg-[#f7f6f2] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">
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
                className="rounded-xl border border-[#e6e2da] bg-white p-6"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 font-semibold text-[#1a1a1a]">{item.title}</h3>
                <p className="text-sm text-[#55514a]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
