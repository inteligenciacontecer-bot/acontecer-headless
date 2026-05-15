import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NoImage from '@/components/NoImage';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';
const PER_PAGE = 12;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetch(API + '/users?slug=' + slug, { next: { revalidate: 3600 } });
  const users = await res.json().catch(() => []);
  const author = Array.isArray(users) ? users[0] : null;
  if (!author) return { title: 'Autor | Acontecer.co.cr' };
  return {
    title: `${author.name} — Periodista | Acontecer.co.cr`,
    description: author.description
      ? author.description.slice(0, 155)
      : `Artículos escritos por ${author.name} en Acontecer.co.cr, el medio digital independiente de Costa Rica.`,
    alternates: { canonical: `https://acontecer.co.cr/autor/${slug}` },
    openGraph: {
      url: `https://acontecer.co.cr/autor/${slug}`,
      images: author.avatar_urls?.['96'] ? [{ url: author.avatar_urls['96'] }] : [],
    },
  };
}

async function getAuthor(slug: string) {
  const res = await fetch(API + '/users?slug=' + slug, { next: { revalidate: 3600 } });
  const users = await res.json();
  return users[0];
}

async function getAuthorPosts(authorId: number, page: number) {
  const res = await fetch(
    API + `/posts?author=${authorId}&per_page=${PER_PAGE}&page=${page}&_embed`,
    { next: { revalidate: 60 } }
  );
  const posts = await res.json();
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
  const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
  return { posts: Array.isArray(posts) ? posts : [], totalPages, total };
}

export default async function AutorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));

  const author = await getAuthor(slug);
  if (!author) return notFound();

  const { posts, totalPages, total } = await getAuthorPosts(author.id, page);
  const avatarUrl = author.avatar_urls?.['96'] || null;

  return (
    <>
      {/* CABECERA AUTOR */}
      <div style={{background:'linear-gradient(135deg, #0000A2, #0a73ce)', padding:'40px 20px'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto', display:'flex', alignItems:'center', gap:'24px', flexWrap:'wrap'}}>
          {avatarUrl
            ? <img src={avatarUrl} alt={author.name} style={{width:'100px', height:'100px', borderRadius:'50%', border:'4px solid rgba(255,255,255,0.3)', objectFit:'cover'}} />
            : <div style={{width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px', fontWeight:'700', color:'white'}}>{author.name?.charAt(0)}</div>}
          <div>
            <h1 style={{fontFamily:'var(--font-lora), serif', fontSize:'32px', color:'white', fontWeight:'700', marginBottom:'8px'}}>{author.name}</h1>
            {author.description && <p style={{color:'rgba(255,255,255,0.8)', fontSize:'15px', maxWidth:'600px', lineHeight:1.6}}>{author.description}</p>}
            <p style={{color:'rgba(255,255,255,0.6)', fontSize:'13px', marginTop:'8px'}}>{total} artículos publicados</p>
          </div>
        </div>
      </div>

      {/* GRID DE ARTÍCULOS */}
      <div style={{maxWidth:'1200px', margin:'32px auto', padding:'0 20px'}}>
        <h2 style={{fontFamily:'var(--font-lora), serif', fontSize:'22px', fontWeight:'700', color:'#0000A2', marginBottom:'24px', paddingBottom:'12px', borderBottom:'2px solid #0000A2'}}>
          {page === 1 ? `Artículos de ${author.name}` : `Artículos de ${author.name} — Página ${page}`}
        </h2>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'24px'}}>
          {posts.map((post: any) => {
            const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const catSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
            const catName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Nacionales';
            return (
              <a key={post.id} href={'/' + catSlug + '/' + post.slug} style={{textDecoration:'none', display:'block', background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
                <div style={{height:'180px', overflow:'hidden'}}>
                  {featuredImg
                    ? <img src={featuredImg} alt="" style={{width:'100%', height:'180px', objectFit:'cover', objectPosition:'top'}} />
                    : <NoImage />}
                </div>
                <div style={{padding:'16px'}}>
                  <span style={{background:'#e8f0fe', color:'#0000A2', fontSize:'10px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', padding:'3px 8px', borderRadius:'3px', marginBottom:'10px', display:'inline-block'}}>{catName}</span>
                  <h3 style={{fontFamily:'var(--font-lora), serif', fontSize:'16px', fontWeight:'700', color:'#111', lineHeight:1.4, marginBottom:'8px'}} dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                  <p style={{fontSize:'12px', color:'#aaa'}}>{new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'32px 0 16px', flexWrap:'wrap'}}>
            {page > 1 && (
              <a href={`/autor/${slug}?page=${page - 1}`}
                style={{display:'flex', alignItems:'center', gap:'4px', padding:'8px 16px', borderRadius:'8px', border:'1px solid #e0e0e0', background:'white', color:'#0000A2', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
                ← Anterior
              </a>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
              .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(n);
                return acc;
              }, [])
              .map((n, idx) =>
                n === '...'
                  ? <span key={`dots-${idx}`} style={{padding:'8px 4px', color:'#aaa'}}>…</span>
                  : <a key={n} href={`/autor/${slug}?page=${n}`}
                      style={{
                        minWidth:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center',
                        borderRadius:'8px', border: n === page ? 'none' : '1px solid #e0e0e0',
                        background: n === page ? '#0000A2' : 'white',
                        color: n === page ? 'white' : '#333',
                        textDecoration:'none', fontWeight: n === page ? '700' : '500', fontSize:'14px',
                      }}>
                      {n}
                    </a>
              )}

            {page < totalPages && (
              <a href={`/autor/${slug}?page=${page + 1}`}
                style={{display:'flex', alignItems:'center', gap:'4px', padding:'8px 16px', borderRadius:'8px', border:'1px solid #e0e0e0', background:'white', color:'#0000A2', textDecoration:'none', fontWeight:'600', fontSize:'14px'}}>
                Siguiente →
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}
