import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agencia de Contenidos | Acontecer.co.cr',
  description: 'Servicios de agencia de contenidos digitales, redacción periodística y comunicación estratégica. Acontecer.co.cr.',
  alternates: { canonical: 'https://acontecer.co.cr/agencia' },
  openGraph: { url: 'https://acontecer.co.cr/agencia' },
};

export default function AgenciaPage() {
  return (
    <>
      <style>{`
        .ag-hero { background: linear-gradient(135deg, #0000A2 0%, #0a73ce 100%); padding: 60px 20px; text-align: center; width: 100%; }
        .ag-container { max-width: 1000px; margin: 50px auto; padding: 0 16px; }
        .ag-card { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 20px rgba(0,0,0,0.06); margin-bottom: 30px; }
        .ag-services { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 30px; }
        .ag-service { background: white; border-radius: 12px; padding: 28px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .ag-steps { display: flex; flex-direction: column; gap: 4px; margin-bottom: 30px; }
        .ag-step { background: white; border-radius: 12px; padding: 24px 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); display: flex; gap: 20px; align-items: flex-start; }
        .ag-cta { background: linear-gradient(135deg, #0000A2, #0a73ce); border-radius: 16px; padding: 50px 40px; text-align: center; color: white; }
        @media (max-width: 768px) {
          .ag-hero { padding: 40px 16px; }
          .ag-services { grid-template-columns: 1fr; }
          .ag-card { padding: 24px 16px; }
          .ag-step { padding: 16px; }
          .ag-cta { padding: 32px 16px; }
        }
      `}</style>

      <div className="ag-hero">
        <h1 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'42px', color:'white', marginBottom:'14px'}}>Agencia de Publicidad</h1>
        <p style={{color:'rgba(255,255,255,0.8)', fontSize:'18px', maxWidth:'600px', margin:'0 auto'}}>Soluciones de comunicación digital para su marca en Costa Rica</p>
      </div>

      <div className="ag-container">
        <div className="ag-card">
          <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'24px', color:'#0000A2', marginBottom:'16px', paddingBottom:'12px', borderBottom:'3px solid #0000A2'}}>Comunicación estratégica para su negocio</h2>
          <p style={{fontSize:'15px', lineHeight:1.8, color:'#555', marginBottom:'14px'}}>Acontecer.co.cr no solo es un medio de noticias — también ofrecemos servicios de agencia de comunicación y publicidad digital para empresas, instituciones y marcas.</p>
          <p style={{fontSize:'15px', lineHeight:1.8, color:'#555'}}>Nuestro equipo combina experiencia periodística con conocimiento digital para crear estrategias de comunicación que generan resultados reales.</p>
        </div>

        <div className="ag-services">
          {[
            {icon:'✍️', title:'Redacción de contenido', desc:'Artículos, comunicados de prensa, blogs y contenido SEO redactado por periodistas profesionales.'},
            {icon:'📱', title:'Gestión de redes sociales', desc:'Manejo profesional de sus redes sociales con contenido de calidad y estrategia digital.'},
            {icon:'🎥', title:'Producción audiovisual', desc:'Videos institucionales, entrevistas, reels y contenido multimedia para sus plataformas.'},
            {icon:'📊', title:'Estrategia digital', desc:'Planificación y ejecución de campañas digitales con métricas y resultados medibles.'},
            {icon:'📰', title:'Notas patrocinadas', desc:'Contenido editorial patrocinado publicado en nuestro medio con alcance garantizado.'},
            {icon:'🎙️', title:'Cobertura de eventos', desc:'Cubrimos sus eventos empresariales con cobertura periodística profesional.'},
          ].map(s => (
            <div key={s.title} className="ag-service">
              <div style={{fontSize:'40px', marginBottom:'14px'}}>{s.icon}</div>
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', color:'#0000A2', marginBottom:'10px'}}>{s.title}</h3>
              <p style={{fontSize:'14px', color:'#666', lineHeight:1.6}}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="ag-steps">
          {[
            {num:'1', title:'Consulta inicial gratuita', desc:'Nos reunimos para entender sus objetivos de comunicación, audiencia objetivo y presupuesto disponible.'},
            {num:'2', title:'Propuesta personalizada', desc:'Desarrollamos una estrategia a medida con formatos, plazos y métricas de éxito claramente definidos.'},
            {num:'3', title:'Ejecución y publicación', desc:'Nuestro equipo produce y publica el contenido acordado con los más altos estándares de calidad.'},
            {num:'4', title:'Reporte de resultados', desc:'Entregamos reportes detallados de alcance, impresiones, clics y engagement de cada campaña.'},
          ].map(s => (
            <div key={s.num} className="ag-step">
              <div style={{width:'44px', height:'44px', background:'#0000A2', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-lora), Georgia, serif', fontSize:'20px', fontWeight:'700', flexShrink:0}}>{s.num}</div>
              <div>
                <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'17px', color:'#111', marginBottom:'6px'}}>{s.title}</h3>
                <p style={{fontSize:'14px', color:'#666', lineHeight:1.6}}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="ag-cta">
          <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'32px', marginBottom:'12px'}}>Hablemos de su proyecto</h2>
          <p style={{fontSize:'16px', opacity:0.85, marginBottom:'28px'}}>Primera consulta gratuita y sin compromiso.</p>
          <div style={{display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap'}}>
            <a href="mailto:prensa@acontecer.co.cr?subject=Agencia de publicidad" style={{background:'white', color:'#0000A2', padding:'14px 32px', borderRadius:'8px', fontWeight:'700', fontSize:'15px'}}>📧 Solicitar consulta gratuita</a>
            <a href="https://wa.me/50662889467" style={{background:'rgba(255,255,255,0.2)', color:'white', padding:'14px 32px', borderRadius:'8px', fontWeight:'700', fontSize:'15px', border:'2px solid rgba(255,255,255,0.4)'}}>📱 WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  );
}
