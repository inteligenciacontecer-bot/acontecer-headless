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
  "foundingDate": "2022",
  "publishingPrinciples": "https://acontecer.co.cr/politicas",
  "masthead": "https://acontecer.co.cr/nosotros",
  "ethicsPolicy": "https://acontecer.co.cr/politicas",
  "correctionsPolicy": "https://acontecer.co.cr/politicas",
  "logo": {
    "@type": "ImageObject",
    "url": "https://acontecer.co.cr/logo.png",
    "width": 2251,
    "height": 353
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
                style={{width:'36px', height:'36px', borderRadius:'8px', background:'#1877f2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', textDecoration:'none'}}>
                f
              </a>
              <a href="https://whatsapp.com/channel/0029VaEbClvAzNbnwhu3Hp0S" target="_blank" rel="noopener"
                style={{width:'36px', height:'36px', borderRadius:'8px', background:'#25d366', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', textDecoration:'none'}}>
                💬
              </a>
              <a href="https://youtube.com/@acontecercocr" target="_blank" rel="noopener"
                style={{width:'36px', height:'36px', borderRadius:'8px', background:'#ff0000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', textDecoration:'none'}}>
                ▶
              </a>
              <a href="https://tiktok.com/@acontecer.co.cr" target="_blank" rel="noopener"
                style={{width:'36px', height:'36px', borderRadius:'8px', background:'#111', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', textDecoration:'none'}}>
                🎵
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
              {name:'Entretenimiento', href:'/categoria/entretenimiento'},
              {name:'Tecnología', href:'/categoria/tecnologia'},
              {name:'Opinión', href:'/categoria/opinion'},
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
            <h4 style={{color:'white', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'18px', paddingBottom:'10px', borderBottom:'2px solid #0a73ce'}}>
              🏛️ Monitor Legislativo
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
              style={{display:'inline-block', background:'#0a73ce', color:'white', padding:'9px 18px', borderRadius:'6px', fontSize:'12px', fontWeight:'700', textDecoration:'none'}}>
              📢 Paute aquí
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
