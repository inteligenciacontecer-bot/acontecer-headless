#!/usr/bin/env python3
"""
scraper_loteria.py — Resultados de la lotería de Costa Rica (JPS).

Fuente: jpsloteria.com (republica los resultados OFICIALES de la JPS; los
números premiados son hechos públicos, sin copyright). La JPS oficial
(jps.go.cr) está protegida por Akamai Bot Manager y no es scrapeable directo.

Diseño DEFENSIVO (igual que scraper_combustibles.py):
  - Si la fuente cambia o un juego no parsea, NO se sobrescribe con basura:
    se conserva el último valor válido del JSON anterior (merge defensivo).
  - Si se parsean menos de 3 juegos, aborta sin escribir.

Salida: /var/www/acontecer-headless/data/loteria.json
La página app/resultados-loteria/page.tsx lee ese JSON con fallback.

Uso:
  python3 scraper_loteria.py            # actualiza el JSON
  python3 scraper_loteria.py --dry-run  # solo imprime lo extraído

Cron sugerido (tras los sorteos diarios, hora CR — Nuevos Tiempos/3 Monazos
son ~12:55pm, 4:30pm, 7:30pm; Nacional dom; Lotto mié/sáb; Chances mar/vie):
  10 13,17,20 * * *  cd /var/www/acontecer-headless && python3 vps-scripts/scraper_loteria.py >> /var/log/loteria.log 2>&1
"""
import sys
import re
import json
import logging
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

URL = 'https://www.jpsloteria.com/'
OUT = Path('/var/www/acontecer-headless/data/loteria.json')
CR = ZoneInfo('America/Costa_Rica')
UA = ('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

# Orden de presentación de los juegos
ORDEN = ['nuevos-tiempos', '3-monazos', 'lotto', 'loteria-nacional', 'chances']

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [loteria] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
log = logging.getLogger()


def descargar() -> str:
    r = requests.get(URL, headers={'User-Agent': UA, 'Accept-Language': 'es-CR,es;q=0.9'},
                     timeout=30, verify=False)
    r.raise_for_status()
    return r.text


def detag(html: str) -> str:
    t = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', html, flags=re.I | re.S)
    t = re.sub(r'<[^>]+>', ' ', t)
    for a, b in [('&nbsp;', ' '), ('&aacute;', 'á'), ('&eacute;', 'é'), ('&iacute;', 'í'),
                 ('&oacute;', 'ó'), ('&uacute;', 'ú'), ('&ntilde;', 'ñ'), ('&Aacute;', 'Á'),
                 ('&deg;', '°'), ('&amp;', '&')]:
        t = t.replace(a, b)
    return re.sub(r'\s+', ' ', t)


# Fecha tipo "Viernes 5 de Junio de 2026"
DIA = r'(?:Lunes|Martes|Mi[ée]rcoles|Jueves|Viernes|S[áa]bado|Domingo)'
FECHA = DIA + r'\s+\d{1,2}\s+de\s+\w+\s+de\s+\d{4}'


def buscar(rgx, texto, grupo=1):
    m = re.search(rgx, texto, re.I)
    return m.group(grupo).strip() if m else None


def parse(texto: str) -> list:
    juegos = []

    f_nt = buscar(r'Nuevos Tiempos es el correspondiente al (' + FECHA + r')', texto)
    f_mz = buscar(r'Monazos es el del (' + FECHA + r')', texto)
    f_lotto = buscar(r'Lotto la última fecha disponible es del día (' + FECHA + r')', texto)
    f_chn = buscar(r'Chances y Loter[íi]a Nacional es de los d[íi]as (' + FECHA + r')', texto)

    # Nuevos Tiempos: día / tarde / noche
    m = re.search(r'Nuevos Tiempos se corresponden con el\s*(\d+)\s*para el sorteo de d[íi]a,?\s*'
                  r'(\d+)\s*para el sorteo de tarde y el\s*(\d+)\s*para el sorteo de noche', texto, re.I)
    if m:
        juegos.append({'clave': 'nuevos-tiempos', 'nombre': 'Nuevos Tiempos', 'fecha': f_nt, 'sorteos': [
            {'etiqueta': 'Mediodía', 'numeros': [m.group(1)]},
            {'etiqueta': 'Tarde', 'numeros': [m.group(2)]},
            {'etiqueta': 'Noche', 'numeros': [m.group(3)]},
        ]})
    else:
        log.warning('No se parseó Nuevos Tiempos')

    # 3 Monazos
    m = re.search(r'3 Monazos han correspondido a los siguientes n[úu]meros\s*,?\s*(\d+)\s*en el sorteo de d[íi]a,?\s*'
                  r'(\d+)\s*en el sorteo de tarde y\s*(\d+)\s*en el sorteo de noche', texto, re.I)
    if m:
        juegos.append({'clave': '3-monazos', 'nombre': '3 Monazos', 'fecha': f_mz, 'sorteos': [
            {'etiqueta': 'Mediodía', 'numeros': [m.group(1)]},
            {'etiqueta': 'Tarde', 'numeros': [m.group(2)]},
            {'etiqueta': 'Noche', 'numeros': [m.group(3)]},
        ]})
    else:
        log.warning('No se parseó 3 Monazos')

    # Lotto + Revancha
    lotto = []
    m = re.search(r'Lotto han correspondido respectivamente con la siguientes combinaci[óo]n ganadora\s*([\d,\s]+?)\s*\.', texto, re.I)
    if m:
        nums = [n.strip() for n in re.split(r'[,\s]+', m.group(1)) if n.strip().isdigit()]
        if nums:
            lotto.append({'etiqueta': 'Lotto', 'numeros': nums})
    m = re.search(r'Revancha los n[úu]meros ganadores son\s*([\d,\s]+?)\s*\.', texto, re.I)
    if m:
        nums = [n.strip() for n in re.split(r'[,\s]+', m.group(1)) if n.strip().isdigit()]
        if nums:
            lotto.append({'etiqueta': 'Revancha', 'numeros': nums})
    if lotto:
        juegos.append({'clave': 'lotto', 'nombre': 'Lotto', 'fecha': f_lotto, 'sorteos': lotto})
    else:
        log.warning('No se parseó Lotto')

    # Lotería Nacional: números desacoplados de la fecha (más robusto)
    m = re.search(r'ha correspondido con el\s*(\d+)\s*,?\s*siendo la serie ganadora el\s*(\d+)', texto, re.I)
    if m:
        f_nac = buscar(r'Nacional[^.]{0,40}?(' + FECHA + r')', texto)
        juegos.append({'clave': 'loteria-nacional', 'nombre': 'Lotería Nacional', 'fecha': f_nac, 'sorteos': [
            {'etiqueta': 'Primer premio', 'numeros': [m.group(1)], 'serie': m.group(2)},
        ]})
    else:
        log.warning('No se parseó Lotería Nacional')

    # Chances (Popular)
    m = re.search(r'Chances componen el primer premio el n[úu]mero\s*(\d+)\s*y la serie\s*(\d+)', texto, re.I)
    if m:
        juegos.append({'clave': 'chances', 'nombre': 'Chances', 'fecha': f_chn, 'sorteos': [
            {'etiqueta': 'Primer premio', 'numeros': [m.group(1)], 'serie': m.group(2)},
        ]})
    else:
        log.warning('No se parseó Chances')

    return juegos


def cargar_anterior() -> dict:
    try:
        return json.loads(OUT.read_text(encoding='utf-8'))
    except Exception:
        return {}


def main():
    dry = '--dry-run' in sys.argv
    try:
        html = descargar()
    except Exception as e:
        log.error(f'FALLO descarga: {e}')
        sys.exit(1)

    texto = detag(html)
    juegos = parse(texto)

    if len(juegos) < 3:
        log.error(f'Solo se parsearon {len(juegos)} juegos (<3). Abortando sin escribir.')
        sys.exit(1)

    # Merge defensivo: conserva juegos que no se parsearon esta vez.
    anterior = cargar_anterior()
    prev = {j.get('clave'): j for j in anterior.get('juegos', [])}
    actuales = {j['clave']: j for j in juegos}
    merged = []
    for clave in ORDEN:
        if clave in actuales:
            merged.append(actuales[clave])
        elif clave in prev:
            merged.append(prev[clave])

    data = {
        'actualizado': datetime.now(CR).isoformat(),
        'fuente': 'Junta de Protección Social (JPS)',
        'juegos': merged,
    }

    for j in merged:
        log.info(f"{j['nombre']}: " + ' · '.join(
            f"{s['etiqueta']} {'-'.join(s['numeros'])}" + (f"/{s['serie']}" if s.get('serie') else '')
            for s in j['sorteos']))

    if dry:
        print(json.dumps(data, ensure_ascii=False, indent=2))
        log.info('DRY-RUN: no se escribió el archivo.')
        return

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    log.info(f'Escrito {OUT} ✓ ({len(merged)} juegos)')


if __name__ == '__main__':
    main()
