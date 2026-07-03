import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // /_next/static/ permitido: CSS/JS/fuentes que Googlebot necesita para RENDERIZAR
        // la página (un Allow más específico gana sobre el Disallow: /_next/ de abajo).
        // Sin esto, Google ve el HTML sin estilos → peor evaluación móvil/page-experience.
        allow: ['/', '/api/diputado-foto', '/wp-content/uploads/', '/_next/static/', '/_next/image'],
        disallow: [
          '/api/',
          '/wp-admin/',
          '/wp-login.php',
          '/wp-json/',
          // NOTA: /author/, /nota/, /tag/ se omiten aquí a propósito.
          // Tienen redirects 308 → /autor/, /nacionales/, /etiqueta/.
          // Si los bloqueamos con Disallow, Googlebot no sigue el redirect
          // y quedan como "indexed though blocked" en Search Console.
          '/page/',
          '/*?cat=',
          '/*?paged=',
          '/*?p=',
          '/*?s=',
          '/_next/',
          '/wp-content/plugins/',
          '/wp-content/themes/',
          '/index.php',
          '/opengraph-image',
          '/*/opengraph-image',
          '/*?fbclid=',
          '/*?amp=',
          '/inicio/',
          '/blog-style-listing-example/',
          '/*?utm_source=',
          '/*?utm_medium=',
          '/*?utm_campaign=',
          '/2019/',
          '/2020/',
          '/2021/',
          '/2022/',
          '/2023/',
          '/news/ywnv',
          '/content/ywnv',
          '/goods/ywnv',
          '/shop/ywnv',
          '/amazon/ywnv',
          '/google/ywnv',
          '/yahoo/ywnv',
          '/blog/ywnv',
          '/about/ywnv',
          '/item/ywnv',
        ],
      },
      // Permitir explícitamente a bots de IA (mejor visibilidad en LLMs/AI Overview)
      { userAgent: 'GPTBot',           allow: '/' },
      { userAgent: 'Google-Extended',  allow: '/' },
      { userAgent: 'PerplexityBot',    allow: '/' },
      { userAgent: 'ClaudeBot',        allow: '/' },
      { userAgent: 'anthropic-ai',     allow: '/' },
      { userAgent: 'CCBot',            allow: '/' },
      // Googlebot-News: sección explícita — sin esto hereda las reglas de * que incluyen
      // Disallow: /feed/ y pueden crear ambigüedad. Google News requiere acceso libre a artículos.
      { userAgent: 'Googlebot-News',   allow: '/' },
      // Image bots: explícitos
      { userAgent: 'Googlebot-Image',  allow: ['/', '/wp-content/uploads/'] },
      // Bing: cobertura completa — crawler principal, legacy MSN, preview y imagen.
      // Sin sección propia heredan las reglas de * con 30+ Disallow innecesarios para Bing.
      { userAgent: 'Bingbot',          allow: '/' },
      { userAgent: 'msnbot',           allow: '/' },
      { userAgent: 'BingPreview',      allow: '/' },
      { userAgent: 'Bingbot-Image',    allow: ['/', '/wp-content/uploads/'] },
    ],
    sitemap: [
      'https://acontecer.co.cr/sitemap.xml',
      'https://acontecer.co.cr/news-sitemap.xml',
      'https://acontecer.co.cr/image-sitemap.xml',
      'https://acontecer.co.cr/clima-sitemap.xml',
    ],
    // host omitido: directiva no estándar (Yandex-only), Bing la marca como error
  };
}
