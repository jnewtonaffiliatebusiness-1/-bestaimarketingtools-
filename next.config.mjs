/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**.pexels.com" },
    ],
  },
  // 308-redirect stale URLs Google still has (they currently 404) to the right pages,
  // instead of letting them sit as crawl errors. See also the suffix-less /reviews/:slug
  // redirect handled in app/reviews/[slug]/page.tsx.
  async redirects() {
    return [
      { source: "/methodology", destination: "/about", permanent: true },
      { source: "/presell", destination: "/reviews", permanent: true },
      { source: "/compare", destination: "/vs", permanent: true },
      // /compare/:slugs was a fully dynamic comparison route: it answered on ANY
      // pair of review slugs, so it was an unbounded space of near-identical
      // pages, orphaned (nothing linked to it) and absent from the sitemap. It is
      // replaced by the bounded, statically generated /vs/ section. The slug
      // formats differ — /compare used full review slugs ("close-crm-review"),
      // /vs uses product slugs ("close") — so there is no 1:1 mapping to redirect
      // to, and these land on the index rather than guessing at a pair.
      { source: "/compare/:slugs", destination: "/vs", permanent: true },
      // /blog listed 8 articles that were never written — every "Read article" link 404'd.
      // The index itself was indexed (sitemap priority 0.8), so redirect rather than 404 it.
      { source: "/blog", destination: "/reviews", permanent: true },
      { source: "/blog/:slug", destination: "/reviews", permanent: true },
    ];
  },
};

export default nextConfig;
