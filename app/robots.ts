import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/wp-content/uploads/'],
        disallow: [
          '/api/',
          '/wp-admin/',
          '/wp-login.php',
          '/wp-json/',
          '/author/',
          '/nota/',
          '/page/',
          '/*?cat=',
          '/*?paged=',
          '/*?p=',
          '/*?s=',
          '/feed/',
          '/*/feed',
          '/*/feed/',
          '/_next/',
          '/wp-content/plugins/',
          '/wp-content/themes/',
          '/index.php',
          '/opengraph-image',
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
        ],
      },
    ],
    sitemap: [
      'https://acontecer.co.cr/sitemap.xml',
      'https://acontecer.co.cr/news-sitemap.xml',
    ],
    host: 'https://acontecer.co.cr',
  };
}
