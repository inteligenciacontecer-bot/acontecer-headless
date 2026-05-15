#!/usr/bin/env python3
"""
Scraper de comisiones de diputados — Asamblea Legislativa de Costa Rica
Usa Playwright (headless Chromium) para renderizar las páginas de SharePoint.

Instalación:
  /opt/venv/bin/pip install playwright
  /opt/venv/bin/playwright install chromium --with-deps

Uso:
  /opt/venv/bin/python /opt/scraper/scrape_comisiones.py
"""
import asyncio
import re
import sys

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("ERROR: playwright no instalado. Correr: /opt/venv/bin/pip install playwright")
    sys.exit(1)

import mysql.connector

DB_CONFIG = {
    'host':     'localhost',
    'user':     'u4_acontecer',
    'password': 'Kp4Rv9xHqW2mLsT7',   # ← reemplazar si cambió
    'database': 'db4_acontecer',
    'charset':  'utf8mb4',
}

BASE_URL = 'https://www.asamblea.go.cr/Diputados/SitePages/Detalle_Diputado.aspx?diputado='


def get_diputados_db():
    """Obtiene id, slug, nombre_completo de todos los diputados."""
    conn = mysql.connector.connect(**DB_CONFIG)
    cur  = conn.cursor(dictionary=True)
    cur.execute("SELECT id, slug, nombre_completo FROM hake_asamblea_diputados ORDER BY id")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


def save_comisiones(dip_id: int, comisiones: list[str]):
    """Guarda las comisiones (lista de str) en la columna comisiones del diputado."""
    value = ', '.join(comisiones)
    conn = mysql.connector.connect(**DB_CONFIG)
    cur  = conn.cursor()
    cur.execute(
        "UPDATE hake_asamblea_diputados SET comisiones = %s WHERE id = %s",
        (value, dip_id)
    )
    conn.commit()
    cur.close()
    conn.close()


async def scrape_diputado(page, nombre_completo: str) -> list[str]:
    """
    Navega a la página del diputado y extrae las comisiones.
    Devuelve lista de nombres de comisión o lista vacía.
    """
    # El parámetro ?diputado= usa el nombre con tildes y espacios
    url = BASE_URL + nombre_completo.replace(' ', '%20')
    try:
        await page.goto(url, wait_until='networkidle', timeout=30000)
        # Esperar a que aparezca contenido (SharePoint puede tardar)
        await page.wait_for_timeout(2000)

        # Buscar tabla o lista de comisiones — ajustar selector según DOM real
        # Intentar varios selectores posibles
        comisiones = []

        # Opción 1: tabla con clase/id de comisiones
        rows = await page.query_selector_all('table.ms-listviewtable tr td:first-child')
        for row in rows:
            text = (await row.inner_text()).strip()
            if text and 'comisi' in text.lower():
                comisiones.append(text)

        if not comisiones:
            # Opción 2: buscar texto que contenga "Comisión"
            all_text = await page.inner_text('body')
            matches = re.findall(r'Comisi[oó]n[^\n\r<]{5,80}', all_text)
            comisiones = list(dict.fromkeys(m.strip() for m in matches))

        return comisiones[:10]  # máximo 10 por diputado

    except Exception as e:
        print(f"  ERROR scraping {nombre_completo}: {e}")
        return []


async def main():
    diputados = get_diputados_db()
    print(f"Procesando {len(diputados)} diputados...")

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (compatible; AconteceBot/1.0)'
        )
        page = await context.new_page()

        for d in diputados:
            print(f"  → {d['nombre_completo']} ... ", end='', flush=True)
            comisiones = await scrape_diputado(page, d['nombre_completo'])
            if comisiones:
                save_comisiones(d['id'], comisiones)
                print(f"{len(comisiones)} comisiones")
            else:
                print("sin datos")
            await asyncio.sleep(1)  # respetar el servidor

        await browser.close()

    print("✓ Scraping completado")


if __name__ == '__main__':
    asyncio.run(main())
