#!/usr/bin/env python3
"""
Monitor del grupo de prensa de la Asamblea Legislativa en Telegram.
Corre como proceso permanente via pm2.
v2: backoff exponencial, manejo robusto de ChatIdInvalidError, sin crash loops.
"""
import asyncio, re, logging, pymysql, requests, sys
from telethon import TelegramClient, events
from telethon.errors import ChatIdInvalidError, ChannelPrivateError, FloodWaitError
from config_asamblea import (
    TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSION,
    TELEGRAM_GROUP, BOT_NOTIFY_URL, DB_PREFIX, get_db_config
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [telegram] %(message)s',
    handlers=[
        logging.FileHandler('/opt/acontecer-ia/logs/asamblea_telegram.log'),
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)

VOTE_RE       = re.compile(r'(\d+)\s*(?:votos?)?\s*a\s*favor|(\d+)\s*(?:votos?)?\s*en\s*contra|aprobad[oa]|rechazad[oa]|votaci[oó]n', re.IGNORECASE)
EXPEDIENTE_RE = re.compile(r'\b(?:expediente|proyecto|exp\.?)\s*[Nn][oO°]?\s*(\d{4,5})', re.IGNORECASE)
FAVOR_RE      = re.compile(r'(\d+)\s*(?:votos?)?\s*a\s*favor', re.IGNORECASE)
CONTRA_RE     = re.compile(r'(\d+)\s*(?:votos?)?\s*en\s*contra', re.IGNORECASE)
ABST_RE       = re.compile(r'(\d+)\s*(?:votos?)?\s*(?:abstenci[oó]n|se\s*abstuvieron)', re.IGNORECASE)


def get_conn():
    cfg = get_db_config()
    return pymysql.connect(
        host=cfg['host'], user=cfg['user'], password=cfg['passwd'],
        database=cfg['db'], charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )


def save_telegram_event(text, message_id, sender, is_vote,
                        expediente, si, no, abst, resultado):
    try:
        conn = get_conn()
        with conn.cursor() as cur:
            cur.execute(
                f"INSERT IGNORE INTO {DB_PREFIX}asamblea_eventos_telegram "
                "(message_id, sender, texto, es_votacion, expediente, "
                "votos_si, votos_no, votos_abstencion, resultado, noticiado, created_at) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 0, NOW())",
                (message_id, sender, text[:2000], int(is_vote),
                 expediente, si, no, abst, resultado)
            )
            conn.commit()
            return cur.lastrowid
    except Exception as e:
        log.error(f'DB error: {e}')
        return None
    finally:
        conn.close()


def notify_bot(event_id, texto, expediente, si, no, resultado):
    try:
        requests.post(BOT_NOTIFY_URL, json={
            'tipo': 'votacion', 'event_id': event_id, 'texto': texto,
            'expediente': expediente, 'si': si, 'no': no, 'resultado': resultado,
        }, timeout=5)
    except Exception as e:
        log.warning(f'notify failed: {e}')


def parse_vote(text):
    si   = int(m.group(1)) if (m := FAVOR_RE.search(text)) else 0
    no   = int(m.group(1)) if (m := CONTRA_RE.search(text)) else 0
    abst = int(m.group(1)) if (m := ABST_RE.search(text)) else 0
    if   re.search(r'aprobad[oa]', text, re.I):  resultado = 'APROBADO'
    elif re.search(r'rechazad[oa]', text, re.I): resultado = 'RECHAZADO'
    else:                                         resultado = 'VOTACION'
    exp_m = EXPEDIENTE_RE.search(text)
    return si, no, abst, resultado, exp_m.group(1) if exp_m else ''


async def get_target(client):
    """Resuelve el grupo: primero por nombre exacto, luego buscando en diálogos."""
    # Intenta get_entity directo
    for intento in [TELEGRAM_GROUP]:
        try:
            entity = await client.get_entity(intento)
            log.info(f'Grupo resuelto: {getattr(entity, "title", intento)} (id={entity.id})')
            return entity
        except (ChatIdInvalidError, ValueError) as e:
            log.warning(f'get_entity({intento!r}) fallido: {e}')
        except Exception as e:
            log.warning(f'Error {type(e).__name__} resolviendo {intento!r}: {e}')

    # Fallback: buscar en diálogos recientes
    log.info('Buscando grupo en diálogos (puede tardar)...')
    try:
        async for dialog in client.iter_dialogs(limit=300):
            if TELEGRAM_GROUP.lower() in dialog.name.lower():
                log.info(f'Encontrado en diálogos: {dialog.name}')
                return dialog.entity
    except Exception as e:
        log.error(f'Error iterando diálogos: {e}')

    return None


async def run_monitor():
    """Bucle principal con backoff exponencial — nunca crashea sin esperar."""
    backoff = 30
    MAX_BACKOFF = 600

    while True:
        client = TelegramClient(TELEGRAM_SESSION, TELEGRAM_API_ID, TELEGRAM_API_HASH)
        try:
            await client.connect()

            if not await client.is_user_authorized():
                log.error('Sesion de Telegram no autorizada. Ejecutar auth manual.')
                await asyncio.sleep(MAX_BACKOFF)
                continue

            log.info('Conectado a Telegram')

            target = await get_target(client)
            if not target:
                log.error(f'No se pudo resolver el grupo "{TELEGRAM_GROUP}". Reintentando en {backoff}s')
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, MAX_BACKOFF)
                continue

            backoff = 30  # reset tras exito

            @client.on(events.NewMessage(chats=target))
            async def handler(event):
                msg  = event.message
                text = msg.message or ''
                if not text.strip():
                    return
                is_vote = bool(VOTE_RE.search(text))
                si, no, abst, resultado, expediente = (
                    parse_vote(text) if is_vote else (0, 0, 0, '', '')
                )
                sender_name = ''
                try:
                    sender = await event.get_sender()
                    sender_name = (
                        getattr(sender, 'username', '')
                        or getattr(sender, 'first_name', '')
                    )
                except Exception:
                    pass
                row_id = save_telegram_event(
                    text, msg.id, sender_name, is_vote,
                    expediente, si, no, abst, resultado
                )
                if is_vote and row_id:
                    log.info(f'VOTACION exp={expediente} {si}/{no} {resultado}')
                    notify_bot(row_id, text[:400], expediente, si, no, resultado)

            log.info(f'Escuchando: {getattr(target, "title", str(target))}')
            await client.run_until_disconnected()

        except FloodWaitError as e:
            log.warning(f'FloodWait: esperar {e.seconds}s')
            await asyncio.sleep(e.seconds + 5)
        except (ChatIdInvalidError, ChannelPrivateError) as e:
            log.error(f'Entidad invalida: {e}. Reintentando en {backoff}s')
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, MAX_BACKOFF)
        except (ConnectionError, OSError) as e:
            log.warning(f'Red: {e}. Reintentando en {backoff}s')
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, MAX_BACKOFF)
        except KeyboardInterrupt:
            log.info('Detenido manualmente.')
            break
        except Exception as e:
            log.error(f'Error inesperado {type(e).__name__}: {e}. Reintentando en {backoff}s')
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, MAX_BACKOFF)
        finally:
            try:
                await client.disconnect()
            except Exception:
                pass


if __name__ == '__main__':
    asyncio.run(run_monitor())
