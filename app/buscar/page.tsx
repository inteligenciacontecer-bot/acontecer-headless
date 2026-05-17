import type { Metadata } from 'next';

// La búsqueda siempre apunta a /buscar sin query string en el canonical
// para evitar indexar miles de variantes del mismo template
export const metadata: Metadata = {
  title: 'Buscar noticias',
  description: 'Busque noticias de política, economía, deportes y más en el archivo de Acontecer.co.cr.',
  alternates: { canonical: 'https://acontecer.co.cr/buscar' },
  robots: { index: false, follow: true },
  openGraph: { url: 'https://acontecer.co.cr/buscar' },
};

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

async function buscarPosts(query: string) {
  const res = await fetch(API + '/posts?search=' + encodeURIComponent(query) + '&per_page=12&_embed', { cache: 'no-store' });
  return res.json();
}

export default async function BuscarPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || '';
  const posts = query ? await buscarPosts(query) : [];

  const getFeaturedImg = (post: any) =>
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

  const getPostUrl = (post: any) => {
    const catSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
    return `/${catSlug}/${post.slug}`;
  };

  return (
    <div style={{maxWidth:'1000px', margin:'30px auto', padding:'0 20px 40px'}}>
      <h1 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'28px', color:'#0000A2', marginBottom:'8px'}}>
        {query ? `Resultados para: "${query}"` : 'Buscar noticias'}
      </h1>
      <p style={{color:'#888', fontSize:'14px', marginBottom:'30px', paddingBottom:'20px', borderBottom:'3px solid #0000A2'}}>
        {posts.length > 0 ? `${posts.length} resultados encontrados` : query ? 'No se encontraron resultados' : 'Ingrese un término de búsqueda'}
      </p>

      {posts.length > 0 ? (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px'}}>
          {posts.map((post: any) => (
            <a key={post.id} href={getPostUrl(post)}
              style={{background:'white', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', textDecoration:'none', display:'block'}}>
              {getFeaturedImg(post)
                ? <img src={getFeaturedImg(post)} alt="" style={{width:'100%', height:'160px', objectFit:'cover'}} />
                : <div style={{width:'100%', height:'160px', background:'linear-gradient(135deg, #e8f0fe, #c5d8ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px'}}>ðŸ“°</div>}
              <div style={{padding:'14px'}}>
                <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'16px', fontWeight:'700', lineHeight:1.4, color:'#111', marginBottom:'8px'}}
                  dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                <div style={{fontSize:'11px', color:'#aaa'}}>
                  {new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : query ? (
        <div style={{textAlign:'center', padding:'60px 20px', color:'#888'}}>
          <div style={{fontSize:'60px', marginBottom:'16px'}}>ðŸ”</div>
          <p style={{fontSize:'18px'}}>No encontramos noticias para <strong>"{query}"</strong></p>
          <p style={{fontSize:'14px', marginTop:'8px'}}>Intente con otras palabras clave</p>
        </div>
      ) : null}
    </div>
  );
}


