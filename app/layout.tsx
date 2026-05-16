import type { Metadata } from "next";
import { Inter, Lora as LoraFont } from 'next/font/google';
import Script from 'next/script';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import ConditionalTicker from "@/components/ConditionalTicker";
import CookieBanner from "@/components/CookieBanner";

const GA_ID = 'G-GFS4JMZGLP';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const lora = LoraFont({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://acontecer.co.cr"),
  title: {
    default: "Acontecer.co.cr - Noticias de Costa Rica",
    template: "%s | Acontecer.co.cr",
  },
  description: "El medio digital independiente de Costa Rica. Noticias de política, economía, deportes, salud y más, con información clara y oportuna.",
  keywords: ["noticias Costa Rica", "acontecer", "periodismo Costa Rica", "noticias ticas", "política Costa Rica"],
  authors: [{ name: "Redacción Acontecer", url: "https://acontecer.co.cr" }],
  creator: "Acontecer.co.cr",
  publisher: "Acontecer.co.cr",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: "https://acontecer.co.cr",
    siteName: "Acontecer.co.cr",
    title: "Acontecer.co.cr - Noticias de Costa Rica",
    description: "El medio digital independiente de Costa Rica. Noticias de política, economía, deportes, salud y más.",
    // La imagen OG se genera dinámicamente desde app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    site: "@acontecercocr",
    creator: "@acontecercocr",
    title: "Acontecer.co.cr - Noticias de Costa Rica",
    description: "El medio digital independiente de Costa Rica.",
  },
  alternates: { canonical: "https://acontecer.co.cr" },
};

const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "name": "Acontecer.co.cr",
  "alternateName": "Acontecer Costa Rica",
  "url": "https://acontecer.co.cr",
  "sameAs": [
    "https://facebook.com/Acontecer.co.cr",
    "https://youtube.com/@acontecercocr",
    "https://tiktok.com/@acontecer.co.cr"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "editorial",
    "email": "prensa@acontecer.co.cr",
    "telephone": "+50662889467",
    "areaServed": "CR",
    "availableLanguage": "Spanish"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CR",
    "addressLocality": "San José"
  },
  "foundingDate": "2022",
  "publishingPrinciples": "https://acontecer.co.cr/politicas",
  "masthead": "https://acontecer.co.cr/nosotros",
  "logo": {
    "@type": "ImageObject",
    "url": "https://cms.acontecer.co.cr/wp-content/uploads/2026/03/FAVS.png",
    "width": 512,
    "height": 512
  }
};

const schemaWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Acontecer.co.cr",
  "url": "https://acontecer.co.cr",
  "description": "El medio digital independiente de Costa Rica",
  "inLanguage": "es-CR",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://acontecer.co.cr/buscar?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" dir="ltr" className={`${inter.variable} ${lora.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="content-language" content="es-cr" />
        {/* Preconnects — solo los orígenes críticos en el camino de carga inicial.
            webpushr se carga tarde (lazyOnload) → no necesita preconnect. */}
        <link rel="preconnect" href="https://cms.acontecer.co.cr" />
        <link rel="dns-prefetch" href="https://cms.acontecer.co.cr" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.webpushr.com" />
        <link rel="dns-prefetch" href="https://analytics.webpushr.com" />
        {/* Iconos multi-resolución — 512×512 para plataformas de noticias */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="512x512" href="https://cms.acontecer.co.cr/wp-content/uploads/2026/03/FAVS.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="https://cms.acontecer.co.cr/wp-content/uploads/2026/03/FAVS.png" />
        {/* Metadatos de plataforma — Windows, Microsoft News, navegadores */}
        <meta name="application-name" content="Acontecer.co.cr" />
        <meta name="theme-color" content="#0000A2" />
        <meta name="msapplication-TileColor" content="#0000A2" />
        <meta name="msapplication-TileImage" content="https://cms.acontecer.co.cr/wp-content/uploads/2026/03/FAVS.png" />
        <meta name="msapplication-config" content="none" />
        {/* RSS autodiscovery — requerido por Apple News y agregadores */}
        <link rel="alternate" type="application/rss+xml" title="Acontecer.co.cr — Feed RSS" href="https://acontecer.co.cr/feed" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schemaOrganization)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schemaWebSite)}} />
      </head>
      <body>
        <Header />
        <Ticker />
        {children}
        <Footer />
        {/* Google Analytics 4 + Consent Mode v2
            Orden correcto según docs de Google:
            1. dataLayer + gtag() → 2. consent default → 3. cargar gtag.js → 4. config */}
        <Script id="ga4-consent" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Paso 1: consent default — todos denegados para EEE (ES, CH, UE)
            // Para el resto del mundo analytics sí se activa por defecto
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500,
              'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','CH','GB']
            });

            // Fuera del EEE: analytics activo por defecto (91% Costa Rica)
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });

            // Mejora medición sin cookies cuando ad_storage es denied
            gtag('set', 'url_passthrough', true);
            gtag('set', 'ads_data_redaction', true);
          `}
        </Script>

        {/* Paso 2: cargar gtag.js */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />

        {/* Paso 3: config */}
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
        <CookieBanner />

        {/* ── Webpushr Push Notifications ────────────────────────────────────
            strategy="lazyOnload": carga solo cuando el navegador está idle
            → no bloquea LCP ni TBT.
            El Service Worker debe estar en /public/webpushr-sw.js
            para que sea accesible en https://acontecer.co.cr/webpushr-sw.js  */}
        <Script id="webpushr-init" strategy="lazyOnload">
          {`
            (function(w,d,s,id){
              if(typeof(w.webpushr)!=='undefined') return;
              w.webpushr = w.webpushr || function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
              var js, fjs = d.getElementsByTagName(s)[0];
              js = d.createElement(s); js.id = id; js.async = 1;
              js.src = 'https://cdn.webpushr.com/app.min.js';
              fjs.parentNode.insertBefore(js, fjs);
            }(window, document, 'script', 'webpushr-jssdk'));

            webpushr('setup', { key: 'BFZLyoX8yANbESQ0fj8qZ8fMVCCUT8i4WoJeMzS0em5o-UCA2zlyCavCwQDFewB1Okqw2dlhJp9ks6ldWiJW0QU' });
          `}
        </Script>
      </body>
    </html>
  );
}
