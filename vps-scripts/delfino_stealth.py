#!/usr/bin/env python3
"""
delfino_stealth.py — Motor de scraping anti-detección para Delfino.cr
======================================================================
USO: Solo como fuente de RESPALDO, nunca primaria.
     Nunca intenta acceder a áreas de login ni bypass de paywall.

Técnicas implementadas:
  - Perfiles multi-dispositivo Costa Rica (iPhone, Samsung, iPad, Desktop, Android viejo)
  - Referrers contextuales: WhatsApp, Facebook, Threads, búsqueda interna, Google orgánico
  - Horarios "ticos": picos 7am/12pm/6pm, días de silencio aleatorios, visitas nocturnas esporádicas
  - Navegación "dumb": visitas sin extracción que limpian el perfil del bot
  - Sesiones largas (5+ notas) vs cortas (1 y desaparecer 3 días)
  - Cookie persistence: sesión de usuario recurrente, no bot de primera visita
  - Puntos de entrada variables: /politica, /economia, búsqueda, artículo directo
  - Delays de lectura humana proporcionales al largo del contenido
  - Playwright stealth cuando está disponible (hover, scroll, mouse move)
  - Headers de ISPs ticos: Telecable WiFi, Kolbi 4G, Movistar, Claro
"""

import random, time, re, logging, json, hashlib
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
log = logging.getLogger(__name__)

BASE = 'https://delfino.cr'
TZ_CR = ZoneInfo('America/Costa_Rica')

# ── Archivo de estado persistente ────────────────────────────────────────────
STATE_FILE = Path('/opt/acontecer-ia/delfino_state.json')


def _load_state() -> dict:
    try:
        return json.loads(STATE_FILE.read_text())
    except Exception:
        return {}


def _save_state(state: dict):
    try:
        STATE_FILE.write_text(json.dumps(state, default=str))
    except Exception:
        pass


# ── Perfiles de dispositivo (Costa Rica) ─────────────────────────────────────
_DEVICES = [
    # iPhone 15 Pro — Telecable WiFi San José
    {
        'name': 'iphone15_telecable',
        'ua': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
        'platform': 'iPhone',
        'mobile': True,
        'viewport': '390x844',
        'connection': 'wifi',
        'downlink': '50',
        'rtt': '20',
        'ect': '4g',
        'lang': 'es-CR,es;q=0.9,en-US;q=0.7,en;q=0.5',
        'sec_ch_ua': None,  # Safari no envía sec-ch-ua
        'sec_platform': '"iPhone"',
    },
    # iPhone 14 — Kolbi 5G
    {
        'name': 'iphone14_kolbi',
        'ua': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'platform': 'iPhone',
        'mobile': True,
        'viewport': '390x844',
        'connection': 'cellular',
        'downlink': '20',
        'rtt': '50',
        'ect': '4g',
        'lang': 'es-CR,es;q=0.9',
        'sec_ch_ua': None,
        'sec_platform': '"iPhone"',
    },
    # Samsung Galaxy S23 — Claro 4G
    {
        'name': 'samsung_s23_claro',
        'ua': 'Mozilla/5.0 (Linux; Android 13; SM-S916B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        'platform': 'Android',
        'mobile': True,
        'viewport': '360x780',
        'connection': 'cellular',
        'downlink': '8',
        'rtt': '80',
        'ect': '4g',
        'lang': 'es-CR,es;q=0.9,en;q=0.7',
        'sec_ch_ua': '"Google Chrome";v="124", "Chromium";v="124", "Not-A.Brand";v="99"',
        'sec_platform': '"Android"',
    },
    # Samsung Galaxy A-series viejo — Movistar 4G lento
    {
        'name': 'samsung_a32_movistar',
        'ua': 'Mozilla/5.0 (Linux; Android 11; SM-A325M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
        'platform': 'Android',
        'mobile': True,
        'viewport': '360x800',
        'connection': 'cellular',
        'downlink': '2.5',
        'rtt': '200',
        'ect': '3g',  # A veces 3G en zonas rurales CR
        'lang': 'es-CR,es;q=0.9',
        'sec_ch_ua': '"Chromium";v="112", "Google Chrome";v="112", "Not-A.Brand";v="24"',
        'sec_platform': '"Android"',
    },
    # iPad Air — WiFi Telecable oficina
    {
        'name': 'ipad_telecable',
        'ua': 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'platform': 'iPad',
        'mobile': False,
        'viewport': '820x1180',
        'connection': 'wifi',
        'downlink': '100',
        'rtt': '10',
        'ect': '4g',
        'lang': 'es-CR,es;q=0.9,en;q=0.7',
        'sec_ch_ua': None,
        'sec_platform': '"iPad"',
    },
    # Desktop Chrome — Fibra Kolbi casa
    {
        'name': 'desktop_chrome_kolbi',
        'ua': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        'platform': 'Windows',
        'mobile': False,
        'viewport': '1440x900',
        'connection': 'wifi',
        'downlink': '100',
        'rtt': '5',
        'ect': '4g',
        'lang': 'es-CR,es;q=0.9,en-US;q=0.7,en;q=0.5',
        'sec_ch_ua': '"Google Chrome";v="135", "Chromium";v="135", "Not-A.Brand";v="99"',
        'sec_platform': '"Windows"',
    },
    # Desktop MacBook Safari — WiFi coworking San Pedro
    {
        'name': 'macbook_safari',
        'ua': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
        'platform': 'macOS',
        'mobile': False,
        'viewport': '1512x982',
        'connection': 'wifi',
        'downlink': '50',
        'rtt': '15',
        'ect': '4g',
        'lang': 'es-CR,es;q=0.9,en-US;q=0.7',
        'sec_ch_ua': None,
        'sec_platform': '"macOS"',
    },
]

# ── Referrers contextuales ────────────────────────────────────────────────────
_REFERRERS = {
    'google_organico': [
        'https://www.google.co.cr/search?q={query}+costa+rica&hl=es-CR',
        'https://www.google.com/search?q={query}+asamblea+legislativa&gl=CR&hl=es-419',
        'https://www.google.co.cr/search?q=noticias+costa+rica+hoy&safe=active',
        'https://www.google.com/search?q=delfino+cr+{query}',
    ],
    'whatsapp': [
        '',          # WhatsApp no envía Referer (direct/blank)
        'android-app://com.whatsapp/',
    ],
    'facebook': [
        'https://www.facebook.com/',
        'https://l.facebook.com/l.php?u=https%3A%2F%2Fdelfino.cr',
        'https://m.facebook.com/',
    ],
    'threads': [
        'https://www.threads.net/',
        'https://l.threads.net/',
    ],
    'interno': [
        f'{BASE}/',
        f'{BASE}/politica',
        f'{BASE}/economia',
        f'{BASE}/sociedad',
        f'{BASE}/?s={{query}}',  # búsqueda interna con lupa
    ],
    'twitter': [
        'https://t.co/',
        'https://twitter.com/',
        'https://x.com/',
    ],
    'directo': [''],  # Sin referrer (acceso directo, URL copiada)
}

# Pesos de probabilidad para cada tipo de referrer
_REFERER_WEIGHTS = {
    'google_organico': 35,
    'whatsapp': 25,
    'facebook': 15,
    'directo': 10,
    'interno': 8,
    'threads': 4,
    'twitter': 3,
}

# ── Puntos de entrada ─────────────────────────────────────────────────────────
_ENTRY_POINTS = [
    ('/', 20),
    ('/politica', 25),
    ('/economia', 15),
    ('/sociedad', 12),
    ('/judicial', 8),
    ('/asamblea', 10),
    ('/opinion', 5),
    ('/ciencia', 3),
    ('/mundo', 2),
]

# ── Sesiones de navegación ────────────────────────────────────────────────────
class DelfinoSession:
    """
    Sesión persistente con identidad fija para toda la sesión.
    Simula un usuario recurrente con cookies guardadas.
    """

    def __init__(self):
        self.session = requests.Session()
        self._device = random.choice(_DEVICES)
        self._load_cookies()
        self._pages_read = 0
        self._session_start = time.time()
        log.debug(f'[delfino] Sesión con dispositivo: {self._device["name"]}')

    def _load_cookies(self):
        """Cargar cookies de sesión anterior si existen."""
        state = _load_state()
        cookies = state.get('cookies', {})
        if cookies:
            for name, val in cookies.items():
                self.session.cookies.set(name, val, domain='delfino.cr')

    def _save_cookies(self):
        """Guardar cookies para próxima sesión."""
        state = _load_state()
        state['cookies'] = {c.name: c.value for c in self.session.cookies
                            if 'delfino' in (c.domain or '')}
        state['last_device'] = self._device['name']
        state['last_visit'] = datetime.now(TZ_CR).isoformat()
        _save_state(state)

    def _build_headers(self, url: str, referer: str = '') -> dict:
        d = self._device
        h = {
            'User-Agent': d['ua'],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': d['lang'],
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': random.choice(['max-age=0', 'no-cache', '']),
            'Upgrade-Insecure-Requests': '1',
        }
        if referer:
            h['Referer'] = referer
        if d['sec_ch_ua']:
            h['sec-ch-ua'] = d['sec_ch_ua']
            h['sec-ch-ua-mobile'] = '?1' if d['mobile'] else '?0'
            h['sec-ch-ua-platform'] = d['sec_platform']
            h['Sec-Fetch-Dest'] = 'document'
            h['Sec-Fetch-Mode'] = 'navigate'
            h['Sec-Fetch-Site'] = 'cross-site' if referer and 'delfino' not in referer else 'same-origin'
            h['Sec-Fetch-User'] = '?1'
        # Network information API headers (imitan Chrome en móvil)
        if d['mobile'] and random.random() < 0.6:
            h['downlink'] = d['downlink']
            h['rtt'] = d['rtt']
            h['ect'] = d['ect']
        if d['viewport'] and random.random() < 0.4:
            w, ht = d['viewport'].split('x')
            h['Viewport-Width'] = w
        return h

    def _pick_referer(self, query: str = 'politica costa rica') -> str:
        tipos = list(_REFERER_WEIGHTS.keys())
        pesos = list(_REFERER_WEIGHTS.values())
        tipo = random.choices(tipos, weights=pesos, k=1)[0]
        plantilla = random.choice(_REFERRERS[tipo])
        return plantilla.format(query=query.replace(' ', '+'))

    def _reading_delay(self, content_len: int = 500):
        """
        Delay proporcional al largo del contenido.
        200 palabras ≈ 1 min de lectura para adulto promedio.
        Añade micro-pausas que simulan desplazamiento.
        """
        words = content_len / 5  # aprox palabras
        base_read_secs = (words / 200) * 60  # tiempo real de lectura
        # Usuarios no leen todo — leen 40-80% del contenido
        fraction = random.uniform(0.4, 0.85)
        read_time = base_read_secs * fraction
        # Cap: max 4 minutos en la misma página
        read_time = min(read_time, 240)
        # Micro-pausas de scroll (de 3 a 8 pausas durante la lectura)
        n_pauses = random.randint(3, 8)
        pause_interval = read_time / n_pauses
        for _ in range(n_pauses):
            actual = pause_interval * random.uniform(0.6, 1.4)
            time.sleep(max(0.5, actual))

    def get(self, path: str, referer: str = '', timeout: int = 20) -> requests.Response | None:
        """GET con todos los headers y delays configurados."""
        url = path if path.startswith('http') else BASE + path
        headers = self._build_headers(url, referer)
        try:
            # Pequeño delay previo (simula tiempo entre clicks)
            time.sleep(random.uniform(1.2, 4.5))
            r = self.session.get(url, headers=headers, timeout=timeout,
                                  allow_redirects=True)
            self._pages_read += 1
            self._save_cookies()
            return r
        except Exception as e:
            log.warning(f'[delfino] GET {url}: {e}')
            return None

    def dumb_visit(self, path: str, referer: str = ''):
        """
        Visita una página sin extraer nada.
        Simula usuario que entró, hizo scroll a la mitad y se fue.
        'Limpia' el perfil del bot ante sistemas de detección.
        """
        r = self.get(path, referer)
        if r and r.status_code == 200:
            content_len = len(r.text)
            # Solo leer 30-60% del tiempo de una visita real
            partial_time = random.uniform(4, 18)
            time.sleep(partial_time)
            log.debug(f'[delfino] dumb_visit {path} ({partial_time:.1f}s)')

    def hover_simulation(self):
        """
        Simula hover sobre elementos de navegación.
        Con requests puro: hace GET a un recurso secundario pequeño
        (imita request que dispara un mouseover/tracker).
        Con Playwright: movimiento real de mouse.
        """
        # Recursos que se cargan al hacer hover (tracking pixels, prefetch)
        hover_targets = [
            '/wp-content/themes/delfino/img/logo.svg',
            '/sitemap.xml',
            '/feed/',
        ]
        target = random.choice(hover_targets)
        # Delay corto, como si el mouse pasó por encima brevemente
        time.sleep(random.uniform(0.3, 1.2))
        self.get(target, referer=BASE + '/')
        time.sleep(random.uniform(0.2, 0.8))


# ── Horarios ticos ────────────────────────────────────────────────────────────
def should_scrape_now() -> tuple[bool, str]:
    """
    Decide si el bot debe correr ahora según horario costarricense.
    Retorna (debe_correr, razon).
    """
    state = _load_state()
    now_cr = datetime.now(TZ_CR)
    today_str = now_cr.strftime('%Y-%m-%d')

    # ¿Día de silencio? (el bot no entra en todo el día)
    if state.get('silent_day') == today_str:
        return False, f'día de silencio ({today_str})'

    # Definir nuevo día de silencio aleatorio (10% probabilidad al inicio del día)
    last_check = state.get('last_day_check', '')
    if last_check != today_str:
        state['last_day_check'] = today_str
        if random.random() < 0.10:  # 10% chance de no entrar hoy
            state['silent_day'] = today_str
            _save_state(state)
            return False, 'elegido como día de silencio'
        _save_state(state)

    hour = now_cr.hour
    minute = now_cr.minute

    # Visita nocturna esporádica 10pm-12am (5% chance)
    if 22 <= hour <= 23:
        if random.random() < 0.05:
            return True, f'visita nocturna esporádica {hour}:{minute:02d}'
        return False, f'hora nocturna {hour}:{minute:02d} — inactivo'

    # Silencio nocturno: 12am - 5:45am
    if hour < 6:
        return False, 'madrugada — inactivo'

    # Revisar si ya corrió muy recientemente
    last_run = state.get('last_run_ts', 0)
    mins_since = (time.time() - last_run) / 60

    # ── Horas pico (lectura fuerte) ──
    # 6:00-7:30am (reporte matutino)
    if 6 <= hour <= 7 and minute <= 30:
        return True, 'hora pico matutina (reporte matutino)'

    # 11:30am-1:00pm (almuerzo)
    if hour == 11 and minute >= 30:
        return True, 'hora pico mediodía'
    if hour == 12:
        return True, 'hora pico mediodía'

    # 5:30pm-7:00pm (salida del trabajo)
    if hour == 17 and minute >= 30:
        return True, 'hora pico vespertina'
    if hour == 18:
        return True, 'hora pico vespertina'

    # ── Horas normales: intervalo aleatorio 45-90 min ──
    min_interval = random.uniform(45, 90)
    if mins_since >= min_interval:
        return True, f'chequeo regular ({mins_since:.0f} min desde último)'

    return False, f'muy reciente ({mins_since:.0f} min, mín={min_interval:.0f})'


def mark_run():
    state = _load_state()
    state['last_run_ts'] = time.time()
    _save_state(state)


# ── Sesión larga vs corta ─────────────────────────────────────────────────────
def decide_session_length() -> int:
    """
    Retorna cuántas páginas de Delfino leer en esta sesión.
    - 40%: sesión corta (1-2 páginas) — y no volver en 1-3 días
    - 45%: sesión normal (3-4 páginas)
    - 15%: sesión larga (5-7 páginas) — suscriptor fiel
    """
    r = random.random()
    if r < 0.40:
        # Sesión corta — programar silencio de 1-3 días
        state = _load_state()
        dias_silencio = random.randint(1, 3)
        fecha_regreso = (datetime.now(TZ_CR) + timedelta(days=dias_silencio)).strftime('%Y-%m-%d')
        state['silent_until'] = fecha_regreso
        _save_state(state)
        log.debug(f'[delfino] Sesión corta — silencio hasta {fecha_regreso}')
        return random.randint(1, 2)
    elif r < 0.85:
        return random.randint(3, 4)
    else:
        return random.randint(5, 7)


def is_in_silence_period() -> bool:
    """Verificar si estamos en período de silencio (post sesión corta)."""
    state = _load_state()
    silent_until = state.get('silent_until', '')
    if not silent_until:
        return False
    today = datetime.now(TZ_CR).strftime('%Y-%m-%d')
    if today <= silent_until:
        log.debug(f'[delfino] En período de silencio hasta {silent_until}')
        return True
    # Limpiar si ya pasó
    del state['silent_until']
    _save_state(state)
    return False


# ── Extracción de contenido ───────────────────────────────────────────────────
def extract_article(html: str, url: str) -> dict | None:
    """
    Extrae SOLO lo visible públicamente:
    título, sumario/excerpt, primeros párrafos.
    NUNCA intenta desbloquear contenido de pago.
    """
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, 'html.parser')

        # Título
        title = ''
        for sel in ['h1.entry-title', 'h1', 'meta[property="og:title"]']:
            el = soup.select_one(sel)
            if el:
                title = el.get('content', '') or el.get_text(strip=True)
                break

        # Excerpt / descripción
        excerpt = ''
        for sel in ['meta[name="description"]', 'meta[property="og:description"]',
                    '.entry-summary', '.excerpt', 'p:first-of-type']:
            el = soup.select_one(sel)
            if el:
                excerpt = el.get('content', '') or el.get_text(strip=True)
                if len(excerpt) > 30:
                    break

        # Primeros párrafos visibles (no paywall)
        paragraphs = []
        for p in soup.select('article p, .entry-content p, .post-content p'):
            txt = p.get_text(strip=True)
            # Parar si encontramos señales de paywall
            if any(x in txt.lower() for x in ['suscri', 'registr', 'iniciar sesión', 'login']):
                break
            if len(txt) > 50:
                paragraphs.append(txt)
            if len(paragraphs) >= 3:
                break

        # Fecha
        fecha = ''
        for sel in ['time[datetime]', 'meta[property="article:published_time"]',
                    '.post-date', '.entry-date']:
            el = soup.select_one(sel)
            if el:
                fecha = el.get('datetime', '') or el.get('content', '') or el.get_text(strip=True)
                if fecha:
                    break

        # Imagen
        img = ''
        og_img = soup.select_one('meta[property="og:image"]')
        if og_img:
            img = og_img.get('content', '')

        if not title:
            return None

        return {
            'titulo':     title[:300],
            'excerpt':    excerpt[:500],
            'parrafos':   paragraphs,
            'fecha':      fecha[:50],
            'url':        url,
            'imagen':     img,
            'fuente':     'delfino',
        }
    except Exception as e:
        log.warning(f'[delfino] extract_article error: {e}')
        return None


# ── Función principal pública ─────────────────────────────────────────────────
def scrape_section(path: str = '/asamblea', max_articles: int = 5) -> list[dict]:
    """
    Scrape una sección de Delfino con comportamiento anti-detección completo.
    Retorna lista de artículos extraídos (puede ser [] si el bot decidió no correr).
    """
    # 1. ¿Debe correr ahora?
    if is_in_silence_period():
        return []

    should, reason = should_scrape_now()
    if not should:
        log.debug(f'[delfino] No corriendo: {reason}')
        return []

    log.info(f'[delfino] Iniciando sesión — {reason}')
    mark_run()

    session_len = decide_session_length()
    log.debug(f'[delfino] Sesión de {session_len} páginas')

    sess = DelfinoSession()

    # 2. Punto de entrada variable (no siempre la home)
    entry_paths = [p for p, _ in _ENTRY_POINTS]
    entry_weights = [w for _, w in _ENTRY_POINTS]
    entry = random.choices(entry_paths, weights=entry_weights, k=1)[0]

    # 3. Visita de calentamiento (dumb) con probabilidad 30%
    if random.random() < 0.30:
        warmup_ref = sess._pick_referer()
        sess.dumb_visit(entry, warmup_ref)
        # Hover aleatorio sobre elemento de navegación
        if random.random() < 0.40:
            sess.hover_simulation()

    # 4. Ir a la sección objetivo
    referer = sess._pick_referer(path.strip('/'))
    r = sess.get(path, referer)
    if not r or r.status_code != 200:
        log.warning(f'[delfino] Sección {path} no disponible: {r.status_code if r else "sin respuesta"}')
        return []

    # 5. Extraer links de artículos de la sección
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(r.text, 'html.parser')
    links = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('/') and href.count('/') >= 2 and not any(
            x in href for x in ['#', '?', 'tag', 'categoria', 'autor', 'page', 'feed']
        ):
            full = BASE + href
            if full not in links:
                links.append(full)
        elif href.startswith(BASE) and href.count('/') >= 4:
            if href not in links:
                links.append(href)

    if not links:
        return []

    # Mezclar para no siempre ir en orden
    random.shuffle(links)

    # 6. Leer artículos
    results = []
    dumb_quota = random.randint(1, max(1, session_len // 3))  # visitas dumb intercaladas

    for i, article_url in enumerate(links[:session_len + dumb_quota]):
        if len(results) >= max_articles:
            break

        # ¿Visita dumb intercalada?
        if i < dumb_quota and random.random() < 0.4:
            sess.dumb_visit(article_url, referer=BASE + path)
            # Hover esporádico
            if random.random() < 0.25:
                sess.hover_simulation()
            continue

        # Visita real
        art_referer = BASE + path if i == 0 else links[i - 1]
        r2 = sess.get(article_url, referer=art_referer)
        if not r2 or r2.status_code != 200:
            continue

        article = extract_article(r2.text, article_url)
        if article:
            # Simular lectura proporcional al contenido
            sess._reading_delay(len(r2.text))
            results.append(article)
            log.debug(f'[delfino] Artículo: {article["titulo"][:60]}')
        else:
            # No había contenido útil — visita dumb de facto
            time.sleep(random.uniform(5, 15))

        # Pausa entre artículos (simula pensar, abrir otra pestaña, etc.)
        inter_pause = random.expovariate(1 / 8)  # media 8s, distribución exponencial
        time.sleep(max(2, min(45, inter_pause)))

    log.info(f'[delfino] Sesión completada: {len(results)} artículos reales, {dumb_quota} visitas dumb')
    return results


def scrape_diputados_delfino(max_partidos: int = 20) -> list[dict]:
    """
    Versión stealth del scraper de diputados desde Delfino.
    Reemplaza la función _scrape_diputados_delfino() en scraper_asamblea.py
    """
    should, reason = should_scrape_now()
    if not should and not _load_state().get('force_diputados'):
        log.debug(f'[delfino] scrape_diputados omitido: {reason}')
        return []

    sess = DelfinoSession()
    base_url = 'https://delfino.cr'

    # Entrar desde punto de entrada variable
    entry = random.choice(['/asamblea', '/', '/politica'])
    ref = sess._pick_referer('diputados asamblea')
    r = sess.get(entry, ref)
    if not r:
        return []

    if random.random() < 0.2:
        sess.hover_simulation()

    time.sleep(random.uniform(2, 6))

    # Ir a la sección de asamblea
    r2 = sess.get('/asamblea', referer=base_url + entry)
    if not r2 or r2.status_code != 200:
        return []

    from bs4 import BeautifulSoup
    soup = BeautifulSoup(r2.text, 'html.parser')
    partido_links = list(dict.fromkeys(
        a['href'] for a in soup.find_all('a', href=True)
        if '/asamblea/partidos/' in a['href']
    ))
    log.info(f'[delfino] {len(partido_links)} partidos encontrados')

    _ROLES = re.compile(r'fracción|fraccion|jefe|jefa|subjef|coordinad|presidente|secretari', re.I)

    diputados = []
    for href in partido_links[:max_partidos]:
        url = base_url + href if href.startswith('/') else href
        rp = sess.get(url, referer=base_url + '/asamblea')
        if not rp or rp.status_code != 200:
            continue

        sp = BeautifulSoup(rp.text, 'html.parser')
        h1s = sp.find_all('h1')
        partido_nombre = ''
        for h in h1s:
            txt = h.get_text(strip=True)
            if txt.lower() != 'asamblea' and txt:
                partido_nombre = txt
                break

        for h3 in sp.find_all('h3'):
            nombre = h3.get_text(strip=True)
            if not nombre or len(nombre) < 5:
                continue
            provincia = ''
            for sib in h3.find_next_siblings():
                txt = sib.get_text(strip=True).split('\n')[0].strip()
                if txt and not _ROLES.search(txt):
                    provincia = txt
                    break
            diputados.append({
                'nombre': nombre,
                'partido': partido_nombre,
                'provincia': provincia,
                'email': '',
            })

        # Pausa inter-partido variable
        time.sleep(random.uniform(6, 18))

    log.info(f'[delfino] {len(diputados)} diputados scrapeados')
    return diputados


# ── Playwright stealth (si disponible) ───────────────────────────────────────
def scrape_with_playwright(url: str) -> str | None:
    """
    Renderizado con Playwright + stealth para páginas con protección avanzada.
    Incluye movimientos de mouse reales y scroll humano.
    Solo se activa si playwright está instalado.
    """
    try:
        from playwright.sync_api import sync_playwright
        import playwright_stealth  # pip install playwright-stealth
    except ImportError:
        return None

    device = random.choice(_DEVICES)
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            ctx = browser.new_context(
                user_agent=device['ua'],
                locale='es-CR',
                timezone_id='America/Costa_Rica',
                viewport={'width': int(device['viewport'].split('x')[0]),
                          'height': int(device['viewport'].split('x')[1])},
                extra_http_headers={
                    'Accept-Language': device['lang'],
                    'downlink': device['downlink'],
                },
            )
            # Inyectar script stealth
            try:
                from playwright_stealth import stealth_sync
                page = ctx.new_page()
                stealth_sync(page)
            except Exception:
                page = ctx.new_page()

            page.goto(url, wait_until='domcontentloaded', timeout=25000)

            # Scroll humano — 3 a 6 pasos descendentes
            steps = random.randint(3, 6)
            for _ in range(steps):
                page.mouse.wheel(0, random.randint(200, 500))
                time.sleep(random.uniform(0.8, 2.5))

            # Hover sobre un elemento aleatorio de navegación
            nav_items = page.query_selector_all('nav a, .menu-item a')
            if nav_items:
                item = random.choice(nav_items[:min(len(nav_items), 8)])
                try:
                    item.hover()
                    time.sleep(random.uniform(0.3, 1.0))
                except Exception:
                    pass

            html = page.content()
            browser.close()
            return html
    except Exception as e:
        log.warning(f'[delfino] playwright error: {e}')
        return None


# ── CLI de prueba ─────────────────────────────────────────────────────────────
if __name__ == '__main__':
    import sys
    logging.basicConfig(level=logging.DEBUG,
                        format='%(asctime)s %(levelname)s %(message)s')
    section = sys.argv[1] if len(sys.argv) > 1 else '/asamblea'
    articles = scrape_section(section, max_articles=3)
    print(f'\n{len(articles)} artículos:')
    for a in articles:
        print(f'  [{a["fecha"][:10]}] {a["titulo"]}')
        print(f'           {a["excerpt"][:80]}...')
