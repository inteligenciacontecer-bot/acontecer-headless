const API = 'https://cms.acontecer.co.cr/wp-json/wp/v2';

function decodeHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCharCode(parseInt(h, 16)))
    .trim();
}

async function getLatestPosts() {
  const res = await fetch(API + '/posts?per_page=5&_embed', { next: { revalidate: 300 } });
  return res.json();
}
export default async function Ticker() {
  const posts = await getLatestPosts();
  return (
    <div style={{background:'#0a73ce', overflow:'hidden', whiteSpace:'nowrap', width:'100%', height:'30px', position:'relative'}}>
      <span style={{display:'inline-block', paddingLeft:'100%', animation:'ticker 40s linear infinite', color:'white', fontSize:'12px', fontWeight:'600', lineHeight:'30px', whiteSpace:'nowrap'}}>
        {posts.map((p: any) => {
          const title = decodeHtml(p.title.rendered);
          const catSlug = p._embedded?.['wp:term']?.[0]?.[0]?.slug || 'nacionales';
          return (
            <a key={p.id} href={'/' + catSlug + '/' + p.slug} style={{color:'white', textDecoration:'none'}}>
              ▶ {title} &nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;&nbsp;
            </a>
          );
        })}
      </span>
    </div>
  );
}

