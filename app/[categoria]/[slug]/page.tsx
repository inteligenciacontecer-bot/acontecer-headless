import './nota.css';
import { redirect, notFound } from 'next/navigation';
import TextToSpeech from '@/components/TextToSpeech';
import Sidebar, { type Heading } from '@/components/Sidebar';
import ArticleScrollTracker from '@/components/ArticleScrollTracker';
import NotaInteractive from '@/components/NotaInteractive';
import AuthorAvatar from '@/components/AuthorAvatar';
import { linkDiputados, type DiputadoMinimo } from '@/lib/diputados-linker';

const API          = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const ASAMBLEA_API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

/* ── Helpers ────────────────────────────────────────────────────────────── */

function truncarHTML(html: string, maxParas = 3): string {
  const parts = html.split('</p>');
  if (parts.length <= maxParas) return html;
  return parts.slice(0, maxParas).join('</p>') + '</p>';
}

function extraerPrimerH2(html: string): { subtitulo: string | null; resto: string } {
  const match = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (!match) return { subtitulo: null, resto: html };
  const subtitulo = match[1].replace(/<[^>]+>/g, '').trim();
  const resto = html.replace(match[0], '').trim();
  return { subtitulo, resto };
}

function extraerEncabezados(html: string): Heading[] {
  const headings: Heading[] = [];
  const re = /<h([23])[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const text = match[3].replace(/<[^>]+>/g, '').trim();
    if (text) headings.push({ id: match[2], text, level: parseInt(match[1]) });
  }
  return headings;
}

/**
 * limpiarContenido — sanitiza el HTML de WordPress para el render
 * @param addHeadingIds  true sólo para el artículo principal (activa TOC IDs)
 */
function limpiarContenido(html: string, addHeadingIds = false) {
  let sectionCount = 0;
  return html
    // Elimina embeds de video/redes que no renderizamos
    .replace(/<figure[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    // Canonicaliza links internos
    .replace(/href="https?:\/\/(www\.|cms\.)?acontecer\.co\.cr/gi, 'href="https://acontecer.co.cr')
    // Agrega IDs a H2/H3 que no los tengan (para TOC)
    .replace(/<h([23])([^>]*)>/gi, (_: string, level: string, attrs: string) => {
      if (!addHeadingIds) return `<h${level}${attrs}>`;
      if (/\bid\s*=/.test(attrs)) return `<h${level}${attrs}>`;
      sectionCount++;
      return `<h${level}${attrs} id="nv2-s${sectionCount}">`;
    })
    // Imágenes responsivas con estilo básico
    .replace(/<img([^>]*)>/gi,
      '<img$1 loading="lazy" decoding="async" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;display:block;">'
    );
}

/* ── API fetches ────────────────────────────────────────────────────────── */

async function getPost(slug: string) {
  const res = await fetch(API + '/posts?slug=' + slug + '&_embed', { next: { revalidate: 60 } });
  const posts = await res.json();
  return posts[0];
}

async function getRelated(categoryIds: number[], currentId: number) {
  const res = await fetch(
    API + '/posts?categories=' + categoryIds.join(',') + '&per_page=4&_embed&exclude=' + currentId,
    { next: { revalidate: 60 } }
  );
  return res.json();
}

async function getDiputadosMinimos(): Promise<DiputadoMinimo[]> {
  try {
    const res = await fetch(`${ASAMBLEA_API}/diputados?_fields=slug,nombre_completo`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

/* ── Metadata ───────────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: { params: Promise<{ slug: string; categoria: string }> }) {
  const { slug, categoria } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Nota no encontrada' };
  const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://acontecer.co.cr/opengraph-image';
  const rawTitle   = post.title.rendered.replace(/<[^>]+>/g, '');
  const rawExcerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim().slice(0, 160) || '';
  const seoTitle   = post.meta?._acontecer_seo_title || '';
  const seoDesc    = post.meta?._acontecer_seo_desc  || '';
  const titulo     = (seoTitle || rawTitle) + ' | Acontecer.co.cr';
  const descripcion = seoDesc || rawExcerpt;
  const realCatSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || categoria;
  const canonicalUrl = `https://acontecer.co.cr/${realCatSlug}/${slug}`;
  const tags    = post._embedded?.['wp:term']?.[1]?.map((t: any) => t.name) || [];
  const autorNombre = post._embedded?.author?.[0]?.name || 'Redaccion ACONTECER';

  return {
    title: titulo,
    description: descripcion,
    keywords: tags.join(', ') || undefined,
    authors: [{ name: autorNombre }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: rawTitle,
      description: descripcion,
      url: canonicalUrl,
      siteName: 'Acontecer.co.cr',
      images: [{ url: featuredImg, width: 1200, height: 630, alt: rawTitle }],
      type: 'article',
      publishedTime:  post.date,
      modifiedTime:   post.modified,
      authors: [autorNombre],
      section: realCatSlug,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: rawTitle,
      description: descripcion,
      images: [featuredImg],
    },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  };
}

/* ── Page component ─────────────────────────────────────────────────────── */

export default async function NotaPage({ params }: { params: Promise<{ slug: string; categoria: string }> }) {
  const { slug, categoria } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();

  // Redirect a la URL canónica si la categoría en la URL no coincide
  const realCat = post._embedded?.['wp:term']?.[0]?.[0]?.slug;
  if (realCat && realCat !== categoria) redirect(`/${realCat}/${slug}`);

  const [related, diputados] = await Promise.all([
    getRelated(post.categories, post.id),
    getDiputadosMinimos(),
  ]);

  const DEFAULT_IMG  = 'https://acontecer.co.cr/opengraph-image';
  const featuredImg  = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_IMG;
  const authorName   = post._embedded?.author?.[0]?.name || 'Redaccion ACONTECER';
  const authorSlug   = post._embedded?.author?.[0]?.slug || 'editor';
  const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['96'] || null;
  const authorBio    = post._embedded?.author?.[0]?.description || '';
  const catName      = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Nacionales';
  const catSlug      = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
  const tags         = (post._embedded?.['wp:term']?.[1] || []) as any[];
  const fecha = new Date(post.date).toLocaleDateString('es-CR', { day:'numeric', month:'long', year:'numeric' });
  const shareUrl   = 'https://acontecer.co.cr/' + catSlug + '/' + slug;
  const shareTitle = encodeURIComponent(post.title.rendered.replace(/<[^>]+>/g, ''));

  const tituloPlano = post.title.rendered
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_: string, n: string) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ');

  const palabras      = post.content.rendered.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const tiempoLectura = Math.max(1, Math.ceil(palabras / 200));

  const { subtitulo, resto } = extraerPrimerH2(post.content.rendered);
  const conIDs         = limpiarContenido(resto, true);        // con IDs para TOC
  const contenidoLimpio = linkDiputados(conIDs, diputados);
  const headings       = extraerEncabezados(conIDs);

  /* ── SVG icons ─────────────────────────────────────────────────────────── */
  const IcFb = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
  const IcWa = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}><path d="M20.5 3.5A11 11 0 0 0 3.5 17l-1.4 5 5-1.4a11 11 0 0 0 13.4-17z"/></svg>;
  const IcX  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" style={{width:13,height:13}}><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>;
  const IcTg = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
  const IcArrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:11,height:11}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

  return (
    <>
      {/* SCHEMA.ORG — BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type':'ListItem', position:1, name:'Inicio',  item:'https://acontecer.co.cr' },
          { '@type':'ListItem', position:2, name:catName,   item:`https://acontecer.co.cr/categoria/${catSlug}` },
          { '@type':'ListItem', position:3, name:tituloPlano, item:`https://acontecer.co.cr/${catSlug}/${slug}` },
        ],
      })}} />

      {/* SCHEMA.ORG — NewsArticle */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline:    tituloPlano.slice(0, 110),
        description: post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim().slice(0, 160),
        url:         `https://acontecer.co.cr/${catSlug}/${slug}`,
        datePublished:  post.date,
        dateModified:   post.modified,
        author: { '@type':'Person', name:authorName, url:`https://acontecer.co.cr/autor/${authorSlug}` },
        publisher: {
          '@type':'Organization', name:'Acontecer.co.cr', url:'https://acontecer.co.cr',
          logo: { '@type':'ImageObject', url:'https://cms.acontecer.co.cr/wp-content/uploads/2026/03/FAVS.png', width:512, height:512 },
        },
        image: featuredImg ? { '@type':'ImageObject', url:featuredImg, width:1200, height:630 } : undefined,
        mainEntityOfPage: { '@type':'WebPage', '@id':`https://acontecer.co.cr/${catSlug}/${slug}` },
        keywords:        tags.map((t: any) => t.name).join(', ') || undefined,
        articleSection:  catName,
        wordCount:       palabras,
        inLanguage:      'es-CR',
        isAccessibleForFree: true,
        copyrightHolder: { '@type':'Organization', name:'Acontecer.co.cr' },
        copyrightYear:   new Date(post.date).getFullYear(),
      })}} />

      {/* BARRA DE PROGRESO FIJA */}
      <div className="nv2-progress" aria-hidden="true">
        <div className="nv2-progress-bar" id="nv2-bar" />
      </div>

      {/* BREADCRUMB — barra azul estilo portada */}
      <nav aria-label="Ruta de navegación" className="nv2-crumb-blue">
        <div className="nv2-crumb-blue-inner">
          <a href="/" className="nv2-crumb-blue-link">Inicio</a>
          <span className="nv2-crumb-blue-sep">›</span>
          <a href={`/categoria/${catSlug}`} className="nv2-crumb-blue-link nv2-crumb-blue-cat">{catName}</a>
          <span className="nv2-crumb-blue-sep nv2-crumb-blue-sep-title">›</span>
          <span className="nv2-crumb-blue-title">{tituloPlano}</span>
        </div>
      </nav>

      {/* MINI HEADER (slides in al hacer scroll) */}
      <div className="nv2-minibar" id="nv2-minibar" aria-hidden="true">
        <div className="nv2-minibar-inner">
          <span className="nv2-minibar-cat">{catName}</span>
          <span className="nv2-minibar-title">{tituloPlano}</span>
          <div className="nv2-minibar-share">
            <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener" title="WhatsApp">
              <IcWa />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" title="Facebook">
              <IcFb />
            </a>
          </div>
        </div>
      </div>

      {/* Client: progreso + minibar + TOC spy */}
      <NotaInteractive />

      {/* GRID PRINCIPAL */}
      <div className="nv2-article-wrap">
        <main>
              {/* ──────────────────────── ARTÍCULO PRINCIPAL ──────────────────── */}
          <article className="nv2-article" id="nv2-main-article">

            {/* HEAD: categoría · título · subtítulo */}
            <div className="nv2-article-head">
              <a href={`/categoria/${catSlug}`} className="nv2-cat-pill">{catName}</a>
              <h1
                id="nv2-article-title"
                className="nv2-article-title"
                dangerouslySetInnerHTML={{__html: post.title.rendered}}
              />
              {subtitulo && (
                <p className="nv2-article-subhead">{subtitulo}</p>
              )}
            </div>

            {/* HERO IMAGE */}
            <div className="nv2-article-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredImg}
                alt={tituloPlano}
                width={1200}
                height={675}
                // @ts-ignore
                fetchpriority="high"
                decoding="async"
              />
            </div>

            {/* META: autor + compartir */}
            <div className="nv2-article-meta-block">
              <div className="nv2-meta-row">
                <div className="nv2-meta-author">
                  <a href={`/autor/${authorSlug}`} className="nv2-meta-avatar">
                    <AuthorAvatar src={authorAvatar} name={authorName} size={44} />
                  </a>
                  <div>
                    <a href={`/autor/${authorSlug}`} className="nv2-meta-name" style={{textDecoration:'none',color:'inherit'}}>
                      {authorName}
                    </a>
                    <div className="nv2-meta-info">
                      <span>{fecha}</span>
                      <span className="nv2-meta-dot">·</span>
                      <span>{tiempoLectura} min de lectura</span>
                    </div>
                  </div>
                </div>
                <div className="nv2-meta-share">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-fb" aria-label="Facebook">
                    <IcFb /> <span>Facebook</span>
                  </a>
                  <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-wa" aria-label="WhatsApp">
                    <IcWa /> <span>WhatsApp</span>
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-x" aria-label="X">
                    <IcX /> <span>X</span>
                  </a>
                </div>
              </div>

              {/* TTS */}
              <TextToSpeech slug={slug} readingTime={tiempoLectura} />
            </div>

            {/* CUERPO */}
            <div className="nv2-article-body">
              <div
                className="nv2-measure"
                dangerouslySetInnerHTML={{__html: contenidoLimpio}}
              />
            </div>

            {/* TAGS */}
            {tags.length > 0 && (
              <div className="nv2-article-body" style={{paddingTop:0, paddingBottom:0}}>
                <div className="nv2-measure">
                  <div className="nv2-article-tags">
                    <span className="nv2-article-tags-lbl">Etiquetas</span>
                    {tags.map((t: any) => (
                      <a key={t.id} href={`/etiqueta/${t.slug}`} className="nv2-tag">{t.name}</a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AUTHOR CARD */}
            <div className="nv2-author-card">
              <div className="nv2-author-card-avatar">
                <AuthorAvatar src={authorAvatar} name={authorName} size={88} />
              </div>
              <div className="nv2-author-card-body">
                <div className="nv2-author-card-eyebrow">Escrito por</div>
                <a href={`/autor/${authorSlug}`} className="nv2-author-card-name" style={{textDecoration:'none',color:'inherit',display:'block'}}>
                  {authorName}
                </a>
                {authorBio && <p className="nv2-author-card-bio">{authorBio}</p>}
                <div className="nv2-author-card-foot">
                  <a href={`/autor/${authorSlug}`} className="nv2-author-card-link">
                    Ver todas sus notas <IcArrow />
                  </a>
                </div>
              </div>
            </div>

            {/* BOTTOM SHARE */}
            <div className="nv2-bottom-share">
              <span className="nv2-bottom-share-lbl">Compartir esta nota</span>
              <div className="nv2-bottom-share-row">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-fb"><IcFb /> Facebook</a>
                <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-wa"><IcWa /> WhatsApp</a>
                <a href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-x"><IcX /> X</a>
                <a href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-tg"><IcTg /> Telegram</a>
              </div>
            </div>

          </article>

          {/* ──────────────────────── NOTAS SIGUIENTES ────────────────────── */}
          {related.map((p: any) => {
            const pImg      = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_IMG;
            const pCat      = p._embedded?.['wp:term']?.[0]?.[0]?.slug || catSlug;
            const pCatName  = p._embedded?.['wp:term']?.[0]?.[0]?.name || catName;
            const pAuthor   = p._embedded?.author?.[0]?.name || 'Redaccion ACONTECER';
            const pAuthorSlug  = p._embedded?.author?.[0]?.slug || 'editor';
            const pAuthorAvatar = p._embedded?.author?.[0]?.avatar_urls?.['96'] || null;
            const pFecha    = new Date(p.date).toLocaleDateString('es-CR', { day:'numeric', month:'long', year:'numeric' });
            const pUrl      = `https://acontecer.co.cr/${pCat}/${p.slug}`;
            const pTitleEnc = encodeURIComponent(p.title.rendered.replace(/<[^>]+>/g, ''));
            const { subtitulo: pSub, resto: pResto } = extraerPrimerH2(p.content.rendered);
            const pContenido = linkDiputados(limpiarContenido(pResto), diputados);
            const pPalabras  = p.content.rendered.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
            const pLectura   = Math.max(1, Math.ceil(pPalabras / 200));

            return (
              <div key={p.id}>
                {/* Separador */}
                <div className="nv2-sigue-sep">
                  <div className="nv2-sigue-sep-line" />
                  <a href={`/${pCat}/${p.slug}`} className="nv2-sigue-sep-tag">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12}}><polyline points="6 9 12 15 18 9"/></svg>
                    Siga leyendo
                  </a>
                  <div className="nv2-sigue-sep-line" />
                </div>

                <ArticleScrollTracker url={`/${pCat}/${p.slug}`} title={p.title.rendered.replace(/<[^>]+>/g, '')} />

                <article className="nv2-article">
                  {/* Hero 21:9 para las siguientes */}
                  <div className="nv2-article-hero" style={{aspectRatio:'21/9', maxHeight:'320px'}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pImg} alt={p.title?.rendered?.replace(/<[^>]+>/g, '') || ''} loading="lazy" decoding="async" />
                  </div>

                  {/* Head */}
                  <div className="nv2-article-head" style={{paddingTop:28}}>
                    <a href={`/categoria/${pCat}`} className="nv2-cat-pill">{pCatName}</a>
                    <h2
                      className="nv2-article-title"
                      style={{fontSize:'clamp(24px, 3vw, 38px)'}}
                      dangerouslySetInnerHTML={{__html: p.title.rendered}}
                    />
                    {pSub && <p className="nv2-article-subhead">{pSub}</p>}
                  </div>

                  {/* Meta */}
                  <div className="nv2-article-meta-block">
                    <div className="nv2-meta-row">
                      <div className="nv2-meta-author">
                        <a href={`/autor/${pAuthorSlug}`} className="nv2-meta-avatar">
                          <AuthorAvatar src={pAuthorAvatar} name={pAuthor} size={44} />
                        </a>
                        <div>
                          <a href={`/autor/${pAuthorSlug}`} className="nv2-meta-name" style={{textDecoration:'none',color:'inherit'}}>{pAuthor}</a>
                          <div className="nv2-meta-info">
                            <span>{pFecha}</span>
                            <span className="nv2-meta-dot">·</span>
                            <span>{pLectura} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="nv2-meta-share">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${pUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-fb"><IcFb /></a>
                        <a href={`https://wa.me/?text=${pTitleEnc}%20${pUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-wa"><IcWa /></a>
                        <a href={`https://twitter.com/intent/tweet?text=${pTitleEnc}&url=${pUrl}`} target="_blank" rel="noopener" className="nv2-share-btn nv2-share-x"><IcX /></a>
                      </div>
                    </div>
                  </div>

                  {/* Body (parcial) */}
                  <div className="nv2-article-body">
                    <div className="nv2-measure">
                      <div dangerouslySetInnerHTML={{__html: truncarHTML(pContenido)}} />
                      <p style={{textAlign:'center', margin:'28px 0'}}>
                        <a
                          href={`/${pCat}/${p.slug}`}
                          style={{
                            display:'inline-flex', alignItems:'center', gap:8,
                            padding:'12px 24px',
                            background:'var(--azul)', color:'#fff',
                            borderRadius:999, fontSize:13, fontWeight:600,
                            textDecoration:'none', border:'none',
                          }}
                        >
                          Continuar leyendo <IcArrow />
                        </a>
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </main>

        {/* SIDEBAR */}
        <Sidebar
          related={related}
          catSlug={catSlug}
          headings={headings}
          readingTime={tiempoLectura}
        />
      </div>
    </>
  );
}
