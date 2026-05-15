#!/bin/bash
# Instala el Monitor Legislativo en el VPS
# Ejecutar como root: bash /opt/acontecer-ia/instalar.sh

set -e
echo "=== Monitor Legislativo — Instalación ==="

VPS_DIR="/opt/acontecer-ia"
WP_MU="/var/www/cms.acontecer.co.cr/wp-content/mu-plugins"
VENV="/opt/venv/bin/python3"
PIP="/opt/venv/bin/pip"

# ── 1. Dependencias Python ────────────────────────────────────────────────────
echo "[1/5] Instalando dependencias Python..."
$PIP install -q telethon pymysql beautifulsoup4 requests pdfplumber lxml

# Verificar whisper (ya debería estar instalado)
$VENV -c "import whisper; print('whisper OK')" 2>/dev/null || \
  $PIP install -q openai-whisper

# Verificar yt-dlp
which yt-dlp > /dev/null 2>&1 || pip3 install -q yt-dlp
# Actualizar yt-dlp (se actualiza frecuentemente)
yt-dlp --update-to stable 2>/dev/null || true

# ffmpeg (para yt-dlp audio)
which ffmpeg > /dev/null 2>&1 || apt-get install -y ffmpeg -q

# ── 2. Copiar plugin WordPress ────────────────────────────────────────────────
echo "[2/5] Instalando mu-plugin de WordPress..."
cp "$VPS_DIR/acontecer-asamblea.php" "$WP_MU/acontecer-asamblea.php"
chown www-data:www-data "$WP_MU/acontecer-asamblea.php"
echo "  → Activar en WP: visita /wp-admin para que se creen las tablas"

# ── 3. Directorio de logs ─────────────────────────────────────────────────────
echo "[3/5] Creando directorio de logs..."
mkdir -p "$VPS_DIR/logs"
chmod 755 "$VPS_DIR/logs"

# ── 4. Cron jobs ──────────────────────────────────────────────────────────────
echo "[4/5] Configurando cron jobs..."
CRON_TMP=$(mktemp)
crontab -l 2>/dev/null > "$CRON_TMP" || true

# Quitar entradas anteriores del monitor (si existen)
grep -v "scraper_asamblea\|youtube_monitor" "$CRON_TMP" > "${CRON_TMP}.clean" && mv "${CRON_TMP}.clean" "$CRON_TMP"

cat >> "$CRON_TMP" << 'CRON'
# Monitor Legislativo — Asamblea CR
# Diputados + fracciones — lunes 6am
0 6 * * 1 /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target diputados >> /opt/acontecer-ia/logs/cron.log 2>&1
# Agenda del día — 7am todos los días
0 7 * * * /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target agenda >> /opt/acontecer-ia/logs/cron.log 2>&1
# Votaciones PDF — cada 10 min lun-jue 8-22h
*/10 8-22 * * 1-4 /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target votaciones >> /opt/acontecer-ia/logs/cron.log 2>&1
# YouTube monitor — cada 5 min
*/5 * * * * /opt/venv/bin/python3 /opt/acontecer-ia/youtube_monitor.py >> /opt/acontecer-ia/logs/cron.log 2>&1
# Salarios — 1ro de cada mes 8am
0 8 1 * * /opt/venv/bin/python3 /opt/acontecer-ia/scraper_asamblea.py --target salarios >> /opt/acontecer-ia/logs/cron.log 2>&1
CRON

crontab "$CRON_TMP"
rm "$CRON_TMP"
echo "  → Cron configurado"

# ── 5. PM2: Telegram monitor ──────────────────────────────────────────────────
echo "[5/5] Iniciando Telegram monitor con PM2..."
pm2 stop asamblea-telegram 2>/dev/null || true
pm2 start "$VPS_DIR/telegram_monitor.py" \
  --name asamblea-telegram \
  --interpreter /opt/venv/bin/python3 \
  --cwd "$VPS_DIR" \
  --restart-delay 5000 \
  --max-restarts 10
pm2 save

echo ""
echo "✅ INSTALACIÓN COMPLETA"
echo ""
echo "PRÓXIMOS PASOS:"
echo "  1. Autenticar Telegram (una vez):"
echo "     cd $VPS_DIR && $VENV setup_telegram.py"
echo ""
echo "  2. Agregar endpoint al bot de WhatsApp:"
echo "     Al final del whatsapp-bot.js agrega:"
echo "     require('./asamblea_bot_endpoint')(client, 'TU_NUMERO@c.us');"
echo ""
echo "  3. Correr scraper inicial:"
echo "     $VENV $VPS_DIR/scraper_asamblea.py --target diputados"
echo ""
echo "  4. Verificar tablas en WordPress:"
echo "     Ve a /wp-admin — las tablas se crean solas al cargar WP"
echo ""
echo "  Estado PM2:"
pm2 list
