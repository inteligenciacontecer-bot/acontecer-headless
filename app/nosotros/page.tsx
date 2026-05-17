import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiénes Somos',
  description: 'Acontecer.co.cr es el medio digital independiente de Costa Rica. Conoce nuestra misión, equipo y compromiso con el periodismo de calidad.',
  alternates: { canonical: 'https://acontecer.co.cr/nosotros' },
  openGraph: { url: 'https://acontecer.co.cr/nosotros' },
};

export default function NosotrosPage() {
  return (
    <>
      <style>{`
        .nos-hero { background: linear-gradient(135deg, #0000A2 0%, #0a73ce 100%); padding: 60px 20px; text-align: center; }
        .nos-container { max-width: 900px; margin: 50px auto; padding: 0 16px; }
        .nos-card { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 20px rgba(0,0,0,0.06); margin-bottom: 30px; }
        .nos-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
        .nos-stats { background: linear-gradient(135deg, #0000A2, #0a73ce); border-radius: 16px; padding: 40px; display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; text-align: center; margin-bottom: 30px; }
        .nos-values { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 30px; }
        .nos-value-card { background: white; border-radius: 12px; padding: 28px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); text-align: center; }
        @media (max-width: 768px) {
          .nos-hero { padding: 40px 16px; }
          .nos-grid-2 { grid-template-columns: 1fr; }
          .nos-stats { grid-template-columns: repeat(2,1fr); }
          .nos-values { grid-template-columns: 1fr; }
          .nos-card { padding: 24px 16px; }
        }
      `}</style>

      <div className="nos-hero">
        <h1 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'42px', color:'white', marginBottom:'14px'}}>Quiénes Somos</h1>
        <p style={{color:'rgba(255,255,255,0.8)', fontSize:'18px', maxWidth:'600px', margin:'0 auto'}}>Somos la nueva cara del periodismo en Costa Rica</p>
      </div>

      <div className="nos-container">
        <div className="nos-card">
          <div className="nos-grid-2">
            <div>
              <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'28px', color:'#0000A2', marginBottom:'16px'}}>Nuestro medio</h2>
              <p style={{fontSize:'16px', lineHeight:1.8, color:'#555', marginBottom:'14px'}}>Acontecer.co.cr es un medio de comunicación digital costarricense enfocado en política, economía y noticias de interés nacional, con una visión objetiva y técnica del periodismo.</p>
              <p style={{fontSize:'16px', lineHeight:1.8, color:'#555', marginBottom:'14px'}}>Nacimos con la convicción de que la juventud puede ser una fuerza transformadora en el mundo de los medios.</p>
              <p style={{fontSize:'16px', lineHeight:1.8, color:'#555'}}>Cubrimos la actualidad nacional e internacional con responsabilidad, claridad y oportunidad.</p>
            </div>
            <div style={{background:'linear-gradient(135deg, #0000A2, #0a73ce)', borderRadius:'12px', minHeight:'240px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'white', fontSize:'60px', gap:'12px'}}>
              🇨🇷
              <p style={{fontSize:'16px', fontWeight:'600', opacity:0.9}}>Periodismo Digital</p>
            </div>
          </div>
        </div>

        <div className="nos-stats">
          {[{num:'+1,200', label:'Artículos publicados'},{num:'+50K', label:'Lectores mensuales'},{num:'6', label:'Secciones temáticas'},{num:'2022', label:'Año de fundación'}].map(s => (
            <div key={s.label}>
              <strong style={{display:'block', fontFamily:'var(--font-lora), Georgia, serif', fontSize:'32px', color:'white', marginBottom:'6px'}}>{s.num}</strong>
              <span style={{color:'rgba(255,255,255,0.8)', fontSize:'13px'}}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="nos-values">
          {[{icon:'🎯', title:'Objetividad', desc:'Informamos desde un punto de vista objetivo y técnico, sin sesgos políticos ni ideológicos.'},{icon:'⚡', title:'Inmediatez', desc:'Llevamos las noticias más importantes de Costa Rica y el mundo en tiempo real.'},{icon:'✅', title:'Responsabilidad', desc:'Verificamos cada dato antes de publicar. La veracidad es nuestro compromiso principal.'}].map(v => (
            <div key={v.title} className="nos-value-card">
              <div style={{fontSize:'40px', marginBottom:'14px'}}>{v.icon}</div>
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', color:'#0000A2', marginBottom:'10px'}}>{v.title}</h3>
              <p style={{fontSize:'14px', color:'#666', lineHeight:1.6}}>{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="nos-card" style={{display:'flex', alignItems:'center', gap:'24px', flexWrap:'wrap'}}>
          <div style={{fontSize:'60px', flexShrink:0}}>🏆</div>
          <div>
            <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'20px', color:'#0000A2', marginBottom:'8px'}}>Premio Alberto Martén Chavarría 2023</h3>
            <p style={{fontSize:'14px', color:'#666', lineHeight:1.6}}>Acontecer.co.cr recibió mención honorífica en el Premio Alberto Martén Chavarría 2023, uno de los reconocimientos más importantes del periodismo costarricense.</p>
          </div>
        </div>
      </div>
    </>
  );
}
