import { readFile } from 'fs/promises';

// Sirve el QR de vinculación de WhatsApp del bot, leyéndolo en vivo de /tmp.
// Auto-refresca cada 15s para que siempre muestre el QR vigente (expiran rápido).
// Temporal: solo se usa al re-vincular el bot.
export const dynamic = 'force-dynamic';

export async function GET() {
  let b64 = '';
  try {
    const img = await readFile('/tmp/wa_qr.png');
    b64 = img.toString('base64');
  } catch {
    // sin QR disponible
  }

  const html = `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="15">
<title>Vincular WhatsApp — Acontecer Bot</title>
<style>
  body{font-family:system-ui,sans-serif;text-align:center;padding:24px;background:#0000A2;color:#fff;margin:0}
  h2{font-size:20px;margin:0 0 6px}
  p{opacity:.85;font-size:14px;line-height:1.5;max-width:420px;margin:10px auto}
  .qr{background:#fff;padding:18px;border-radius:16px;display:inline-block;margin:14px 0;box-shadow:0 8px 30px rgba(0,0,0,.3)}
  .qr img{display:block;width:280px;height:280px;max-width:78vw;max-height:78vw}
  .steps{text-align:left;max-width:340px;margin:16px auto;font-size:14px;opacity:.9}
  .steps li{margin:6px 0}
  .tag{display:inline-block;background:rgba(255,255,255,.15);padding:4px 12px;border-radius:20px;font-size:12px;margin-top:8px}
</style></head><body>
  <h2>📱 Vincular el bot de WhatsApp</h2>
  ${b64
    ? `<div class="qr"><img src="data:image/png;base64,${b64}" alt="QR WhatsApp"></div>`
    : `<p>⏳ Generando QR… espera unos segundos (la página se refresca sola).</p>`}
  <ol class="steps">
    <li>Abre <b>WhatsApp</b> en el teléfono del bot</li>
    <li>Menú <b>⋮</b> → <b>Dispositivos vinculados</b></li>
    <li><b>Vincular un dispositivo</b></li>
    <li>Escanea el código de arriba</li>
  </ol>
  <span class="tag">🔄 Se actualiza solo cada 15s</span>
</body></html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
