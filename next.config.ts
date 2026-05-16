import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Nota: s-maxage agresivo (60s) para news + SWR largo (600s)
        // → Googlebot recibe HTML pre-renderizado al instante (TTFB <50ms)
        //   mientras Next revalida en segundo plano
        source: '/:categoria/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=600' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        // Categorías: idem nota para mantener archivo siempre fresco para crawlers
        source: '/categoria/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=600' },
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
      {
        // ── Security Headers globales ──────────────────────────────────────
        // Aplican a TODAS las rutas. Cloudflare suele forzar HSTS=max-age=0
        // hasta que se active en panel — al setearlo aquí desde origin lo overrideamos.
        source: '/:path*',
        headers: [
          {
            // HSTS: forza HTTPS por 1 año. Sin preload (compromiso permanente — opt-in manual)
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            // Envía Referer completo a propio dominio, solo origin a externos
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Deshabilita APIs del browser que el sitio NO usa
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
          },
          {
            // Refuerzo: previene MIME sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Refuerzo: previene clickjacking en mismo origen
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // CSP en modo REPORT-ONLY: loggea violaciones pero NO bloquea contenido.
            // Estrategia: dejarlo así 1-2 semanas, revisar errores en consola, y
            // recién entonces cambiar key a 'Content-Security-Policy' para enforce.
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://cdn.webpushr.com https://*.webpushr.com https://*.ads-twitter.com https://static.cloudflareinsights.com https://ajax.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.analytics.google.com https://*.webpushr.com https://cms.acontecer.co.cr https://acontecer.co.cr https://api.open-meteo.com https://tipodecambio.paginasweb.cr",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://*.facebook.com https://*.twitter.com https://platform.twitter.com",
              "media-src 'self' https: blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              // "upgrade-insecure-requests" — solo válido en CSP enforce, no en Report-Only
            ].join('; '),
          },
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
