import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — AI Marketing Guides & Strategy",
  description:
    "In-depth guides on AI marketing, email automation, SEO strategy, and sales tools. Learn how to build the right marketing stack for your business.",
};

const BLOG_POSTS = [
  {
    slug: "best-cold-email-software",
    title: "Best Cold Email Software in 2025: 10 Tools Compared",
    desc: "We tested 10 cold email tools. Here's what actually works for deliverability, personalization, and scale.",
    date: "2025-01-10",
    category: "AI Marketing",
  },
  {
    slug: "how-to-automate-cold-outreach",
    title: "How to Automate Cold Outreach (Without Getting Banned)",
    desc: "Step-by-step guide to setting up automated cold email sequences that land in the inbox, not spam.",
    date: "2025-01-15",
    category: "AI Marketing",
  },
  {
    slug: "mailchimp-vs-activecampaign",
    title: "Mailchimp vs ActiveCampaign: Which Should You Use?",
    desc: "The definitive comparison for 2025. We break down pricing, automation, deliverability, and support.",
    date: "2025-01-20",
    category: "Email Marketing",
  },
  {
    slug: "best-seo-tools-for-small-business",
    title: "Best SEO Tools for Small Business (Budget-Friendly)",
    desc: "You don't need a $500/mo SEO suite. Here are the best affordable options that actually move the needle.",
    date: "2025-01-25",
    category: "SEO",
  },
  {
    slug: "how-to-track-seo-rankings",
    title: "How to Track Your SEO Rankings Effectively in 2025",
    desc: "Rank tracking without the overwhelm. The tools, setup, and metrics that actually matter.",
    date: "2025-02-01",
    category: "SEO",
  },
  {
    slug: "best-crm-for-agencies",
    title: "Best CRM for Agencies in 2025: 8 Options Compared",
    desc: "Managing multiple client pipelines is hard. These are the CRMs built for agency workflows.",
    date: "2025-02-05",
    category: "CRM",
  },
  {
    slug: "best-social-media-scheduling-tools",
    title: "Best Social Media Scheduling Tools: Tested & Ranked",
    desc: "We used 12 social scheduling tools for 30 days each. Here's the honest ranking.",
    date: "2025-02-10",
    category: "Social Media",
  },
  {
    slug: "ai-marketing-stack-2025",
    title: "The Complete AI Marketing Stack for 2025",
    desc: "The exact tool stack top marketing teams use: from content creation to analytics to outreach.",
    date: "2025-02-15",
    category: "Strategy",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-3 text-4xl font-black text-white">Blog</h1>
        <p className="text-gray-400">
          Strategy guides, tool comparisons, and deep-dives on marketing software.
        </p>
      </div>

      <div className="space-y-6">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-500/30 hover:bg-white/8"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                {post.category}
              </span>
              <span className="text-xs text-gray-600">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h2 className="mb-2 text-xl font-bold text-white group-hover:text-amber-400 transition">
              {post.title}
            </h2>
            <p className="text-gray-400">{post.desc}</p>
            <p className="mt-3 text-sm text-amber-500 group-hover:text-amber-400 transition">
              Read article →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
