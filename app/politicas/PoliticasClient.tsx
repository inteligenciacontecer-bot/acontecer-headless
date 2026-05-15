'use client';
import { useState } from 'react';

export default function PoliticasClient() {
  const [tab, setTab] = useState('correcciones');

  return (
    <>
      <div style={{background:'linear-gradient(135deg, #0000A2 0%, #0a73ce 100%)', padding:'60px 20px', textAlign:'center'}}>
        <h1 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'42px', color:'white', marginBottom:'14px'}}>Políticas Editoriales</h1>
        <p style={{color:'rgba(255,255,255,0.8)', fontSize:'18px', maxWidth:'600px', margin:'0 auto'}}>Nuestro compromiso con la ética, la transparencia y la corrección periodística</p>
      </div>

      <div style={{maxWidth:'900px', margin:'50px auto', padding:'0 20px'}}>
        <div style={{display:'flex', background:'white', borderRadius:'12px 12px 0 0', overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          {[{id:'correcciones', label:'📝 Política de Correcciones'},{id:'etica', label:'⚖️ Política de Ética'}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{flex:1, padding:'16px', border:'none', background: tab===t.id ? 'white' : '#f4f6fa', fontSize:'15px', fontWeight:'600', cursor:'pointer', color: tab===t.id ? '#0000A2' : '#666', borderBottom: tab===t.id ? '3px solid #0000A2' : '3px solid transparent', fontFamily:'inherit'}}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{background:'white', borderRadius:'0 0 16px 16px', padding:'40px', boxShadow:'0 2px 20px rgba(0,0,0,0.06)'}}>
          {tab === 'correcciones' ? (
            <>
              <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'24px', color:'#0000A2', marginBottom:'16px', paddingBottom:'12px', borderBottom:'3px solid #0000A2'}}>Política de Correcciones</h2>
              <p style={{fontSize:'15px', lineHeight:1.8, color:'#555', marginBottom:'20px'}}>Acontecer.co.cr se compromete con la exactitud periodística. Cuando cometemos un error, lo corregimos de forma transparente y oportuna.</p>
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', color:'#111', margin:'20px 0 10px'}}>¿Cómo reportar un error?</h3>
              <p style={{fontSize:'15px', lineHeight:1.8, color:'#555', marginBottom:'20px'}}>Si detecta información incorrecta, puede notificarnos a prensa@acontecer.co.cr con el asunto "Corrección" o por WhatsApp al +(506) 6288-9467.</p>
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', color:'#111', margin:'20px 0 10px'}}>Proceso de corrección</h3>
              <p style={{fontSize:'15px', lineHeight:1.8, color:'#555'}}>Revisamos cada solicitud en un plazo máximo de 24 horas. Si el error es confirmado, corregimos el artículo e indicamos la corrección al final del mismo con la fecha correspondiente.</p>
            </>
          ) : (
            <>
              <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'24px', color:'#0000A2', marginBottom:'16px', paddingBottom:'12px', borderBottom:'3px solid #0000A2'}}>Política de Ética Periodística</h2>
              <p style={{fontSize:'15px', lineHeight:1.8, color:'#555', marginBottom:'20px'}}>Acontecer.co.cr se rige por los más altos estándares éticos del periodismo costarricense e internacional.</p>
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', color:'#111', margin:'20px 0 10px'}}>Principios fundamentales</h3>
              <p style={{fontSize:'15px', lineHeight:1.8, color:'#555', marginBottom:'20px'}}>Veracidad, independencia editorial, objetividad, transparencia y responsabilidad son los pilares de nuestro trabajo periodístico.</p>
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', color:'#111', margin:'20px 0 10px'}}>Conflictos de interés</h3>
              <p style={{fontSize:'15px', lineHeight:1.8, color:'#555', marginBottom:'20px'}}>Nuestros periodistas no aceptan pagos, regalos o beneficios de fuentes cubiertas editorialmente. La cobertura publicitaria está claramente diferenciada del contenido editorial.</p>
              <h3 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'18px', color:'#111', margin:'20px 0 10px'}}>Protección de fuentes</h3>
              <p style={{fontSize:'15px', lineHeight:1.8, color:'#555'}}>Respetamos el secreto de fuente como derecho fundamental del periodismo. Las fuentes anónimas solo se utilizan cuando la información es de interés público.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
