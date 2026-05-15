#!/usr/bin/env python3
"""
Monitor del grupo de prensa de la Asamblea Legislativa en Telegram.
v3: backoff exponencial + PDF parsing + resumen IA con Claude Haiku

pm2:
  pm2 start /opt/acontecer-ia/telegram_monitor.py \
      --name asamblea-telegram \
      --interpreter /opt/venv/bin/python3

Env vars requeridas:
  ANTHROPIC_API_KEY   — clave de Anthropic para generar resumenes IA
"""
import asyncio, re, io, logging, pymysql, requests, sys, os
from telethon import TelegramClient, events
from telethon.tl.types import MessageMediaDocument, DocumentAttributeFilename
from telethon.errors import ChatIdInvalidError, ChannelPrivateError, FloodWaitError

sys.path.insert(0, os.path.dirname(__file__))
from config_asamblea import (
    TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSION,
    TELEGRAM_GROUP, BOT_NOTIFY_URL, DB_PREFIX, get_db_config,
    ANTHROPIC_API_KEY,
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [telegram] %(message)s',
    handlers=[
        logging.FileHandler('/opt/acontecer-ia/logs/asamblea_telegram.log'),
        logging.StreamHandler(),
    ]
)
log = logging.getLogger(__name__)

# ── Importar parser PDF ───────────────────────────────────────────────────────
try:
    from parse_votos_pdf import parse_pdf_bytes, cargar_diputados_db, procesar_y_guardar
    PDF_PARSER_OK = True
    log.info('parse_votos_pdf cargado ✓')
except ImportError as e:
    PDF_PARSER_OK = False
    log.warning(f'parse_votos_pdf no disponible: {e} — PDFs serán ignorados')

# ── Regex ─────────────────────────────────────────────────────────────────────
VOTE_RE       = re.compile(
    r'(\d+)\s*(?:votos?)?\s*a\s*favor|(\d+)\s*(?:votos?)?\s*en\s*contra'
    r'|aprobad[oa]|rechazad[oa]|votaci[oó]n', re.IGNORECASE)
EXPEDIENTE_RE = re.compile(
    r'\b(?:expediente|proyecto|exp\.?)\s*[Nn][oO°]?\s*(\d{4,5})', re.IGNORECASE)
FAVOR_RE  = re.compile(r'(\d+)\s*(?:votos?)?\s*a\s*favor', re.IGNORECASE)
CONTRA_RE = re.compile(r'(\d+)\s*(?:votos?)?\s*en\s*contra', re.IGNORECASE)
ABST_RE   = re.compile(
    r'(\d+)\s*(?:votos?)?\s*(?:abstenci[oó]n|se\s*abstuvieron)', re.IGNORECASE)

# ── DB ────────────────────────────────────────────────────────────────────────
def get_conn():
    cfg = get_db_config()
    return pymysql.connect(
        host=cfg['host'], user=cfg['user'], password=cfg['passwd'],
        database=cfg['db'], charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
    )


def save_telegram_event(
    text: str, message_id: int, sender: str, is_vote: bool,
    expediente: str, si: int, no: int, abst: int, resultado: str,
) -> int | None:
    try:
        conn = get_conn()
        with conn.cursor() as cur:
            cur.execute(
                f"INSERT IGNORE INTO {DB_PREFIX}asamblea_eventos_telegram "
                "(message_id, sender, texto, es_votacion, expediente, "
                "votos_si, votos_no, votos_abstencion, resultado, noticiado, created_at) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 0, NOW())",
                (message_id, sender, text[:2000], int(is_vote),
                 expediente, si, no, abst, resultado),
            )
            conn.commit()
            return cur.lastrowid or None
    except Exception as e:
        log.error(f'DB save_event error: {e}')
        return None
    finally:
        conn.close()


def update_ia_resumen(event_id: int, ia_resumen: str) -> None:
    """Actualiza ia_resumen de un evento ya guardado (columna añadida en v1.5)."""
    if not event_id or not ia_resumen:
        return
    try:
        conn = get_conn()
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE {DB_PREFIX}asamblea_eventos_telegram "
                "SET ia_resumen=%s WHERE id=%s",
                (ia_resumen[:1000], event_id),
            )
            conn.commit()
    except Exception as e:
        log.warning(f'update_ia_resumen error: {e}')
    finally:
        conn.close()


# ── Claude IA ─────────────────────────────────────────────────────────────────
async def generar_resumen_ia(texto: str) -> str:
    """Genera resumen periodístico 1 oración en español con Claude Haiku."""
    if not ANTHROPIC_API_KEY or len(texto.strip()) < 25:
        return ''
    try:
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
        msg = await client.messages.create(
            model='claude-haiku-4-5',
            max_tokens=100,
            messages=[{
                'role': 'user',
                'content': (
                    'Eres redactor del Monitor Legislativo de Costa Rica. '
                    'Resume en UNA oración (máximo 20 palabras) este mensaje oficial '
                    'del grupo de prensa de la Asamblea Legislativa. '
                    'Responde solo la oración, sin comillas:\n\n'
                    f'{texto[:600]}'
                ),
            }],
        )
        resumen = msg.content[0].text.strip().strip('"').strip("'")
        log.debug(f'IA: {resumen[:90]}')
        return resumen
    except Exception as e:
        log.warning(f'Claude API error: {e}')
        return ''


# ── Parseo de texto ───────────────────────────────────────────────────────────
def parse_vote(text: str) -> tuple:
    si   = int(m.group(1)) if (m := FAVOR_RE.search(text))  else 0
    no   = int(m.group(1)) if (m := CONTRA_RE.search(text)) else 0
    abst = int(m.group(1)) if (m := ABST_RE.search(text))   else 0
    if   re.search(r'aprobad[oa]', text, re.I): resultado = 'APROBADO'
    elif re.search(r'rechazad[oa]', text, re.I): resultado = 'RECHAZADO'
    else:                                         resultado = 'VOTACION'
    exp_m = EXPEDIENTE_RE.search(text)
    return si, no, abst, resultado, (exp_m.group(1) if exp_m else '')


# ── Notificaciones ────────────────────────────────────────────────────────────
def notify_bot(event_id: int, texto: str, expediente: str,
               si: int, no: int, resultado: str) -> None:
    try:
        requests.post(BOT_NOTIFY_URL, json={
            'tipo': 'votacion', 'event_id': event_id,
            'texto': texto[:400], 'expediente': expediente,
            'si': si, 'no': no, 'resultado': resultado,
        }, timeout=5)
    except Exception as e:
        log.warning(f'notify_bot failed: {e}')


def notify_bot_pdf(votacion_id: int, guardados: int,
                   sin_match: list, filename: str) -> None:
    try:
        requests.post(BOT_NOTIFY_URL, json={
            'tipo': 'votos_pdf', 'votacion_id': votacion_id,
            'guardados': guardados, 'sin_match': len(sin_match),
            'archivo': filename,
        }, timeout=5)
    except Exception as e:
        log.warning(f'notify_bot_pdf failed: {e}')


# ── PDF: encontrar votacion_id ────────────────────────────────────────────────
def encontrar_votacion_id(caption: str, filename: str) -> int | None:
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            # 1. Buscar expediente en caption y en filename
            for texto in [caption or '', filename or '']:
                exp_m = EXPEDIENTE_RE.search(texto) or re.search(r'\b(\d{4,5})\b', texto)
                if exp_m:
                    exp = exp_m.group(1)
                    cur.execute(
                        f"SELECT id FROM {DB_PREFIX}asamblea_votaciones "
                        "WHERE expediente=%s ORDER BY created_at DESC LIMIT 1",
                        (exp,),
                    )
                    row = cur.fetchone()
                    if row:
                        log.info(f'PDF → votacion {row["id"]} (expediente {exp})')
                        return row['id']
            # 2. Votación más reciente de las últimas 24h
            cur.execute(
                f"SELECT id, titulo FROM {DB_PREFIX}asamblea_votaciones "
                "WHERE created_at >= NOW() - INTERVAL 24 HOUR "
                "ORDER BY created_at DESC LIMIT 1",
            )
            row = cur.fetchone()
            if row:
                log.info(f'PDF → votacion {row["id"]} "{str(row["titulo"])[:50]}" (más reciente 24h)')
                return row['id']
    except Exception as e:
        log.error(f'encontrar_votacion_id: {e}')
    finally:
        conn.close()
    log.warning('No se encontró votacion para el PDF')
    return None


# ── PDF: descarga y procesamiento ────────────────────────────────────────────
async def procesar_pdf_telegram(client: TelegramClient, msg, filename: str) -> None:
    if not PDF_PARSER_OK:
        log.warning('Parser PDF no disponible, ignorando documento')
        return

    caption = msg.message or ''
    log.info(f'PDF recibido: "{filename}" | caption: "{caption[:80]}"')

    # Descargar bytes
    try:
        buf = io.BytesIO()
        await client.download_media(msg, file=buf)
        pdf_bytes = buf.getvalue()
        log.info(f'PDF descargado: {len(pdf_bytes):,} bytes')
    except Exception as e:
        log.error(f'Error descargando PDF: {e}')
        return

    if len(pdf_bytes) < 1_000:
        log.warning('PDF demasiado pequeño, ignorando')
        return

    votacion_id = encontrar_votacion_id(caption, filename)
    if not votacion_id:
        log.warning(f'Sin votacion_id para PDF "{filename}", votos no guardados')
        return

    try:
        diputados = await asyncio.to_thread(cargar_diputados_db)
        log.info(f'{len(diputados)} diputados cargados para matching')

        votos_raw = await asyncio.to_thread(parse_pdf_bytes, pdf_bytes)
        log.info(f'PDF parseado: {len(votos_raw)} votos extraídos')

        if not votos_raw:
            log.warning('Sin votos en PDF')
            return

        resultado = await asyncio.to_thread(
            procesar_y_guardar, votos_raw, votacion_id, diputados, False
        )
        guardados = resultado['guardados']
        sin_match = resultado['sin_match']
        log.info(f'PDF guardado: {guardados} votos → votacion_id={votacion_id}')
        if sin_match:
            log.warning(f'Sin match: {sin_match[:5]}')

        notify_bot_pdf(votacion_id, guardados, sin_match, filename)

    except Exception as e:
        log.error(f'Error procesando PDF "{filename}": {e}', exc_info=True)


def get_pdf_filename(msg) -> str | None:
    if not msg.media or not isinstance(msg.media, MessageMediaDocument):
        return None
    doc = msg.media.document
    if not doc:
        return None
    if doc.mime_type and 'pdf' in doc.mime_type.lower():
        for attr in (doc.attributes or []):
            if isinstance(attr, DocumentAttributeFilename):
                return attr.file_name
        return 'documento.pdf'
    for attr in (doc.attributes or []):
        if isinstance(attr, DocumentAttributeFilename):
            if attr.file_name.lower().endswith('.pdf'):
                return attr.file_name
    return None


# ── Resolver grupo Telegram ───────────────────────────────────────────────────
async def get_target(client: TelegramClient):
    try:
        entity = await client.get_entity(TELEGRAM_GROUP)
        log.info(f'Grupo: {getattr(entity, "title", TELEGRAM_GROUP)} (id={entity.id})')
        return entity
    except (ChatIdInvalidError, ValueError) as e:
        log.warning(f'get_entity fallido: {e} — buscando en diálogos')
    except Exception as e:
        log.warning(f'get_entity error: {e} — buscando en diálogos')

    try:
        async for dialog in client.iter_dialogs(limit=300):
            if isinstance(TELEGRAM_GROUP, int) and dialog.id == TELEGRAM_GROUP:
                log.info(f'Encontrado por ID en diálogos: {dialog.name}')
                return dialog.entity
            if isinstance(TELEGRAM_GROUP, str) and TELEGRAM_GROUP.lower() in dialog.name.lower():
                log.info(f'Encontrado por nombre en diálogos: {dialog.name}')
                return dialog.entity
    except Exception as e:
        log.error(f'Error iterando diálogos: {e}')
    return None


# ── Main ──────────────────────────────────────────────────────────────────────
async def run_monitor() -> None:
    backoff = 30
    MAX_BACKOFF = 600

    while True:
        client = TelegramClient(TELEGRAM_SESSION, TELEGRAM_API_ID, TELEGRAM_API_HASH)
        try:
            await client.connect()

            if not await client.is_user_authorized():
                log.error('Sesión no autorizada. Ejecutar auth manual.')
                await asyncio.sleep(MAX_BACKOFF)
                continue

            log.info('Conectado a Telegram ✓')
            target = await get_target(client)
            if not target:
                log.error(f'No se pudo resolver el grupo. Reintentando en {backoff}s')
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, MAX_BACKOFF)
                continue

            backoff = 30  # reset tras éxito

            @client.on(events.NewMessage(chats=target))
            async def handler(event):
                msg  = event.message
                text = msg.message or ''

                sender_name = ''
                try:
                    sender = await event.get_sender()
                    sender_name = (
                        getattr(sender, 'username', '')
                        or getattr(sender, 'first_name', '')
                    )
                except Exception:
                    pass

                # ── PDF ──────────────────────────────────────────────────────
                pdf_filename = get_pdf_filename(msg)
                if pdf_filename:
                    asyncio.create_task(
                        procesar_pdf_telegram(client, msg, pdf_filename)
                    )
                    # También guardar el caption si tiene info de votación
                    if text.strip():
                        is_vote = bool(VOTE_RE.search(text))
                        si, no, abst, resultado, expediente = (
                            parse_vote(text) if is_vote else (0, 0, 0, '', '')
                        )
                        save_telegram_event(
                            f'[PDF: {pdf_filename}] {text}'[:2000],
                            msg.id, sender_name, is_vote,
                            expediente, si, no, abst, resultado,
                        )
                    return

                # ── Texto ─────────────────────────────────────────────────────
                if not text.strip():
                    return

                is_vote = bool(VOTE_RE.search(text))
                si, no, abst, resultado, expediente = (
                    parse_vote(text) if is_vote else (0, 0, 0, '', '')
                )

                # Guardar primero (sin esperar IA)
                row_id = save_telegram_event(
                    text, msg.id, sender_name, is_vote,
                    expediente, si, no, abst, resultado,
                )

                if is_vote and row_id:
                    log.info(f'VOTACIÓN: exp={expediente} {si}/{no} {resultado}')
                    notify_bot(row_id, text[:400], expediente, si, no, resultado)
                else:
                    log.debug(f'Mensaje guardado: {text[:60]}')

                # Resumen IA en background — no bloquea el handler
                async def _ia_task(rid=row_id, tx=text):
                    resumen = await generar_resumen_ia(tx)
                    if resumen and rid:
                        update_ia_resumen(rid, resumen)

                asyncio.create_task(_ia_task())

            log.info(f'Escuchando: {getattr(target, "title", str(target))}')
            await client.run_until_disconnected()

        except FloodWaitError as e:
            log.warning(f'FloodWait: esperar {e.seconds}s')
            await asyncio.sleep(e.seconds + 5)
        except (ChatIdInvalidError, ChannelPrivateError) as e:
            log.error(f'Entidad inválida: {e}. Reintentando en {backoff}s')
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, MAX_BACKOFF)
        except (ConnectionError, OSError) as e:
            log.warning(f'Error de red: {e}. Reintentando en {backoff}s')
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, MAX_BACKOFF)
        except KeyboardInterrupt:
            log.info('Detenido manualmente.')
            break
        except Exception as e:
            log.error(f'Error {type(e).__name__}: {e}. Reintentando en {backoff}s')
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, MAX_BACKOFF)
        finally:
            try:
                await client.disconnect()
            except Exception:
                pass


if __name__ == '__main__':
    asyncio.run(run_monitor())
