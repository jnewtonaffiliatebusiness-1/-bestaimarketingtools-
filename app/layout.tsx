import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Best AI Marketing Tools — Honest Reviews & Comparisons",
    template: "%s | Best AI Marketing Tools",
  },
  description:
    "100+ honest, unbiased reviews of AI marketing tools, email platforms, SEO tools, social media software, and CRM systems. Find the right tool for your business.",
  metadataBase: new URL("https://www.aitoolsreviewshub.com"),
  openGraph: {
    siteName: "Best AI Marketing Tools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#f7f6f2] text-[#1a1a1a] antialiased">
        <GoogleAnalytics />
        <header className="fixed top-0 z-50 w-full border-b border-[#e6e2da] bg-[#f7f6f2]/90 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-black text-xl text-[#1a1a1a] hover:text-[#b8460f] transition">
              Best<span className="text-[#b8460f]">AI</span>MarketingTools
            </Link>
            <div className="hidden items-center gap-6 text-sm md:flex">
              <Link href="/reviews" className="text-[#55514a] hover:text-[#1a1a1a] transition">
                All Reviews
              </Link>
              <Link href="/category/ai-marketing-automation" className="text-[#55514a] hover:text-[#1a1a1a] transition">
                AI Tools
              </Link>
              <Link href="/category/email-marketing" className="text-[#55514a] hover:text-[#1a1a1a] transition">
                Email
              </Link>
              <Link href="/category/seo-content-tools" className="text-[#55514a] hover:text-[#1a1a1a] transition">
                SEO
              </Link>
              <Link href="/category/crm-sales-automation" className="text-[#55514a] hover:text-[#1a1a1a] transition">
                CRM
              </Link>
              {/* /vs had NO inbound link from anywhere on the site until
                  2026-08-17, which is why GSC reported all 50 of its pages as
                  "URL is unknown to Google" rather than judging them. This nav
                  entry plus the per-review block is the fix. */}
              <Link href="/vs" className="text-[#55514a] hover:text-[#1a1a1a] transition">
                Compare
              </Link>
              {/* Points at our own offer page, not straight at the checkout.
                  Until 2026-08-06 this threw browsing visitors directly at a
                  third-party cart with nothing selling in between — 20 clicks
                  produced 0 order-form visitors. It was also labelled "Bonfire
                  Terminal", which is the $5,000 product, not the $27 club it
                  actually opened. */}
              <Link
                href="/ai-marketers-club"
                className="rounded-lg bg-[#b8460f] px-4 py-2 font-semibold text-white hover:bg-[#9e3c0d] transition"
              >
                AI Marketers Club
              </Link>
            </div>
          </nav>
        </header>

        <main className="pt-16">{children}</main>

        <footer className="border-t border-[#e6e2da] bg-[#f7f6f2] py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <h4 className="mb-4 font-semibold text-[#1a1a1a]">Categories</h4>
                <ul className="space-y-2 text-sm text-[#55514a]">
                  <li><Link href="/category/ai-marketing-automation" className="hover:text-[#1a1a1a] transition">AI Marketing</Link></li>
                  <li><Link href="/category/email-marketing" className="hover:text-[#1a1a1a] transition">Email Marketing</Link></li>
                  <li><Link href="/category/seo-content-tools" className="hover:text-[#1a1a1a] transition">SEO Tools</Link></li>
                  <li><Link href="/category/social-media-analytics" className="hover:text-[#1a1a1a] transition">Social Media</Link></li>
                  <li><Link href="/category/crm-sales-automation" className="hover:text-[#1a1a1a] transition">CRM & Sales</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-[#1a1a1a]">Best Of</h4>
                <ul className="space-y-2 text-sm text-[#55514a]">
                  <li><Link href="/best/best-ai-marketing-tools" className="hover:text-[#1a1a1a] transition">Best AI Tools</Link></li>
                  <li><Link href="/best/best-email-marketing-platforms" className="hover:text-[#1a1a1a] transition">Best Email Platforms</Link></li>
                  <li><Link href="/best/best-seo-tools" className="hover:text-[#1a1a1a] transition">Best SEO Tools</Link></li>
                  <li><Link href="/best/best-crm-tools" className="hover:text-[#1a1a1a] transition">Best CRM Tools</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-[#1a1a1a]">Site</h4>
                <ul className="space-y-2 text-sm text-[#55514a]">
                  <li><Link href="/reviews" className="hover:text-[#1a1a1a] transition">All Reviews</Link></li>
                  <li><Link href="/vs" className="hover:text-[#1a1a1a] transition">Tool Comparisons</Link></li>
                  <li><Link href="/about" className="hover:text-[#1a1a1a] transition">About & Methodology</Link></li>
                  <li><Link href="/disclosure" className="hover:text-[#1a1a1a] transition">Affiliate Disclosure</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-[#1a1a1a]">Sponsored</h4>
                <p className="mb-3 text-sm text-[#55514a]">
                  An affiliate partner we work with:
                </p>
                <Link
                  href="/ai-marketers-club"
                  className="inline-block rounded-lg bg-[#b8460f] px-4 py-2 text-sm font-bold text-white hover:bg-[#9e3c0d] transition"
                >
                  AI Marketers Club — $27 →
                </Link>
              </div>
            </div>
            <div className="mt-8 border-t border-[#e6e2da] pt-8 text-center text-xs text-[#8a857c]">
              <p>
                Some links on this site are{" "}
                <Link href="/disclosure" className="underline hover:text-[#1a1a1a] transition">affiliate links</Link>.
                We may earn a commission at no extra cost to you. This does not influence our editorial opinions.
              </p>
              <p className="mt-2">
                &copy; {new Date().getFullYear()} Best AI Marketing Tools. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
