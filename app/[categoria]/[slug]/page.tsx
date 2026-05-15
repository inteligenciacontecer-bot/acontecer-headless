import { redirect, notFound } from 'next/navigation';
import TextToSpeech from '@/components/TextToSpeech';
import Sidebar from '@/components/Sidebar';
import ArticleScrollTracker from '@/components/ArticleScrollTracker';
import { linkDiputados, type DiputadoMinimo } from '@/lib/diputados-linker';

const API          = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const ASAMBLEA_API = 'https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea';

function extraerPrimerH2(html: string): { subtitulo: string | null; resto: string } {
  const match = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (!match) return { subtitulo: null, resto: html };
  const subtitulo = match[1].replace(/<[^>]+>/g, '').trim();
  const resto = html.replace(match[0], '').trim();
  return { subtitulo, resto };
}

function limpiarContenido(html: string) {
  return html
    .replace(/<figure[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    // ── Canonicalizar links internos ────────────────────────────────────────
    // WP embebe links a cms.acontecer.co.cr y www.acontecer.co.cr en el
    // contenido. Los reescribimos SOLO en href (no src de imágenes) para
    // que Google vea una sola autoridad en acontecer.co.cr
    .replace(/href="https?:\/\/(www\.|cms\.)?acontecer\.co\.cr/gi, 'href="https://acontecer.co.cr')
    // ── Estilos ─────────────────────────────────────────────────────────────
    .replace(/<p>/gi, '<p style="margin-bottom:24px;display:block;line-height:1.9;font-size:17px;color:#222;">')
    .replace(/<p class="wp-block-paragraph"[^>]*>/gi, '<p style="margin-bottom:24px;display:block;line-height:1.9;font-size:17px;color:#222;">')
    .replace(/<h2 class="wp-block-heading"[^>]*>/gi, '<h2 style="font-family:Fraunces,serif;font-size:24px;font-weight:700;color:#111;margin:28px 0 14px;display:block;line-height:1.3;">')
    .replace(/<h3 class="wp-block-heading"[^>]*>/gi, '<h3 style="font-family:Fraunces,serif;font-size:21px;font-weight:700;color:#333;margin:24px 0 12px;display:block;">')
    .replace(/<img([^>]*)>/gi, '<img$1 style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;display:block;">');
}

async function getPost(slug: string) {
  const res = await fetch(API + '/posts?slug=' + slug + '&_embed', { next: { revalidate: 60 } });
  const posts = await res.json();
  return posts[0];
}

async function getRelated(categoryIds: number[], currentId: number) {
  const res = await fetch(API + '/posts?categories=' + categoryIds.join(',') + '&per_page=5&_embed&exclude=' + currentId, { next: { revalidate: 60 } });
  return res.json();
}

async function getDiputadosMinimos(): Promise<DiputadoMinimo[]> {
  try {
    const res = await fetch(`${ASAMBLEA_API}/diputados?_fields=slug,nombre_completo`, {
      next: { revalidate: 3600 }, // lista cambia raramente
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; categoria: string }> }) {
  const { slug, categoria } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Nota no encontrada' };
  const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://acontecer.co.cr/opengraph-image';
  const rawTitle = post.title.rendered.replace(/<[^>]+>/g, '');
  const rawExcerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim().slice(0, 160) || '';

  // Custom SEO fields from AI pipeline; fallback to post title / excerpt
  const seoTitleMeta: string = post.meta?._acontecer_seo_title || '';
  const seoDescMeta: string = post.meta?._acontecer_seo_desc || '';
  const titulo = (seoTitleMeta || rawTitle) + ' | Acontecer.co.cr';
  const ogTitulo = rawTitle; // OG siempre usa el título real de la nota
  const descripcion = seoDescMeta || rawExcerpt;
  // ── Canonical siempre usa la categoría REAL del post, no la de la URL ──
  // Esto evita que /internacionales/slug tenga canonical diferente de /nacionales/slug
  const realCatSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || categoria;
  const canonicalUrl = `https://acontecer.co.cr/${realCatSlug}/${slug}`;
  const tags = post._embedded?.['wp:term']?.[1]?.map((t: any) => t.name) || [];
  const keywords = tags.join(', ');
  const fechaPublicacion = post.date;
  const fechaModificacion = post.modified;
  const autorNombre = post._embedded?.author?.[0]?.name || 'Redaccion ACONTECER';

  return {
    title: titulo,
    description: descripcion,
    keywords: keywords || undefined,
    authors: [{ name: autorNombre }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: ogTitulo,
      description: descripcion,
      url: canonicalUrl,
      siteName: 'Acontecer.co.cr',
      images: [{ url: featuredImg, width: 1200, height: 630, alt: ogTitulo }],
      type: 'article',
      publishedTime: fechaPublicacion,
      modifiedTime: fechaModificacion,
      authors: [autorNombre],
      section: realCatSlug,
      tags: tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitulo,
      description: descripcion,
      images: [featuredImg],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  };
}

export default async function NotaPage({ params }: { params: Promise<{ slug: string; categoria: string }> }) {
  const { slug, categoria } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();

  // ── Redirect a la URL canónica si la categoría de la URL no coincide ────
  // Ej: /internacionales/mi-nota → 301 → /nacionales/mi-nota
  const realCat = post._embedded?.['wp:term']?.[0]?.[0]?.slug;
  if (realCat && realCat !== categoria) {
    redirect(`/${realCat}/${slug}`);
  }

  const [related, diputados] = await Promise.all([
    getRelated(post.categories, post.id),
    getDiputadosMinimos(),
  ]);
  const DEFAULT_IMG = 'https://acontecer.co.cr/opengraph-image';
  const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_IMG;
  const authorName = post._embedded?.author?.[0]?.name || 'Redaccion ACONTECER';
  const authorSlug = post._embedded?.author?.[0]?.slug || 'editor';
  const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['96'];
  const authorBio = post._embedded?.author?.[0]?.description || '';
  const catName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Nacionales';
  const catSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
  const fecha = new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'});
  const shareUrl = 'https://acontecer.co.cr/' + catSlug + '/' + slug;
  const shareTitle = encodeURIComponent(post.title.rendered);
  // Decodifica HTML entities del título para usar en atributos alt/texto plano
  const tituloPlano = post.title.rendered
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_: string, n: string) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ');

  const { subtitulo, resto } = extraerPrimerH2(post.content.rendered);
  // limpiar HTML → luego insertar links a diputados en texto plano
  const contenidoLimpio = linkDiputados(limpiarContenido(resto), diputados);

  // Tiempo de lectura (200 palabras/min promedio en español)
  const palabras = post.content.rendered.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const tiempoLectura = Math.max(1, Math.ceil(palabras / 200));

  return (
    <>
      <div style={{background:'linear-gradient(90deg,#0000A2,#0a73ce)'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto', padding:'9px 20px', display:'flex', alignItems:'center', gap:'6px', fontSize:'12px'}}>
          <a href="/" style={{color:'rgba(255,255,255,0.75)', textDecoration:'none', fontWeight:'500'}}>Inicio</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2} strokeLinecap="round" style={{width:11,height:11,flexShrink:0}}><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{color:'white', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.8px'}}>{catName}</span>
        </div>
      </div>

      {/* SCHEMA.ORG - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://acontecer.co.cr' },
            { '@type': 'ListItem', 'position': 2, 'name': catName, 'item': `https://acontecer.co.cr/categoria/${catSlug}` },
            { '@type': 'ListItem', 'position': 3, 'name': post.title.rendered.replace(/<[^>]+>/g, ''), 'item': `https://acontecer.co.cr/${catSlug}/${slug}` },
          ]
        })}}
      />

      {/* SCHEMA.ORG - NewsArticle */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          'headline': post.title.rendered.replace(/<[^>]+>/g, '').slice(0, 110),
          'description': post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim().slice(0, 160),
          'url': `https://acontecer.co.cr/${catSlug}/${slug}`,
          'datePublished': post.date,
          'dateModified': post.modified,
          'author': {
            '@type': 'Person',
            'name': authorName,
            'url': `https://acontecer.co.cr/autor/${authorSlug}`,
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Acontecer.co.cr',
            'url': 'https://acontecer.co.cr',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://cms.acontecer.co.cr/wp-content/uploads/2026/03/FAVS.png',
              'width': 512,
              'height': 512,
            },
          },
          'image': featuredImg ? {
            '@type': 'ImageObject',
            'url': featuredImg,
            'width': 1200,
            'height': 630,
          } : undefined,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://acontecer.co.cr/${catSlug}/${slug}`,
          },
          'keywords': (post._embedded?.['wp:term']?.[1] || []).map((t: any) => t.name).join(', ') || undefined,
          'articleSection': catName,
          'wordCount': palabras,
          'inLanguage': 'es-CR',
          'isAccessibleForFree': true,
          'copyrightHolder': { '@type': 'Organization', 'name': 'Acontecer.co.cr' },
          'copyrightYear': new Date(post.date).getFullYear(),
        })}}
      />

      <div className="nota-grid">
        {/* ── COLUMNA PRINCIPAL: nota actual + 5 notas siguientes ── */}
        <div>
        {/* Tracker del artículo principal */}
        <ArticleScrollTracker
          url={`/${catSlug}/${slug}`}
          title={post.title.rendered.replace(/<[^>]+>/g, '')}
        />
        <article style={{background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          <div className="nota-header-div" style={{padding:'28px 20px 0'}}>
            <a href={'/categoria/' + catSlug}
              style={{background:'#0a73ce', color:'white', fontSize:'10px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', padding:'4px 12px', borderRadius:'3px', marginBottom:'16px', display:'inline-block'}}>
              {catName}
            </a>
            <h1 style={{fontFamily:'Fraunces, serif', fontSize:'clamp(24px, 5vw, 36px)', fontWeight:'900', lineHeight:1.15, color:'#0a0a0a', marginBottom:'12px', letterSpacing:'-0.5px'}}
              dangerouslySetInnerHTML={{__html: post.title.rendered}} />

            {subtitulo && (
              <p style={{fontFamily:'Inter, sans-serif', fontSize:'18px', color:'#555', lineHeight:1.6, marginBottom:'16px', fontWeight:'400', borderLeft:'3px solid #0a73ce', paddingLeft:'14px'}}>
                {subtitulo}
              </p>
            )}

            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 0', borderTop:'1px solid #eee', borderBottom:'1px solid #eee', flexWrap:'wrap', gap:'12px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <a href={'/autor/' + authorSlug} style={{flexShrink:0}}>
                  {authorAvatar
                    ? <img src={authorAvatar} alt={authorName} style={{width:'44px', height:'44px', borderRadius:'50%', objectFit:'cover', border:'2px solid #e8f0fe'}} />
                    : <div style={{width:'44px', height:'44px', borderRadius:'50%', background:'linear-gradient(135deg,#0000A2,#0a73ce)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'16px', fontWeight:'700'}}>{authorName.charAt(0)}</div>}
                </a>
                <div>
                  <a href={'/autor/' + authorSlug} style={{fontWeight:'700', color:'#111', fontSize:'14px', textDecoration:'none', display:'block'}}>{authorName}</a>
                  <div style={{color:'#888', fontSize:'12px', marginTop:'2px', display:'flex', gap:8, alignItems:'center'}}>
                    <span>{fecha}</span>
                    <span style={{color:'#ddd'}}>·</span>
                    <span style={{display:'flex', alignItems:'center', gap:3}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" style={{width:11,height:11}}>
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {tiempoLectura} min de lectura
                    </span>
                  </div>
                </div>
              </div>
              <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                <a href={'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl} target="_blank" rel="noopener" style={{background:'#1877f2', color:'white', padding:'7px 14px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>Facebook</a>
                <a href={'https://wa.me/?text=' + shareTitle + '%20' + shareUrl} target="_blank" rel="noopener" style={{background:'#25d366', color:'white', padding:'7px 14px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>WhatsApp</a>
                <a href={'https://twitter.com/intent/tweet?text=' + shareTitle + '&url=' + shareUrl} target="_blank" rel="noopener" style={{background:'#000', color:'white', padding:'7px 14px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>X</a>
              </div>
            </div>
          </div>

          {/* ── Imagen destacada ─────────────────────────────────────────── */}
          {/* Usamos <img> directo en vez de Next.js <Image fill> porque   */}
          {/* aspect-ratio + position:absolute falla en algunos Android.   */}
          {/* fetchpriority="high" garantiza LCP óptimo sin el overhead    */}
          {/* de la capa de optimización cuando la imagen ya es WebP/AVIF. */}
          <div style={{margin:'20px 0 0', width:'100%', background:'#f0f2f5', lineHeight:0}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredImg}
              alt={tituloPlano}
              width={1200}
              height={675}
              // @ts-ignore fetchpriority is valid HTML but not yet in React types
              fetchpriority="high"
              decoding="async"
              style={{width:'100%', height:'auto', display:'block', maxHeight:'520px', objectFit:'cover'}}
            />
          </div>

          <div style={{padding:'16px 20px 0'}}>
            <TextToSpeech slug={slug} readingTime={tiempoLectura} />
          </div>

          <div
            style={{padding:'8px 20px 32px', fontSize:'17px', lineHeight:1.85, color:'#1a1a1a'}}
            dangerouslySetInnerHTML={{__html: contenidoLimpio}}
          />

          <div style={{margin:'0 20px 32px', padding:'20px 24px', background:'#f8f9ff', borderRadius:'12px', border:'1px solid #e8f0fe', display:'flex', gap:'16px', alignItems:'flex-start'}}>
            <a href={'/autor/' + authorSlug} style={{flexShrink:0}}>
              {authorAvatar
                ? <img src={authorAvatar} alt={authorName} style={{width:'60px', height:'60px', borderRadius:'50%', objectFit:'cover', border:'3px solid white', boxShadow:'0 2px 8px rgba(0,0,162,0.2)'}} />
                : <div style={{width:'60px', height:'60px', borderRadius:'50%', background:'linear-gradient(135deg,#0000A2,#0a73ce)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'22px', fontWeight:'700'}}>{authorName.charAt(0)}</div>}
            </a>
            <div>
              <div style={{fontSize:'11px', color:'#0a73ce', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Escrito por</div>
              <a href={'/autor/' + authorSlug} style={{fontFamily:'Fraunces, serif', fontSize:'16px', fontWeight:'700', color:'#0000A2', textDecoration:'none', display:'block', marginBottom:'4px'}}>{authorName}</a>
              {authorBio && <p style={{fontSize:'13px', color:'#666', lineHeight:1.5, margin:0}}>{authorBio}</p>}
            </div>
          </div>

          <div style={{padding:'16px 20px', borderTop:'1px solid #f0f0f0', display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap'}}>
            <span style={{fontSize:'13px', fontWeight:'700', color:'#555', textTransform:'uppercase', letterSpacing:'1px'}}>Compartir:</span>
            <a href={'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl} target="_blank" rel="noopener" style={{background:'#1877f2', color:'white', padding:'8px 16px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>Facebook</a>
            <a href={'https://wa.me/?text=' + shareTitle + '%20' + shareUrl} target="_blank" rel="noopener" style={{background:'#25d366', color:'white', padding:'8px 16px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>WhatsApp</a>
            <a href={'https://twitter.com/intent/tweet?text=' + shareTitle + '&url=' + shareUrl} target="_blank" rel="noopener" style={{background:'#000', color:'white', padding:'8px 16px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>X Twitter</a>
            <a href={'https://t.me/share/url?url=' + shareUrl + '&text=' + shareTitle} target="_blank" rel="noopener" style={{background:'#0088cc', color:'white', padding:'8px 16px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>Telegram</a>
          </div>
        </article>

          {/* ── NOTAS SIGUIENTES — solo desktop ── */}
          <div className="solo-desktop">
          {related.map((p: any) => {
            const pImg    = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_IMG;
            const pCat    = p._embedded?.['wp:term']?.[0]?.[0]?.slug || catSlug;
            const pCatName= p._embedded?.['wp:term']?.[0]?.[0]?.name || catName;
            const pAuthor = p._embedded?.author?.[0]?.name || 'Redaccion ACONTECER';
            const pAuthorSlug = p._embedded?.author?.[0]?.slug || 'editor';
            const pAuthorAvatar = p._embedded?.author?.[0]?.avatar_urls?.['96'];
            const pFecha  = new Date(p.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'});
            const pUrl    = `https://acontecer.co.cr/${pCat}/${p.slug}`;
            const pTitle  = encodeURIComponent(p.title.rendered);
            const { subtitulo: pSub, resto: pResto } = extraerPrimerH2(p.content.rendered);
            const pContenido = limpiarContenido(pResto);
            const pPalabras  = p.content.rendered.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
            const pLectura   = Math.max(1, Math.ceil(pPalabras / 200));

            return (
              <div key={p.id} style={{marginTop:'32px'}}>
                {/* Separador */}
                <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px'}}>
                  <div style={{flex:1, height:'1px', background:'#e8e8e8'}} />
                  <a href={`/${pCat}/${p.slug}`}
                    style={{background:'#0000A2', color:'white', fontSize:'10px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', padding:'6px 16px', borderRadius:'20px', textDecoration:'none', whiteSpace:'nowrap'}}>
                    Seguí leyendo
                  </a>
                  <div style={{flex:1, height:'1px', background:'#e8e8e8'}} />
                </div>

                {/* Tracker de analytics para este artículo */}
                <ArticleScrollTracker
                  url={`/${pCat}/${p.slug}`}
                  title={p.title.rendered.replace(/<[^>]+>/g, '')}
                />

                <article style={{background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
                  {/* Imagen — lazy: están bajo el fold */}
                  <div style={{position:'relative', width:'100%', aspectRatio:'16/9', overflow:'hidden', background:'#f0f2f5'}}>
                    <img src={pImg} alt={p.title?.rendered?.replace(/<[^>]+>/g, '') || ''} loading="lazy" decoding="async"
                      style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
                  </div>

                  <div style={{padding:'28px 20px 0'}}>
                    <a href={`/categoria/${pCat}`}
                      style={{background:'#0a73ce', color:'white', fontSize:'10px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', padding:'4px 12px', borderRadius:'3px', marginBottom:'16px', display:'inline-block'}}>
                      {pCatName}
                    </a>
                    <h2 style={{fontFamily:'Fraunces, serif', fontSize:'clamp(22px, 4vw, 32px)', fontWeight:'900', lineHeight:1.15, color:'#0a0a0a', marginBottom:'12px', letterSpacing:'-0.5px'}}
                      dangerouslySetInnerHTML={{__html: p.title.rendered}} />
                    {pSub && (
                      <p style={{fontFamily:'Inter, sans-serif', fontSize:'17px', color:'#555', lineHeight:1.6, marginBottom:'16px', fontWeight:'400', borderLeft:'3px solid #0a73ce', paddingLeft:'14px'}}>
                        {pSub}
                      </p>
                    )}
                    {/* Autor + fecha */}
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid #eee', borderBottom:'1px solid #eee', flexWrap:'wrap', gap:'10px', marginBottom:'4px'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <a href={`/autor/${pAuthorSlug}`} style={{flexShrink:0}}>
                          {pAuthorAvatar
                            ? <img src={pAuthorAvatar} alt={pAuthor} style={{width:'38px', height:'38px', borderRadius:'50%', objectFit:'cover'}} />
                            : <div style={{width:'38px', height:'38px', borderRadius:'50%', background:'linear-gradient(135deg,#0000A2,#0a73ce)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'14px', fontWeight:'700'}}>{pAuthor.charAt(0)}</div>}
                        </a>
                        <div>
                          <a href={`/autor/${pAuthorSlug}`} style={{fontWeight:'700', color:'#111', fontSize:'13px', textDecoration:'none', display:'block'}}>{pAuthor}</a>
                          <div style={{color:'#888', fontSize:'11px', marginTop:'2px', display:'flex', gap:6, alignItems:'center'}}>
                            <span>{pFecha}</span>
                            <span style={{color:'#ddd'}}>·</span>
                            <span>{pLectura} min de lectura</span>
                          </div>
                        </div>
                      </div>
                      <div style={{display:'flex', gap:'8px'}}>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${pUrl}`} target="_blank" rel="noopener" style={{background:'#1877f2', color:'white', padding:'6px 12px', borderRadius:'6px', fontSize:'11px', fontWeight:'600'}}>Facebook</a>
                        <a href={`https://wa.me/?text=${pTitle}%20${pUrl}`} target="_blank" rel="noopener" style={{background:'#25d366', color:'white', padding:'6px 12px', borderRadius:'6px', fontSize:'11px', fontWeight:'600'}}>WhatsApp</a>
                        <a href={`https://twitter.com/intent/tweet?text=${pTitle}&url=${pUrl}`} target="_blank" rel="noopener" style={{background:'#000', color:'white', padding:'6px 12px', borderRadius:'6px', fontSize:'11px', fontWeight:'600'}}>X</a>
                      </div>
                    </div>
                  </div>

                  {/* Contenido completo */}
                  <div style={{padding:'8px 20px 32px', fontSize:'17px', lineHeight:1.85, color:'#1a1a1a'}}
                    dangerouslySetInnerHTML={{__html: pContenido}} />

                  {/* Pie: ver nota completa */}
                  <div style={{padding:'16px 20px', borderTop:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px'}}>
                    <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                      <span style={{fontSize:'13px', fontWeight:'700', color:'#555', textTransform:'uppercase', letterSpacing:'1px'}}>Compartir:</span>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${pUrl}`} target="_blank" rel="noopener" style={{background:'#1877f2', color:'white', padding:'7px 14px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>Facebook</a>
                      <a href={`https://wa.me/?text=${pTitle}%20${pUrl}`} target="_blank" rel="noopener" style={{background:'#25d366', color:'white', padding:'7px 14px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>WhatsApp</a>
                      <a href={`https://t.me/share/url?url=${pUrl}&text=${pTitle}`} target="_blank" rel="noopener" style={{background:'#0088cc', color:'white', padding:'7px 14px', borderRadius:'6px', fontSize:'12px', fontWeight:'600'}}>Telegram</a>
                    </div>
                    <a href={`/${pCat}/${p.slug}`} style={{fontSize:'13px', fontWeight:'700', color:'#0000A2', textDecoration:'none'}}>
                      Ver nota completa →
                    </a>
                  </div>
                </article>
              </div>
            );
          })}
          </div>{/* cierre solo-desktop */}
        </div>{/* cierre columna principal */}

        <Sidebar related={related} catSlug={catSlug} />
      </div>{/* cierre nota-grid */}
    </>
  );
}
