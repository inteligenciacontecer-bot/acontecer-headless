/**
 * POST /api/webpushr/notify
 *
 * Receptor del webhook de WordPress: recibe los datos de la nota recién
 * publicada y envía la notificación push a todos los suscriptores via
 * Webpushr API, con la URL canónica del headless (acontecer.co.cr).
 *
 * Body esperado (JSON desde el hook de PHP):
 *   {
 *     secret:    string,   // WEBHOOK_SECRET definido en ambos lados
 *     title:     string,   // Título de la nota
 *     message:   string,   // Extracto corto (≤ 100 chars)
 *     slug:      string,   // slug WP del post
 *     categoria: string,   // slug de la categoría principal
 *     image_url: string|null
 *   }
 */

export const runtime = 'nodejs';

const WEBPUSHR_KEY        = '0997debd0f615da3ff3f84742cb663e1';
const WEBPUSHR_AUTH_TOKEN = '41729';
const WEBHOOK_SECRET      = process.env.WEBPUSHR_WEBHOOK_SECRET ?? 'acontecer2025push';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { secret, title, message, slug, categoria, image_url } = body;

    // ── Autenticación simple ────────────────────────────────────────────────
    if (secret !== WEBHOOK_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!title || !slug || !categoria) {
      return Response.json({ error: 'Missing required fields: title, slug, categoria' }, { status: 400 });
    }

    // ── URL canónica del headless ────────────────────────────────────────────
    const targetUrl = `https://acontecer.co.cr/${categoria}/${slug}`;

    // ── Payload para Webpushr ────────────────────────────────────────────────
    const payload: Record<string, unknown> = {
      title,
      message: message ?? 'Nueva nota en Acontecer.co.cr',
      target_url: targetUrl,
      // Botón de acción directo a la nota
      action_buttons: [
        { title: 'Leer nota', url: targetUrl },
      ],
    };

    if (image_url) {
      payload.image = image_url;
    }

    // ── Enviar a Webpushr ────────────────────────────────────────────────────
    const wpRes = await fetch('https://api.webpushr.com/v1/notification/send/all', {
      method: 'POST',
      headers: {
        'webpushrKey':       WEBPUSHR_KEY,
        'webpushrAuthToken': WEBPUSHR_AUTH_TOKEN,
        'Content-Type':      'application/json',
      },
      body: JSON.stringify(payload),
    });

    const wpData = await wpRes.json();

    if (!wpRes.ok) {
      console.error('[webpushr] Error en API:', wpData);
      return Response.json({ error: 'Webpushr API error', detail: wpData }, { status: 502 });
    }

    console.log(`[webpushr] Push enviado → ${targetUrl} | status: ${wpData.status}`);
    return Response.json({ ok: true, target_url: targetUrl, webpushr: wpData });

  } catch (err) {
    console.error('[webpushr] Error interno:', err);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
