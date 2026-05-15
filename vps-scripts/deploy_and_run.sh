#!/bin/bash
# Deploy scraper actualizado, corre migración SQL, y lanza scrapers en secuencia.
# Ejecutar desde VPS como root: bash /opt/acontecer-ia/deploy_and_run.sh

set -euo pipefail
VENV="/opt/venv/bin/python3"
SCRAPER="/opt/acontecer-ia/scraper_asamblea.py"
LOG="/opt/acontecer-ia/logs/asamblea_scraper.log"

echo "=== $(date) deploy_and_run.sh iniciado ==="

# ── 1. Migración SQL ──────────────────────────────────────────────────────────
WP_CONFIG="/var/www/cms.acontecer.co.cr/wp-config.php"
DB_NAME=$(grep -oP "define\s*\(\s*'DB_NAME'\s*,\s*'\K[^']+" "$WP_CONFIG")
DB_USER=$(grep -oP "define\s*\(\s*'DB_USER'\s*,\s*'\K[^']+" "$WP_CONFIG")
DB_PASS=$(grep -oP "define\s*\(\s*'DB_PASSWORD'\s*,\s*'\K[^']+" "$WP_CONFIG")

echo "→ Aplicando migración SQL a $DB_NAME..."
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < /opt/acontecer-ia/migrate_expedientes_votaciones.sql 2>&1 \
  || echo "  (algunos ALTER ya existían — normal)"

# ── 2. Scrapers ───────────────────────────────────────────────────────────────
echo "→ Scraping expedientes (SharePoint + Delfino fallback)..."
$VENV "$SCRAPER" --target expedientes 2>&1 | tail -20

echo "→ Scraping votaciones (SharePoint + Telegram sync)..."
$VENV "$SCRAPER" --target votaciones 2>&1 | tail -20

echo "→ Scraping agenda (orden del día)..."
$VENV "$SCRAPER" --target agenda 2>&1 | tail -15

# ── 3. Actualizar crontabs ────────────────────────────────────────────────────
CRON_TMP=$(mktemp)
crontab -l > "$CRON_TMP" 2>/dev/null || true

# Quitar líneas obsoletas y añadir las correctas
grep -v 'scraper_asamblea.py --target' "$CRON_TMP" > "${CRON_TMP}.new" || true

cat >> "${CRON_TMP}.new" << 'EOF'
# Monitor Legislativo — scraper crons
0 6 * * 1     /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target diputados
0 7 * * *     /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target agenda
*/30 8-22 * * 1-4  /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target expedientes
*/15 8-22 * * 1-4  /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target votaciones
0 8 1 * *     /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target salarios
0 9 * * 1     /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target gasolina
0 10 * * 1    /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target asistencia
EOF

crontab "${CRON_TMP}.new"
rm -f "$CRON_TMP" "${CRON_TMP}.new"
echo "→ Crontabs actualizados."

echo "=== Fin deploy_and_run.sh ==="

# ── 4. Resumen de tablas ──────────────────────────────────────────────────────
echo ""
echo "Estado de tablas:"
mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
  SELECT 'expedientes' AS tabla, COUNT(*) AS total FROM hake_asamblea_expedientes
  UNION ALL SELECT 'votaciones', COUNT(*) FROM hake_asamblea_votaciones
  UNION ALL SELECT 'telegram_votos', COUNT(*) FROM hake_asamblea_eventos_telegram WHERE es_votacion=1;
" 2>&1
