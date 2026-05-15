#!/usr/bin/env python3
"""
Patch whatsapp-bot.js:
1. Agrega función sendSeguro() que reintenta con chat fresco si hay detached Frame
2. Arregla procesarTexto para que el fallo del mensaje de status no aborte el procesamiento
"""
RUTA = '/opt/acontecer-ia/whatsapp-bot.js'

with open(RUTA, 'r', encoding='utf-8') as f:
    src = f.read()

changes = 0

# ──────────────────────────────────────────────────────────────────────────────
# 1. Insertar función sendSeguro antes de procesarTexto
# ──────────────────────────────────────────────────────────────────────────────
ANCHOR = '// ─── PROCESAR TEXTO ─'
SEND_SEGURO = '''// ─── SEND SEGURO: reintenta con chat fresco en detached Frame ────────────────
async function sendSeguro(chat, msg, reintentos = 3) {
  for (let i = 0; i < reintentos; i++) {
    try {
      await chat.sendMessage(msg);
      return true;
    } catch(e) {
      const esFrame = e.message && (
        e.message.includes('detached Frame') ||
        e.message.includes('Execution context') ||
        e.message.includes('Session closed') ||
        e.message.includes('Target closed') ||
        e.message.includes('timed out')
      );
      if (esFrame && i < reintentos - 1) {
        await new Promise(r => setTimeout(r, 1500 * (i + 1)));
        // Intentar obtener chat fresco
        try {
          const chatFresco = await client.getChatById(chat.id._serialized);
          if (chatFresco) { chat = chatFresco; }
        } catch(_) {}
      } else {
        console.error('[sendSeguro] Error enviando mensaje:', e.message.slice(0, 100));
        return false;
      }
    }
  }
  return false;
}

'''

if 'sendSeguro' not in src:
    idx = src.find(ANCHOR)
    if idx >= 0:
        src = src[:idx] + SEND_SEGURO + src[idx:]
        changes += 1
        print("OK 1: sendSeguro() insertada")
    else:
        print("WARN 1: no se encontro anchor para sendSeguro")
else:
    print("INFO 1: sendSeguro ya existe")

# ──────────────────────────────────────────────────────────────────────────────
# 2. Arreglar procesarTexto para que status fallido no aborte procesamiento
# ──────────────────────────────────────────────────────────────────────────────
OLD2 = '''async function procesarTexto(msg, chat, texto) {
  try {
    await chat.sendMessage('✍️ Redactando nota...');
    const ts = Date.now();
    await procesarConClaude(chat, texto, ts);
  } catch (err) {
    console.error('[ERROR] texto:', err.message);
  }
}'''

NEW2 = '''async function procesarTexto(msg, chat, texto) {
  // Enviar confirmacion sin bloquear el procesamiento si falla
  sendSeguro(chat, '✍️ Redactando nota...').catch(() => {});
  try {
    const ts = Date.now();
    await procesarConClaude(chat, texto, ts);
  } catch (err) {
    console.error('[ERROR] texto:', err.message);
  }
}'''

if OLD2 in src:
    src = src.replace(OLD2, NEW2, 1)
    changes += 1
    print("OK 2: procesarTexto arreglado")
else:
    print("WARN 2: no se encontro procesarTexto original")
    # Try to find what's there
    import re
    m = re.search(r'async function procesarTexto.*?^}', src, re.MULTILINE | re.DOTALL)
    if m:
        print("  Encontrado como:\n" + m.group(0)[:300])

# ──────────────────────────────────────────────────────────────────────────────
# 3. Reemplazar chat.sendMessage por sendSeguro en enviarNotaParaAprobacion
# ──────────────────────────────────────────────────────────────────────────────
OLD3 = '''  try {
    await chat.sendMessage(preview);
    console.log('[Claude] nota enviada al chat OK');
  } catch(e) {
    console.error('[Claude] ERROR enviando nota:', e.message);
  }'''

NEW3 = '''  const ok = await sendSeguro(chat, preview);
  if (ok) {
    console.log('[Claude] nota enviada al chat OK');
  } else {
    console.error('[Claude] ERROR enviando nota tras reintentos');
  }'''

if OLD3 in src:
    src = src.replace(OLD3, NEW3, 1)
    changes += 1
    print("OK 3: enviarNotaParaAprobacion usa sendSeguro")
else:
    print("WARN 3: no se encontro bloque de envio de nota")

with open(RUTA, 'w', encoding='utf-8') as f:
    f.write(src)

print(f"\nTotal cambios: {changes}")
print("Archivo guardado.")
