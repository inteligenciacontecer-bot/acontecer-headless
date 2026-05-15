import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:categoria/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=3600' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        source: '/categoria/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=120, stale-while-revalidate=1800' },
        ],
      },
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=600' },
        ],
      },
      {
        source: '/asamblea/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=30, stale-while-revalidate=300' },
        ],
      },
      {
        source: '/feed',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
      {
        source: '/logo.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, immutable' },
        ],
      },
      {
        source: '/:path(sitemap.xml|news-sitemap.xml)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=1800, stale-while-revalidate=3600' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/:path*',
        destination: 'https://cms.acontecer.co.cr/wp-content/:path*',
      },
    ];
  },
  async redirects() {
    return [
      { source: '/author/:slug', destination: '/autor/:slug', permanent: true },
      { source: '/tag/:slug', destination: '/etiqueta/:slug', permanent: true },
      { source: '/rss', destination: '/feed', permanent: false },
      { source: '/page/:num', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: false },
      { source: '/wp-admin/:path*', destination: '/', permanent: false },
      { source: '/', has: [{ type: 'query', key: 'cat' }], destination: '/', permanent: true },
      { source: '/page/:num', has: [{ type: 'query', key: 'cat' }], destination: '/', permanent: true },
      { source: '/wp-json/:path*', destination: 'https://cms.acontecer.co.cr/wp-json/:path*', permanent: false },
      { source: '/inicio/:rest*', destination: '/', permanent: true },
      { source: '/blog-style-listing-example/:rest*', destination: '/', permanent: true },
      { source: '/:path*', has: [{ type: 'query', key: 'utm_source' }], destination: '/:path*', permanent: true },
      { source: '/:path*', has: [{ type: 'query', key: 'utm_medium' }], destination: '/:path*', permanent: true },
      { source: '/:path*', has: [{ type: 'query', key: 'utm_campaign' }], destination: '/:path*', permanent: true },
      { source: '/categoria/:slug/page/:num', destination: '/categoria/:slug', permanent: true },
      { source: '/categoria/:slug/page/:num/', destination: '/categoria/:slug', permanent: true },
      { source: '/:a/:b/feed', destination: '/feed', permanent: true },
      { source: '/:a/:b/feed/', destination: '/feed', permanent: true },
      { source: '/:a/feed', destination: '/feed', permanent: true },
      { source: '/:a/feed/', destination: '/feed', permanent: true },
      { source: '/uncategorized/:slug', destination: '/nacionales/:slug', permanent: true },
      { source: '/2019/:rest*', destination: '/', permanent: true },
      { source: '/2020/:rest*', destination: '/', permanent: true },
      { source: '/2021/:rest*', destination: '/', permanent: true },
      { source: '/2022/:rest*', destination: '/', permanent: true },
      { source: '/2023/:rest*', destination: '/', permanent: true },
      { source: '/:path*', has: [{ type: 'query', key: 'amp' }], destination: '/:path*', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cms.acontecer.co.cr' },
      { protocol: 'https', hostname: 'acontecer.co.cr' },
      { protocol: 'https', hostname: 'scenic-reef-209903.wp1.sh' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'www.asamblea.go.cr' },
    ],
  },
};

export default nextConfig;
