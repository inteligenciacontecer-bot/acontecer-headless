#!/usr/bin/env python3
"""
match_proponentes.py
Vincula expedientes (proyectos de ley) con los diputados que los proponen,
usando matching robusto por DOS apellidos para evitar falsos positivos
(muchos diputados comparten un apellido).

Crea/llena la tabla hake_asamblea_expediente_diputado (enlace N:M).
Idempotente: se puede correr cuantas veces se quiera.

Fuente de proponente: campo `proponente` de hake_asamblea_expedientes
(poblado por scraper_proyectos_asignados.py y scraper_asamblea.py).

Cron sugerido: correr despues de los scrapers de expedientes.
"""

import re, sys, unicodedata
from datetime import datetime


def log(msg):
    print(f"[MATCH {datetime.now().strftime('%H:%M:%S')}] {msg}", flush=True)


# ── Normalizacion ────────────────────────────────────────────────────────────
def norm(s: str) -> str:
    """Mayusculas, sin acentos, sin puntuacion rara, espacios colapsados."""
    if not s:
        return ""
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.upper()
    s = s.replace("-", " ").replace(".", " ").replace(",", " ")
    s = re.sub(r"\s+", " ", s)
    return s.strip()


# Tokens que NO son apellidos (particulas, conectores)
PARTICULAS = {"DE", "LA", "LOS", "LAS", "DEL", "Y", "G"}


def apellidos_de(nombre_completo: str):
    """
    Devuelve los dos apellidos (ultimos dos tokens significativos).
    Maneja apellidos compuestos comunes (Mc, Flórez-Estrada ya normalizado).
    """
    toks = [t for t in norm(nombre_completo).split() if t not in PARTICULAS]
    if len(toks) < 2:
        return None
    # Ultimos dos tokens = apellido1, apellido2
    return toks[-2], toks[-1]


# ── MySQL (credenciales desde wp-config.php) ─────────────────────────────────
def get_db_config():
    with open("/var/www/cms.acontecer.co.cr/wp-config.php") as f:
        txt = f.read()
    def _get(key):
        m = re.search(rf"define\s*\(\s*['\"]DB_{key}['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)", txt)
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
    host, port = cfg["host"], 3306
    if ":" in host:
        host, port = host.rsplit(":", 1)
        port = int(port)
    return pymysql.connect(
        host=host, port=port, user=cfg["user"], password=cfg["passwd"],
        database=cfg["db"], charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor, autocommit=False,
    )


# ── Esquema ──────────────────────────────────────────────────────────────────
DDL = """
CREATE TABLE IF NOT EXISTS hake_asamblea_expediente_diputado (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    expediente    VARCHAR(20)  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
    diputado_id   INT UNSIGNED NOT NULL,
    rol           VARCHAR(30)  DEFAULT 'proponente',
    created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_exp_dip (expediente, diputado_id),
    KEY idx_diputado (diputado_id),
    KEY idx_expediente (expediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
"""


def main():
    db = get_db()
    try:
        with db.cursor() as cur:
            cur.execute(DDL)
            db.commit()

            # Cargar diputados activos
            cur.execute(
                "SELECT id, nombre_completo FROM hake_asamblea_diputados WHERE activo=1"
            )
            diputados = cur.fetchall()
            # Pre-calcular apellidos normalizados de cada diputado
            dip_apellidos = []
            for d in diputados:
                ap = apellidos_de(d["nombre_completo"])
                if ap:
                    dip_apellidos.append((d["id"], d["nombre_completo"], ap[0], ap[1]))
            log(f"Diputados activos: {len(dip_apellidos)}")

            # Cargar expedientes con proponente no vacio ni generico
            cur.execute(
                "SELECT numero, proponente FROM hake_asamblea_expedientes "
                "WHERE proponente IS NOT NULL AND proponente <> ''"
            )
            expedientes = cur.fetchall()
            log(f"Expedientes con proponente: {len(expedientes)}")

            GENERICOS = ("PODER EJECUTIVO", "VARIOS DIPUTADOS", "FRACCION",
                         "FRACCIN", "ASAMBLEA LEGISLATIVA")

            links = []
            exp_sin_match = 0
            for e in expedientes:
                prop_norm = norm(e["proponente"])
                # Saltar proponentes 100% genericos (sin nombre individual)
                if any(g in prop_norm for g in GENERICOS) and not _tiene_nombre(prop_norm):
                    continue

                matched_any = False
                for dip_id, dip_nombre, ap1, ap2 in dip_apellidos:
                    # Exigir AMBOS apellidos como palabra completa
                    if re.search(rf"\b{re.escape(ap1)}\b", prop_norm) and \
                       re.search(rf"\b{re.escape(ap2)}\b", prop_norm):
                        links.append((e["numero"], dip_id))
                        matched_any = True
                if not matched_any:
                    exp_sin_match += 1

            log(f"Enlaces encontrados: {len(links)} | Expedientes sin match: {exp_sin_match}")

            # Reconstruir tabla (limpiar y reinsertar — idempotente)
            cur.execute("DELETE FROM hake_asamblea_expediente_diputado WHERE rol='proponente'")
            insertados = 0
            for numero, dip_id in links:
                try:
                    cur.execute(
                        "INSERT IGNORE INTO hake_asamblea_expediente_diputado "
                        "(expediente, diputado_id, rol) VALUES (%s, %s, 'proponente')",
                        (numero, dip_id)
                    )
                    insertados += cur.rowcount
                except Exception as ex:
                    log(f"  Error insertando {numero}->{dip_id}: {ex}")
            db.commit()
            log(f"Insertados {insertados} enlaces unicos.")

            # Reporte: top diputados por # proyectos
            cur.execute(
                "SELECT d.nombre_completo, COUNT(*) AS n "
                "FROM hake_asamblea_expediente_diputado ed "
                "JOIN hake_asamblea_diputados d ON d.id = ed.diputado_id "
                "GROUP BY ed.diputado_id ORDER BY n DESC LIMIT 15"
            )
            log("Top diputados con proyectos vinculados:")
            for r in cur.fetchall():
                log(f"  {r['n']:>3}  {r['nombre_completo']}")

    finally:
        db.close()


def _tiene_nombre(prop_norm: str) -> bool:
    """Heuristica: el proponente trae al menos un nombre individual ademas del generico."""
    # Si tras quitar las palabras genericas quedan >=2 tokens, probablemente hay un nombre
    limpio = prop_norm
    for g in ("PODER EJECUTIVO", "VARIOS DIPUTADOS Y DIPUTADAS", "VARIOS DIPUTADOS",
              "FRACCION", "FRACCIN", "ASAMBLEA LEGISLATIVA", "Y OTROS", "Y OTRAS",
              "PARTIDO", "DIPUTADO", "DIPUTADA", "DE LA", "DEL", "DE LOS"):
        limpio = limpio.replace(g, " ")
    toks = [t for t in limpio.split() if len(t) > 2]
    return len(toks) >= 2


if __name__ == "__main__":
    main()
