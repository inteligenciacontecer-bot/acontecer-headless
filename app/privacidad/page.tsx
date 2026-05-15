import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Acontecer.co.cr',
  description: 'Política de privacidad y tratamiento de datos personales de Acontecer.co.cr.',
  alternates: { canonical: 'https://acontecer.co.cr/privacidad' },
  openGraph: { url: 'https://acontecer.co.cr/privacidad' },
};

export default function PrivacidadPage() {
  const secciones = [
    {titulo:'1. Información que recopilamos', contenido:'Acontecer.co.cr recopila información cuando usted visita nuestro sitio web, se suscribe a nuestro boletín o nos contacta directamente. La información puede incluir nombre y correo electrónico al suscribirse, datos de navegación como dirección IP, tipo de navegador y páginas visitadas, e información proporcionada voluntariamente al contactarnos.'},
    {titulo:'2. Uso de la información', contenido:'La información recopilada se utiliza exclusivamente para enviar el boletín de noticias, mejorar la experiencia de navegación, responder consultas y analizar el tráfico del sitio. Acontecer.co.cr no vende, alquila ni comparte su información personal con terceros con fines comerciales.'},
    {titulo:'3. Cookies', contenido:'Nuestro sitio utiliza cookies para mejorar la experiencia del usuario. Puede configurar su navegador para rechazarlas, aunque esto puede afectar algunas funcionalidades. Utilizamos Google Analytics para estadísticas de tráfico de forma anónima.'},
    {titulo:'4. Sus derechos', contenido:'Usted tiene derecho a acceder a su información personal, solicitar corrección de datos inexactos, solicitar la eliminación de su información y cancelar su suscripción al boletín en cualquier momento. Para ejercer estos derechos, contáctenos a: prensa@acontecer.co.cr'},
    {titulo:'5. Seguridad', contenido:'Implementamos medidas de seguridad técnicas y organizativas para proteger su información. Nuestro sitio utiliza certificado SSL para cifrar las comunicaciones.'},
    {titulo:'6. Cambios a esta política', contenido:'Acontecer.co.cr se reserva el derecho de actualizar esta política. Cualquier cambio significativo será notificado a través de nuestro sitio web. Última actualización: marzo 2026. Contacto: prensa@acontecer.co.cr'},
  ];

  return (
    <>
      <div style={{background:'linear-gradient(135deg, #0000A2 0%, #0a73ce 100%)', padding:'60px 20px', textAlign:'center'}}>
        <h1 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'42px', color:'white', marginBottom:'14px'}}>Política de Privacidad</h1>
        <p style={{color:'rgba(255,255,255,0.8)', fontSize:'18px', maxWidth:'600px', margin:'0 auto'}}>Cómo recopilamos, usamos y protegemos su información</p>
      </div>
      <div style={{maxWidth:'900px', margin:'50px auto', padding:'0 20px'}}>
        {secciones.map(s => (
          <div key={s.titulo} style={{background:'white', borderRadius:'16px', padding:'40px', boxShadow:'0 2px 20px rgba(0,0,0,0.06)', marginBottom:'24px'}}>
            <h2 style={{fontFamily:'var(--font-lora), Georgia, serif', fontSize:'24px', color:'#0000A2', marginBottom:'16px', paddingBottom:'12px', borderBottom:'3px solid #0000A2'}}>{s.titulo}</h2>
            <p style={{fontSize:'15px', lineHeight:1.8, color:'#555'}}>{s.contenido}</p>
          </div>
        ))}
      </div>
    </>
  );
}
