'use client';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
      <a href={'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl}
        target="_blank" rel="noopener noreferrer"
        style={{background:'#1877f2', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', textDecoration:'none'}}>
        f Facebook
      </a>
      <a href={'https://api.whatsapp.com/send?text=' + encodedTitle + '%20' + encodedUrl}
        target="_blank" rel="noopener noreferrer"
        style={{background:'#25d366', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', textDecoration:'none'}}>
        WhatsApp
      </a>
      <a href={'https://twitter.com/intent/tweet?url=' + encodedUrl + '&text=' + encodedTitle}
        target="_blank" rel="noopener noreferrer"
        style={{background:'#000', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', textDecoration:'none'}}>
        X Twitter
      </a>
      <a href={'https://t.me/share/url?url=' + encodedUrl + '&text=' + encodedTitle}
        target="_blank" rel="noopener noreferrer"
        style={{background:'#0088cc', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', textDecoration:'none'}}>
        Telegram
      </a>
    </div>
  );
}

