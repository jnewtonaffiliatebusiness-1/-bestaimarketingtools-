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
      { source: "/compare", destination: "/reviews", permanent: true },
    ];
  },
};

export default nextConfig;
