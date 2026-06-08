#!/usr/bin/env python3
"""
scraper_proyectos_asignados.py
Descarga los Oficios SD de la Asamblea Legislativa (SharePoint) y extrae
los proyectos de ley nuevos asignados a comision, insertandolos en la
tabla hake_asamblea_expedientes de MySQL.

Fuente: SharePoint Asamblea - Proyectos asignados a comision legislatura 2026-2027
Cron sugerido: 0 7,12,17 * * 1-5
"""

import urllib.request, json, ssl, re, os, sys, io
from datetime import datetime

# ── Config ──────────────────────────────────────────────────────────────────
BASE_ASAMBLEA = "https://www.asamblea.go.cr"
FOLDER_API = (
    BASE_ASAMBLEA +
    "/glcp/_api/web/GetFolderByServerRelativeUrl("
    "'/glcp/Listas%20de%20proyectos%20de%20ley%20nuevos%20con%20comisin%20asig"
    "/Proyectos%20asignados%20a%20comisi%C3%B3n%20legislatura%202026-2027'"
    ")/Files?$select=Name,ServerRelativeUrl,TimeLastModified"
    "&$orderby=TimeLastModified%20desc"
)
PROCESSED_FILE = os.path.join(os.path.dirname(__file__), "data", "proyectos_asignados_processed.json")

# ── SSL sin verificar (cert Asamblea no confiable en Debian) ─────────────────
CTX = ssl._create_unverified_context()

MESES = {
    "enero":1,"febrero":2,"marzo":3,"abril":4,"mayo":5,"junio":6,
    "julio":7,"agosto":8,"septiembre":9,"octubre":10,"noviembre":11,"diciembre":12
}

def log(msg):
    print(f"[PROYECTOS {datetime.now().strftime('%H:%M:%S')}] {msg}", flush=True)

# ── HTTP helper ──────────────────────────────────────────────────────────────
def fetch(url, headers=None, binary=False):
    hdrs = {"User-Agent": "Mozilla/5.0 (compatible; AcontecerBot/1.0)"}
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, headers=hdrs)
    r = urllib.request.urlopen(req, timeout=30, context=CTX)
    return r.read() if binary else r.read().decode("utf-8", errors="replace")

# ── SharePoint: listar PDFs ──────────────────────────────────────────────────
def listar_pdfs():
    raw = fetch(FOLDER_API, {"Accept": "application/json;odata=verbose"})
    data = json.loads(raw)
    return data.get("d", {}).get("results", [])

# ── Descargar PDF ────────────────────────────────────────────────────────────
def descargar_pdf(server_relative_url):
    import urllib.parse
    parts = server_relative_url.split("/")
    encoded = "/".join(urllib.parse.quote(p, safe="") for p in parts)
    url = BASE_ASAMBLEA + encoded
    return fetch(url, binary=True)

# ── Extraer texto del PDF ────────────────────────────────────────────────────
def extraer_texto(pdf_bytes):
    import pdfplumber
    text_parts = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            t = page.extract_text() or ""
            text_parts.append(t)
    return "\n".join(text_parts)

# ── Parsear proyectos del texto ──────────────────────────────────────────────
def parsear_proyectos(texto, nombre_oficio):
    # Normalizar artefactos OCR y saltos de linea
    # La Asamblea usa PDFs escaneados donde la OCR confunde G↔C en ciertas fuentes
    texto = (texto
        .replace("N®", "N°")
        .replace("N.°", "N°")
        .replace("\n", " ")
        .replace("  ", " ")
        # Errores OCR tipicos de los PDFs de la Asamblea (G por C en mayusculas)
        .replace("GOMISIÓN", "COMISIÓN")
        .replace("GOMISION", "COMISION")
        .replace("ADMINISTRAGION", "ADMINISTRACIÓN")
        .replace("ADICION", "ADICIÓN")
        .replace("ADICGION", "ADICIÓN")
        .replace("EXPLORAGION", "EXPLORACIÓN")
        .replace("EXPLORAGI", "EXPLORACIÓN")
        .replace("ORGANIGA", "ORGÁNICA")
        .replace("PROVINGIA", "PROVINCIA")
        .replace("OGTUBRE", "OCTUBRE")
        .replace("GARLOS", "CARLOS"))

    # Extraer fecha del nombre del oficio: "...del 3 de junio de 2026.pdf"
    fecha_oficio = None
    fecha_m = re.search(r"del?\s+(\d+)\s+de\s+(\w+)\s+de\s+(\d{4})", nombre_oficio, re.I)
    if fecha_m:
        d, mes_str, y = fecha_m.groups()
        m = MESES.get(mes_str.lower())
        if m:
            fecha_oficio = f"{y}-{m:02d}-{int(d):02d}"

    # Extraer numero de oficio
    oficio_m = re.search(r"(SD[\s-]\d+[-]\d+[-]\d+)", nombre_oficio, re.I)
    oficio_num = oficio_m.group(1).replace(" ", "-") if oficio_m else nombre_oficio[:40]

    proyectos = []

    # Partir en items numerados: "1) ...", "2) ..."
    # re.split retorna ["previo","1","contenido1","2","contenido2",...]
    partes = re.split(r'\s+(\d{1,2})\)\s+', texto)

    i = 1
    while i < len(partes) - 1:
        num_str = partes[i]
        contenido = partes[i + 1] if i + 1 < len(partes) else ""
        i += 2

        if not num_str.isdigit():
            continue

        # Titulo: entre comillas dobles tipograficas o ASCII
        titulo_m = re.search(r'[“"](.{10,600})[”"]', contenido)
        if not titulo_m:
            # Buscar comillas normales como fallback
            titulo_m = re.search(r'"(.{10,600})"', contenido)
        if not titulo_m:
            log(f"  Item {num_str}: sin titulo, saltando")
            continue
        titulo = re.sub(r'\s+', ' ', titulo_m.group(1).strip())

        # Expediente: "EXPEDIENTE N° 25.518" -> "25518"
        exp_m = re.search(r'EXPEDIENTE\s+N[°o®]?\s*([\d.,]+)', contenido, re.I)
        if not exp_m:
            log(f"  Item {num_str}: sin expediente, saltando")
            continue
        numero = re.sub(r'[.,]', '', exp_m.group(1))

        # Comision: despues de "Pasa a estudio de la"
        com_m = re.search(r'Pasa a estudio de la\s+(.+?)(?:\.\s*$|\.?\s*$)', contenido, re.I)
        comision = ""
        if com_m:
            comision = re.sub(r'\s+', ' ', com_m.group(1).strip()).rstrip(".")

        # Proponente: texto ANTES de la primera comilla, sin prefijos de cargo
        antes_titulo = contenido[:titulo_m.start()].strip()
        proponente = re.sub(
            r'^(DE LOS? DIPUTAD[OAS]+\s+|DEL PODER EJECUTIVO\s*)',
            '', antes_titulo, flags=re.I
        ).strip().rstrip(".," )
        proponente = re.sub(r'\s+', ' ', proponente)[:400]

        proyectos.append({
            "numero": numero,
            "titulo": titulo.upper(),
            "comision": comision.upper(),
            "proponente": proponente.upper() if proponente else "ASAMBLEA LEGISLATIVA",
            "estado": "COMISION",
            "fecha_presentacion": fecha_oficio,
            "fuente_oficio": oficio_num,
        })
        log(f"  Exp {numero}: {titulo[:60]}...")

    return proyectos

# ── MySQL (credenciales desde wp-config.php igual que scraper_asamblea.py) ───
def get_db_config():
    import re as _re
    with open("/var/www/cms.acontecer.co.cr/wp-config.php") as f:
        txt = f.read()
    def _get(key):
        m = _re.search(rf"define\s*\(\s*['\"]DB_{key}['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)", txt)
        return m.group(1) if m else ""
    return {
        "host": _get("HOST") or "localhost",
        "db":   _get("NAME"),
        "user": _get("USER"),
        "passwd": _get("PASSWORD"),
    }

def get_db():
    import pymysql
    cfg = get_db_config()
    host = cfg["host"]
    port = 3306
    if ":" in host:
        host, port = host.rsplit(":", 1)
        port = int(port)
    return pymysql.connect(
        host=host, port=port,
        user=cfg["user"], password=cfg["passwd"],
        database=cfg["db"],
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
    )

def upsert_proyectos(proyectos):
    if not proyectos:
        return 0
    db = get_db()
    insertados = 0
    actualizados = 0
    try:
        with db.cursor() as cur:
            for p in proyectos:
                cur.execute(
                    "SELECT id, comision FROM hake_asamblea_expedientes WHERE numero=%s",
                    (p["numero"],)
                )
                row = cur.fetchone()
                if row:
                    # Solo actualizar comision si estaba vacia
                    if not row["comision"] and p["comision"]:
                        cur.execute(
                            "UPDATE hake_asamblea_expedientes "
                            "SET comision=%s, estado=%s, updated_at=NOW() WHERE numero=%s",
                            (p["comision"], p["estado"], p["numero"])
                        )
                        actualizados += 1
                else:
                    cur.execute(
                        """INSERT INTO hake_asamblea_expedientes
                           (numero, titulo, estado, comision, proponente,
                            fecha_presentacion, created_at, updated_at)
                           VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())""",
                        (p["numero"], p["titulo"], p["estado"], p["comision"],
                         p["proponente"], p["fecha_presentacion"])
                    )
                    insertados += 1
    finally:
        db.close()
    log(f"DB: {insertados} insertados, {actualizados} actualizados con comision")
    return insertados + actualizados

# ── Estado de PDFs procesados ────────────────────────────────────────────────
def cargar_procesados():
    try:
        with open(PROCESSED_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    except Exception:
        return set()

def guardar_procesados(procesados):
    os.makedirs(os.path.dirname(PROCESSED_FILE), exist_ok=True)
    with open(PROCESSED_FILE, "w", encoding="utf-8") as f:
        json.dump(sorted(procesados), f, ensure_ascii=False, indent=2)

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    log("Iniciando scraper de proyectos asignados a comision (via SharePoint)...")
    procesados = cargar_procesados()

    try:
        pdfs = listar_pdfs()
    except Exception as e:
        log(f"ERROR listando PDFs SharePoint: {e}")
        sys.exit(1)

    log(f"PDFs disponibles: {len(pdfs)} | Ya procesados: {len(procesados)}")
    total_nuevos = 0

    for pdf_info in pdfs:
        nombre = pdf_info["Name"]
        if nombre in procesados:
            log(f"  Saltando (ya procesado): {nombre}")
            continue

        log(f"Procesando: {nombre}")
        try:
            pdf_bytes = descargar_pdf(pdf_info["ServerRelativeUrl"])
            log(f"  Descargado: {len(pdf_bytes):,} bytes")
            texto = extraer_texto(pdf_bytes)
            proyectos = parsear_proyectos(texto, nombre)
            log(f"  Proyectos encontrados: {len(proyectos)}")
            if proyectos:
                n = upsert_proyectos(proyectos)
                total_nuevos += n
            # Marcar como procesado aunque no haya proyectos (PDF leido OK)
            procesados.add(nombre)
            guardar_procesados(procesados)
        except Exception as e:
            log(f"  ERROR en {nombre}: {e}")
            import traceback
            traceback.print_exc()

    log(f"Finalizado. Total registros nuevos/actualizados: {total_nuevos}")

if __name__ == "__main__":
    main()
