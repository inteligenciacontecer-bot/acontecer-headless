import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctenos para consultas, colaboraciones, columnas de opinión o pauta publicitaria. Redacción Acontecer.co.cr.',
  alternates: { canonical: 'https://acontecer.co.cr/contacto' },
  openGraph: { url: 'https://acontecer.co.cr/contacto', images: [{ url: 'https://acontecer.co.cr/wp-content/uploads/2026/06/CONTACTENOS-PORTADA.webp', alt: 'Contacto Acontecer.co.cr' }] },
};

export default function ContactoPage() {
  return (
    <>
      <style>{`
        .con-hero { background: linear-gradient(135deg, #0000A2 0%, #0a73ce 100%); padding: 60px 20px; text-align: center; width: 100%; }
        .con-container { max-width: 1000px; margin: 50px auto; padding: 0 16px; }
        .con-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; margin-bottom: 30px; }
        .con-card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 20px rgba(0,0,0,0.06); text-align: center; }
        .con-social { background: linear-gradient(135deg, #0000A2, #0a73ce); border-radius: 16px; padding: 40px; text-align: center; color: white; }
        .con-social-links { display: flex; justify-content: center; gap: 12px; flexWrap: wrap; margin-top: 28px; }
        @media (max-width: 768px) {
          .con-hero { padding: 40px 16px; }
          .con-grid { grid-template-columns: 1fr; }
          .con-card { padding: 24px 16px; }
          .con-social-links { flex-wrap: wrap; }
        }
      `}</style>

      <div className="con-hero">
        <h1 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'42px', color:'white', marginBottom:'14px'}}>Contáctenos</h1>
        <p style={{color:'rgba(255,255,255,0.8)', fontSize:'18px', maxWidth:'600px', margin:'0 auto'}}>Estamos disponibles para atender sus consultas, colaboraciones y solicitudes publicitarias</p>
      </div>

      <div className="con-container">
        <div className="con-grid">
          {[
            {icon:'📧', title:'Redacción', desc:'Para enviar columnas de opinión, comunicados de prensa o información noticiosa.', value:'prensa@acontecer.co.cr', href:'mailto:prensa@acontecer.co.cr', btn:'Enviar correo'},
            {icon:'📱', title:'Teléfono / WhatsApp', desc:'Contáctenos directamente para consultas urgentes o coordinación de entrevistas.', value:'+(506) 6288-9467', href:'https://wa.me/50662889467', btn:'WhatsApp'},
            {icon:'📢', title:'Pauta publicitaria', desc:'¿Quiere llegar a miles de lectores costarricenses?', value:'prensa@acontecer.co.cr', href:'mailto:prensa@acontecer.co.cr?subject=Pauta', btn:'Solicitar info'},
            {icon:'✍️', title:'Columnas de opinión', desc:'¿Tiene algo importante que decir? Envíenos su columna para consideración editorial.', value:'prensa@acontecer.co.cr', href:'mailto:prensa@acontecer.co.cr?subject=Columna', btn:'Enviar columna'},
          ].map(c => (
            <div key={c.title} className="con-card">
              <div style={{fontSize:'48px', marginBottom:'16px'}}>{c.icon}</div>
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'20px', color:'#0000A2', marginBottom:'10px'}}>{c.title}</h3>
              <p style={{fontSize:'14px', color:'#777', lineHeight:1.6, marginBottom:'16px'}}>{c.desc}</p>
              <div style={{fontSize:'16px', fontWeight:'600', color:'#0a73ce', marginBottom:'14px'}}>{c.value}</div>
              <a href={c.href} style={{background:'#0000A2', color:'white', padding:'10px 24px', borderRadius:'20px', fontSize:'13px', fontWeight:'700', display:'inline-block'}}>{c.btn}</a>
            </div>
          ))}
        </div>

        <div className="con-social">
          <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'28px', marginBottom:'10px'}}>Síganos en redes sociales</h2>
          <p style={{opacity:0.8, marginBottom:'28px', fontSize:'15px'}}>Manténgase informado siguiéndonos en nuestras plataformas digitales</p>
          <div style={{display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap'}}>
            {[{label:'📘 Facebook', href:'https://facebook.com/Acontecer.co.cr'},{label:'📸 Instagram', href:'#'},{label:'✕ Twitter', href:'#'},{label:'🎵 TikTok', href:'#'},{label:'▶ YouTube', href:'#'}].map(s => (
              <a key={s.label} href={s.href} style={{background:'rgba(255,255,255,0.15)', color:'white', padding:'12px 20px', borderRadius:'8px', fontSize:'14px', fontWeight:'600'}}>{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
