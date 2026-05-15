#!/usr/bin/env python3
"""
Scraper Monitor Legislativo — Asamblea CR
Fuentes primarias: asamblea.go.cr (HTML / CSV / open data oficiales)
Respaldo silencioso:  delfino.cr  (solo cuando la fuente oficial falla)

Cron recomendado:
  0 6 * * 1   python3 scraper_asamblea.py --target diputados
  0 7 * * *   python3 scraper_asamblea.py --target agenda
  */10 8-22 * * 1-4  python3 scraper_asamblea.py --target votaciones
  0 8 1 * *   python3 scraper_asamblea.py --target salarios
  0 9 * * 1   python3 scraper_asamblea.py --target gasolina
  0 10 * * 1  python3 scraper_asamblea.py --target asistencia
"""
import sys, re, time, random, logging, argparse, io, json, os
import requests, pymysql
from datetime import datetime, date
from bs4 import BeautifulSoup
from config_asamblea import get_db_config, DB_PREFIX, DELFINO_BASE

# ── Logging ───────────────────────────────────────────────────────────────────
os.makedirs('/opt/acontecer-ia/logs', exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [scraper] %(levelname)s %(message)s',
    handlers=[
        logging.FileHandler('/opt/acontecer-ia/logs/asamblea_scraper.log'),
        logging.StreamHandler(),
    ]
)
log = logging.getLogger(__name__)

# ── SharePoint REST API ───────────────────────────────────────────────────────
SHAREPOINT_API = 'https://www.asamblea.go.cr/glcp/_api/web/lists'

# List GUIDs descubiertos vía /glcp/_api/web/lists
SP_LISTS = {
    # Resoluciones y primeros debates de plenario (521 items, más recientes ~2024)
    'proyectos_primero': '4289d658-cd0b-4803-b2fd-57a573ed8d0c',
    # Votaciones del plenario — biblioteca de documentos PDF (195 items)
    'votaciones':        '5b55485f-a6d8-4f5b-a441-ff1e6f0b4157',
    # Proyectos nuevos con comisión asignada — doc library (161 items)
    'proyectos_nuevos':  '4c888c13-97dc-4834-a905-297389d17dc9',
}


def fetch_sp_list(list_id: str, select: str = '*', orderby: str = 'Modified desc',
                  top: int = 30, expand: str = '', extra: str = '') -> list:
    """
    Llama la REST API de SharePoint de la Asamblea y devuelve los items.
    No necesita autenticación — los endpoints son públicos (lectura).
    """
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    url = f"{SHAREPOINT_API}/GetById('{list_id}')/items?$top={top}&$orderby={orderby}"
    if select:
        url += f'&$select={select}'
    if expand:
        url += f'&$expand={expand}'
    if extra:
        url += f'&{extra}'

    browser = random.choice(_BROWSER_POOL)
    headers = _build_headers(browser, 'https://www.asamblea.go.cr/', False)
    headers['Accept'] = 'application/json;odata=verbose'
    headers.pop('Upgrade-Insecure-Requests', None)

    try:
        r = _SESSION.get(url, headers=headers, timeout=30, verify=False)
        if r.status_code == 200:
            return r.json().get('d', {}).get('results', [])
        log.warning(f'SharePoint API HTTP {r.status_code} for list {list_id}')
    except Exception as e:
        log.warning(f'fetch_sp_list error: {e}')
    return []


# ── URLs oficiales ────────────────────────────────────────────────────────────
URLS = {
    'diputados':           'https://www.asamblea.go.cr/Diputados/SitePages/Lista%20Diputados.aspx',
    'fracciones':          'https://www.asamblea.go.cr/Diputados/SitePages/Fracciones_Administracion_Actual.aspx',
    'agenda':              'https://www.asamblea.go.cr/glcp/SitePages/ConsultaOrdenDiaPlenario.aspx',
    'votaciones_folder':   'https://www.asamblea.go.cr/glcp/votaciones_plenario/forms/allitems.aspx',
    'salarios_base':       'https://www.asamblea.go.cr/opendata/Salarios/Funcionarios/CSV/',
    'asistencia_base':     'https://www.asamblea.go.cr/opendata/asistencia/csv/',
    'gasolina_base':       'https://www.asamblea.go.cr/opendata/Combustible/CSV/',
    'diputado_bio':        'https://www.asamblea.go.cr/Diputados/SitePages/{slug}.aspx',
    'expedientes_search':  'https://www.asamblea.go.cr/glcp/SitePages/ConsultarExpediente.aspx',
}

# ── Stealth: pool de navegadores reales ──────────────────────────────────────
_BROWSER_POOL = [
    # Chrome Windows
    {'ua': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
     'sec_ch': '"Google Chrome";v="135", "Chromium";v="135", "Not-A.Brand";v="99"', 'plat': '"Windows"'},
    {'ua': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
     'sec_ch': '"Google Chrome";v="124", "Chromium";v="124", "Not-A.Brand";v="99"', 'plat': '"Windows"'},
    {'ua': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
     'sec_ch': '"Google Chrome";v="126", "Chromium";v="126", "Not-A.Brand";v="99"', 'plat': '"Windows"'},
    # Chrome macOS
    {'ua': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
     'sec_ch': '"Google Chrome";v="135", "Chromium";v="135", "Not-A.Brand";v="99"', 'plat': '"macOS"'},
    {'ua': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
     'sec_ch': '"Google Chrome";v="124", "Chromium";v="124", "Not-A.Brand";v="99"', 'plat': '"macOS"'},
    # Edge Windows
    {'ua': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0',
     'sec_ch': '"Microsoft Edge";v="135", "Chromium";v="135", "Not-A.Brand";v="99"', 'plat': '"Windows"'},
    {'ua': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
     'sec_ch': '"Microsoft Edge";v="124", "Chromium";v="124", "Not-A.Brand";v="99"', 'plat': '"Windows"'},
    # Safari macOS
    {'ua': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
     'sec_ch': None, 'plat': None},
    {'ua': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
     'sec_ch': None, 'plat': None},
    # Firefox
    {'ua': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
     'sec_ch': None, 'plat': None},
    {'ua': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:126.0) Gecko/20100101 Firefox/126.0',
     'sec_ch': None, 'plat': None},
    # Chrome Android (móvil)
    {'ua': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
     'sec_ch': '"Google Chrome";v="124", "Chromium";v="124", "Not-A.Brand";v="99"', 'plat': '"Android"'},
    {'ua': 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
     'sec_ch': '"Google Chrome";v="124", "Chromium";v="124", "Not-A.Brand";v="99"', 'plat': '"Android"'},
    # Safari iOS
    {'ua': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
     'sec_ch': None, 'plat': None},
]

# Referers creíbles para Costa Rica — simulan llegar desde búsqueda o noticias
_REFERERS_CR = [
    'https://www.google.co.cr/search?q=asamblea+legislativa+costa+rica',
    'https://www.google.com/search?q=diputados+costa+rica+asamblea',
    'https://www.nacion.com/',
    'https://www.crhoy.com/',
    'https://semanario.ucr.ac.cr/',
    'https://www.diarioextra.com/',
    'https://elpais.cr/',
]
_REFERERS_DELFINO = [
    'https://delfino.cr/asamblea',
    'https://delfino.cr/',
    'https://www.google.co.cr/search?q=delfino+asamblea+diputados',
]


def _build_headers(browser: dict, referer: str | None = None, stealth: bool = False) -> dict:
    h = {
        'User-Agent': browser['ua'],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-CR,es;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0',
        'DNT': '1',
    }
    if browser['sec_ch']:
        h['sec-ch-ua'] = browser['sec_ch']
        h['sec-ch-ua-mobile'] = '?1' if 'Mobile' in browser['ua'] else '?0'
        h['sec-ch-ua-platform'] = browser['plat']
        h['Sec-Fetch-Dest'] = 'document'
        h['Sec-Fetch-Mode'] = 'navigate'
        h['Sec-Fetch-Site'] = 'cross-site' if stealth else 'same-origin'
        h['Sec-Fetch-User'] = '?1'
    if referer:
        h['Referer'] = referer
    return h


def _human_delay(min_s: float = 2.0, max_s: float = 6.0):
    """Delay con distribución tipo Poisson truncada — más humano que uniforme."""
    base = random.uniform(min_s, max_s)
    jitter = random.gauss(0, 0.4)
    time.sleep(max(min_s * 0.5, base + jitter))


# requests.Session persistente (cookies + keep-alive)
_SESSION = requests.Session()


def fetch(url: str, stealth: bool = False, retries: int = 3,
          referer: str | None = None, verify_ssl: bool = False) -> requests.Response | None:
    """
    HTTP GET con rotación de navegador y delays humanos.
    verify_ssl=False porque asamblea.go.cr tiene cert problemático.
    """
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    browser = random.choice(_BROWSER_POOL)
    ref = referer or (random.choice(_REFERERS_DELFINO if stealth else _REFERERS_CR))
    headers = _build_headers(browser, ref, stealth)

    if stealth:
        _human_delay(3.5, 9.0)
    else:
        _human_delay(1.5, 4.0)

    for attempt in range(retries):
        try:
            r = _SESSION.get(url, headers=headers, timeout=25, verify=verify_ssl, allow_redirects=True)
            r.raise_for_status()
            return r
        except requests.exceptions.HTTPError as e:
            log.warning(f'HTTP {e.response.status_code} en {url} (intento {attempt+1})')
            if e.response.status_code in (403, 429):
                # Cambiar browser y esperar más
                browser = random.choice(_BROWSER_POOL)
                headers = _build_headers(browser, random.choice(_REFERERS_CR), stealth)
                _human_delay(10, 20)
        except Exception as e:
            log.warning(f'fetch {url} intento {attempt+1}: {e}')
            _human_delay(2 ** attempt, 2 ** (attempt + 1))
    return None


def fetch_playwright(url: str) -> str | None:
    """
    Fallback con Playwright para páginas JS-rendered (SharePoint / SPFx).
    Solo se usa si playwright está instalado.
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        log.debug('playwright no disponible, usando requests')
        return None

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            ctx = browser.new_context(
                user_agent=random.choice(_BROWSER_POOL)['ua'],
                locale='es-CR',
                timezone_id='America/Costa_Rica',
                extra_http_headers={'Accept-Language': 'es-CR,es;q=0.9'},
            )
            page = ctx.new_page()
            page.goto(url, wait_until='networkidle', timeout=30000)
            html = page.content()
            browser.close()
            return html
    except Exception as e:
        log.warning(f'playwright error: {e}')
        return None


def get_conn():
    cfg = get_db_config()
    return pymysql.connect(
        host=cfg['host'], user=cfg['user'],
        password=cfg['passwd'], database=cfg['db'],
        charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor,
    )


def slugify(s: str) -> str:
    s = s.lower().strip()
    for a, b in [('á','a'),('é','e'),('í','i'),('ó','o'),('ú','u'),('ü','u'),('ñ','n'),(' ','-')]:
        s = s.replace(a, b)
    return re.sub(r'[^a-z0-9-]', '', s)


# ── DIPUTADOS (delfino.cr por partido, fuente oficial como intento inicial) ───
def _scrape_diputados_oficial() -> list:
    """
    Intenta obtener diputados de asamblea.go.cr.
    La página es SharePoint SPFx — con Playwright puede funcionar,
    con requests normalmente devuelve HTML vacío.
    """
    diputados = []

    # 1. Playwright si está disponible
    html = fetch_playwright(URLS['diputados'])
    soup = BeautifulSoup(html, 'html.parser') if html else None

    # 2. Fallback requests
    if not soup or not soup.select('table tr'):
        r = fetch(URLS['diputados'], verify_ssl=False)
        if r:
            soup = BeautifulSoup(r.text, 'html.parser')

    if soup:
        for row in soup.select('table tr'):
            cells = [td.get_text(strip=True) for td in row.select('td')]
            if len(cells) >= 2 and cells[0] and not cells[0].lower().startswith('nombre'):
                diputados.append({
                    'nombre':   cells[0],
                    'partido':  cells[1] if len(cells) > 1 else '',
                    'provincia': cells[2] if len(cells) > 2 else '',
                    'email':    cells[3] if len(cells) > 3 else '',
                })

    return diputados


def _scrape_diputados_delfino() -> list:
    """
    Itera cada página de partido en delfino.cr.
    Estructura real:
      - /asamblea → links /asamblea/partidos/{slug}
      - Cada página tiene DOS h1: "Asamblea" (cabecera) y "Partido X" (el real)
      - h3 = nombre diputado; siguiente sibling = provincia O "Jefe/a de fracción"
    """
    base = 'https://delfino.cr'
    index = fetch(f'{base}/asamblea', stealth=True)
    if not index:
        return []

    soup = BeautifulSoup(index.text, 'html.parser')
    links = list(dict.fromkeys(
        a['href'] for a in soup.find_all('a', href=True)
        if '/asamblea/partidos/' in a['href']
    ))
    log.info(f'delfino.cr: {len(links)} partidos')

    # Palabras que indican cargo/rol — NO son provincia
    _ROLES = re.compile(r'fracción|fraccion|jefe|jefa|subjef|coordinad|presidente|secretari', re.I)

    diputados = []
    for href in links:
        url = base + href if href.startswith('/') else href
        rp = fetch(url, stealth=True)
        if not rp:
            continue
        sp = BeautifulSoup(rp.text, 'html.parser')

        # Tomar el SEGUNDO h1 (el primero es "Asamblea", el segundo es "Partido X")
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

            # Provincia: próximo sibling que NO sea un cargo/rol
            provincia = ''
            for sib in h3.find_next_siblings():
                txt = sib.get_text(strip=True).split('\n')[0].strip()
                if txt and not _ROLES.search(txt):
                    provincia = txt
                    break

            diputados.append({
                'nombre':    nombre,
                'partido':   partido_nombre,
                'provincia': provincia,
                'email':     '',
            })

    return diputados


def scrape_diputados():
    log.info('Scrapeando diputados...')

    # Siempre intentar fuente oficial primero
    diputados = _scrape_diputados_oficial()

    # Respaldo silencioso solo si la oficial falló o devolvió poco
    if len(diputados) < 10:
        log.info(f'Oficial devolvió {len(diputados)} — usando respaldo silencioso delfino.cr')
        diputados = _scrape_diputados_delfino()

    if not diputados:
        log.error('No se pudieron obtener diputados de ninguna fuente')
        return

    conn = get_conn()
    try:
        with conn.cursor() as cur:
            for d in diputados:
                slug = slugify(d['nombre'])
                cur.execute(
                    f"""INSERT INTO {DB_PREFIX}asamblea_diputados
                          (nombre_completo, partido, provincia, email, slug, updated_at)
                        VALUES (%s, %s, %s, %s, %s, NOW())
                        ON DUPLICATE KEY UPDATE
                          partido=VALUES(partido), provincia=VALUES(provincia),
                          email=VALUES(email), updated_at=NOW()""",
                    (d['nombre'], d['partido'], d['provincia'], d['email'], slug)
                )
        conn.commit()
        log.info(f'Guardados {len(diputados)} diputados')
    finally:
        conn.close()


# ── FOTOS + REDES SOCIALES (bio pages oficiales) ──────────────────────────────
def scrape_fotos_redes():
    """
    Visita la página oficial de cada diputado en asamblea.go.cr para extraer
    foto, email oficial y enlaces a redes sociales.
    """
    log.info('Scrapeando fotos y redes sociales...')
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(f"SELECT id, nombre_completo, slug FROM {DB_PREFIX}asamblea_diputados WHERE activo=1")
            diputados = cur.fetchall()
    finally:
        conn.close()

    for d in diputados:
        # URL oficial: generalmente nombre-apellido.aspx
        slug_oficial = d['nombre_completo'].replace(' ', '-')
        url = URLS['diputado_bio'].format(slug=slug_oficial)

        html = fetch_playwright(url)
        if not html:
            r = fetch(url, verify_ssl=False)
            html = r.text if r else None

        if not html:
            continue

        soup = BeautifulSoup(html, 'html.parser')
        updates = {}

        # Foto
        img = (soup.find('img', class_=re.compile(r'foto|diputad|profile|legisl', re.I)) or
               soup.find('img', src=re.compile(r'diputad|legisl|foto', re.I)))
        if img and img.get('src'):
            src = img['src']
            if src.startswith('/'):
                src = 'https://www.asamblea.go.cr' + src
            updates['foto_url'] = src[:500]

        # Redes sociales
        for a in soup.find_all('a', href=True):
            href = a['href'].lower()
            if 'facebook.com' in href:
                updates['facebook'] = a['href'][:200]
            elif 'instagram.com' in href:
                updates['instagram'] = a['href'][:200]
            elif 'twitter.com' in href or 'x.com' in href:
                updates['twitter'] = a['href'][:200]
            elif 'tiktok.com' in href:
                updates['tiktok'] = a['href'][:200]
            elif 'youtube.com' in href or 'youtu.be' in href:
                updates['youtube_canal'] = a['href'][:200]

        # Email en la página
        email_m = re.search(r'[a-zA-Z0-9._%+-]+@asamblea\.go\.cr', html)
        if email_m:
            updates['email'] = email_m.group(0)

        if updates:
            conn = get_conn()
            try:
                sets = ', '.join(f'{k}=%s' for k in updates)
                vals = list(updates.values()) + [d['id']]
                with conn.cursor() as cur:
                    cur.execute(f"UPDATE {DB_PREFIX}asamblea_diputados SET {sets} WHERE id=%s", vals)
                conn.commit()
                log.info(f'  {d["nombre_completo"]}: {list(updates.keys())}')
            finally:
                conn.close()

        _human_delay(4, 10)


# ── FRACCIONES ────────────────────────────────────────────────────────────────
def scrape_fracciones():
    log.info('Scrapeando fracciones...')
    html = fetch_playwright(URLS['fracciones'])
    r = None if html else fetch(URLS['fracciones'], verify_ssl=False)
    soup = BeautifulSoup(html or (r.text if r else ''), 'html.parser')
    if not soup:
        return
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            for row in soup.select('table tr'):
                cells = [td.get_text(strip=True) for td in row.select('td')]
                if len(cells) >= 2 and cells[0]:
                    nombre, fraccion = cells[0], cells[1] if len(cells) > 1 else ''
                    if fraccion and nombre.split():
                        cur.execute(
                            f"""UPDATE {DB_PREFIX}asamblea_diputados
                                SET fraccion=%s, updated_at=NOW()
                                WHERE nombre_completo LIKE %s""",
                            (fraccion, f'%{nombre.split()[0]}%{nombre.split()[-1]}%')
                        )
        conn.commit()
        log.info('Fracciones actualizadas')
    finally:
        conn.close()


# ── GASOLINA (combustible) ────────────────────────────────────────────────────
def scrape_gasolina():
    """
    Descarga CSV de gastos de combustible del portal open data de la Asamblea.
    URL: /opendata/Combustible/CSV/Combustible_{Mes}{Año}.csv
    """
    import csv
    log.info('Scrapeando gastos de combustible...')
    hoy = date.today()
    meses_es = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

    # Intentar mes actual y mes anterior (a veces no publicaron el actual)
    for delta in (0, 1):
        m = hoy.month - delta
        y = hoy.year if m > 0 else hoy.year - 1
        m = m if m > 0 else 12
        mes_str = meses_es[m - 1]
        url = f"{URLS['gasolina_base']}Combustible_{mes_str}{y}.csv"
        r = fetch(url, verify_ssl=False)
        if r and r.status_code == 200:
            break
    else:
        log.warning('CSV de combustible no disponible')
        return

    conn = get_conn()
    count = 0
    try:
        reader = csv.DictReader(io.StringIO(r.text))
        with conn.cursor() as cur:
            for row in reader:
                nombre = (row.get('Nombre') or row.get('nombre') or
                          row.get('Funcionario') or '').strip()
                if not nombre:
                    continue
                # Normalizar clave de monto
                monto_raw = (row.get('Monto') or row.get('monto') or
                             row.get('Total') or row.get('Combustible') or '0')
                monto = float(re.sub(r'[^\d.]', '', str(monto_raw)) or '0')
                periodo = date(y, m, 1).isoformat()

                cur.execute(
                    f"""INSERT INTO {DB_PREFIX}asamblea_gasolina
                          (nombre, periodo, monto, updated_at)
                        VALUES (%s, %s, %s, NOW())
                        ON DUPLICATE KEY UPDATE monto=VALUES(monto), updated_at=NOW()""",
                    (nombre, periodo, monto)
                )
                count += 1

        # Actualizar promedio y marcadores en tabla diputados
        with conn.cursor() as cur:
            cur.execute(f"""
                UPDATE {DB_PREFIX}asamblea_diputados d
                JOIN (
                    SELECT nombre, AVG(monto) AS promedio_personal
                    FROM {DB_PREFIX}asamblea_gasolina
                    GROUP BY nombre
                ) g ON g.nombre LIKE CONCAT('%', SUBSTRING_INDEX(d.nombre_completo, ' ', 1), '%')
                SET d.gasto_gasolina_promedio = g.promedio_personal,
                    d.updated_at = NOW()
            """)
        conn.commit()
        log.info(f'Combustible: {count} registros importados (período {periodo})')
    finally:
        conn.close()


# ── ASISTENCIA ────────────────────────────────────────────────────────────────
def scrape_asistencia():
    """
    Descarga CSV de asistencia. Calcula % por diputado y lo guarda.
    URL: /opendata/asistencia/csv/Asistencia_{YYYY}.csv
    """
    import csv
    log.info('Scrapeando asistencia...')
    hoy = date.today()

    r = fetch(f"{URLS['asistencia_base']}Asistencia_{hoy.year}.csv", verify_ssl=False)
    if not r:
        r = fetch(f"{URLS['asistencia_base']}Asistencia_{hoy.year - 1}.csv", verify_ssl=False)
    if not r:
        log.warning('CSV de asistencia no disponible')
        return

    conn = get_conn()
    count = 0
    try:
        reader = csv.DictReader(io.StringIO(r.text))
        totales: dict[str, dict] = {}
        for row in reader:
            nombre = (row.get('Nombre') or row.get('nombre') or
                      row.get('Diputado') or '').strip()
            if not nombre:
                continue
            asistio = str(row.get('Asistio') or row.get('asistio') or
                          row.get('Asistencia') or '').strip().upper()
            if nombre not in totales:
                totales[nombre] = {'total': 0, 'asistio': 0}
            totales[nombre]['total'] += 1
            if asistio in ('S', 'SI', 'SÍ', 'TRUE', '1', 'P', 'PRESENTE'):
                totales[nombre]['asistio'] += 1

        with conn.cursor() as cur:
            for nombre, datos in totales.items():
                pct = round(datos['asistio'] / datos['total'] * 100, 1) if datos['total'] else 0
                cur.execute(
                    f"""INSERT INTO {DB_PREFIX}asamblea_asistencia
                          (nombre, anio, sesiones_total, sesiones_asistidas, porcentaje, updated_at)
                        VALUES (%s, %s, %s, %s, %s, NOW())
                        ON DUPLICATE KEY UPDATE
                          sesiones_total=VALUES(sesiones_total),
                          sesiones_asistidas=VALUES(sesiones_asistidas),
                          porcentaje=VALUES(porcentaje),
                          updated_at=NOW()""",
                    (nombre, hoy.year, datos['total'], datos['asistio'], pct)
                )
                count += 1

            # Propagar porcentaje a tabla diputados
            cur.execute(f"""
                UPDATE {DB_PREFIX}asamblea_diputados d
                JOIN {DB_PREFIX}asamblea_asistencia a
                  ON a.nombre LIKE CONCAT('%', SUBSTRING_INDEX(d.nombre_completo, ' ', 1), '%')
                 AND a.anio = %s
                SET d.asistencia_porcentaje = a.porcentaje, d.updated_at = NOW()
            """, (hoy.year,))

        conn.commit()
        log.info(f'Asistencia: {count} diputados procesados')
    finally:
        conn.close()


# ── EXPEDIENTES (SharePoint REST + delfino fallback) ─────────────────────────
def scrape_expedientes():
    """
    Obtiene expedientes legislativos vía SharePoint REST API.
    Fuente primaria: res_primeros_proyectos_plenario (campos reales: Title=numero, Nombre=titulo_HTML,
    Inciativa=proponente, Iniciado=fecha, N_x00b0__x0020_de_x0020_Ley=estado/lugar).
    Fallback: proyec_dictaminados y delfino.cr.
    """
    log.info('Scrapeando expedientes...')
    items = []

    def clean_html(html_str):
        """Limpia HTML y retorna texto plano."""
        if not html_str:
            return ''
        try:
            from bs4 import BeautifulSoup
            return BeautifulSoup(html_str, 'html.parser').get_text(strip=True)
        except Exception:
            return re.sub(r'<[^>]+>', '', html_str).strip()

    # ── 1. res_primeros_proyectos_plenario (Title=número, Nombre=título HTML) ──
    sp_items = fetch_sp_list(
        SP_LISTS['proyectos_primero'],
        select='Title,Nombre,Inciativa,Iniciado,N_x00b0__x0020_de_x0020_Ley,Modified',
        orderby='Modified desc',
        top=200,
    )
    if sp_items:
        log.info(f'res_primeros devolvió {len(sp_items)} proyectos')
        for it in sp_items:
            numero_raw = str(it.get('Title') or '').strip()
            # Extraer solo dígitos del campo número (puede venir como "19935" o "20.247")
            numero = re.sub(r'[^0-9]', '', numero_raw)
            if not numero or len(numero) < 4:
                continue
            titulo_html = it.get('Nombre') or ''
            titulo = clean_html(titulo_html)
            if not titulo:
                continue
            titulo = re.sub(r'\s+', ' ', titulo).strip()
            proponente = clean_html(it.get('Inciativa') or '')
            estado_raw = str(it.get('N_x00b0__x0020_de_x0020_Ley') or '').strip()
            # Estado: "LUGAR N.°229" → "PRIMER DEBATE", o "Ley Nº 9999" → "APROBADO"
            if re.search(r'ley\s*n[°º]?\s*\d+', estado_raw, re.I):
                estado = 'APROBADO'
            elif 'LUGAR' in estado_raw.upper():
                estado = 'PRIMER DEBATE'
            else:
                estado = (estado_raw[:80] or 'EN TRÁMITE')
            fecha_raw = it.get('Modified') or ''
            try:
                fecha = datetime.fromisoformat(fecha_raw[:19]).date().isoformat()
            except Exception:
                fecha = date.today().isoformat()
            items.append({
                'numero':     numero,
                'titulo':     titulo[:500],
                'proponente': proponente[:200],
                'estado':     estado[:100],
                'comision':   '',
                'fecha':      fecha,
            })

    # ── 2. proyec_dictaminados (Title=número, Nombre=título HTML, Tipo_=dictamen) ──
    if len(items) < 50:
        sp2 = fetch_sp_list(
            'ab07ff6d-dbfb-4ee5-bae4-997771624b61',
            select='Title,Nombre,Tipo_x0020_de_x0020_dictamen,Fecha,Modified',
            orderby='Modified desc',
            top=100,
        )
        for it in sp2:
            numero = re.sub(r'[^0-9]', '', str(it.get('Title') or ''))
            if not numero or len(numero) < 4:
                continue
            titulo = clean_html(it.get('Nombre') or '')
            if not titulo:
                continue
            estado = str(it.get('Tipo_x0020_de_x0020_dictamen') or 'DICTAMINADO')[:80]
            fecha_raw = it.get('Fecha') or it.get('Modified') or ''
            try:
                fecha = datetime.fromisoformat(str(fecha_raw)[:19]).date().isoformat()
            except Exception:
                fecha = date.today().isoformat()
            items.append({
                'numero': numero, 'titulo': titulo[:500],
                'proponente': '', 'estado': estado, 'comision': '',
                'fecha': fecha,
            })

    # ── 2. Fallback: delfino.cr sección asamblea ──────────────────────────────
    if len(items) < 5:
        log.info('SharePoint insuficiente — intentando delfino.cr/asamblea...')
        r = fetch('https://delfino.cr/asamblea', stealth=True)
        if r:
            soup = BeautifulSoup(r.text, 'html.parser')
            for el in soup.select('article, [class*="proyecto"], [class*="expediente"], li'):
                txt = el.get_text(' ', strip=True)
                if not txt or len(txt) < 20:
                    continue
                exp_m = re.search(r'(?:exp(?:ediente)?\.?\s*(?:n[°o]\.?\s*)?)?(\d{4,5})', txt, re.I)
                if not exp_m:
                    continue
                titulo_el = el.find(['h2','h3','h4','a','strong'])
                titulo = (titulo_el.get_text(strip=True) if titulo_el else txt[:200])
                items.append({
                    'numero':     exp_m.group(1),
                    'titulo':     titulo[:500],
                    'proponente': '',
                    'estado':     'EN TRÁMITE',
                    'comision':   '',
                    'fecha':      date.today().isoformat(),
                })
                if len(items) >= 25:
                    break

    # ── 3. También agregar lo que ya está en agenda hoy ──────────────────────
    # (la función scrape_agenda() ya alimenta expedientes, complementamos)

    if not items:
        log.warning('scrape_expedientes: ninguna fuente devolvió datos')
        return

    # Deduplicar por número, quedarse con el más reciente
    seen: dict[str, dict] = {}
    for it in items:
        n = it['numero']
        if n not in seen:
            seen[n] = it

    conn = get_conn()
    saved = 0
    try:
        with conn.cursor() as cur:
            for it in seen.values():
                cur.execute(
                    f"""INSERT INTO {DB_PREFIX}asamblea_expedientes
                          (numero, titulo, proponente, estado, comision, fecha_agenda, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s, NOW())
                        ON DUPLICATE KEY UPDATE
                          titulo     = IF(LENGTH(VALUES(titulo)) > LENGTH(titulo), VALUES(titulo), titulo),
                          proponente = IF(VALUES(proponente) != '', VALUES(proponente), proponente),
                          estado     = VALUES(estado),
                          comision   = IF(VALUES(comision) != '', VALUES(comision), comision),
                          fecha_agenda = VALUES(fecha_agenda),
                          updated_at = NOW()""",
                    (it['numero'], it['titulo'], it['proponente'],
                     it['estado'], it['comision'], it['fecha'])
                )
                saved += 1
        conn.commit()
        log.info(f'Expedientes: {saved} guardados / actualizados')
    finally:
        conn.close()


# ── AGENDA DEL DÍA ────────────────────────────────────────────────────────────
def scrape_agenda():
    log.info('Scrapeando agenda del plenario...')
    html = fetch_playwright(URLS['agenda'])
    r = None if html else fetch(URLS['agenda'], verify_ssl=False)
    soup = BeautifulSoup(html or (r.text if r else ''), 'html.parser')
    if not soup:
        return

    items = []
    for el in soup.select('table tr, li, [class*="proyecto"], [class*="expediente"]'):
        txt = el.get_text(' ', strip=True)
        if re.search(r'\d{4,5}', txt) and len(txt) > 20:
            exp_m = re.search(r'\b(\d{4,5})\b', txt)
            items.append({
                'numero': exp_m.group(1) if exp_m else '',
                'titulo': txt[:500],
                'fecha_agenda': date.today().isoformat(),
            })

    if not items:
        return

    conn = get_conn()
    try:
        with conn.cursor() as cur:
            for it in items:
                cur.execute(
                    f"""INSERT INTO {DB_PREFIX}asamblea_expedientes
                          (numero, titulo, estado, fecha_agenda, updated_at)
                        VALUES (%s, %s, 'EN AGENDA', %s, NOW())
                        ON DUPLICATE KEY UPDATE
                          titulo=VALUES(titulo), estado='EN AGENDA',
                          fecha_agenda=VALUES(fecha_agenda), updated_at=NOW()""",
                    (it['numero'], it['titulo'], it['fecha_agenda'])
                )
        conn.commit()
        log.info(f'Agenda: {len(items)} expedientes')
    finally:
        conn.close()


# ── VOTACIONES (SharePoint REST + Telegram sync + PDF fallback) ───────────────
def scrape_votaciones():
    """
    Tres fuentes de votaciones en orden de confiabilidad:
    1. SharePoint REST API — lista votaciones_plenario (PDFs con metadata)
    2. Telegram monitor — eventos ya capturados por telegram_monitor_fixed.py
    3. Folder HTML de la Asamblea — fallback clásico (pocos resultados)
    """
    log.info('Scrapeando votaciones (API + Telegram + PDF)...')
    conn = get_conn()

    try:
        with conn.cursor() as cur:
            cur.execute(f"SELECT url_pdf FROM {DB_PREFIX}asamblea_votaciones WHERE url_pdf IS NOT NULL")
            existing_urls = {row['url_pdf'] for row in cur.fetchall()}
    except Exception:
        existing_urls = set()

    # ── 1. SharePoint REST API: lista votaciones_plenario ────────────────────
    sp_items = fetch_sp_list(
        SP_LISTS['votaciones'],
        select='Title,FileLeafRef,Modified,Created,File,FSObjType',
        orderby='Modified desc',
        top=30,
        expand='File',
        extra='$filter=FSObjType eq 0',  # solo archivos, no carpetas
    )

    saved_sp = 0
    for it in sp_items:
        # Obtener URL del archivo
        file_info = it.get('File', {}) or {}
        server_relative = file_info.get('ServerRelativeUrl', '')
        if server_relative:
            pdf_url = 'https://www.asamblea.go.cr' + server_relative
        else:
            # Construir URL desde nombre del archivo
            leaf = it.get('FileLeafRef', '')
            pdf_url = f"https://www.asamblea.go.cr/glcp/votaciones_plenario/{leaf}" if leaf else ''

        # Ignorar carpetas (PRESIDENCIA, VICEPRESIDENCIA, etc.) — solo PDFs
        if not pdf_url or not pdf_url.lower().endswith('.pdf'):
            continue
        if pdf_url in existing_urls:
            continue

        titulo = (it.get('Title') or it.get('FileLeafRef') or '').strip()
        fecha_raw = it.get('Modified') or it.get('Created') or ''
        try:
            fecha_dt = datetime.fromisoformat(fecha_raw[:19])
        except Exception:
            fecha_dt = datetime.now()

        # Extraer número de expediente del título/filename
        exp_m = re.search(r'\b(\d{4,5})\b', titulo)
        expediente = exp_m.group(1) if exp_m else ''

        # Resultado del nombre del archivo
        titulo_lower = titulo.lower()
        if 'aprobad' in titulo_lower:
            resultado = 'APROBADO'
        elif 'rechazad' in titulo_lower or 'neg' in titulo_lower:
            resultado = 'RECHAZADO'
        else:
            resultado = 'VOTACION'

        # Intentar extraer votos del título: "32-18" o "32 a favor 18 en contra"
        si = no = abst = 0
        votos_m = re.search(r'(\d+)\s*[-–]\s*(\d+)', titulo)
        if votos_m:
            si, no = int(votos_m.group(1)), int(votos_m.group(2))

        _save_votacion(conn, pdf_url, titulo, si, no, abst, resultado, expediente, fecha_dt)
        existing_urls.add(pdf_url)
        saved_sp += 1

    log.info(f'SharePoint: {saved_sp} votaciones nuevas')

    # ── 2. Sincronizar desde Telegram (ya capturadas por el monitor) ──────────
    _sync_votaciones_telegram(conn, existing_urls)

    # ── 3. Fallback HTML folder (poco efectivo pero por si acaso) ─────────────
    r = fetch(URLS['votaciones_folder'], verify_ssl=False)
    if r:
        soup = BeautifulSoup(r.text, 'html.parser')
        for link in soup.find_all('a', href=re.compile(r'\.pdf', re.I)):
            href = link.get('href', '')
            if not href.startswith('http'):
                href = 'https://www.asamblea.go.cr' + href
            if href and href not in existing_urls:
                _process_votacion_pdf(conn, href, link.get_text(strip=True))
                existing_urls.add(href)

    try:
        conn.close()
    except Exception:
        pass


def _sync_votaciones_telegram(conn, existing_urls: set):
    """
    Copia al destino votaciones los registros del monitor de Telegram
    que aún no hayan sido noticiados / insertados.
    """
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"""SELECT id, texto, expediente, votos_si, votos_no, votos_abstencion,
                           resultado, created_at
                    FROM {DB_PREFIX}asamblea_eventos_telegram
                    WHERE es_votacion = 1
                      AND noticiado  = 0
                    ORDER BY created_at DESC
                    LIMIT 20"""
            )
            rows = cur.fetchall()

        synced = 0
        for row in rows:
            expediente = row['expediente'] or ''
            titulo = row['texto'][:200] if row['texto'] else f'Votación exp. {expediente}'
            resultado = row['resultado'] or 'VOTACION'
            si   = row['votos_si']   or 0
            no   = row['votos_no']   or 0
            abst = row['votos_abstencion'] or 0
            fecha_dt = row['created_at'] or datetime.now()

            _save_votacion(conn, None, titulo, si, no, abst, resultado, expediente, fecha_dt)

            # Marcar como noticiado en la tabla telegram
            with conn.cursor() as cur:
                cur.execute(
                    f"UPDATE {DB_PREFIX}asamblea_eventos_telegram SET noticiado=1 WHERE id=%s",
                    (row['id'],)
                )
            conn.commit()
            synced += 1

        log.info(f'Telegram sync: {synced} votaciones sincronizadas')
    except Exception as e:
        log.error(f'_sync_votaciones_telegram error: {e}')


def _process_votacion_pdf(conn, url: str, titulo: str):
    r = fetch(url, verify_ssl=False)
    if not r:
        return

    pdf_bytes = r.content
    text = titulo

    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            text = '\n'.join(p.extract_text() or '' for p in pdf.pages[:3])
    except ImportError:
        log.warning('pdfplumber no instalado')
    except Exception as e:
        log.error(f'PDF parse error: {e}')

    si   = int(m.group(1)) if (m := re.search(r'(?:a\s+favor|si)[:\s]+(\d+)', text, re.I)) else 0
    no   = int(m.group(1)) if (m := re.search(r'(?:en\s+contra|no)[:\s]+(\d+)', text, re.I)) else 0
    abst = int(m.group(1)) if (m := re.search(r'abstenci[oó]n[:\s]+(\d+)', text, re.I)) else 0

    resultado = ('APROBADO' if re.search(r'aprobad[oa]', text, re.I)
                 else 'RECHAZADO' if re.search(r'rechazad[oa]', text, re.I)
                 else 'VOTACION')

    exp_m = re.search(r'\b(\d{4,5})\b', titulo)
    votacion_id = _save_votacion(conn, url, titulo, si, no, abst, resultado,
                                 exp_m.group(1) if exp_m else '')

    # Extraer y guardar votos individuales
    if votacion_id:
        votos_ind = parse_votos_individuales_pdf(pdf_bytes)
        if votos_ind:
            _save_votos_individuales(conn, votacion_id, votos_ind)


def _save_votacion(conn, url, titulo, si, no, abst, resultado, expediente='', fecha_dt=None) -> int | None:
    fecha_sql = fecha_dt if fecha_dt else datetime.now()
    with conn.cursor() as cur:
        cur.execute(
            f"""INSERT INTO {DB_PREFIX}asamblea_votaciones
                  (titulo, expediente, fecha, votos_si, votos_no, votos_abstencion,
                   resultado, url_pdf, noticiada, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 0, NOW())
                ON DUPLICATE KEY UPDATE noticiada=noticiada""",
            (titulo[:500], expediente, fecha_sql, si, no, abst, resultado, url)
        )
        conn.commit()
        row_id = cur.lastrowid or None
        if row_id:
            log.info(f'Votación id={row_id}: {resultado} {si}/{no} exp={expediente}')
            try:
                from config_asamblea import BOT_NOTIFY_URL
                requests.post(BOT_NOTIFY_URL, json={
                    'tipo': 'votacion', 'event_id': row_id,
                    'titulo': titulo[:200], 'expediente': expediente,
                    'si': si, 'no': no, 'resultado': resultado,
                }, timeout=5)
            except Exception:
                pass
        return row_id


def parse_votos_individuales_pdf(pdf_bytes: bytes) -> list:
    """
    Extrae votos individuales de un PDF de votación de la Asamblea.
    Los PDFs tienen una tabla: Nombre | Partido/Fracción | Voto
    Voto puede ser: Sí, No, Abstención, Ausente, Afirmativo, Negativo
    """
    try:
        import pdfplumber
    except ImportError:
        log.warning('pdfplumber no instalado — pip install pdfplumber')
        return []

    votos = []
    VOTO_MAP = {
        'sí': 'SI', 'si': 'SI', 'afirmativo': 'SI', 'a favor': 'SI', 'favor': 'SI',
        'no': 'NO', 'negativo': 'NO', 'en contra': 'NO', 'contra': 'NO',
        'abstención': 'ABSTENCION', 'abstencion': 'ABSTENCION', 'abstención': 'ABSTENCION',
        'ausente': 'AUSENTE', 'no asistió': 'AUSENTE', 'no asistio': 'AUSENTE',
    }

    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            full_text = ''
            all_tables = []
            for page in pdf.pages:
                t = page.extract_tables()
                all_tables.extend(t or [])
                full_text += (page.extract_text() or '') + '\n'

        # Estrategia 1: tablas estructuradas
        for table in all_tables:
            if not table or len(table) < 3:
                continue
            # Detectar qué columnas son nombre y voto
            header = [str(c).lower().strip() if c else '' for c in table[0]]
            nombre_col = next((i for i, h in enumerate(header)
                               if any(k in h for k in ('nombre', 'diputad', 'legisl', 'señor', 'señora'))), None)
            voto_col   = next((i for i, h in enumerate(header)
                               if any(k in h for k in ('voto', 'votó', 'vot', 'posición', 'decision'))), None)

            if nombre_col is None and len(header) >= 2:
                # Heurístico: primera col = nombre, última = voto
                nombre_col = 0
                voto_col = -1

            if nombre_col is None:
                continue

            for row in table[1:]:
                if not row or len(row) <= max(nombre_col, voto_col if voto_col is not None else 0):
                    continue
                nombre = str(row[nombre_col] or '').strip()
                voto_raw = str(row[voto_col] if voto_col is not None else row[-1] or '').lower().strip()
                if not nombre or len(nombre) < 5:
                    continue
                voto_norm = next((v for k, v in VOTO_MAP.items() if k in voto_raw), None)
                if voto_norm:
                    votos.append({'nombre': nombre, 'voto': voto_norm})

        # Estrategia 2: texto libre si no hay tabla
        if not votos:
            # Patrones: "JUAN CARLOS PÉREZ: SÍ" o "PÉREZ RODRÍGUEZ - NO"
            for line in full_text.split('\n'):
                line = line.strip()
                m = re.match(r'^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s,\.]{8,60})[:\-–]\s*(.{2,20})$', line)
                if m:
                    nombre = m.group(1).strip(' ,.')
                    voto_raw = m.group(2).lower().strip()
                    voto_norm = next((v for k, v in VOTO_MAP.items() if k in voto_raw), None)
                    if voto_norm and len(nombre) >= 8:
                        votos.append({'nombre': nombre, 'voto': voto_norm})

    except Exception as e:
        log.error(f'parse_votos_individuales_pdf error: {e}')

    log.info(f'PDF: {len(votos)} votos individuales extraídos')
    return votos


def _match_diputado(nombre: str, cursor) -> int | None:
    """
    Busca un diputado en la DB por nombre (tolerante a variaciones de formato).
    Devuelve el id o None.
    """
    nombre_clean = nombre.strip().upper()
    tokens = [t for t in nombre_clean.split() if len(t) > 2]
    if not tokens:
        return None

    # Intentar con los 2 tokens más largos (apellidos)
    tokens_sorted = sorted(tokens, key=len, reverse=True)
    for n in range(min(3, len(tokens_sorted)), 0, -1):
        like_parts = [f"nombre_completo LIKE %s" for _ in range(n)]
        vals = [f'%{t}%' for t in tokens_sorted[:n]]
        cursor.execute(
            f"SELECT id FROM {DB_PREFIX}asamblea_diputados WHERE " + ' AND '.join(like_parts) + " LIMIT 1",
            vals
        )
        row = cursor.fetchone()
        if row:
            return row['id']
    return None


def _save_votos_individuales(conn, votacion_id: int, votos: list) -> int:
    """Guarda votos individuales en asamblea_votos_individuales."""
    if not votos:
        return 0
    saved = 0
    with conn.cursor() as cur:
        for v in votos:
            dip_id = _match_diputado(v['nombre'], cur)
            if not dip_id:
                log.debug(f'  sin match: {v["nombre"]}')
                continue
            cur.execute(
                f"""INSERT INTO {DB_PREFIX}asamblea_votos_individuales
                      (votacion_id, diputado_id, voto)
                    VALUES (%s, %s, %s)
                    ON DUPLICATE KEY UPDATE voto=VALUES(voto)""",
                (votacion_id, dip_id, v['voto'])
            )
            saved += 1
    conn.commit()
    log.info(f'  votos_individuales: {saved}/{len(votos)} guardados para votacion_id={votacion_id}')
    return saved


def scrape_votos_pdf_historico():
    """
    Re-procesa todos los PDFs de votaciones existentes para extraer votos individuales.
    Útil para backfill inicial.
    """
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                f"""SELECT id, url_pdf, titulo FROM {DB_PREFIX}asamblea_votaciones
                    WHERE url_pdf IS NOT NULL AND url_pdf != ''
                    ORDER BY id DESC LIMIT 200"""
            )
            votaciones = cur.fetchall()
    finally:
        conn.close()

    log.info(f'Procesando {len(votaciones)} PDFs para votos individuales...')
    for v in votaciones:
        r = fetch(v['url_pdf'], verify_ssl=False)
        if not r:
            continue
        votos = parse_votos_individuales_pdf(r.content)
        if votos:
            conn = get_conn()
            try:
                _save_votos_individuales(conn, v['id'], votos)
            finally:
                conn.close()
        _human_delay(2, 5)


# ── SALARIOS CSV ──────────────────────────────────────────────────────────────
def scrape_salarios():
    import csv
    hoy = date.today()
    meses_es = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
    mes_str = meses_es[hoy.month - 1]
    url = f"{URLS['salarios_base']}Salarios_{mes_str}{hoy.year}.csv"
    log.info(f'Descargando salarios: {url}')
    r = fetch(url, verify_ssl=False)
    if not r:
        log.warning('CSV de salarios no disponible aún')
        return

    conn = get_conn()
    try:
        reader = csv.DictReader(io.StringIO(r.text))
        with conn.cursor() as cur:
            for row in reader:
                nombre = (row.get('Nombre') or row.get('nombre') or '').strip()
                if not nombre:
                    continue
                salario = float(re.sub(r'[^\d.]', '', row.get('Salario Bruto', row.get('salario', '0')) or '0') or 0)
                cur.execute(
                    f"""INSERT INTO {DB_PREFIX}asamblea_salarios
                          (nombre, mes, salario_bruto, updated_at)
                        VALUES (%s, %s, %s, NOW())
                        ON DUPLICATE KEY UPDATE salario_bruto=VALUES(salario_bruto), updated_at=NOW()""",
                    (nombre, hoy.strftime('%Y-%m-01'), salario)
                )
        conn.commit()
        log.info('Salarios importados')
    finally:
        conn.close()


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--target', default='all',
                        choices=['diputados','fotos','fracciones','agenda',
                                 'expedientes','votaciones','salarios',
                                 'gasolina','asistencia','votos_pdf','all'])
    args = parser.parse_args()
    t = args.target

    if t in ('diputados', 'all'):
        scrape_diputados()
        scrape_fracciones()
    if t in ('fotos', 'all'):
        scrape_fotos_redes()
    if t in ('agenda', 'all'):
        scrape_agenda()
    if t in ('expedientes', 'all'):
        scrape_expedientes()
    if t in ('votaciones', 'all'):
        scrape_votaciones()
    if t in ('salarios', 'all'):
        scrape_salarios()
    if t in ('gasolina', 'all'):
        scrape_gasolina()
    if t in ('asistencia', 'all'):
        scrape_asistencia()
    if t == 'votos_pdf':
        scrape_votos_pdf_historico()
