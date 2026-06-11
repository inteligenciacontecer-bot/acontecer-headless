import type { Metadata, Viewport } from "next";
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
  alternates: {
    canonical: "https://acontecer.co.cr",
    languages: { 'es-CR': 'https://acontecer.co.cr' },
  },
};

// Viewport separado del metadata — evita que Next.js lo duplique en el <head>
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  // @id canónico — permite que Google unifique todas las menciones del medio
  // en un único nodo del Knowledge Graph, sin importar en qué página aparezca.
  "@id": "https://acontecer.co.cr/#organization",
  "name": "Acontecer.co.cr",
  "legalName": "Acontecer Costa Rica",
  "alternateName": "Acontecer Costa Rica",
  "url": "https://acontecer.co.cr",
  "sameAs": [
    "https://facebook.com/Acontecer.co.cr",
    "https://youtube.com/@acontecercocr",
    "https://tiktok.com/@acontecer.co.cr",
    "https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S"
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
    "addressLocality": "San José",
    "addressRegion": "Provincia de San José"
  },
  // areaServed con Wikidata para señal de entidad ligada
  "areaServed": {
    "@type": "Country",
    "name": "Costa Rica",
    "sameAs": [
      "https://es.wikipedia.org/wiki/Costa_Rica",
      "https://www.wikidata.org/wiki/Q800"
    ]
  },
  "foundingDate": "2020",
  "publishingPrinciples": "https://acontecer.co.cr/politicas",
  "masthead": "https://acontecer.co.cr/nosotros",
  "logo": {
    "@type": "ImageObject",
    "url": "https://acontecer.co.cr/logo.png",
    "width": 600,
    "height": 94
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
    <html lang="es" suppressHydrationWarning dir="ltr" className={`${inter.variable} ${lora.variable}`}>
      <head>
        {/* viewport se declara via export const viewport — no duplicar aquí */}
        <meta httpEquiv="content-language" content="es-cr" />
        {/* Preconnects — solo los orígenes críticos en el camino de carga inicial.
            webpushr se carga tarde (lazyOnload) → no necesita preconnect. */}
        {/* cms.acontecer.co.cr: imágenes de etiquetas/categorías se cargan desde ahí */}
        <link rel="preconnect" href="https://cms.acontecer.co.cr" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cms.acontecer.co.cr" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.webpushr.com" />
        <link rel="dns-prefetch" href="https://analytics.webpushr.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        {/* APIs de datos en vivo (clima + tipo cambio) — preconnect ahorra ~950ms LCP mobile */}
        <link rel="preconnect" href="https://api.open-meteo.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tipodecambio.paginasweb.cr" />
        {/* Dark mode anti-FOUC: aplica data-theme ANTES del primer paint
            para evitar flash light → dark en usuarios que lo tenían activado */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
        {/* Iconos multi-resolución — favicon, PWA (192/512), Apple */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favs.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* PWA — Web App Manifest (installable on mobile/desktop) */}
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Metadatos de plataforma — Windows, Microsoft News, navegadores */}
        <meta name="application-name" content="Acontecer.co.cr" />
        <meta name="apple-mobile-web-app-title" content="Acontecer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0000A2" />
        <meta name="msapplication-TileColor" content="#0000A2" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <meta name="msapplication-config" content="none" />
        {/* RSS autodiscovery — requerido por Apple News y agregadores */}
        <link rel="alternate" type="application/rss+xml" title="Acontecer.co.cr — Feed RSS" href="https://acontecer.co.cr/feed" />
        {/* OpenSearch — permite agregar Acontecer como motor de búsqueda del browser */}
        <link rel="search" type="application/opensearchdescription+xml" title="Acontecer.co.cr" href="/opensearch.xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schemaOrganization)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schemaWebSite)}} />
      </head>
      <body>
        {/* A11y: skip-link para usuarios de teclado / lectores de pantalla */}
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
        <Header />
        <Ticker />
        <div id="main-content" tabIndex={-1} style={{outline: 'none'}}>{children}</div>
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
        {/* Microsoft Clarity — mapas de calor y grabaciones de sesión */}
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x586fz391j");
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
