import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pauta Publicitaria',
  description: 'Llegue a miles de lectores costarricenses con su pauta publicitaria en Acontecer.co.cr. Formatos digitales, boletines y redes sociales.',
  alternates: { canonical: 'https://acontecer.co.cr/pauta' },
  openGraph: { url: 'https://acontecer.co.cr/pauta' },
};

export default function PautaPage() {
  return (
    <>
      <style>{`
        .pauta-hero { background: linear-gradient(135deg, #0000A2 0%, #0a73ce 100%); padding: 60px 20px; text-align: center; width: 100%; }
        .pauta-container { max-width: 1000px; margin: 50px auto; padding: 0 16px; }
        .pauta-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-bottom: 30px; }
        .pauta-stat { background: white; border-radius: 12px; padding: 28px 20px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .pauta-formats { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 30px; }
        .pauta-format { background: #f8f9ff; border-radius: 12px; padding: 24px; }
        .pauta-mediakit { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 20px rgba(0,0,0,0.06); margin-bottom: 30px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .pauta-cta { background: linear-gradient(135deg, #0000A2, #0a73ce); border-radius: 16px; padding: 50px 40px; text-align: center; color: white; }
        @media (max-width: 768px) {
          .pauta-hero { padding: 40px 16px; }
          .pauta-stats { grid-template-columns: repeat(2,1fr); }
          .pauta-formats { grid-template-columns: 1fr; }
          .pauta-mediakit { flex-direction: column; text-align: center; padding: 24px 16px; }
          .pauta-cta { padding: 32px 16px; }
        }
      `}</style>

      <div className="pauta-hero">
        <h1 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'42px', color:'white', marginBottom:'14px'}}>Paute con Nosotros</h1>
        <p style={{color:'rgba(255,255,255,0.8)', fontSize:'18px', maxWidth:'600px', margin:'0 auto'}}>Llegue a miles de lectores costarricenses con su mensaje</p>
      </div>

      <div className="pauta-container">

        {/* STATS */}
        <div className="pauta-stats">
          {[
            {num:'+15M', label:'Vistas mensuales en Facebook'},
            {num:'+50K', label:'Lectores mensuales web'},
            {num:'+1,200', label:'Artículos publicados'},
            {num:'6', label:'Secciones temáticas'},
          ].map(s => (
            <div key={s.label} className="pauta-stat">
              <div style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'32px', color:'#0000A2', fontWeight:'700', marginBottom:'6px'}}>{s.num}</div>
              <div style={{fontSize:'13px', color:'#888'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* MEDIAKIT */}
        <div className="pauta-mediakit">
          <div style={{fontSize:'60px', flexShrink:0}}>📊</div>
          <div style={{flex:1}}>
            <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'24px', color:'#0000A2', marginBottom:'10px'}}>Descargue nuestro Media Kit</h2>
            <p style={{fontSize:'15px', color:'#555', lineHeight:1.7, marginBottom:'16px'}}>Conozca todos nuestros formatos publicitarios, tarifas, alcance y estadísticas detalladas de nuestra audiencia en el Media Kit oficial de Acontecer.co.cr</p>
            <a href="https://drive.google.com/file/d/1WgmOm_QyTEYRqLeWd4R9Rxmxxx1RGkE9/view?usp=sharing" target="_blank" rel="noopener noreferrer"
              style={{background:'#0000A2', color:'white', padding:'12px 28px', borderRadius:'8px', fontSize:'14px', fontWeight:'700', display:'inline-block'}}>
              📥 Ver Media Kit completo
            </a>
          </div>
        </div>

        {/* FORMATS */}
        <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'24px', color:'#0000A2', marginBottom:'20px', paddingBottom:'12px', borderBottom:'3px solid #0000A2'}}>Formatos publicitarios</h2>
        <div className="pauta-formats">
          {[
            {icon:'🖼️', title:'Banner principal', desc:'Posición destacada en la parte superior del sitio, visible en todas las páginas.', size:'728x90px'},
            {icon:'📰', title:'Nota patrocinada', desc:'Contenido editorial a medida integrado en nuestra sección de noticias.', size:'Artículo completo'},
            {icon:'📱', title:'Banner lateral', desc:'Sidebar del sitio, visible durante toda la lectura de los artículos.', size:'300x250px'},
            {icon:'📧', title:'Boletín de correo', desc:'Incluya su marca en nuestro boletín enviado a suscriptores activos.', size:'600px ancho'},
            {icon:'🎯', title:'Banner en nota', desc:'Anuncio integrado dentro del cuerpo de los artículos.', size:'728x90px'},
            {icon:'📣', title:'Paquete completo', desc:'Combinación de formatos para máxima exposición en web y redes.', size:'Personalizado'},
          ].map(f => (
            <div key={f.title} className="pauta-format">
              <div style={{fontSize:'36px', marginBottom:'10px'}}>{f.icon}</div>
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'16px', color:'#0000A2', marginBottom:'8px'}}>{f.title}</h3>
              <p style={{fontSize:'13px', color:'#666', lineHeight:1.6, marginBottom:'10px'}}>{f.desc}</p>
              <span style={{background:'#e8f0ff', color:'#0000A2', fontSize:'11px', padding:'3px 10px', borderRadius:'4px', fontWeight:'600'}}>{f.size}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pauta-cta">
          <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'32px', marginBottom:'12px'}}>¿Listo para llegar a Costa Rica?</h2>
          <p style={{fontSize:'16px', opacity:0.85, marginBottom:'28px', maxWidth:'500px', margin:'0 auto 28px'}}>Contáctenos hoy y le prepararemos una propuesta personalizada sin costo ni compromiso.</p>
          <div style={{display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap'}}>
            <a href="mailto:prensa@acontecer.co.cr?subject=Pauta publicitaria" style={{background:'white', color:'#0000A2', padding:'14px 32px', borderRadius:'8px', fontWeight:'700', fontSize:'15px'}}>📧 Solicitar propuesta</a>
            <a href="https://wa.me/50662889467" style={{background:'rgba(255,255,255,0.2)', color:'white', padding:'14px 32px', borderRadius:'8px', fontWeight:'700', fontSize:'15px', border:'2px solid rgba(255,255,255,0.4)'}}>📱 WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  );
}
