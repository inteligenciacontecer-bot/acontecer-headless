-- Migración: añade columnas faltantes a tablas asamblea
-- Ejecutar en la BD de WordPress (hake_)
-- Seguro repetir: usa IF NOT EXISTS / IGNORE

-- ── asamblea_expedientes ─────────────────────────────────────────────────────
ALTER TABLE hake_asamblea_expedientes
  ADD COLUMN IF NOT EXISTS proponente  VARCHAR(200) DEFAULT '' AFTER titulo,
  ADD COLUMN IF NOT EXISTS comision    VARCHAR(200) DEFAULT '' AFTER proponente,
  ADD COLUMN IF NOT EXISTS estado      VARCHAR(100) DEFAULT 'EN TRÁMITE' AFTER comision;

-- Asegurar índice único en numero
ALTER TABLE hake_asamblea_expedientes
  ADD UNIQUE INDEX IF NOT EXISTS uniq_numero (numero);

-- ── asamblea_votaciones ──────────────────────────────────────────────────────
-- Añadir columna fecha si no existe (además de created_at)
ALTER TABLE hake_asamblea_votaciones
  ADD COLUMN IF NOT EXISTS fecha DATETIME DEFAULT NULL AFTER expediente;

-- Permitir url_pdf NULL (para votaciones capturadas vía Telegram)
ALTER TABLE hake_asamblea_votaciones
  MODIFY COLUMN url_pdf VARCHAR(500) DEFAULT NULL;

-- ── Ver estado ───────────────────────────────────────────────────────────────
SELECT 'expedientes' AS tabla, COUNT(*) AS total FROM hake_asamblea_expedientes
UNION ALL
SELECT 'votaciones',            COUNT(*) FROM hake_asamblea_votaciones
UNION ALL
SELECT 'telegram_eventos',      COUNT(*) FROM hake_asamblea_eventos_telegram WHERE es_votacion=1;
