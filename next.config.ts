import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * OMDb returns movie poster URLs hosted on Amazon / IMDb CDNs, not on this app.
     * Next.js `<Image>` only loads remote URLs that are explicitly allowlisted here.
     *
     * Without these patterns, poster images would fail at runtime and we'd need
     * a plain `<img>` tag instead (losing automatic optimization, sizing, and lazy loading).
     *
     * Hostnames match common OMDb `Poster` field values, e.g.:
     * - https://m.media-amazon.com/images/M/...
     * - https://images-na.ssl-images-amazon.com/images/M/...
     * - http://ia.media-imdb.com/images/M/...  (legacy entries; http kept for older records)
     *
     * @see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "http",
        hostname: "ia.media-imdb.com",
      },
    ],
  },
};

export default nextConfig;
