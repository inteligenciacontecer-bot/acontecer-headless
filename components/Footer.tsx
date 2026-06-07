import Link from 'next/link';
import Image from 'next/image';

// Schema JSON-LD de validación legal — aparece en el footer de TODAS las páginas.
// Mismo @id que layout.tsx → Google los une en un único nodo del Knowledge Graph.
// Propósito: E-E-A-T — prueba que el medio tiene dirección, teléfono y política editorial real.
const schemaFooterOrg = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "@id": "https://acontecer.co.cr/#organization",
  "name": "Acontecer.co.cr",
  "legalName": "Acontecer Costa Rica",
  "url": "https://acontecer.co.cr",
  "telephone": "+50662889467",
  "email": "prensa@acontecer.co.cr",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "San José",
    "addressLocality": "San José",
    "addressRegion": "Provincia de San José",
    "addressCountry": "CR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 9.9281,
    "longitude": -84.0907
  },
  "areaServed": {
    "@type": "Country",
    "name": "Costa Rica",
    "sameAs": "https://www.wikidata.org/wiki/Q800"
  },
  "foundingDate": "2020",
  "publishingPrinciples": "https://acontecer.co.cr/politicas",
  "masthead": "https://acontecer.co.cr/nosotros",
  "ethicsPolicy": "https://acontecer.co.cr/politicas",
  "correctionsPolicy": "https://acontecer.co.cr/politicas",
  "logo": {
    "@type": "ImageObject",
    "url": "https://acontecer.co.cr/logo.png",
    "width": 600,
    "height": 94
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "editorial",
      "telephone": "+50662889467",
      "email": "prensa@acontecer.co.cr",
      "availableLanguage": "Spanish",
      "areaServed": "CR"
    },
    {
      "@type": "ContactPoint",
      "contactType": "advertising",
      "url": "https://acontecer.co.cr/pauta",
      "availableLanguage": "Spanish"
    }
  ],
  "sameAs": [
    "https://facebook.com/Acontecer.co.cr",
    "https://youtube.com/@acontecercocr",
    "https://tiktok.com/@acontecer.co.cr",
    "https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S"
  ]
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{background:'linear-gradient(180deg, #00007a 0%, #000055 100%)', color:'rgba(255,255,255,0.7)', marginTop:'40px'}}>
      {/* JSON-LD de validación legal del medio — E-E-A-T anchor */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schemaFooterOrg)}} />

      {/* FRANJA SUPERIOR */}
      <div style={{borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'40px 20px'}}>
        <div className="footer-inner">

          {/* COLUMNA LOGO */}
          <div>
            <Link href="/">
              <Image src="/logo.png" alt="Acontecer.co.cr" width={255} height={40} style={{maxHeight:'40px', width:'auto', maxWidth:'100%', mixBlendMode:'screen', marginBottom:'16px', display:'block'}} />
            </Link>
            <p style={{fontSize:'13px', lineHeight:1.8, marginBottom:'20px', color:'rgba(255,255,255,0.6)', maxWidth:'280px'}}>
              Somos la nueva cara del periodismo en Costa Rica. Informamos con responsabilidad, claridad y oportunidad sobre los temas que más importan.
            </p>
            <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
              <a href="https://facebook.com/Acontecer.co.cr" target="_blank" rel="noopener"
                style={{width:'36px', height:'36px', borderRadius:'8px', background:'#1877f2', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none'}}>
                <svg viewBox="0 0 24 24" fill="#fff" style={{width:18,height:18}} aria-hidden="true"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.029H9.101z"/></svg>
              </a>
              <a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S" target="_blank" rel="noopener"
                style={{width:'36px', height:'36px', borderRadius:'8px', background:'#25d366', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none'}}>
                <svg viewBox="0 0 24 24" fill="#fff" style={{width:18,height:18}} aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </a>
              <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener"
                style={{width:'36px', height:'36px', borderRadius:'8px', background:'#ff0000', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none'}}>
                <svg viewBox="0 0 24 24" fill="#fff" style={{width:18,height:18}} aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://tiktok.com/@acontecer.co.cr" target="_blank" rel="noopener"
                style={{width:'36px', height:'36px', borderRadius:'8px', background:'#111', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none'}}>
                <svg viewBox="0 0 24 24" fill="#fff" style={{width:18,height:18}} aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.08-.14 1.62.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
          </div>

          {/* SECCIONES */}
          <div>
            <h4 style={{color:'white', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'18px', paddingBottom:'10px', borderBottom:'2px solid #0a73ce'}}>
              Secciones
            </h4>
            {[
              {name:'Nacionales', href:'/categoria/nacionales'},
              {name:'Internacionales', href:'/categoria/internacionales'},
              {name:'Deportes', href:'/categoria/deportes'},
              {name:'Economía', href:'/categoria/economia'},
              {name:'Servicios', href:'/servicios'},
              {name:'Tipo de cambio del dólar', href:'/tipo-de-cambio'},
              {name:'Clima en Costa Rica', href:'/clima'},
              {name:'Precio de combustibles', href:'/precio-combustibles'},
              {name:'Resultados de lotería', href:'/resultados-loteria'},
              {name:'Feriados de Costa Rica', href:'/feriados-costa-rica'},
              {name:'Entretenimiento', href:'/categoria/entretenimiento'},
              {name:'Tecnología', href:'/categoria/tecnologia'},
              {name:'Opinión', href:'/categoria/opinion'},
              {name:'Turismo', href:'/categoria/turismo'},
            ].map(s => (
              <Link key={s.name} href={s.href}
                style={{display:'block', color:'rgba(255,255,255,0.55)', fontSize:'13px', marginBottom:'9px', textDecoration:'none', transition:'color 0.2s'}}>
                {s.name}
              </Link>
            ))}
          </div>

          {/* NOSOTROS */}
          <div>
            <h4 style={{color:'white', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'18px', paddingBottom:'10px', borderBottom:'2px solid #0a73ce'}}>
              Nosotros
            </h4>
            {[
              {name:'Quiénes somos', href:'/nosotros'},
              {name:'Contáctenos', href:'/contacto'},
              {name:'Paute con nosotros', href:'/pauta'},
              {name:'Agencia de publicidad', href:'/agencia'},
              {name:'Políticas editoriales', href:'/politicas'},
              {name:'Política de privacidad', href:'/privacidad'},
            ].map(item => (
              <Link key={item.name} href={item.href}
                style={{display:'block', color:'rgba(255,255,255,0.55)', fontSize:'13px', marginBottom:'9px', textDecoration:'none'}}>
                {item.name}
              </Link>
            ))}
          </div>

          {/* MONITOR LEGISLATIVO */}
          <div>
            <h4 style={{color:'white', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'18px', paddingBottom:'10px', borderBottom:'2px solid #0a73ce', display:'flex', alignItems:'center', gap:'7px'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13,flexShrink:0}} aria-hidden="true"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
              Monitor Legislativo
            </h4>
            {[
              {name:'Dashboard',   href:'/asamblea'},
              {name:'Diputados',   href:'/asamblea/diputados'},
              {name:'Votaciones',  href:'/asamblea/votaciones'},
              {name:'Expedientes', href:'/asamblea/expedientes'},
              {name:'Comisiones',  href:'/asamblea/comisiones'},
              {name:'En vivo',     href:'/asamblea/en-vivo'},
            ].map(item => (
              <Link key={item.name} href={item.href}
                style={{display:'block', color:'rgba(255,255,255,0.55)', fontSize:'13px', marginBottom:'9px', textDecoration:'none'}}>
                {item.name}
              </Link>
            ))}
          </div>

          {/* CONTACTO */}
          <div>
            <h4 style={{color:'white', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'18px', paddingBottom:'10px', borderBottom:'2px solid #0a73ce'}}>
              Contacto
            </h4>
            <div style={{marginBottom:'14px'}}>
              <div style={{fontSize:'11px', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Redacción</div>
              <a href="mailto:prensa@acontecer.co.cr" style={{color:'rgba(255,255,255,0.7)', fontSize:'13px', textDecoration:'none'}}>prensa@acontecer.co.cr</a>
            </div>
            <div style={{marginBottom:'14px'}}>
              <div style={{fontSize:'11px', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Teléfono</div>
              <a href="tel:+50662889467" style={{color:'rgba(255,255,255,0.7)', fontSize:'13px', textDecoration:'none'}}>+(506) 6288-9467</a>
            </div>
            <div style={{marginBottom:'20px'}}>
              <div style={{fontSize:'11px', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>WhatsApp</div>
              <a href="https://wa.me/50662889467" style={{color:'rgba(255,255,255,0.7)', fontSize:'13px', textDecoration:'none'}}>Enviar mensaje</a>
            </div>
            <a href="/pauta"
              style={{display:'inline-flex', alignItems:'center', gap:'7px', background:'#0a73ce', color:'white', padding:'9px 18px', borderRadius:'6px', fontSize:'12px', fontWeight:'700', textDecoration:'none'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14,flexShrink:0}} aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
              Paute aquí
            </a>
          </div>
        </div>
      </div>

      {/* FRANJA INFERIOR */}
      <div style={{padding:'20px', maxWidth:'1200px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px'}}>
        <div style={{fontSize:'12px', color:'rgba(255,255,255,0.4)'}}>
          © {year} Acontecer.co.cr · Todos los derechos reservados · San José, Costa Rica
        </div>
        <div style={{display:'flex', gap:'16px'}}>
          <Link href="/privacidad" style={{fontSize:'12px', color:'rgba(255,255,255,0.4)', textDecoration:'none'}}>Privacidad</Link>
          <Link href="/politicas" style={{fontSize:'12px', color:'rgba(255,255,255,0.4)', textDecoration:'none'}}>Políticas editoriales</Link>
          <Link href="/contacto" style={{fontSize:'12px', color:'rgba(255,255,255,0.4)', textDecoration:'none'}}>Contacto</Link>
        </div>
      </div>
    </footer>
  );
}
