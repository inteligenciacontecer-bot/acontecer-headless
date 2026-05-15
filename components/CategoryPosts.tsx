'use client';
import { useState } from 'react';
import NoImage from '@/components/NoImage';

const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

export default function CategoryPosts({ initialPosts, categoryId, featured, categorySlug }: {
  initialPosts: any[];
  categoryId: number;
  featured: any;
  categorySlug: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getFeaturedImg = (post: any) =>
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

  const loadMore = async () => {
    setLoading(true);
    const res = await fetch(API + '/posts?categories=' + categoryId + '&per_page=12&_embed&page=' + page);
    const newPosts = await res.json();
    if (!Array.isArray(newPosts) || newPosts.length < 12) setHasMore(false);
    if (Array.isArray(newPosts) && newPosts.length > 0) {
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
    }
    setLoading(false);
  };

  return (
    <>
      {featured && (
        <a href={'/' + categorySlug + '/' + featured.slug} className="featured-card">
          {getFeaturedImg(featured)
            ? <img src={getFeaturedImg(featured)} alt="" style={{width:'100%', height:'280px', objectFit:'cover'}} />
            : <div style={{height:'280px', overflow:'hidden'}}><NoImage /></div>}
          <div style={{padding:'28px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <span style={{background:'#0a73ce', color:'white', fontSize:'10px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', padding:'4px 10px', borderRadius:'3px', marginBottom:'14px', width:'fit-content'}}>Destacado</span>
            <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'22px', fontWeight:'700', lineHeight:1.3, color:'#111', marginBottom:'12px'}} dangerouslySetInnerHTML={{__html: featured.title.rendered}} />
            <span style={{fontSize:'12px', color:'#aaa'}}>{new Date(featured.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}</span>
          </div>
        </a>
      )}
      <div className="section-title">Mas noticias</div>
      <div className="posts-grid">
        {posts.map((post: any) => (
          <a key={post.id} href={'/' + categorySlug + '/' + post.slug} className="post-card">
            {getFeaturedImg(post)
              ? <img src={getFeaturedImg(post)} alt="" className="post-card-img" />
              : <div className="post-card-placeholder" style={{overflow:'hidden'}}><NoImage /></div>}
            <div className="post-card-body">
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'16px', fontWeight:'700', lineHeight:1.4, color:'#111', marginBottom:'8px'}} dangerouslySetInnerHTML={{__html: post.title.rendered}} />
              <div style={{fontSize:'11px', color:'#aaa'}}>{new Date(post.date).toLocaleDateString('es-CR', {day:'numeric', month:'long', year:'numeric'})}</div>
            </div>
          </a>
        ))}
      </div>
      {hasMore && (
        <div style={{textAlign:'center', margin:'32px 0'}}>
          <button onClick={loadMore} disabled={loading} style={{background:'#0000A2', color:'white', border:'none', padding:'12px 32px', borderRadius:'25px', fontSize:'15px', fontWeight:'700', cursor:'pointer', opacity: loading ? 0.7 : 1}}>
            {loading ? 'Cargando...' : 'Cargar mas noticias'}
          </button>
        </div>
      )}
    </>
  );
}


