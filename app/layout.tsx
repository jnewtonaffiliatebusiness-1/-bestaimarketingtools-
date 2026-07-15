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
      <body className="bg-[#f7f6f2] text-[#1a1a1a] antialiased">
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
              <Link
                href="https://www.digistore24.com/redir/300124/JNewton/aitoolshub?utm_source=reviewsite&utm_medium=nav&utm_campaign=navbar"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#b8460f] px-4 py-2 font-semibold text-white hover:bg-[#9e3c0d] transition"
              >
                Bonfire Terminal
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
                  <li><Link href="/blog" className="hover:text-[#1a1a1a] transition">Blog</Link></li>
                  <li><Link href="/about" className="hover:text-[#1a1a1a] transition">About & Methodology</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-[#1a1a1a]">Our Pick</h4>
                <p className="mb-3 text-sm text-[#55514a]">
                  The one tool we recommend above all others:
                </p>
                <Link
                  href="https://www.digistore24.com/redir/300124/JNewton/aitoolshub?utm_source=reviewsite&utm_medium=footer&utm_campaign=footer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-[#b8460f] px-4 py-2 text-sm font-bold text-white hover:bg-[#9e3c0d] transition"
                >
                  Try Bonfire Terminal →
                </Link>
              </div>
            </div>
            <div className="mt-8 border-t border-[#e6e2da] pt-8 text-center text-xs text-[#8a857c]">
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
