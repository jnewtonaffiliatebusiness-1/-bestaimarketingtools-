import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Best AI Marketing Tools — Honest Reviews & Comparisons 2025",
    template: "%s | Best AI Marketing Tools",
  },
  description:
    "100+ honest, unbiased reviews of AI marketing tools, email platforms, SEO tools, social media software, and CRM systems. Find the right tool for your business.",
  metadataBase: new URL("https://aitoolsreviewshub.com"),
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
      <body className="bg-gray-950 text-white antialiased">
        <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-black text-xl text-white hover:text-amber-400 transition">
              Best<span className="text-amber-400">AI</span>MarketingTools
            </Link>
            <div className="hidden items-center gap-6 text-sm md:flex">
              <Link href="/reviews" className="text-gray-400 hover:text-white transition">
                All Reviews
              </Link>
              <Link href="/category/ai-marketing-automation" className="text-gray-400 hover:text-white transition">
                AI Tools
              </Link>
              <Link href="/category/email-marketing" className="text-gray-400 hover:text-white transition">
                Email
              </Link>
              <Link href="/category/seo-content-tools" className="text-gray-400 hover:text-white transition">
                SEO
              </Link>
              <Link href="/category/crm-sales-automation" className="text-gray-400 hover:text-white transition">
                CRM
              </Link>
              <Link
                href="https://bonfireterminal.com?utm_source=reviewsite&utm_medium=nav&utm_campaign=navbar"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-black hover:bg-amber-400 transition"
              >
                Bonfire Terminal
              </Link>
            </div>
          </nav>
        </header>

        <main className="pt-16">{children}</main>

        <footer className="border-t border-white/10 bg-gray-950 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <h4 className="mb-4 font-semibold text-white">Categories</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/category/ai-marketing-automation" className="hover:text-white transition">AI Marketing</Link></li>
                  <li><Link href="/category/email-marketing" className="hover:text-white transition">Email Marketing</Link></li>
                  <li><Link href="/category/seo-content-tools" className="hover:text-white transition">SEO Tools</Link></li>
                  <li><Link href="/category/social-media-analytics" className="hover:text-white transition">Social Media</Link></li>
                  <li><Link href="/category/crm-sales-automation" className="hover:text-white transition">CRM & Sales</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-white">Best Of</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/best/best-ai-marketing-tools" className="hover:text-white transition">Best AI Tools</Link></li>
                  <li><Link href="/best/best-email-marketing-platforms" className="hover:text-white transition">Best Email Platforms</Link></li>
                  <li><Link href="/best/best-seo-tools" className="hover:text-white transition">Best SEO Tools</Link></li>
                  <li><Link href="/best/best-crm-tools" className="hover:text-white transition">Best CRM Tools</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-white">Site</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/reviews" className="hover:text-white transition">All Reviews</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                  <li><Link href="/about" className="hover:text-white transition">About & Methodology</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-white">Our Pick</h4>
                <p className="mb-3 text-sm text-gray-400">
                  The one tool we recommend above all others:
                </p>
                <Link
                  href="https://bonfireterminal.com?utm_source=reviewsite&utm_medium=footer&utm_campaign=footer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 transition"
                >
                  Try Bonfire Terminal →
                </Link>
              </div>
            </div>
            <div className="mt-8 border-t border-white/5 pt-8 text-center text-xs text-gray-600">
              <p>
                Some links on this site are affiliate links. We may earn a commission at no extra cost to you.
                This does not influence our editorial opinions.
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
