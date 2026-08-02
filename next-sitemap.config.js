/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Hardcoded (NOT process.env.SITE_URL): a Vercel env var SITE_URL was set to a
  // whitespace-padded non-www value, which broke every sitemap URL (wrong host + stray
  // spaces). The canonical host is www — pin it here so the env var can't override it.
  siteUrl: "https://www.aitoolsreviewshub.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  // Keep non-page routes out of the sitemap (e.g. the /api/comparison-sheet endpoint).
  // Also drop every review carrying `noindex: true` in its frontmatter — the 100
  // template-generated pages (2026-08-01). Submitting a noindexed URL in a sitemap
  // sends Google contradictory signals, so the two must agree.
  // Reversible: remove the frontmatter flag and these drop out of this list too.
  exclude: (() => {
    const base = ["/api/*"];
    try {
      const fs = require("fs");
      const path = require("path");
      const dir = path.join(__dirname, "content", "reviews");
      const noindexed = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".mdx"))
        .filter((f) => /^noindex:\s*true\s*$/m.test(fs.readFileSync(path.join(dir, f), "utf8")))
        .map((f) => "/reviews/" + f.replace(/\.mdx$/, ""));
      console.log(`[next-sitemap] excluding ${noindexed.length} noindexed reviews`);
      return base.concat(noindexed);
    } catch (e) {
      // Never silently ship a sitemap full of noindexed URLs — fail loudly instead.
      throw new Error("next-sitemap: could not read content/reviews to build the exclude list: " + e.message);
    }
  })(),
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
    ],
  },
  additionalPaths: async () => {
    return [
      { loc: "/", priority: 1.0, changefreq: "daily" },
      { loc: "/reviews", priority: 0.9, changefreq: "daily" },
      { loc: "/about", priority: 0.5, changefreq: "monthly" },
    ];
  },
};
