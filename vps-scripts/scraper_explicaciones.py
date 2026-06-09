#!/usr/bin/env python3
"""
scraper_explicaciones.py
Genera una explicacion en lenguaje sencillo de cada proyecto de ley (para el
publico y para SEO) usando Claude Haiku (barato). Procesa los expedientes que
aun no tienen explicacion. Idempotente.

Requiere ANTHROPIC_API_KEY en el entorno.
Cron sugerido: 45 */4 * * *  (cada 4h, procesa un lote).
"""
import urllib.request, json, ssl, re, os, sys
from datetime import datetime

CTX = ssl._create_unverified_context()
DB_PREFIX = "hake_"
MODEL = "claude-haiku-4-5"
LOTE = int(os.environ.get("EXP_LOTE", "40"))  # cuantos por corrida


def log(m):
    print(f"[EXPLICA {datetime.now().strftime('%H:%M:%S')}] {m}", flush=True)


def get_db():
    import pymysql
    with open("/var/www/cms.acontecer.co.cr/wp-config.php") as f:
        txt = f.read()
    def g(k):
        m = re.search(rf"define\s*\(\s*['\"]DB_{k}['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)", txt)
        return m.group(1) if m else ""
    host, port = g("HOST") or "localhost", 3306
    if ":" in host:
        host, port = host.rsplit(":", 1); port = int(port)
    return pymysql.connect(host=host, port=port, user=g("USER"), password=g("PASSWORD"),
                           database=g("NAME"), charset="utf8mb4",
                           cursorclass=pymysql.cursors.DictCursor, autocommit=False)


def explicar(e):
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        return ""
    prompt = (
        "Sos un periodista que explica leyes al publico de Costa Rica. En 2 oraciones claras y "
        "sencillas, explica de que trata este proyecto de ley y a quien afecta o beneficia. Sin "
        "tecnicismos, sin repetir el titulo literal, sin inventar detalles que no esten.\n\n"
        f"Titulo: {e['titulo']}\n"
        f"Comision: {e.get('comision') or 'No asignada'}\n"
        f"Proponente: {e.get('proponente') or 'No indicado'}\n"
        f"Estado: {e.get('estado') or ''}"
    )
    body = json.dumps({
        "model": MODEL, "max_tokens": 220,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body, headers={
        "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01"})
    try:
        r = urllib.request.urlopen(req, timeout=60, context=CTX)
        return json.loads(r.read())["content"][0]["text"].strip()
    except Exception as ex:
        log(f"  API err {e['numero']}: {ex}")
        return ""


def main():
    db = get_db()
    with db.cursor() as cur:
        cur.execute(
            f"SELECT numero, titulo, comision, proponente, estado FROM {DB_PREFIX}asamblea_expedientes "
            f"WHERE (explicacion IS NULL OR explicacion='') AND titulo<>'' "
            f"ORDER BY CAST(numero AS UNSIGNED) DESC LIMIT %s", (LOTE,))
        pend = cur.fetchall()
    log(f"Pendientes en este lote: {len(pend)}")
    n = 0
    for e in pend:
        txt = explicar(e)
        if not txt:
            continue
        with db.cursor() as cur:
            cur.execute(f"UPDATE {DB_PREFIX}asamblea_expedientes SET explicacion=%s WHERE numero=%s",
                        (txt[:1500], e["numero"]))
            db.commit()
        n += 1
    log(f"Explicaciones generadas: {n}")
    with db.cursor() as cur:
        cur.execute(f"SELECT COUNT(*) c FROM {DB_PREFIX}asamblea_expedientes WHERE explicacion IS NOT NULL AND explicacion<>''")
        log(f"Total con explicacion: {cur.fetchone()['c']}")
    db.close()


if __name__ == "__main__":
    main()
