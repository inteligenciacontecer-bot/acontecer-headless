#!/usr/bin/env python3
"""
Parser de votos individuales para PDFs de la Asamblea Legislativa CR.

Estrategia en capas:
  1. PyMuPDF: extrae texto con coordenadas → identifica papeletas individuales
  2. Tesseract OCR: si el texto del voto está garbled, re-lee esa área como imagen
  3. rapidfuzz: normaliza el texto extraído contra ["A FAVOR", "EN CONTRA", …]
  4. Tabla resumen: última(s) página(s) con grid de todos los diputados
  5. Fallback manual: si todo falla, acepta texto pegado vía stdin

Uso directo:
  python3 parse_votos_pdf.py --url URL_PDF --votacion-id 5
  python3 parse_votos_pdf.py --archivo ruta.pdf --votacion-id 5
  python3 parse_votos_pdf.py --manual --votacion-id 5    # pega texto interactivo
"""
import sys, re, io, os, logging, argparse, tempfile
import requests, fitz, urllib3
from rapidfuzz import process as rf_process, fuzz
import pymysql

urllib3.disable_warnings()

sys.path.insert(0, os.path.dirname(__file__))
from config_asamblea import get_db_config, DB_PREFIX

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [votos_pdf] %(levelname)s %(message)s',
    handlers=[
        logging.FileHandler('/opt/acontecer-ia/logs/votos_pdf.log'),
        logging.StreamHandler(),
    ]
)
log = logging.getLogger(__name__)

# ── Constantes ────────────────────────────────────────────────────────────────

# Palabras clave → voto normalizado (con variantes OCR comunes)
VOTO_PALABRAS = {
    'SI': [
        'a favor', 'afavor', 'favor', 'si ', ' si', 'sí',
        # Artefactos OCR frecuentes de "A FAVOR"
        'a fav', 'a favo', 'favo', 'a/favor', 'avor',
        'af', 'a f', '/avor', 'avo',
    ],
    'NO': [
        'en contra', 'contra', ' no ', 'no\n', ': no',
        # Artefactos OCR frecuentes de "EN CONTRA"
        'en cont', 'ncontra', 'en c', 'ntr', 'ontra',
        'cont', 'ncont',
    ],
    'ABSTENCION': [
        'abstencion', 'abstención', 'abstenc', 'abst',
        'se abstiene', 'abstiene',
    ],
    'AUSENTE': [
        'ausente', 'ausent', 'no present', 'no asist',
    ],
}

# Candidatos para fuzzy match (incluir variantes OCR)
VOTO_CANDIDATOS = {
    'SI':         ['A FAVOR', 'FAVOR', 'SI', 'SÍ', 'AFAVOR'],
    'NO':         ['EN CONTRA', 'CONTRA', 'NO', 'EN CONT'],
    'ABSTENCION': ['ABSTENCION', 'ABSTENCIÓN', 'SE ABSTIENE'],
    'AUSENTE':    ['AUSENTE', 'NO PRESENTE'],
}
TODOS_CANDIDATOS = [(v, voto) for voto, lst in VOTO_CANDIDATOS.items() for v in lst]

# Coordenadas aproximadas de las papeletas (en pts PDF, calibradas para A4)
# La primera línea "Voto por:" aparece siempre en y ≈ 230-250
Y_VOTO_MIN = 215
Y_VOTO_MAX = 260
# El nombre del diputado aparece en y ≈ 455-490
Y_NOMBRE_MIN = 450
Y_NOMBRE_MAX = 500

# Marcadores que indican que es una página de papeleta individual
PAPELETA_MARCADORES = ['voto por', 'emitido por', 'del directorio', 'secretar']

# ── DB ────────────────────────────────────────────────────────────────────────

def get_conn():
    cfg = get_db_config()
    return pymysql.connect(
        host=cfg['host'], user=cfg['user'],
        password=cfg['passwd'], database=cfg['db'],
        charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor
    )


def cargar_diputados_db() -> list[dict]:
    """Carga todos los diputados activos de la BD."""
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT id, nombre_completo, nombre_corto, slug
                FROM {DB_PREFIX}asamblea_diputados
                WHERE activo = 1
            """)
            return cur.fetchall()
    finally:
        conn.close()


def guardar_votos(votacion_id: int, votos: list[dict]) -> int:
    """Guarda lista de {diputado_id, voto} en la tabla de votos individuales."""
    if not votos:
        return 0
    conn = get_conn()
    saved = 0
    try:
        with conn.cursor() as cur:
            for v in votos:
                cur.execute(f"""
                    INSERT INTO {DB_PREFIX}asamblea_votos_individuales
                        (votacion_id, diputado_id, voto)
                    VALUES (%s, %s, %s)
                    ON DUPLICATE KEY UPDATE voto=VALUES(voto)
                """, (votacion_id, v['diputado_id'], v['voto']))
                saved += 1
        conn.commit()
        log.info(f'Guardados {saved} votos para votacion_id={votacion_id}')
    finally:
        conn.close()
    return saved


# ── Fuzzy matching ────────────────────────────────────────────────────────────

def normalizar_voto(texto_raw: str) -> str | None:
    """
    Dado texto garbled de OCR, devuelve SI/NO/ABSTENCION/AUSENTE o None.
    Usa tres capas:
      1. Comparación directa con palabras clave
      2. Fuzzy match contra candidatos conocidos
      3. Heurística de caracteres (solo si las anteriores fallan)
    """
    if not texto_raw:
        return None

    t = texto_raw.lower().strip()

    # Capa 1: palabras clave directas
    for voto, palabras in VOTO_PALABRAS.items():
        for p in palabras:
            if p in t:
                return voto

    # Capa 2: fuzzy match (rapidfuzz)
    t_upper = t.upper()
    best_score = 0
    best_voto  = None
    for candidato, voto in TODOS_CANDIDATOS:
        score = fuzz.partial_ratio(t_upper, candidato)
        if score > best_score:
            best_score = score
            best_voto  = voto

    if best_score >= 55:
        log.debug(f'  fuzzy match: "{t_upper}" → {best_voto} ({best_score}%)')
        return best_voto

    # Capa 3: heurística de caracteres iniciales
    # "a/" o "A/" casi siempre es "A FAVOR"
    if re.match(r'^[aA][/\\\|]', t):
        return 'SI'
    # "e" + consonante suele ser "EN CONTRA"
    if re.match(r'^[eE][nNhH]?\s*[cC]', t):
        return 'NO'

    log.debug(f'  no se pudo normalizar: "{texto_raw[:40]}"')
    return None


def match_diputado(nombre: str, diputados: list[dict]) -> dict | None:
    """
    Fuzzy match de un nombre extraído del PDF contra la lista de diputados.
    Devuelve el dict del diputado o None.
    """
    if not nombre or len(nombre) < 5:
        return None

    # Colapsar espacios múltiples (artefacto de coordenadas PDF)
    nombre_up = re.sub(r'\s+', ' ', nombre.upper().strip())

    # Match exacto primero
    for d in diputados:
        if nombre_up in d['nombre_completo'].upper():
            return d

    # Fuzzy match con rapidfuzz
    nombres_db = [d['nombre_completo'].upper() for d in diputados]
    result = rf_process.extractOne(nombre_up, nombres_db, scorer=fuzz.token_sort_ratio)
    if result and result[1] >= 70:
        idx = nombres_db.index(result[0])
        log.debug(f'  fuzzy dip: "{nombre_up}" → "{diputados[idx]["nombre_completo"]}" ({result[1]}%)')
        return diputados[idx]

    log.debug(f'  sin match diputado: "{nombre_up}"')
    return None


# ── Tesseract OCR ─────────────────────────────────────────────────────────────

def ocr_area(page: fitz.Page, rect: fitz.Rect, lang: str = 'spa') -> str:
    """
    Aplica Tesseract a un área rectangular de la página.
    Devuelve el texto reconocido.
    """
    try:
        import pytesseract
        from PIL import Image

        mat = fitz.Matrix(3, 3)          # 3x zoom → ~216 DPI efectivo
        clip = page.get_pixmap(matrix=mat, clip=rect, colorspace=fitz.csGRAY)
        img_bytes = clip.tobytes('png')
        img = Image.open(io.BytesIO(img_bytes))

        # Preprocesar: binarizar para mejorar OCR de stamps/sellos
        import numpy as np
        arr = np.array(img)
        # Threshold adaptativo simple
        thresh = arr.mean() * 0.85
        arr = (arr < thresh).astype(np.uint8) * 255
        img = Image.fromarray(arr)

        config = '--psm 6 --oem 1 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzáéíóúÁÉÍÓÚñÑüÜ /'
        texto = pytesseract.image_to_string(img, lang=lang, config=config)
        return texto.strip()
    except Exception as e:
        log.debug(f'OCR error: {e}')
        return ''


# ── Parser principal ──────────────────────────────────────────────────────────

def es_pagina_papeleta(texto_pagina: str) -> bool:
    """Determina si una página es una papeleta individual de votación."""
    t = texto_pagina.lower()
    hits = sum(1 for m in PAPELETA_MARCADORES if m in t)
    return hits >= 2


def extraer_voto_de_pagina(page: fitz.Page) -> dict | None:
    """
    Extrae {nombre, voto_raw, voto} de una página de papeleta individual.
    Usa coordenadas para separar el área de nombre del área de voto.
    """
    page_height = page.rect.height
    page_width  = page.rect.width

    # Extraer todos los bloques de texto con posición
    blocks = page.get_text('dict')['blocks']
    nombre_candidatos = []
    voto_textos = []

    for block in blocks:
        for line in block.get('lines', []):
            y0 = line['bbox'][1]
            text = ' '.join(s['text'] for s in line.get('spans', [])).strip()
            if not text:
                continue

            # Área de voto: y ≈ 215-260 (primera línea "Voto por:" + contenido)
            if Y_VOTO_MIN <= y0 <= Y_VOTO_MAX:
                # Ignorar si es solo "Voto por:" o "Voto por"
                clean = re.sub(r'[Vv]oto\s+por:?\s*', '', text).strip()
                if clean and len(clean) > 1:
                    voto_textos.append(clean)

            # Área de nombre: y ≈ 450-500
            if Y_NOMBRE_MIN <= y0 <= Y_NOMBRE_MAX:
                # Filtrar texto irrelevante
                if not any(k in text.lower() for k in
                           ['emitido', 'secretar', 'directorio', 'línea', 'linea',
                            'pln', 'pusc', 'prn', 'pnt', 'pac', 'ml', 'fa ']):
                    if len(text) > 6 and re.search(r'[A-ZÁÉÍÓÚÑa-záéíóúñ]', text):
                        nombre_candidatos.append(text)

    nombre = re.sub(r'\s+', ' ', ' '.join(nombre_candidatos).strip()) if nombre_candidatos else None
    voto_raw = ' '.join(voto_textos).strip() if voto_textos else None

    if not nombre:
        return None

    # Normalizar el voto con fuzzy
    voto_norm = normalizar_voto(voto_raw) if voto_raw else None

    # Si el voto sigue siendo poco claro, usar Tesseract en el área exacta
    if voto_raw and not voto_norm:
        rect_voto = fitz.Rect(0, Y_VOTO_MIN, page_width, Y_VOTO_MAX + 10)
        ocr_text = ocr_area(page, rect_voto)
        log.debug(f'  OCR voto area: "{ocr_text}"')
        voto_norm = normalizar_voto(ocr_text) or voto_norm

    # Sin texto en área de voto → probablemente ausente/abstención
    if not voto_raw:
        # Verificar con Tesseract para estar seguros
        rect_voto = fitz.Rect(0, Y_VOTO_MIN, page_width, Y_VOTO_MAX + 10)
        ocr_text = ocr_area(page, rect_voto)
        voto_norm = normalizar_voto(ocr_text) or 'AUSENTE'

    return {
        'nombre':   nombre,
        'voto_raw': voto_raw or '(vacío)',
        'voto':     voto_norm or 'AUSENTE',
    }


def parse_tabla_resumen(page: fitz.Page, num_votacion: int | None = None) -> list[dict]:
    """
    Parsea la tabla resumen de la última página del PDF.
    Columnas: Diputado | 1 | 2 | ... | 57
    """
    votos = []
    blocks = page.get_text('dict')['blocks']

    # Extraer todas las palabras con posición X
    palabras_con_x = []
    for block in blocks:
        for line in block.get('lines', []):
            for span in line.get('spans', []):
                text = span['text'].strip()
                if text:
                    x0, y0 = span['bbox'][0], span['bbox'][1]
                    palabras_con_x.append({'text': text, 'x': x0, 'y': y0})

    if not palabras_con_x:
        return votos

    # Detectar fila del encabezado (contiene números 1-57)
    header_y = None
    for w in palabras_con_x:
        if re.match(r'^\d+$', w['text']) and 1 <= int(w['text']) <= 57:
            header_y = w['y']
            break

    if header_y is None:
        return votos

    # Encontrar posición X de la columna del número de votación
    col_x = None
    if num_votacion:
        for w in palabras_con_x:
            if abs(w['y'] - header_y) < 15 and w['text'] == str(num_votacion):
                col_x = w['x']
                break

    # Si no sabemos qué columna, tomar la primera columna con datos (≈ columna 1)
    if col_x is None:
        nums = [w for w in palabras_con_x
                if abs(w['y'] - header_y) < 15 and re.match(r'^\d+$', w['text'])]
        if nums:
            col_x = min(nums, key=lambda w: int(w['text']) if w['text'].isdigit() else 999)['x']

    if col_x is None:
        return votos

    # Agrupar filas de diputados (y > header_y + 10)
    filas = {}
    for w in palabras_con_x:
        if w['y'] > header_y + 10:
            yk = round(w['y'] / 8) * 8  # agrupa por fila (tolerancia 8pts)
            if yk not in filas:
                filas[yk] = []
            filas[yk].append(w)

    for yk, items in sorted(filas.items()):
        # Nombre: texto a la izquierda (x < 150)
        nombre_parts = [i['text'] for i in items if i['x'] < 150]
        if not nombre_parts:
            continue
        nombre = ' '.join(nombre_parts).strip()

        # Voto: texto cercano a col_x (±25pts)
        voto_parts = [i['text'] for i in items if abs(i['x'] - col_x) < 25]
        voto_raw = ' '.join(voto_parts).strip()
        voto_norm = normalizar_voto(voto_raw) if voto_raw else 'AUSENTE'

        votos.append({'nombre': nombre, 'voto_raw': voto_raw, 'voto': voto_norm})

    log.info(f'Tabla resumen: {len(votos)} filas parseadas')
    return votos


# ── Lista agrupada (formato "A Favor / En Contra") ────────────────────────────

def es_pagina_lista_agrupada(texto_lower: str) -> bool:
    """
    Detecta el formato 'Lista de nombres: A Favor (Voto: N) / En Contra (Voto: N)'.
    Es el formato estándar de las mociones de la Asamblea vía Telegram.
    """
    tiene_seccion = bool(re.search(r'a\s+favor|en\s+contra|abstenci[oó]n', texto_lower))
    tiene_indicador = bool(re.search(
        r'lista\s+de\s+nombres|nombre\s+propuesta|voto:\s*\d|mocion|moci[oó]n|expediente|exp\.',
        texto_lower
    ))
    return tiene_seccion and tiene_indicador


def parse_lista_agrupada(texto_pagina: str) -> list[dict]:
    """
    Parsea el formato de lista agrupada:
      A Favor (Voto: 3)
        Nombre Apellido1 Apellido2
        ...
      En Contra (Voto: 50)
        Nombre Apellido1 Apellido2
        ...
    Reutiliza parse_texto_manual que ya maneja secciones.
    """
    return parse_texto_manual(texto_pagina)


def parse_pdf_bytes(pdf_bytes: bytes, num_votacion: int | None = None) -> list[dict]:
    """
    Punto de entrada principal. Procesa el PDF completo.
    Devuelve lista de {nombre, voto_raw, voto}.

    Detecta tres formatos:
      1. Lista agrupada: A Favor / En Contra (mociones Telegram, 1 pág)
      2. Papeletas individuales (multi-página, 1 por diputado)
      3. Tabla resumen (última página con grid de diputados)
    """
    doc = fitz.open(stream=pdf_bytes, filetype='pdf')
    total = len(doc)
    log.info(f'PDF: {total} páginas')

    votos_lista_agrupada = []
    votos_por_papeleta   = []
    votos_tabla_resumen  = []

    for pg_num, page in enumerate(doc):
        texto_original = page.get_text('text')       # conservar mayúsculas para el parser
        texto_lower    = texto_original.lower()

        # ── 1. Lista agrupada (formato "A Favor / En Contra") ─────────────────
        if es_pagina_lista_agrupada(texto_lower):
            lista = parse_lista_agrupada(texto_original)
            if lista:
                log.info(f'  Pág {pg_num+1}: lista agrupada → {len(lista)} votos')
                votos_lista_agrupada.extend(lista)
            continue

        # ── 2. Tabla resumen (últimas páginas con "Diputado") ─────────────────
        if 'diputado' in texto_lower and pg_num > total * 0.8:
            log.info(f'  Pág {pg_num+1}: tabla resumen detectada')
            tabla = parse_tabla_resumen(page, num_votacion)
            if tabla:
                votos_tabla_resumen.extend(tabla)
            continue

        # ── 3. Papeleta individual ─────────────────────────────────────────────
        if es_pagina_papeleta(texto_lower):
            resultado = extraer_voto_de_pagina(page)
            if resultado:
                log.debug(f'  Pág {pg_num+1}: {resultado["nombre"]} → {resultado["voto"]}')
                votos_por_papeleta.append(resultado)

    doc.close()
    log.info(
        f'Lista agrupada: {len(votos_lista_agrupada)} | '
        f'Papeletas: {len(votos_por_papeleta)} | '
        f'Tabla resumen: {len(votos_tabla_resumen)}'
    )

    # Prioridad: lista agrupada si tiene votos suficientes (>= 5)
    if len(votos_lista_agrupada) >= 5:
        log.info('Usando lista agrupada como fuente principal')
        return votos_lista_agrupada

    # Papeletas si tenemos >=40
    if len(votos_por_papeleta) >= 40:
        log.info('Usando papeletas individuales como fuente principal')
        return votos_por_papeleta

    # Tabla resumen
    if votos_tabla_resumen:
        log.info('Usando tabla resumen como fuente principal')
        return votos_tabla_resumen

    # Combinar lo que haya
    all_votos = {v['nombre']: v for v in votos_tabla_resumen}
    for v in votos_por_papeleta + votos_lista_agrupada:
        all_votos[v['nombre']] = v

    return list(all_votos.values())


# ── Fallback: texto manual (stdin o argumento) ────────────────────────────────

def parse_texto_manual(texto: str) -> list[dict]:
    """
    Parsea texto pegado manualmente.
    Acepta formatos:
      - "A FAVOR:\n  - Nombre\n  - Nombre"
      - "Nombre: SI\nNombre2: NO"
      - Texto libre del acta o Telegram
    """
    lineas = texto.splitlines()
    votos_parsed = []
    voto_seccion = 'SI'  # default

    SECCIONES = {
        'si': 'SI', 'favor': 'SI', 'afavor': 'SI', 'aprob': 'SI',
        'no': 'NO', 'contra': 'NO', 'rechaz': 'NO',
        'abstencion': 'ABSTENCION', 'abstención': 'ABSTENCION', 'absten': 'ABSTENCION',
        'ausente': 'AUSENTE', 'absent': 'AUSENTE',
    }

    for linea in lineas:
        linea_clean = linea.strip()
        if not linea_clean:
            continue

        # ¿Es encabezado de sección?
        linea_low = re.sub(r'[^a-záéíóúñ]', '', linea_clean.lower())
        encontrado_seccion = False
        for kw, voto in SECCIONES.items():
            if kw in linea_low and len(linea_clean) < 50:
                voto_seccion = voto
                encontrado_seccion = True
                break
        if encontrado_seccion:
            continue

        # Quitar bullets y numeración
        nombre_raw = re.sub(r'^[\s\-\•\*\d\.\)\(\[\]]+', '', linea_clean).strip()
        nombre_raw = re.sub(r'\s+', ' ', nombre_raw).strip(' .,;-')

        if len(nombre_raw) < 6:
            continue

        # Inline vote: "Nombre: SÍ" o "Nombre - NO"
        m = re.match(r'^(.+?)[\:\-–]\s*(\w[\w\s]{1,20})$', nombre_raw)
        voto_inline = None
        if m:
            voto_text = m.group(2).lower().strip()
            voto_inline = next(
                (v for kw, v in SECCIONES.items() if kw in re.sub(r'[^a-z]','', voto_text)),
                None
            )
            if voto_inline:
                nombre_raw = m.group(1).strip()

        votos_parsed.append({
            'nombre':   nombre_raw,
            'voto_raw': nombre_raw,
            'voto':     voto_inline or voto_seccion,
        })

    return votos_parsed


# ── Pipeline completo ─────────────────────────────────────────────────────────

def procesar_y_guardar(votos_raw: list[dict], votacion_id: int,
                       diputados: list[dict], dry_run: bool = False) -> dict:
    """
    Hace fuzzy match de nombres contra DB y guarda (si no es dry_run).
    Devuelve estadísticas.
    """
    guardados = []
    sin_match  = []

    for v in votos_raw:
        dip = match_diputado(v['nombre'], diputados)
        if dip:
            guardados.append({
                'diputado_id':    dip['id'],
                'nombre':         dip['nombre_completo'],
                'voto':           v['voto'],
            })
        else:
            sin_match.append(v['nombre'])

    log.info(f'Matched: {len(guardados)} | Sin match: {len(sin_match)}')

    if guardados and not dry_run:
        guardar_votos(votacion_id, guardados)

    return {
        'total_raw':  len(votos_raw),
        'guardados':  len(guardados),
        'sin_match':  sin_match,
        'detalle':    guardados,
    }


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description='Parser de votos individuales — Asamblea CR')
    ap.add_argument('--url',         help='URL del PDF')
    ap.add_argument('--archivo',     help='Ruta local del PDF')
    ap.add_argument('--votacion-id', type=int, required=True, dest='votacion_id',
                    help='ID de la votación en la BD')
    ap.add_argument('--num-votacion', type=int, dest='num_votacion',
                    help='Número de ronda dentro del PDF (ej: 5 para "quinta votación")')
    ap.add_argument('--manual',      action='store_true',
                    help='Leer texto pegado manualmente desde stdin')
    ap.add_argument('--dry-run',     action='store_true', dest='dry_run',
                    help='Mostrar resultado sin guardar en BD')
    args = ap.parse_args()

    # ── Cargar diputados de la BD
    log.info('Cargando diputados de la BD...')
    diputados = cargar_diputados_db()
    log.info(f'{len(diputados)} diputados cargados')

    votos_raw = []

    if args.manual:
        # ── Modo manual: leer texto de stdin
        print('\n══════════════════════════════════════════════════')
        print('  Modo manual — pegá el texto de la votación')
        print('  (cuando termines, presioná Ctrl+D o Ctrl+Z)')
        print('══════════════════════════════════════════════════\n')
        texto = sys.stdin.read()
        votos_raw = parse_texto_manual(texto)

    elif args.url or args.archivo:
        # ── Obtener bytes del PDF
        if args.url:
            log.info(f'Descargando PDF: {args.url}')
            r = requests.get(args.url, verify=False, timeout=60,
                             headers={'User-Agent': 'Mozilla/5.0'})
            r.raise_for_status()
            pdf_bytes = r.content
        else:
            with open(args.archivo, 'rb') as f:
                pdf_bytes = f.read()

        log.info(f'PDF: {len(pdf_bytes)/1024/1024:.1f} MB')
        votos_raw = parse_pdf_bytes(pdf_bytes, args.num_votacion)

    else:
        ap.error('Especificá --url, --archivo o --manual')

    if not votos_raw:
        log.warning('No se extrajeron votos')
        sys.exit(1)

    log.info(f'{len(votos_raw)} votos extraídos. Procesando...')

    stats = procesar_y_guardar(votos_raw, args.votacion_id, diputados, args.dry_run)

    # ── Reporte final
    print('\n══════════════════════════════════════════════════')
    print(f'  Votos extraídos: {stats["total_raw"]}')
    print(f'  Guardados en BD: {stats["guardados"]}')
    if stats['sin_match']:
        print(f'\n  ⚠ Sin coincidencia ({len(stats["sin_match"])}) — revisar manualmente:')
        for n in stats['sin_match'][:20]:
            print(f'    - {n}')
    if args.dry_run:
        print('\n  (dry-run: nada fue guardado)')
    print('══════════════════════════════════════════════════\n')

    if stats['guardados'] > 0 and not args.dry_run:
        print(f'✅ Mapa de curules actualizado para votación #{args.votacion_id}')
        print(f'   Ver en: https://acontecer.co.cr/asamblea/votaciones')


if __name__ == '__main__':
    main()
