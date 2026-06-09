#!/usr/bin/env python3
"""Marca como APROBADO (convertido en ley) los expedientes que ya son ley,
segun la lista oficial 'Lista de iniciativas convertidas en ley'. Asi los
proyectos viejos ya aprobados no quedan mostrandose como pendientes."""
import urllib.request, json, ssl, urllib.parse, re
DB_PREFIX = "hake_"
CTX = ssl._create_unverified_context()
B = "https://www.asamblea.go.cr/glcp/_api/web"

def fj(u):
    return json.loads(urllib.request.urlopen(urllib.request.Request(u, headers={"Accept":"application/json;odata=verbose","User-Agent":"Mozilla/5.0"}), timeout=40, context=CTX).read())

def get_db():
    import pymysql
    t = open("/var/www/cms.acontecer.co.cr/wp-config.php").read()
    def g(k):
        m = re.search(rf"define\s*\(\s*['\"]DB_{k}['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)", t); return m.group(1) if m else ""
    h, p = g("HOST") or "localhost", 3306
    if ":" in h: h, p = h.rsplit(":", 1); p = int(p)
    import pymysql as my
    return my.connect(host=h, port=p, user=g("USER"), password=g("PASSWORD"), database=g("NAME"), charset="utf8mb4", cursorclass=my.cursors.DictCursor, autocommit=False)

L = "Lista de iniciativas convertidas en ley"
url = f"{B}/lists/getbytitle('{urllib.parse.quote(L)}')/items?$top=500&$select=Title,Contacto,Instituci_x00f3_n_x0020_solicita"
items = fj(url).get("d", {}).get("results", [])
print(f"Leyes: {len(items)}")
db = get_db(); upd = 0
with db.cursor() as cur:
    for it in items:
        m = re.search(r"\d{2}[.\s]?\d{3}", str(it.get("Contacto") or ""))
        if not m: continue
        numero = re.sub(r"[^0-9]", "", m.group(0))
        ley = re.sub(r"\s+", " ", str(it.get("Title") or "")).strip()
        estado = f"CONVERTIDO EN {ley}"[:100] if ley else "CONVERTIDO EN LEY"
        cur.execute(f"UPDATE {DB_PREFIX}asamblea_expedientes SET estado=%s WHERE numero=%s", (estado, numero))
        upd += cur.rowcount
    db.commit()
print(f"Expedientes marcados como ley: {upd}")
db.close()
