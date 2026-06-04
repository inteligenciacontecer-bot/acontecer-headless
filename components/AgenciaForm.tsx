'use client';

import { useState } from 'react';

// WhatsApp de la agencia (mismo número que el CTA del hero). Cambiar aquí si hace falta.
const WA_NUMERO = '50662889467';

export default function AgenciaForm() {
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [org, setOrg] = useState('');
  const [correo, setCorreo] = useState('');
  const [servicio, setServicio] = useState('');
  const [mensaje, setMensaje] = useState('');

  const enviar = () => {
    const txt =
      'Hola, quiero un diagnóstico estratégico con Acontecer Studio.\n\n' +
      `Nombre: ${nombre || '—'}\n` +
      `Cargo: ${cargo || '—'}\n` +
      `Organización: ${org || '—'}\n` +
      `Correo: ${correo || '—'}\n` +
      `Servicio de interés: ${servicio || '—'}\n` +
      `Mensaje: ${mensaje || '—'}`;
    window.open(`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <form className="ag-form" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
      <div className="ag-form-grid">
        <div className="ag-field ag-field-half">
          <label className="ag-label">Nombre completo</label>
          <input className="ag-input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. María Solano" />
        </div>
        <div className="ag-field ag-field-half">
          <label className="ag-label">Cargo</label>
          <input className="ag-input" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Director de Comunicación" />
        </div>
        <div className="ag-field ag-field-half">
          <label className="ag-label">Organización</label>
          <input className="ag-input" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Nombre de la empresa o institución" />
        </div>
        <div className="ag-field ag-field-half">
          <label className="ag-label">Correo corporativo</label>
          <input className="ag-input" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="m.solano@empresa.cr" />
        </div>
        <div className="ag-field ag-field-full">
          <label className="ag-label">¿Qué buscás?</label>
          <select className="ag-input ag-select" value={servicio} onChange={(e) => setServicio(e.target.value)}>
            <option value="" disabled>Seleccioná un servicio</option>
            <option value="Comunicación institucional">Comunicación institucional</option>
            <option value="Asesoría política / electoral">Asesoría política / electoral</option>
            <option value="Gestión de crisis">Gestión de crisis</option>
            <option value="Media tech y desarrollo">Media tech y desarrollo</option>
            <option value="Producción audiovisual">Producción audiovisual</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="ag-field ag-field-full">
          <label className="ag-label">Contanos brevemente</label>
          <textarea className="ag-input ag-textarea" value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Contexto del proyecto, plazos, presupuesto estimado…" rows={4} />
        </div>
      </div>
      <button className="ag-submit" type="submit">Escribir por WhatsApp →</button>
      <p className="ag-form-privacy">Tus datos se manejan según nuestra política de privacidad. No los compartimos ni con anunciantes ni con terceros.</p>
    </form>
  );
}
