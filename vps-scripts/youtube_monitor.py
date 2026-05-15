#!/usr/bin/env python3
"""
Monitor de YouTube de la Asamblea Legislativa.
Detecta cuando hay sesión en vivo, descarga audio con yt-dlp y transcribe con Whisper.
Cron: */5 * * * * /opt/venv/bin/python3 /opt/acontecer-ia/youtube_monitor.py
"""
import subprocess, re, json, os, logging, requests, pymysql
from datetime import datetime
from config_asamblea import (
    YOUTUBE_CHANNEL_URL, YOUTUBE_LIVE_URL, YOUTUBE_CHUNK_MINS,
    AUDIO_TMP, WHISPER_MODEL, BOT_NOTIFY_URL, DB_PREFIX, get_db_config
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [youtube] %(message)s',
    handlers=[logging.FileHandler('/opt/acontecer-ia/logs/asamblea_youtube.log'),
              logging.StreamHandler()]
)
log = logging.getLogger(__name__)

STATE_FILE = '/opt/acontecer-ia/youtube_state.json'

def load_state() -> dict:
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {'last_live_id': None, 'last_chunk_time': 0}

def save_state(state: dict):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f)

def get_conn():
    cfg = get_db_config()
    return pymysql.connect(host=cfg['host'], user=cfg['user'],
                           password=cfg['passwd'], database=cfg['db'],
                           charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)

def check_live() -> tuple[bool, str | None, str | None]:
    """Devuelve (is_live, video_id, title)."""
    try:
        result = subprocess.run(
            ['yt-dlp', '--dump-json', '--no-playlist', YOUTUBE_LIVE_URL],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode != 0:
            return False, None, None
        data = json.loads(result.stdout.strip().split('\n')[0])
        is_live = data.get('is_live') or data.get('live_status') == 'is_live'
        return is_live, data.get('id'), data.get('title', '')
    except Exception as e:
        log.debug(f'check_live: {e}')
        return False, None, None

def get_latest_videos(n: int = 5) -> list[dict]:
    """Obtiene los últimos N videos del canal (sin API key)."""
    try:
        result = subprocess.run(
            ['yt-dlp', '--dump-json', '--flat-playlist',
             '--playlist-items', f'1:{n}', YOUTUBE_CHANNEL_URL],
            capture_output=True, text=True, timeout=60
        )
        videos = []
        for line in result.stdout.strip().split('\n'):
            if line:
                try:
                    videos.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
        return videos
    except Exception as e:
        log.warning(f'get_latest_videos: {e}')
        return []

def download_audio_chunk(url: str, minutes: int = 3) -> str | None:
    """Descarga un fragmento de audio del stream en vivo."""
    out = AUDIO_TMP
    try:
        subprocess.run([
            'yt-dlp',
            '-x', '--audio-format', 'wav',
            '--audio-quality', '0',
            '--postprocessor-args', f'ffmpeg:-t {minutes * 60} -ar 16000 -ac 1',
            '-o', out,
            '--no-playlist',
            '--force-overwrites',
            url,
        ], timeout=minutes * 60 + 60, check=True, capture_output=True)
        return out if os.path.exists(out) else None
    except subprocess.CalledProcessError as e:
        log.error(f'yt-dlp error: {e.stderr.decode()[:200]}')
        return None

def transcribe(audio_path: str) -> str:
    """Transcribe con Whisper desde el venv existente."""
    try:
        import whisper
        model = whisper.load_model(WHISPER_MODEL)
        result = model.transcribe(audio_path, language='es', fp16=False)
        return result['text']
    except ImportError:
        pass
    # fallback: whisper CLI
    try:
        result = subprocess.run(
            ['/opt/venv/bin/whisper', audio_path,
             '--model', WHISPER_MODEL, '--language', 'es',
             '--output_format', 'txt', '--output_dir', '/tmp'],
            capture_output=True, text=True, timeout=300
        )
        txt_path = audio_path.replace('.wav', '.txt').replace('/tmp/asamblea_chunk', '/tmp/asamblea_chunk')
        if os.path.exists(txt_path):
            with open(txt_path) as f:
                return f.read()
        return result.stdout
    except Exception as e:
        log.error(f'whisper error: {e}')
        return ''

# Patrones para detectar votaciones en transcripción
VOTE_RE = re.compile(
    r'(\d+)\s*(?:votos?)?\s*a\s*favor|'
    r'(\d+)\s*(?:votos?)?\s*en\s*contra|'
    r'aprobad[oa]|rechazad[oa]|votaci[oó]n\s+(?:del\s+)?(?:expediente|proyecto)',
    re.IGNORECASE
)
FAVOR_RE = re.compile(r'(\d+)\s*(?:votos?)?\s*a\s*favor', re.IGNORECASE)
CONTRA_RE = re.compile(r'(\d+)\s*(?:votos?)?\s*en\s*contra', re.IGNORECASE)
EXP_RE    = re.compile(r'\b(\d{4,5})\b')

def parse_events(text: str) -> list[dict]:
    events = []
    # Dividir por oraciones para capturar contexto
    sentences = re.split(r'[.!?\n]', text)
    for sent in sentences:
        if VOTE_RE.search(sent):
            si_m  = FAVOR_RE.search(sent)
            no_m  = CONTRA_RE.search(sent)
            exp_m = EXP_RE.search(sent)
            if re.search(r'aprobad[oa]', sent, re.I):
                resultado = 'APROBADO'
            elif re.search(r'rechazad[oa]', sent, re.I):
                resultado = 'RECHAZADO'
            else:
                resultado = 'VOTACION'
            events.append({
                'texto': sent.strip()[:300],
                'expediente': exp_m.group(1) if exp_m else '',
                'si':  int(si_m.group(1)) if si_m else 0,
                'no':  int(no_m.group(1)) if no_m else 0,
                'resultado': resultado,
            })
    return events

def save_and_notify(events: list[dict], video_id: str, video_title: str):
    if not events:
        return
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            for ev in events:
                cur.execute(f"""
                    INSERT INTO {DB_PREFIX}asamblea_votaciones
                      (titulo, expediente, fecha, votos_si, votos_no,
                       resultado, fuente, noticiada, created_at)
                    VALUES (%s, %s, NOW(), %s, %s, %s, %s, 0, NOW())
                """, (
                    (video_title + ' — ' + ev['texto'])[:500],
                    ev['expediente'], ev['si'], ev['no'],
                    ev['resultado'], f'youtube:{video_id}'
                ))
                row_id = cur.lastrowid
                if row_id:
                    try:
                        requests.post(BOT_NOTIFY_URL, json={
                            'tipo': 'votacion_youtube',
                            'event_id': row_id,
                            'titulo': ev['texto'],
                            'expediente': ev['expediente'],
                            'si': ev['si'], 'no': ev['no'],
                            'resultado': ev['resultado'],
                            'video_url': f'https://youtube.com/watch?v={video_id}',
                        }, timeout=5)
                    except Exception:
                        pass
        conn.commit()
        log.info(f'{len(events)} eventos de votación guardados desde YouTube')
    finally:
        conn.close()

def save_video_record(video_id: str, title: str, is_live: bool):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(f"""
                INSERT IGNORE INTO {DB_PREFIX}asamblea_sesiones_youtube
                  (youtube_id, titulo, tipo, fecha, url, created_at)
                VALUES (%s, %s, %s, NOW(), %s, NOW())
            """, (video_id, title, 'live' if is_live else 'recorded',
                  f'https://youtube.com/watch?v={video_id}'))
        conn.commit()
    finally:
        conn.close()

def main():
    import time as _time
    state = load_state()
    is_live, video_id, title = check_live()

    if not is_live:
        log.debug('No hay sesión en vivo')
        # Registrar últimos videos nuevos
        for v in get_latest_videos(3):
            vid = v.get('id') or v.get('url', '').split('=')[-1]
            if vid:
                save_video_record(vid, v.get('title', ''), False)
        return

    log.info(f'LIVE detectado: {title} (id={video_id})')
    save_video_record(video_id, title, True)

    # Solo transcribir si han pasado los minutos de chunk desde la última vez
    now = _time.time()
    if now - state.get('last_chunk_time', 0) < YOUTUBE_CHUNK_MINS * 60:
        log.debug('Esperando próximo ciclo de transcripción')
        return

    live_url = f'https://youtube.com/watch?v={video_id}'
    audio = download_audio_chunk(live_url, YOUTUBE_CHUNK_MINS)
    if not audio:
        return

    log.info(f'Transcribiendo {YOUTUBE_CHUNK_MINS} min de audio con Whisper {WHISPER_MODEL}...')
    text = transcribe(audio)
    if text:
        log.info(f'Transcripción ({len(text)} chars): {text[:200]}')
        events = parse_events(text)
        if events:
            save_and_notify(events, video_id, title)

    state['last_live_id']    = video_id
    state['last_chunk_time'] = now
    save_state(state)

    # Limpiar audio temporal
    try:
        os.remove(audio)
    except Exception:
        pass

if __name__ == '__main__':
    os.makedirs('/opt/acontecer-ia/logs', exist_ok=True)
    main()
