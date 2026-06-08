#!/usr/bin/env python3
"""
scraper_actas.py
Indexa las actas legislativas publicadas por la Asamblea en SharePoint y
genera una explicacion breve de cada una (con Claude, cacheada).

Fuentes (SharePoint REST, sin auth):
  - directorio  : /glcp/Documentos compartidos/2026               (.docx)
  - jefaturas   : /glcp/actas_jefaturas/Actas Período 2025-2026   (.pdf)
  - comisiones  : /glcp/actas_instalacion_com/<tipo>/<comision>/  (.pdf, anidado)

Tabla: hake_asamblea_actas (idempotente por url_hash).
La explicacion se genera UNA sola vez por acta (si resumen vacio).

Cron sugerido: 30 6 * * * (diario, antes del matutino).
Para Claude: correr con ANTHROPIC_API_KEY en el entorno
  set -a; . /opt/acontecer-ia/.env; set +a; /opt/venv/bin/python3 scraper_actas.py
"""

import urllib.request, json, ssl, re, os, sys, io, hashlib, unicodedata
from datetime import datetime, date

CTX = ssl._create_unverified_context()
BASE = "https://www.asamblea.go.cr"
API_FOLDER = BASE + "/glcp/_api/web/GetFolderByServerRelativeUrl('{enc}')"

FUENTES = [
    {"tipo": "directorio", "label": "Directorio Legislativo",
     "rel": "/glcp/Documentos compartidos/2026", "recursivo": False},
    {"tipo": "jefaturas", "label": "Jefes de Fraccion",
     "rel": "/glcp/actas_jefaturas/Actas Período 2025-2026", "recursivo": False},
    {"tipo": "comisiones", "label": "Comisiones",
     "rel": "/glcp/actas_instalacion_com", "recursivo": True},
]

MESES = {1:"enero",2:"febrero",3:"marzo",4:"abril",5:"mayo",6:"junio",
         7:"julio",8:"agosto",9:"septiembre",10:"octubre",11:"noviembre",12:"diciembre"}


def log(m):
    print(f"[ACTAS {datetime.now().strftime('%H:%M:%S')}] {m}", flush=True)


# ── HTTP ─────────────────────────────────────────────────────────────────────
def fetch(url, headers=None, binary=False, timeout=40):
    h = {"User-Agent": "Mozilla/5.0 (compatible; AcontecerBot/1.0)"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, headers=h)
    r = urllib.request.urlopen(req, timeout=timeout, context=CTX)
    return r.read() if binary else r.read().decode("utf-8", "replace")


def sp_json(url):
    import urllib.parse
    return json.loads(fetch(url, {"Accept": "application/json;odata=verbose"}))


def url_for(rel):
    import urllib.parse
    return API_FOLDER.format(enc=urllib.parse.quote(rel, safe=""))


def archivo_url(server_relative_url):
    import urllib.parse
    parts = server_relative_url.split("/")
    return BASE + "/".join(urllib.parse.quote(p, safe="") for p in parts)


# ── Recoleccion de archivos ──────────────────────────────────────────────────
def listar_archivos(rel, recursivo, categoria="", depth=0):
    """Devuelve [{name, url_rel, categoria}] de una carpeta (recursivo opcional)."""
    out = []
    try:
        files = sp_json(url_for(rel) + "/Files?$select=Name,ServerRelativeUrl,TimeLastModified&$top=200") \
            .get("d", {}).get("results", [])
        for f in files:
            name = f["Name"]
            if not re.search(r"\.(pdf|docx?)$", name, re.I):
                continue
            out.append({
                "name": name,
                "url_rel": f["ServerRelativeUrl"],
                "modified": f.get("TimeLastModified", ""),
                "categoria": categoria,
            })
    except Exception as e:
        log(f"  err files {rel}: {e}")

    if recursivo and depth < 3:
        try:
            folders = sp_json(url_for(rel) + "/Folders?$select=Name,ServerRelativeUrl&$top=60") \
                .get("d", {}).get("results", [])
            for fo in folders:
                if fo["Name"].startswith("Forms"):
                    continue
                # La categoria mas util es el nombre de la comision (ultimo nivel con archivos)
                sub_cat = fo["Name"] if depth >= 1 else categoria
                out.extend(listar_archivos(fo["ServerRelativeUrl"], True, sub_cat, depth + 1))
        except Exception as e:
            log(f"  err folders {rel}: {e}")
    return out


# ── Extraccion de texto ──────────────────────────────────────────────────────
def extraer_texto(data, formato):
    try:
        if formato == "pdf":
            import pdfplumber
            parts = []
            with pdfplumber.open(io.BytesIO(data)) as pdf:
                for pg in pdf.pages[:8]:   # primeras 8 paginas bastan para resumir
                    parts.append(pg.extract_text() or "")
            return "\n".join(parts)
        else:  # docx
            import docx
            d = docx.Document(io.BytesIO(data))
            return "\n".join(p.text for p in d.paragraphs[:120])
    except Exception as e:
        log(f"  err extraer texto: {e}")
        return ""


# ── Metadatos del nombre ─────────────────────────────────────────────────────
def parse_meta(name, tipo, categoria):
    base = re.sub(r"\.(pdf|docx?)$", "", name, flags=re.I)
    # numero de acta
    num_m = re.search(r"(\d{1,4}[-./]?\d{0,4})", base)
    numero = num_m.group(1) if num_m else ""
    # titulo legible
    titulo = re.sub(r"\s+", " ", base.replace(".", " ").replace("_", " ")).strip()
    if tipo == "jefaturas":
        titulo = re.sub(r"\bJF\b|\bJefes?\b", "", titulo, flags=re.I).strip(" .-")
        titulo = f"Acta {numero} — Jefes de Fraccion" if numero else titulo
    return numero, titulo


def fecha_de(texto, modified):
    # Buscar fecha en texto: "3 de junio de 2026" / "03-06-2026"
    m = re.search(r"(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})", texto or "", re.I)
    if m:
        d, mes, y = m.groups()
        inv = {v: k for k, v in MESES.items()}
        mm = inv.get(mes.lower())
        if mm:
            try:
                return date(int(y), mm, int(d)).isoformat()
            except Exception:
                pass
    if modified:
        return modified[:10]
    return None


# ── Resumen con Claude (cacheado) ────────────────────────────────────────────
def _anthropic_key():
    """Lee la API key del entorno o, si no está, del .env del bot (solo esa línea).
    Nunca se imprime. Mismo patrón que get_db() leyendo wp-config.php."""
    k = os.environ.get("ANTHROPIC_API_KEY", "")
    if k:
        return k
    try:
        with open("/opt/acontecer-ia/.env") as f:
            for line in f:
                if line.startswith("ANTHROPIC_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    except Exception:
        pass
    return ""


def resumir_con_claude(texto, contexto):
    key = _anthropic_key()
    texto = (texto or "").strip()
    if not texto:
        return ""
    if not key:
        # Fallback sin Claude: primer parrafo significativo
        limpio = re.sub(r"\s+", " ", texto).strip()
        return limpio[:280] + ("…" if len(limpio) > 280 else "")
    prompt = (
        f"Resume en 2 oraciones, en espanol neutro y claro, de que trata esta acta legislativa "
        f"de Costa Rica ({contexto}). Se concreto: que organo sesiono, que se decidio o discutio. "
        f"No inventes. No uses vinetas. Texto del acta:\n\n{texto[:6000]}"
    )
    try:
        body = json.dumps({
            "model": "claude-sonnet-4-6",
            "max_tokens": 200,
            "messages": [{"role": "user", "content": prompt}],
        }).encode("utf-8")
        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages", data=body,
            headers={
                "Content-Type": "application/json",
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
            })
        r = urllib.request.urlopen(req, timeout=60, context=CTX)
        data = json.loads(r.read())
        return data["content"][0]["text"].strip()
    except Exception as e:
        log(f"  Claude err: {e}")
        limpio = re.sub(r"\s+", " ", texto).strip()
        return limpio[:280] + ("…" if len(limpio) > 280 else "")


# ── MySQL ────────────────────────────────────────────────────────────────────
def get_db():
    import pymysql, re as _re
    with open("/var/www/cms.acontecer.co.cr/wp-config.php") as f:
        txt = f.read()
    def g(k):
        m = _re.search(rf"define\s*\(\s*['\"]DB_{k}['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)", txt)
        return m.group(1) if m else ""
    host, port = g("HOST") or "localhost", 3306
    if ":" in host:
        host, port = host.rsplit(":", 1); port = int(port)
    return pymysql.connect(host=host, port=port, user=g("USER"), password=g("PASSWORD"),
                           database=g("NAME"), charset="utf8mb4",
                           cursorclass=pymysql.cursors.DictCursor, autocommit=True)


DDL = """
CREATE TABLE IF NOT EXISTS hake_asamblea_actas (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    tipo        VARCHAR(40)  NOT NULL,
    categoria   VARCHAR(220) DEFAULT '',
    titulo      VARCHAR(320) NOT NULL,
    numero      VARCHAR(40)  DEFAULT '',
    fecha       DATE         NULL,
    url_archivo VARCHAR(700) NOT NULL,
    url_hash    CHAR(40)     NOT NULL,
    formato     VARCHAR(8)   DEFAULT 'pdf',
    resumen     TEXT,
    texto_len   INT          DEFAULT 0,
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_hash (url_hash),
    KEY idx_tipo (tipo),
    KEY idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
"""


def main():
    solo_index = "--index-only" in sys.argv   # no descarga ni resume, solo lista
    limite = None
    for i, a in enumerate(sys.argv):
        if a == "--limit" and i + 1 < len(sys.argv):
            limite = int(sys.argv[i + 1])
    db = get_db()
    with db.cursor() as cur:
        cur.execute(DDL)

    # 1. Recolectar todos los archivos de todas las fuentes
    todos = []
    for fu in FUENTES:
        log(f"Listando {fu['tipo']} ...")
        archivos = listar_archivos(fu["rel"], fu["recursivo"], fu["label"])
        for a in archivos:
            a["tipo"] = fu["tipo"]
        log(f"  {len(archivos)} archivos")
        todos.extend(archivos)
    log(f"TOTAL archivos: {len(todos)}")

    # 2. Cargar hashes ya procesados (con resumen)
    with db.cursor() as cur:
        cur.execute("SELECT url_hash, resumen FROM hake_asamblea_actas")
        existentes = {r["url_hash"]: r["resumen"] for r in cur.fetchall()}

    nuevos = 0
    resumidos = 0
    for a in todos:
        url_abs = archivo_url(a["url_rel"])
        h = hashlib.sha1(url_abs.encode("utf-8")).hexdigest()
        ya = h in existentes
        tiene_resumen = bool(existentes.get(h))
        if ya and tiene_resumen:
            continue   # nada que hacer

        if limite is not None and resumidos >= limite:
            break

        formato = "pdf" if a["name"].lower().endswith(".pdf") else "docx"
        numero, titulo = parse_meta(a["name"], a["tipo"], a["categoria"])

        resumen = ""
        fecha = a.get("modified", "")[:10] or None
        texto_len = 0
        if not solo_index:
            try:
                data = fetch(url_abs, binary=True)
                texto = extraer_texto(data, formato)
                texto_len = len(texto)
                ctx = f"{a['tipo']}" + (f", {a['categoria']}" if a["categoria"] else "")
                resumen = resumir_con_claude(texto, ctx)
                fecha = fecha_de(texto, a.get("modified", "")) or fecha
                resumidos += 1
            except Exception as e:
                log(f"  err procesando {a['name']}: {e}")

        with db.cursor() as cur:
            if ya:
                cur.execute(
                    "UPDATE hake_asamblea_actas SET resumen=%s, fecha=%s, texto_len=%s "
                    "WHERE url_hash=%s",
                    (resumen, fecha, texto_len, h))
            else:
                cur.execute(
                    """INSERT INTO hake_asamblea_actas
                       (tipo, categoria, titulo, numero, fecha, url_archivo, url_hash, formato, resumen, texto_len)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (a["tipo"], a["categoria"], titulo[:320], numero, fecha,
                     url_abs[:700], h, formato, resumen, texto_len))
                nuevos += 1
        log(f"  {'+' if not ya else '~'} [{a['tipo']}] {titulo[:55]}")

    db.close()
    log(f"Finalizado. Nuevos: {nuevos} | Resumidos: {resumidos}")


if __name__ == "__main__":
    main()
