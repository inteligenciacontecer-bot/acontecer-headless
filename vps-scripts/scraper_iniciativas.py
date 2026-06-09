#!/usr/bin/env python3
"""
scraper_iniciativas.py
Sincroniza TODOS los proyectos de ley en corriente legislativa (periodo actual)
desde la lista SharePoint "Listado de iniciativas en corriente legislativa".

Campos: N de proyecto (expediente), Tipo de Iniciativa (titulo), Presentado por
(proponente), Estado Actual (comision/estado), fechas.

Upsert en hake_asamblea_expedientes (llave UNIQUE en numero -> sin duplicados).
Luego corre el matcher de proponentes para vincular a diputados.

Cron sugerido: cada 6h (los proyectos cambian de estado seguido).
"""
import urllib.request, json, ssl, urllib.parse, re, sys
from datetime import datetime, date

CTX = ssl._create_unverified_context()
BASE = "https://www.asamblea.go.cr/glcp/_api/web"
LISTA = "Listado de iniciativas en corriente legislativa"
DB_PREFIX = "hake_"


def log(m):
    print(f"[INICIATIVAS {datetime.now().strftime('%H:%M:%S')}] {m}", flush=True)


def fetch_all():
    """Trae todos los items de la lista (paginado)."""
    select = ("Title,Tipo_x0020_de_x0020_Iniciativa,Presentado_x0020_por,"
              "N_x00fa_mero_x0020_de_x0020_proy,Estado_x0020_Actual,Created,Modified")
    url = (f"{BASE}/lists/getbytitle('{urllib.parse.quote(LISTA)}')/items"
           f"?$top=500&$select={select}")
    out = []
    while url:
        req = urllib.request.Request(url, headers={
            "Accept": "application/json;odata=verbose", "User-Agent": "Mozilla/5.0"})
        d = json.loads(urllib.request.urlopen(req, timeout=40, context=CTX).read())
        out += d.get("d", {}).get("results", [])
        url = d.get("d", {}).get("__next")
    return out


def limpiar(html):
    if not html:
        return ""
    try:
        from bs4 import BeautifulSoup
        txt = BeautifulSoup(html, "html.parser").get_text(" ", strip=True)
    except Exception:
        txt = re.sub(r"<[^>]+>", " ", html)
    return re.sub(r"\s+", " ", txt).strip()


def get_db():
    import re as _re, pymysql
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
                           cursorclass=pymysql.cursors.DictCursor, autocommit=False)


def main():
    log("Descargando lista de iniciativas en corriente legislativa...")
    items = fetch_all()
    log(f"Items: {len(items)}")

    registros = []
    for it in items:
        num_raw = str(it.get("N_x00fa_mero_x0020_de_x0020_proy") or "")
        # Tomar SOLO el primer expediente (formato 25.252 / 25252), evitar concatenar varios
        m = re.search(r"\d{2}[.\s]?\d{3}", num_raw) or re.search(r"\d{4,6}", num_raw)
        if not m:
            continue
        numero = re.sub(r"[^0-9]", "", m.group(0))
        if len(numero) < 4 or len(numero) > 6:
            continue
        titulo = limpiar(it.get("Tipo_x0020_de_x0020_Iniciativa"))
        proponente = limpiar(it.get("Presentado_x0020_por"))
        estado_raw = limpiar(it.get("Estado_x0020_Actual"))
        # Estado Actual suele traer la comision o el lugar del tramite
        comision = estado_raw if "comisi" in estado_raw.lower() else ""
        estado = "EN COMISIÓN" if comision else (estado_raw[:90] or "EN CORRIENTE")
        fecha = (it.get("Created") or "")[:10] or None
        if not titulo:
            continue
        registros.append({
            "numero": numero, "titulo": titulo[:500], "proponente": proponente[:200],
            "estado": estado[:100], "comision": comision[:200], "fecha": fecha,
        })

    log(f"Registros validos: {len(registros)}")
    db = get_db()
    ins, upd = 0, 0
    with db.cursor() as cur:
        for r in registros:
            cur.execute(
                f"""INSERT INTO {DB_PREFIX}asamblea_expedientes
                      (numero, titulo, proponente, estado, comision, fecha_presentacion, created_at, updated_at)
                    VALUES (%s,%s,%s,%s,%s,%s,NOW(),NOW())
                    ON DUPLICATE KEY UPDATE
                      titulo = VALUES(titulo),
                      proponente = IF(VALUES(proponente) <> '', VALUES(proponente), proponente),
                      estado = VALUES(estado),
                      comision = IF(VALUES(comision) <> '', VALUES(comision), comision),
                      fecha_presentacion = COALESCE(fecha_presentacion, VALUES(fecha_presentacion)),
                      updated_at = NOW()""",
                (r["numero"], r["titulo"], r["proponente"], r["estado"],
                 r["comision"], r["fecha"]))
            if cur.rowcount == 1:
                ins += 1
            elif cur.rowcount == 2:
                upd += 1
        db.commit()
    log(f"Insertados: {ins} | actualizados: {upd}")

    # Reporte de cobertura
    with db.cursor() as cur:
        cur.execute(f"SELECT COUNT(*) t, SUM(CAST(numero AS UNSIGNED)>=25000) n25 FROM {DB_PREFIX}asamblea_expedientes")
        row = cur.fetchone()
        log(f"Total expedientes en DB: {row['t']} | del periodo actual (25xxx+): {row['n25']}")
    db.close()


if __name__ == "__main__":
    main()
