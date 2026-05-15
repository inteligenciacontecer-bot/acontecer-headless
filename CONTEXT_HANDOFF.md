# Contexto del Proyecto — Acontecer.co.cr
> Documento para traspasar contexto a una nueva sesión de Claude Code.

---

## 1. Descripción General

**Acontecer.co.cr** es un medio digital de noticias de Costa Rica.  
Tiene dos capas:

| Capa | Tecnología | Ubicación |
|------|-----------|-----------|
| CMS (backend/contenido) | WordPress | `cms.acontecer.co.cr` — VPS propio |
| Frontend (público) | Next.js 16 headless | Vercel (repo GitHub privado) |
| Bot de redacción | Node.js + Python + Claude API | VPS propio (`/opt/acontecer-ia/`) |
| Monitor Legislativo | Next.js + PHP API + MySQL | Mismo VPS, mismo repo |

**URLs:**
- Sitio público: `https://acontecer.co.cr`
- CMS interno: `https://cms.acontecer.co.cr` (noindex, no exponer)
- VPS IP: **`46.202.151.188`** (acceso SSH disponible)

---

## 2. Stack Técnico — Frontend (Next.js)

```
next           16.2.1   (App Router, NO Pages Router)
react          19.2.4
tailwindcss    ^4        (@import "tailwindcss" en globals.css — NO @tailwind directives)
typescript     ^5
```

**⚠️ IMPORTANTE — Next.js 16 / React 19 tiene breaking changes:**
- `dynamic()` con `ssr:false` NO funciona en Server Components → debe ir en Client Components con `'use client'`
- `metadata` / `generateMetadata` NO se puede exportar desde componentes `'use client'`
- Para OG images: usar `app/opengraph-image.tsx` con `export const runtime = 'nodejs'`
- Leer `node_modules/next/dist/docs/` ante cualquier duda de API

**Tailwind v4:** usa `@import "tailwindcss"` al inicio de `globals.css`. No hay `tailwind.config.js` ni `@tailwind base/components/utilities`.

**Fuentes:** `next/font/google` — Inter (`--font-inter`) y Fraunces (`--font-fraunces`). NO hay `<link>` a Google Fonts.

**Imágenes:** `unoptimized: true` en `next.config.ts` (las fotos vienen ya optimizadas del CMS). `remotePatterns` incluye `cms.acontecer.co.cr`, `acontecer.co.cr`, `www.asamblea.go.cr`, `i.ytimg.com`.

---

## 3. Estructura de Archivos Clave

```
app/
  layout.tsx                   # Root layout: Header, Footer, Ticker, metadata global, Schema.org
  page.tsx                     # Homepage (server component, ISR 60s)
  globals.css                  # Todos los estilos — inline styles + clases CSS custom
  opengraph-image.tsx          # OG image global (nodejs runtime, lee /public/icon.png)
  robots.ts                    # Robots.txt dinámico
  sitemap.ts                   # Sitemap principal
  news-sitemap.xml/route.ts    # Google News Sitemap con <image:image>

  categoria/[slug]/page.tsx    # Listado de categoría
  categoria/[slug]/opengraph-image.tsx  # OG por categoría (9 categorías con emoji/color)
  [categoria]/[slug]/page.tsx  # Artículo individual (ruta canónica)
  nota/[slug]/page.tsx         # Ruta legacy — redirige canónica a /[categoria]/[slug]
  autor/[slug]/page.tsx        # Perfil de autor

  asamblea/page.tsx            # Dashboard Monitor Legislativo
  asamblea/diputados/page.tsx  # Grid de diputados con filtros
  asamblea/[slug]/page.tsx     # Perfil individual de diputado (SSG, revalidate 3600)
  asamblea/votaciones/page.tsx
  asamblea/en-vivo/page.tsx

  (links)/enlaces/page.tsx     # Link in Bio — layout independiente (sin Header/Footer)
  (links)/layout.tsx           # Layout mínimo para route group

  contacto/page.tsx
  nosotros/page.tsx
  agencia/page.tsx
  pauta/page.tsx
  privacidad/page.tsx
  politicas/page.tsx           # Server wrapper → PoliticasClient.tsx ('use client')
  buscar/page.tsx              # (noindex)

components/
  Header.tsx                   # 'use client' — sticky azul #0000A2, nav desktop/mobile
  Footer.tsx
  Ticker.tsx                   # Breaking news ticker
  CategoryPosts.tsx
  DiputadosClient.tsx          # 'use client' — filtros fracción/provincia
  Hemiciclo.tsx                # SVG hemiciclo 57 bancas
  HemicicloClient.tsx          # 'use client' wrapper para dynamic() del hemiciclo
  ShareButtons.tsx
  Sidebar.tsx
  TextToSpeech.tsx
  YoutubeEmbed.tsx             # Facade — carga iframe solo al hacer click (perf)
  NoImage.tsx

lib/
  og-image.tsx                 # helper makeSectionOgImage({ emoji, titulo, subtitulo, accentColor })

public/
  logo.png                     # Logo blanco horizontal (mixBlendMode: screen en header)
  icon.png                     # Ícono cuadrado — usado en OG images y Link in Bio
  favicon.ico
  news-sitemap.xsl             # Hoja XSL para visualizar el sitemap en navegador
```

---

## 4. Convenciones de Estilos

El proyecto usa **inline styles + clases CSS custom** en `globals.css`. Tailwind se usa poco.

**Clases principales del layout homepage:**
- `.hero-section` / `.hero-inner` / `.hero-main` / `.hero-sidebar` / `.hero-side-card`
- `.main-grid` — 2 cols en desktop (contenido + aside), 1 col en móvil
- `.news-grid` — 3 cols en desktop (≥1100px), 2 cols en móvil
- `.cat-editorial` — layout editorial 2 cols: nota grande + lista
- `.sidebar-widget` / `.sidebar-item`
- `.cats-bar` / `.cats-inner` / `.cat-link`

**Breakpoint desktop:** `@media (min-width: 1100px)` — definido al final de `globals.css`.  
**Max-width en desktop:** `1500px` (hero, main-grid, cats-inner, stats, YouTube).

**Paleta principal:**
```css
--azul:        #0000A2   /* header, títulos */
--azul-claro:  #0a73ce   /* acentos, links */
--gris-claro:  #f4f6fa   /* fondo general */
```

---

## 5. WordPress API (fuente de datos)

Base URL: `https://cms.acontecer.co.cr/wp-json/wp/v2`

Endpoints usados:
```
/posts?per_page=N&_embed                          # noticias con imagen destacada
/posts?categories=ID&per_page=N&_embed
/posts?slug=SLUG&_embed
/posts?search=QUERY&per_page=N&_embed
/categories?slug=SLUG
/categories?per_page=20
/users?slug=SLUG
/media/ID
```

**Imagen destacada:** `post._embedded?.['wp:featuredmedia']?.[0]?.source_url`  
**SEO title/desc:** `post.acf?._acontecer_seo_title` y `post.acf?._acontecer_seo_desc` (con fallback a `post.title.rendered` y `post.excerpt.rendered`)

---

## 6. SEO — Estado actual

- **Canónicas:** Todas las páginas emiten su propia `alternates.canonical` absoluta.
  - Artículos: `https://acontecer.co.cr/{categoriaSlug}/{slug}` (NO `/nota/{slug}`)
  - `/buscar` tiene `robots: { index: false, follow: true }`
- **OG Images:** Generadas dinámicamente con `next/og` (NO `/logo.png` blanco).
  - Global: `app/opengraph-image.tsx`
  - Por categoría: `app/categoria/[slug]/opengraph-image.tsx`
  - Por sección: `app/{seccion}/opengraph-image.tsx`
- **Sitemap:** `sitemap.ts` + `news-sitemap.xml/route.ts` (con `<image:image>`)
- **Schema.org:** `NewsMediaOrganization` + `WebSite` en el root layout
- **CMS blindado:** `cms.acontecer.co.cr` tiene `X-Robots-Tag: noindex, nofollow` + 301 redirect en `/`

---

## 7. Monitor Legislativo (Asamblea)

Sección en `/asamblea` — datos de 57 diputados de Costa Rica.

**Base de datos MySQL en VPS:**
- Tablas: `diputados`, `votaciones`, `expedientes`, `asistencia`, `gasolina`, `eventos_telegram`

**API PHP (mu-plugin WordPress):**
- Endpoint: `https://cms.acontecer.co.cr/wp-json/asamblea/v1/`
- Rutas: `/diputados`, `/diputados/{slug}`, `/votaciones`, `/expedientes`, `/promedios`

**Scrapers Python en VPS** (`/opt/acontecer-asamblea/`):
- `scraper_asamblea.py` — SharePoint REST API de Asamblea + fallback delfino.cr
- `telegram_monitor.py` — escucha grupo Prensa Asamblea (Telethon)
- Crons con `ionice -c 3 nice -n 19` para no saturar el VPS

**Datos de diputados:** fotos desde `www.asamblea.go.cr`, colores por fracción (PLN azul, PUSC negro, FA rojo, etc.)

**Hemiciclo:** SVG interactivo `components/Hemiciclo.tsx` con 57 bancas en 5 filas. En móvil: primer tap = tooltip, segundo tap = navegar al perfil.

---

## 8. Bot de WhatsApp (Redacción IA)

**Ruta VPS:** `/opt/acontecer-ia/`

**Archivos:**
- `whatsapp-bot.js` — Node.js + whatsapp-web.js. Recibe mensajes de texto/audio/imagen
- `redactar.py` — Python + Claude API. Redacta noticias en formato WordPress
- `transcribir.py` — Whisper para notas de voz
- `describir.py` — visión para imágenes

**Flujo principal:**
1. Usuario envía texto/audio/imagen a WhatsApp
2. Bot detecta tipo → llama al script Python correspondiente
3. `redactar.py` llama a Claude API → devuelve JSON con `{titulo, contenido, categoria, tags}`
4. Bot envía la nota para aprobación → usuario aprueba → se publica en WordPress

**Fix crítico aplicado (bug "detached Frame"):**
```javascript
// CORRECTO — no bloquea si el frame se desconecta:
sendSeguro(chat, '✍️ Redactando nota...').catch(() => {});
try {
  await procesarConClaude(chat, texto, ts);
} catch(err) { ... }

// sendSeguro() = helper con 3 reintentos + getChatById() fresco en error de frame
```

**Flag anti-duplicados:** `let procesandoClaude = false` — evita 3 llamadas paralelas a Claude si el usuario envía el mismo texto varias veces.

**`redactar.py` parse JSON 3 intentos:** limpia control chars → regex `{...}` → error con respuesta cruda.

---

## 9. Página Link in Bio (`/enlaces`)

- Ruta group `(links)` → layout mínimo sin Header/Footer/Ticker
- ISR 300s, fetcha 12 últimas noticias del CMS
- Diseño mobile-first: fondo navy `#050520`, botones gradiente celeste
- Logo: `/icon.png` 96×96 con glow
- Botones fijos: Monitor Legislativo, Canal WhatsApp, Publicidad, Contacto
- WhatsApp channel: `https://www.whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S`

---

## 10. Infraestructura VPS

| Dato | Valor |
|------|-------|
| IP | `46.202.151.188` |
| OS | Ubuntu/Debian |
| Web server | nginx (xcloud panel) |
| PHP | activo (WordPress) |
| Node.js | activo (bot WhatsApp) |
| Python | activo (scrapers + IA) |
| MySQL | activo (asamblea DB) |

**Nginx config CMS:** `/etc/nginx/xcloud-conf/cms.acontecer.co.cr/server/`  
**Archivo blindaje SEO:** `seo-blindaje.conf` (X-Robots-Tag noindex + 301 desde `/`)

**Servicios activos:**
- `pm2` — gestiona `whatsapp-bot.js`
- Crontabs — scrapers asamblea con ionice/nice

---

## 11. Despliegue

- **GitHub repo:** `inteligenciacontecer-bot/acontecer-headless` (privado)
- **Vercel:** proyecto `acontecer-headless`, team `inteligenciacontecer-bots-projects`
- **CI/CD:** push a `main` → Vercel despliega automáticamente
- **Build:** Turbopack

---

## 12. Cosas a tener en cuenta / Gotchas

1. **No usar `'use client'` + `export const metadata`** — no funciona en Next.js 16. Separar en Server Component wrapper + Client Component.
2. **`dynamic()` con `ssr:false`** — solo en Client Components.
3. **OG images** — siempre `export const runtime = 'nodejs'` para poder leer archivos con `fs`.
4. **`logo.png`** — es blanco sobre transparente. NO usar como OG image (sale en blanco en redes sociales). Usar `icon.png` para OG.
5. **Tailwind v4** — NO escribir `@tailwind base` ni `@tailwind components`. Solo `@import "tailwindcss"`.
6. **inline styles en JSX** — el proyecto los usa extensivamente. No refactorizar a Tailwind sin necesidad.
7. **`per_page` WP API** — máximo recomendado 50. Con `_embed` aumenta el tiempo de respuesta.
8. **Archivos `temp_*.tsx`** en `app/` — son backups temporales, ignorar.
9. **`page.tsx.bak`** en `app/` — backup de la homepage, ignorar.
10. **Bot WhatsApp** corre con PM2 en VPS. Si se edita `whatsapp-bot.js`, hacer `pm2 restart whatsapp-bot` en el VPS.
