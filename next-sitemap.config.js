/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.aitoolsreviewshub.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  // Keep non-page routes out of the sitemap (e.g. the /api/comparison-sheet endpoint).
  exclude: ["/api/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
    ],
  },
  additionalPaths: async () => {
    return [
      { loc: "/", priority: 1.0, changefreq: "daily" },
      { loc: "/reviews", priority: 0.9, changefreq: "daily" },
      { loc: "/blog", priority: 0.8, changefreq: "weekly" },
      { loc: "/about", priority: 0.5, changefreq: "monthly" },
    ];
  },
};
