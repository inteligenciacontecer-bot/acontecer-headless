/**
 * Endpoint HTTP que recibe alertas de los scripts Python y las envía al admin de WhatsApp.
 * Puerto: 3001  ->  http://localhost:3001/api/asamblea-alerta
 *
 * Fix v2: queue de mensajes para evitar "detached Frame" cuando el cliente WA no está listo.
 * Las llamadas asíncronas a waClient.sendMessage se encolan y se procesan en orden.
 */
const http = require('http');

module.exports = function iniciarEndpointAsamblea(waClient, adminNumber) {
  const NUMERO_ADMIN = adminNumber || process.env.WA_ADMIN || '50688888888@c.us';

  // Cola de mensajes pendientes
  const cola = [];
  let enviando = false;

  async function procesarCola() {
    if (enviando) return;
    enviando = true;
    while (cola.length > 0) {
      const { numero, msg } = cola.shift();
      try {
        if (waClient && waClient.info) {
          await waClient.sendMessage(numero, msg);
        }
      } catch (e) {
        // Ignorar errores esperados de Puppeteer durante navegacion interna de WhatsApp Web
        const esperado = e.message && (
          e.message.includes('detached Frame') ||
          e.message.includes('Execution context') ||
          e.message.includes('Session closed') ||
          e.message.includes('Target closed')
        );
        if (!esperado) {
          console.error('[asamblea-endpoint] Error WA:', e.message.slice(0, 120));
        }
      }
    }
    enviando = false;
  }

  const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/api/asamblea-alerta') {
      res.writeHead(404).end('{}');
      return;
    }
    let body = '';
    req.on('data', d => (body += d));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const msg = buildMessage(data);
        if (msg) {
          cola.push({ numero: NUMERO_ADMIN, msg });
          setImmediate(procesarCola);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        console.error('[asamblea-endpoint] parse error:', e.message.slice(0, 80));
        res.writeHead(500).end('{"ok":false}');
      }
    });
  });

  server.listen(3001, '127.0.0.1', () =>
    console.log('[asamblea] Endpoint escuchando en :3001')
  );
};

function buildMessage(data) {
  const { tipo, titulo, expediente, si, no, resultado, video_url, texto } = data;

  if (tipo === 'votacion' || tipo === 'votacion_youtube') {
    const fuente = tipo === 'votacion_youtube' ? 'YouTube' : 'Telegram';
    const exp    = expediente ? `Expediente *${expediente}*\n` : '';
    const votos  = (si !== undefined || no !== undefined) ? `SI: *${si}*  NO: *${no}*\n` : '';
    const resStr = resultado ? `Resultado: *${resultado}*\n` : '';
    const vid    = video_url ? `\n${video_url}` : '';

    return (
      `VOTACION [${fuente}]\n\n` +
      `${exp}` +
      `${(titulo || texto || '').slice(0, 250)}\n\n` +
      `${votos}` +
      `${resStr}` +
      `${vid}\n\n` +
      `Responda *si* para generar nota.`
    ).trim();
  }

  if (tipo === 'expediente') {
    return (
      `EXPEDIENTE NUEVO\n` +
      `${expediente ? 'N ' + expediente + '\n' : ''}` +
      `${titulo || ''}`
    ).trim();
  }

  if (tipo === 'telegram') {
    return ('Telegram Asamblea:\n' + (texto || titulo || '')).trim();
  }

  return titulo ? ('Alerta: ' + titulo) : null;
}
