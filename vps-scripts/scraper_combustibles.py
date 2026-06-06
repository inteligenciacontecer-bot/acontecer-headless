#!/usr/bin/env python3
"""
scraper_combustibles.py — Actualiza el precio de combustibles desde RECOPE.

Diseño DEFENSIVO: si RECOPE cambia su HTML o los datos son absurdos,
NO escribe nada (la página mantiene el último JSON válido / fallback).

Salida: /var/www/acontecer-headless/data/combustibles.json
La página app/precio-combustibles/page.tsx lee ese JSON con fallback.

Uso:
  python3 scraper_combustibles.py            # actualiza el JSON
  python3 scraper_combustibles.py --dry-run  # solo imprime lo extraído

Cron sugerido (2.º sábado de cada mes, 6am CR — el ajuste rige desde el 2.º viernes):
  0 6 8-14 * 6  cd /var/www/acontecer-headless && python3 vps-scripts/scraper_combustibles.py >> /var/log/combustibles.log 2>&1
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

URL = 'https://www.recope.go.cr/productos/precios-nacionales/tabla-precios/'
OUT = Path('/var/www/acontecer-headless/data/combustibles.json')
CR = ZoneInfo('America/Costa_Rica')

# Rango sano de precios al consumidor (₡/litro). Fuera de esto = dato corrupto.
PRECIO_MIN = 400
PRECIO_MAX = 1500

# Productos a extraer: (clave, regex del nombre en RECOPE, nombre mostrado, nota)
PRODUCTOS = [
    ('super', r'GASOLINA\s+SUPER',        'Gasolina Súper',   '95 octanos'),
    ('plus',  r'GASOLINA\s+PLUS\s*91',    'Gasolina Plus 91', '91 octanos · regular'),
    ('diesel', r'DIESEL\s*50',            'Diésel',           'Diésel 50'),
]

MESES = {
    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
    'julio': 7, 'agosto': 8, 'septiembre': 9, 'setiembre': 9, 'octubre': 10,
    'noviembre': 11, 'diciembre': 12,
}

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [combustibles] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)
log = logging.getLogger()


def descargar() -> str:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept-Language': 'es-CR,es;q=0.9',
    }
    r = requests.get(URL, headers=headers, timeout=30, verify=False)
    r.raise_for_status()
    return r.text


def html_a_texto(html: str) -> str:
    """Quita tags y normaliza espacios para un parseo robusto."""
    txt = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', html, flags=re.I | re.S)
    txt = re.sub(r'<[^>]+>', ' ', txt)
    txt = (txt.replace('&nbsp;', ' ').replace('&aacute;', 'á').replace('&eacute;', 'é')
              .replace('&iacute;', 'í').replace('&oacute;', 'ó').replace('&uacute;', 'ú'))
    txt = re.sub(r'\s+', ' ', txt)
    return txt


def parse_precio(num: str) -> float:
    """'753.00' o '753,00' o '1.234,50' → float."""
    s = num.strip()
    if ',' in s and '.' in s:
        s = s.replace('.', '').replace(',', '.')   # 1.234,50 → 1234.50
    else:
        s = s.replace(',', '.')                     # 753,00 → 753.00
    return float(s)


def extraer_precio(texto: str, nombre_regex: str):
    """Extrae el precio AL CONSUMIDOR de la tabla 'Estaciones de Servicio'.

    Cada fila tiene 4 columnas en este orden:
      sin impuesto | impuesto único | margen | PRECIO TOTAL (consumidor)
    Ej.: 'GASOLINA SUPER ( SUPERIOR ) 412.87 269.50 71.11 753.00'
    Tomamos el 4.º número (el total), que es el precio final en estación.
    """
    # nombre, luego texto sin dígitos (paréntesis), luego 4 números de la fila
    patron = (nombre_regex + r'[^\d]*'
              r'([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)')
    m = re.search(patron, texto, re.I)
    if not m:
        return None
    try:
        total = parse_precio(m.group(4))   # 4.ª columna = precio al consumidor
    except ValueError:
        return None
    if PRECIO_MIN <= total <= PRECIO_MAX:
        return round(total)
    return None


def extraer_fecha(texto: str) -> str | None:
    """'Rigen a partir del 03 de junio del 2026' → '2026-06-03'."""
    m = re.search(r'rigen?\s+a\s+partir\s+del\s+(\d{1,2})\s+de\s+(\w+)\s+del?\s+(\d{4})',
                  texto, re.I)
    if not m:
        return None
    dia, mes_txt, anio = int(m.group(1)), m.group(2).lower(), int(m.group(3))
    mes = MESES.get(mes_txt)
    if not mes:
        return None
    return f'{anio:04d}-{mes:02d}-{dia:02d}'


def main():
    dry = '--dry-run' in sys.argv
    try:
        html = descargar()
    except Exception as e:
        log.error(f'FALLO descarga RECOPE: {e}')
        sys.exit(1)

    texto = html_a_texto(html)

    combustibles = []
    for clave, rgx, nombre, nota in PRODUCTOS:
        precio = extraer_precio(texto, rgx)
        if precio is None:
            log.error(f'NO se encontró precio válido para {nombre} ({rgx}). Abortando sin escribir.')
            sys.exit(1)
        combustibles.append({'nombre': nombre, 'precio': precio, 'nota': nota})
        log.info(f'{nombre}: ₡{precio}')

    fecha = extraer_fecha(texto)
    if not fecha:
        # No es fatal: usamos la fecha de hoy como referencia de actualización
        fecha = datetime.now(CR).strftime('%Y-%m-%d')
        log.warning(f'No se extrajo fecha de vigencia; usando hoy ({fecha}).')
    else:
        log.info(f'Vigente desde: {fecha}')

    data = {
        'vigenteDesde': fecha,
        'combustibles': combustibles,
        'actualizado': datetime.now(CR).isoformat(),
        'fuente': URL,
    }

    if dry:
        print(json.dumps(data, ensure_ascii=False, indent=2))
        log.info('DRY-RUN: no se escribió el archivo.')
        return

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    log.info(f'Escrito {OUT} ✓')


if __name__ == '__main__':
    main()
