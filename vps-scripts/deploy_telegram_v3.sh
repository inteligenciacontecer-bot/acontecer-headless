#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
#  Deploy telegram_monitor v3 + ia_resumen + ultima-hora endpoint
#  Correr desde VPS como root:
#    bash /tmp/deploy_telegram_v3.sh
# ═══════════════════════════════════════════════════════════════════
set -euo pipefail
VENV="/opt/venv"
IA_DIR="/opt/acontecer-ia"
WP_PLUGIN="/var/www/cms.acontecer.co.cr/wp-content/plugins/acontecer-asamblea"
LOG="$IA_DIR/logs"

echo "=== $(date) deploy_telegram_v3 ==="

# ── 1. Verificar dependencias Python ──────────────────────────────
echo "→ Verificando dependencias Python..."
$VENV/bin/pip install --quiet anthropic pymupdf rapidfuzz pytesseract 2>&1 | tail -5

# Verificar imports críticos
$VENV/bin/python3 -c "import fitz; print('  PyMuPDF:', fitz.__version__)" || {
    echo "  WARN: PyMuPDF fallo, reinstalando..."
    $VENV/bin/pip install --force-reinstall pymupdf
}
$VENV/bin/python3 -c "import rapidfuzz; print('  rapidfuzz: OK')" || $VENV/bin/pip install rapidfuzz
$VENV/bin/python3 -c "import anthropic; print('  anthropic: OK')" || $VENV/bin/pip install anthropic

# ── 2. Copiar archivos Python al directorio IA ────────────────────
echo "→ Actualizando scripts Python..."
cp "$IA_DIR/telegram_monitor.py.new"  "$IA_DIR/telegram_monitor.py"  2>/dev/null || \
    echo "  SKIP: telegram_monitor.py.new no encontrado (ya copiado directamente?)"
cp "$IA_DIR/config_asamblea.py.new"   "$IA_DIR/config_asamblea.py"   2>/dev/null || true

# ── 3. Verificar ANTHROPIC_API_KEY ────────────────────────────────
echo "→ Verificando ANTHROPIC_API_KEY..."
if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
    echo "  WARN: ANTHROPIC_API_KEY no está en el ambiente."
    echo "  Para habilitarlo: export ANTHROPIC_API_KEY='sk-ant-...' >> /etc/environment"
    echo "  Luego: source /etc/environment && pm2 restart asamblea-telegram"
else
    echo "  OK: ANTHROPIC_API_KEY configurado"
fi

# ── 4. Actualizar plugin WordPress ────────────────────────────────
echo "→ Actualizando plugin WordPress..."
if [ -d "$WP_PLUGIN" ]; then
    cp "$WP_PLUGIN/acontecer-asamblea.php" "$WP_PLUGIN/acontecer-asamblea.php.bak"
    echo "  Backup creado: acontecer-asamblea.php.bak"
fi

# ── 5. Forzar migración de BD (cambiar versión) ───────────────────
echo "→ Disparando migración de BD via WP-CLI..."
WP_CLI=$(which wp 2>/dev/null || echo "/usr/local/bin/wp")
WP_PATH="/var/www/cms.acontecer.co.cr"
if [ -f "$WP_CLI" ]; then
    $WP_CLI option delete acontecer_asamblea_db_version --path="$WP_PATH" --allow-root 2>/dev/null || true
    echo "  Opción de versión eliminada → WordPress migrará al próximo request"
else
    echo "  WP-CLI no encontrado. Ejecutando via MySQL..."
    WP_CONFIG="$WP_PATH/wp-config.php"
    DB_NAME=$(grep -oP "define\s*\(\s*'DB_NAME'\s*,\s*'\K[^']+" "$WP_CONFIG")
    DB_USER=$(grep -oP "define\s*\(\s*'DB_USER'\s*,\s*'\K[^']+" "$WP_CONFIG")
    DB_PASS=$(grep -oP "define\s*\(\s*'DB_PASSWORD'\s*,\s*'\K[^']+" "$WP_CONFIG")
    mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
        DELETE FROM hake_options WHERE option_name='acontecer_asamblea_db_version';
        -- Añadir columna si no existe
        ALTER TABLE hake_asamblea_eventos_telegram
            ADD COLUMN IF NOT EXISTS ia_resumen TEXT DEFAULT NULL AFTER texto;
    " 2>&1 || echo "  (ALTER ya existía o error — revisar manualmente)"
fi

# ── 6. Reiniciar bot Telegram ─────────────────────────────────────
echo "→ Reiniciando pm2 asamblea-telegram..."
if pm2 list | grep -q "asamblea-telegram"; then
    pm2 restart asamblea-telegram
    sleep 3
    pm2 logs asamblea-telegram --lines 20 --nostream
else
    echo "  Proceso no encontrado. Iniciando..."
    pm2 start "$IA_DIR/telegram_monitor.py" \
        --name asamblea-telegram \
        --interpreter "$VENV/bin/python3"
    sleep 3
    pm2 logs asamblea-telegram --lines 15 --nostream
fi

pm2 save

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Deploy completado. Verificar:"
echo "  1. pm2 logs asamblea-telegram (debe decir 'parse_votos_pdf cargado ✓')"
echo "  2. curl https://cms.acontecer.co.cr/wp-json/acontecer/v1/asamblea/ultima-hora"
echo "  3. Columna ia_resumen: mysql -e 'SHOW COLUMNS FROM hake_asamblea_eventos_telegram LIKE ia_resumen'"
echo "═══════════════════════════════════════════════════════════"
