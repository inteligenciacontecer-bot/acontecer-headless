<?php
/**
 * Plugin Name: Acontecer – Monitor Legislativo
 * Description: Tablas y REST API para el Monitor Legislativo Pro
 * Version: 1.5
 */
defined('ABSPATH') || exit;

// ── Crear / migrar tablas ─────────────────────────────────────────────────────
register_activation_hook(__FILE__, 'acontecer_asamblea_create_tables');
add_action('init', function () {
    if (get_option('acontecer_asamblea_db_version') !== '1.5') {
        acontecer_asamblea_create_tables();
    }
});

function acontecer_asamblea_create_tables(): void {
    global $wpdb;
    $c = $wpdb->get_charset_collate();
    $p = $wpdb->prefix;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    // Diputados — columnas ampliadas para perfiles completos
    dbDelta("CREATE TABLE {$p}asamblea_diputados (
        id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre_completo         VARCHAR(200)  NOT NULL,
        nombre_corto            VARCHAR(100)  DEFAULT '',
        partido                 VARCHAR(120)  DEFAULT '',
        fraccion                VARCHAR(120)  DEFAULT '',
        provincia               VARCHAR(60)   DEFAULT '',
        email                   VARCHAR(150)  DEFAULT '',
        telefono                VARCHAR(60)   DEFAULT '',
        foto_url                VARCHAR(500)  DEFAULT '',
        cargo                   VARCHAR(100)  DEFAULT '',
        bio                     TEXT,
        comisiones              TEXT,
        facebook                VARCHAR(250)  DEFAULT '',
        instagram               VARCHAR(250)  DEFAULT '',
        twitter                 VARCHAR(250)  DEFAULT '',
        tiktok                  VARCHAR(250)  DEFAULT '',
        youtube_canal           VARCHAR(250)  DEFAULT '',
        gasto_gasolina_promedio DECIMAL(12,2) DEFAULT 0,
        asistencia_porcentaje   DECIMAL(5,2)  DEFAULT NULL,
        activo                  TINYINT(1)    DEFAULT 1,
        slug                    VARCHAR(200)  NOT NULL DEFAULT '',
        updated_at              DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY slug (slug)
    ) $c;");

    dbDelta("CREATE TABLE {$p}asamblea_votaciones (
        id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        titulo           TEXT         NOT NULL,
        expediente       VARCHAR(20)  DEFAULT '',
        fecha            DATETIME     DEFAULT NULL,
        votos_si         SMALLINT     DEFAULT 0,
        votos_no         SMALLINT     DEFAULT 0,
        votos_abstencion SMALLINT     DEFAULT 0,
        resultado        VARCHAR(30)  DEFAULT '',
        url_pdf          VARCHAR(500) DEFAULT '',
        fuente           VARCHAR(100) DEFAULT 'scraper',
        noticiada        TINYINT(1)   DEFAULT 0,
        created_at       DATETIME     DEFAULT CURRENT_TIMESTAMP
    ) $c;");

    dbDelta("CREATE TABLE {$p}asamblea_eventos_telegram (
        id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        message_id       BIGINT       NOT NULL,
        sender           VARCHAR(100) DEFAULT '',
        texto            TEXT         NOT NULL,
        ia_resumen       TEXT         DEFAULT NULL,
        es_votacion      TINYINT(1)   DEFAULT 0,
        expediente       VARCHAR(20)  DEFAULT '',
        votos_si         SMALLINT     DEFAULT 0,
        votos_no         SMALLINT     DEFAULT 0,
        votos_abstencion SMALLINT     DEFAULT 0,
        resultado        VARCHAR(30)  DEFAULT '',
        noticiado        TINYINT(1)   DEFAULT 0,
        created_at       DATETIME     DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY message_id (message_id)
    ) $c;");

    // Migrar columna ia_resumen en tablas ya existentes (dbDelta no añade columnas)
    $cols = $wpdb->get_col("SHOW COLUMNS FROM {$p}asamblea_eventos_telegram LIKE 'ia_resumen'");
    if (empty($cols)) {
        $wpdb->query("ALTER TABLE {$p}asamblea_eventos_telegram ADD COLUMN ia_resumen TEXT DEFAULT NULL AFTER texto");
    }

    dbDelta("CREATE TABLE {$p}asamblea_expedientes (
        id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        numero              VARCHAR(20)  NOT NULL,
        titulo              TEXT         NOT NULL,
        estado              VARCHAR(100) DEFAULT '',
        tipo                VARCHAR(100) DEFAULT '',
        comision            VARCHAR(200) DEFAULT '',
        proponente          VARCHAR(400) DEFAULT '',
        fecha_presentacion  DATE         DEFAULT NULL,
        fecha_agenda        DATE         DEFAULT NULL,
        updated_at          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY numero (numero)
    ) $c;");

    dbDelta("CREATE TABLE {$p}asamblea_sesiones_youtube (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        youtube_id VARCHAR(20)  NOT NULL,
        titulo     VARCHAR(500) DEFAULT '',
        tipo       VARCHAR(20)  DEFAULT 'recorded',
        fecha      DATETIME     DEFAULT NULL,
        url        VARCHAR(300) DEFAULT '',
        created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY youtube_id (youtube_id)
    ) $c;");

    dbDelta("CREATE TABLE {$p}asamblea_salarios (
        id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre        VARCHAR(200)  NOT NULL,
        mes           DATE          NOT NULL,
        salario_bruto DECIMAL(12,2) DEFAULT 0,
        updated_at    DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY nombre_mes (nombre(100), mes)
    ) $c;");

    dbDelta("CREATE TABLE {$p}asamblea_gasolina (
        id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre     VARCHAR(200)  NOT NULL,
        periodo    DATE          NOT NULL,
        monto      DECIMAL(12,2) DEFAULT 0,
        updated_at DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY nombre_periodo (nombre(100), periodo)
    ) $c;");

    dbDelta("CREATE TABLE {$p}asamblea_asistencia (
        id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre              VARCHAR(200) NOT NULL,
        anio                SMALLINT     NOT NULL,
        sesiones_total      SMALLINT     DEFAULT 0,
        sesiones_asistidas  SMALLINT     DEFAULT 0,
        porcentaje          DECIMAL(5,2) DEFAULT 0,
        updated_at          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY nombre_anio (nombre(100), anio)
    ) $c;");

    dbDelta("CREATE TABLE {$p}asamblea_votos_individuales (
        id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        votacion_id  INT UNSIGNED NOT NULL,
        diputado_id  INT UNSIGNED NOT NULL,
        voto         ENUM('SI','NO','ABSTENCION','AUSENTE') NOT NULL DEFAULT 'AUSENTE',
        created_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY vot_dip (votacion_id, diputado_id),
        INDEX idx_diputado (diputado_id),
        INDEX idx_votacion (votacion_id)
    ) $c;");

    update_option('acontecer_asamblea_db_version', '1.5');
}

// ── REST API ──────────────────────────────────────────────────────────────────
add_action('rest_api_init', function () {
    $ns = 'acontecer/v1';

    register_rest_route($ns, '/asamblea/diputados', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_diputados',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/diputados/(?P<slug>[a-z0-9-]+)', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_diputado_perfil',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/votaciones', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_votaciones',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/expedientes', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_expedientes',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/telegram', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_telegram',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/ultima-hora', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_ultima_hora',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/resumen', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_resumen',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/promedios', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_promedios',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/gasolina', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_gasolina',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/sesiones', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_sesiones',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/asamblea/alerta', [
        'methods'             => 'POST',
        'callback'            => 'acontecer_api_recibir_alerta',
        'permission_callback' => function (WP_REST_Request $r) {
            return $r->get_header('X-Asamblea-Secret') === get_option('acontecer_asamblea_secret', 'changeme');
        },
    ]);

    register_rest_route($ns, '/asamblea/diputados/(?P<slug>[a-z0-9-]+)/votos', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_diputado_votos',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route($ns, '/asamblea/votaciones/(?P<id>[0-9]+)/mapa', [
        'methods'             => 'GET',
        'callback'            => 'acontecer_api_get_votacion_mapa',
        'permission_callback' => '__return_true',
    ]);

    // ── Carga manual de votos individuales (requiere secret) ──────────────────
    register_rest_route($ns, '/asamblea/votaciones/(?P<id>[0-9]+)/cargar-votos', [
        'methods'             => 'POST',
        'callback'            => 'acontecer_api_cargar_votos_texto',
        'permission_callback' => function (WP_REST_Request $r) {
            return $r->get_header('X-Asamblea-Secret') === get_option('acontecer_asamblea_secret', 'changeme');
        },
    ]);
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Busca la clave apellido del nombre completo para usar en LIKE.
 * Toma el segundo token (primer apellido) si existe, si no el primero.
 */
function _asamblea_apellido_like(string $nombre_completo): string {
    global $wpdb;
    $partes = array_filter(explode(' ', trim($nombre_completo)));
    // Intentamos usar el primer apellido (posición 2 en "Nombre Apellido1 Apellido2")
    $buscar = count($partes) >= 2 ? array_values($partes)[1] : array_values($partes)[0];
    return '%' . $wpdb->esc_like($buscar) . '%';
}

// ── Callbacks ─────────────────────────────────────────────────────────────────

function acontecer_api_get_diputados(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $p = $wpdb->prefix;
    $where = ['activo = 1'];
    $params = [];

    if ($v = sanitize_text_field($r->get_param('fraccion'))) {
        $where[] = 'fraccion = %s'; $params[] = $v;
    }
    if ($v = sanitize_text_field($r->get_param('provincia'))) {
        $where[] = 'provincia = %s'; $params[] = $v;
    }
    if ($v = sanitize_text_field($r->get_param('search'))) {
        $where[] = '(nombre_completo LIKE %s OR partido LIKE %s OR fraccion LIKE %s)';
        $params[] = "%$v%"; $params[] = "%$v%"; $params[] = "%$v%";
    }

    $sql  = "SELECT id, nombre_completo, nombre_corto, partido, fraccion, provincia,
                    email, foto_url, cargo, facebook, instagram, twitter, tiktok,
                    gasto_gasolina_promedio, asistencia_porcentaje, comisiones, slug
             FROM {$p}asamblea_diputados
             WHERE " . implode(' AND ', $where) . "
             ORDER BY fraccion, nombre_completo";
    $rows = $params
        ? $wpdb->get_results($wpdb->prepare($sql, $params))
        : $wpdb->get_results($sql);

    return new WP_REST_Response($rows, 200);
}

function acontecer_api_get_diputado_perfil(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $p    = $wpdb->prefix;
    $slug = sanitize_text_field($r->get_param('slug'));

    $diputado = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$p}asamblea_diputados WHERE slug = %s", $slug
    ));
    if (!$diputado) {
        return new WP_REST_Response(['error' => 'not found'], 404);
    }

    $apellido_like = _asamblea_apellido_like($diputado->nombre_completo);

    // Últimas 20 votaciones (globales)
    $votaciones = $wpdb->get_results(
        "SELECT titulo, expediente, resultado, votos_si, votos_no, votos_abstencion, fecha, url_pdf
         FROM {$p}asamblea_votaciones
         ORDER BY COALESCE(fecha, created_at) DESC LIMIT 20"
    );

    // Votos individuales resumen
    $votos_resumen = $wpdb->get_row($wpdb->prepare(
        "SELECT
            COUNT(*) AS total,
            SUM(voto='SI') AS si,
            SUM(voto='NO') AS no,
            SUM(voto='ABSTENCION') AS abstencion,
            SUM(voto='AUSENTE') AS ausente
         FROM {$p}asamblea_votos_individuales
         WHERE diputado_id = %d",
        $diputado->id
    ));
    // Últimas 10 votaciones individuales
    $ultimos_votos = $wpdb->get_results($wpdb->prepare(
        "SELECT vi.voto, vi.votacion_id, v.titulo, v.expediente, v.resultado,
                COALESCE(v.fecha, v.created_at) AS fecha
         FROM {$p}asamblea_votos_individuales vi
         JOIN {$p}asamblea_votaciones v ON v.id = vi.votacion_id
         WHERE vi.diputado_id = %d
         ORDER BY fecha DESC LIMIT 10",
        $diputado->id
    ));

    // Últimos 10 expedientes donde aparece como proponente
    $expedientes = $wpdb->get_results($wpdb->prepare(
        "SELECT numero, titulo, estado, tipo, comision, fecha_presentacion
         FROM {$p}asamblea_expedientes
         WHERE proponente LIKE %s
         ORDER BY fecha_presentacion DESC, updated_at DESC LIMIT 10",
        $apellido_like
    ));

    // Si no hay expedientes por proponente, traer los 10 más recientes como fallback
    if (empty($expedientes)) {
        $expedientes = $wpdb->get_results(
            "SELECT numero, titulo, estado, tipo, comision, fecha_presentacion
             FROM {$p}asamblea_expedientes
             ORDER BY fecha_presentacion DESC, updated_at DESC LIMIT 10"
        );
    }

    // Historial de gasolina (últimos 12 meses)
    $gasolina = $wpdb->get_results($wpdb->prepare(
        "SELECT periodo, monto FROM {$p}asamblea_gasolina
         WHERE nombre LIKE %s ORDER BY periodo DESC LIMIT 12",
        $apellido_like
    ));

    // Promedio global de combustible (últimos 6 meses)
    $promedio_global_gasolina = (float) $wpdb->get_var(
        "SELECT AVG(monto) FROM {$p}asamblea_gasolina
         WHERE periodo >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 MONTH), '%Y-%m-01')"
    );

    // Asistencia histórica
    $asistencia = $wpdb->get_results($wpdb->prepare(
        "SELECT anio, sesiones_total, sesiones_asistidas, porcentaje
         FROM {$p}asamblea_asistencia
         WHERE nombre LIKE %s ORDER BY anio DESC LIMIT 4",
        $apellido_like
    ));

    // Promedio nacional de asistencia (año más reciente)
    $promedio_nacional_asistencia = (float) $wpdb->get_var(
        "SELECT AVG(porcentaje) FROM {$p}asamblea_asistencia
         WHERE anio = (SELECT MAX(anio) FROM {$p}asamblea_asistencia)"
    );

    // Gasto personal promedio (últimos 6 meses)
    $gasto_personal_promedio = (float) $wpdb->get_var($wpdb->prepare(
        "SELECT AVG(monto) FROM {$p}asamblea_gasolina
         WHERE nombre LIKE %s
           AND periodo >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 MONTH), '%Y-%m-01')",
        $apellido_like
    ));

    return new WP_REST_Response([
        'diputado'                    => $diputado,
        'votaciones'                  => $votaciones,
        'expedientes'                 => $expedientes,
        'gasolina'                    => $gasolina,
        'promedio_global_gasolina'    => round($promedio_global_gasolina, 2),
        'gasto_personal_promedio'     => round($gasto_personal_promedio, 2),
        'promedio_nacional_asistencia'=> round($promedio_nacional_asistencia, 2),
        'asistencia'                  => $asistencia,
        'votos_resumen'               => $votos_resumen,
        'ultimos_votos'               => $ultimos_votos,
    ], 200);
}

function acontecer_api_get_diputado_votos(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $p    = $wpdb->prefix;
    $slug = sanitize_text_field($r->get_param('slug'));
    $limit = min(200, absint($r->get_param('per_page') ?: 50));

    $diputado = $wpdb->get_row($wpdb->prepare(
        "SELECT id, nombre_completo FROM {$p}asamblea_diputados WHERE slug = %s", $slug
    ));
    if (!$diputado) return new WP_REST_Response(['error' => 'not found'], 404);

    $votos = $wpdb->get_results($wpdb->prepare(
        "SELECT vi.voto, v.id AS votacion_id, v.titulo, v.expediente,
                v.resultado, v.votos_si, v.votos_no, v.votos_abstencion,
                COALESCE(v.fecha, v.created_at) AS fecha
         FROM {$p}asamblea_votos_individuales vi
         JOIN {$p}asamblea_votaciones v ON v.id = vi.votacion_id
         WHERE vi.diputado_id = %d
         ORDER BY fecha DESC
         LIMIT %d",
        $diputado->id, $limit
    ));

    return new WP_REST_Response([
        'diputado_id'    => $diputado->id,
        'nombre'         => $diputado->nombre_completo,
        'total'          => count($votos),
        'si'             => count(array_filter($votos, fn($v) => $v->voto === 'SI')),
        'no'             => count(array_filter($votos, fn($v) => $v->voto === 'NO')),
        'abstencion'     => count(array_filter($votos, fn($v) => $v->voto === 'ABSTENCION')),
        'ausente'        => count(array_filter($votos, fn($v) => $v->voto === 'AUSENTE')),
        'votos'          => $votos,
    ], 200);
}

function acontecer_api_get_votacion_mapa(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $p  = $wpdb->prefix;
    $id = absint($r->get_param('id'));

    $votacion = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$p}asamblea_votaciones WHERE id = %d", $id
    ));
    if (!$votacion) return new WP_REST_Response(['error' => 'not found'], 404);

    $mapa = $wpdb->get_results($wpdb->prepare(
        "SELECT d.id, d.nombre_completo, d.nombre_corto, d.partido, d.fraccion,
                d.foto_url, d.slug, vi.voto
         FROM {$p}asamblea_votos_individuales vi
         JOIN {$p}asamblea_diputados d ON d.id = vi.diputado_id
         WHERE vi.votacion_id = %d
         ORDER BY d.fraccion, d.nombre_completo",
        $id
    ));

    // Deputies not in votos_individuales → AUSENTE
    $con_voto_ids = array_map(fn($r) => $r->id, $mapa);
    $ausentes = [];
    if (!empty($con_voto_ids)) {
        $ids_sql = implode(',', array_map('absint', $con_voto_ids));
        $ausentes = $wpdb->get_results(
            "SELECT id, nombre_completo, nombre_corto, partido, fraccion, foto_url, slug
             FROM {$p}asamblea_diputados
             WHERE activo = 1 AND id NOT IN ($ids_sql)"
        );
        foreach ($ausentes as &$a) $a->voto = 'AUSENTE';
    }

    $todos = array_merge($mapa, $ausentes);

    return new WP_REST_Response([
        'votacion' => $votacion,
        'mapa'     => $todos,
        'totales'  => [
            'si'         => count(array_filter($todos, fn($d) => $d->voto === 'SI')),
            'no'         => count(array_filter($todos, fn($d) => $d->voto === 'NO')),
            'abstencion' => count(array_filter($todos, fn($d) => $d->voto === 'ABSTENCION')),
            'ausente'    => count(array_filter($todos, fn($d) => $d->voto === 'AUSENTE')),
        ],
    ], 200);
}

function acontecer_api_get_votaciones(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $p      = $wpdb->prefix;
    $limit  = min(500, absint($r->get_param('per_page') ?: 50));
    $where  = [];
    $params = [];

    if ($v = sanitize_text_field($r->get_param('expediente'))) {
        $where[] = 'expediente = %s'; $params[] = $v;
    }
    if ($v = sanitize_text_field($r->get_param('resultado'))) {
        $where[] = 'resultado = %s'; $params[] = strtoupper($v);
    }
    $w   = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $sql = "SELECT * FROM {$p}asamblea_votaciones $w ORDER BY COALESCE(fecha, created_at) DESC LIMIT $limit";
    $rows = $params ? $wpdb->get_results($wpdb->prepare($sql, $params)) : $wpdb->get_results($sql);

    return new WP_REST_Response($rows, 200);
}

function acontecer_api_get_expedientes(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $p      = $wpdb->prefix;
    $limit  = min(200, absint($r->get_param('per_page') ?: 100));
    $where  = [];
    $params = [];

    if ($v = sanitize_text_field($r->get_param('estado'))) {
        $where[] = 'estado = %s'; $params[] = $v;
    }
    if ($v = sanitize_text_field($r->get_param('search'))) {
        $where[] = '(titulo LIKE %s OR numero LIKE %s OR proponente LIKE %s)';
        $params[] = "%$v%"; $params[] = "%$v%"; $params[] = "%$v%";
    }
    if ($v = sanitize_text_field($r->get_param('proponente'))) {
        $where[] = 'proponente LIKE %s'; $params[] = "%$v%";
    }
    $w   = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $sql = "SELECT * FROM {$p}asamblea_expedientes $w ORDER BY fecha_agenda DESC, updated_at DESC LIMIT $limit";
    $rows = $params ? $wpdb->get_results($wpdb->prepare($sql, $params)) : $wpdb->get_results($sql);

    return new WP_REST_Response($rows, 200);
}

function acontecer_api_get_telegram(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $limit    = min(100, absint($r->get_param('limit') ?: 50));
    $solo_vot = $r->get_param('solo_votaciones') === 'true';
    $w        = $solo_vot ? 'WHERE es_votacion = 1' : '';
    $rows     = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}asamblea_eventos_telegram $w ORDER BY created_at DESC LIMIT %d",
        $limit
    ));
    return new WP_REST_Response($rows, 200);
}

function acontecer_api_resumen(): WP_REST_Response {
    global $wpdb;
    $p = $wpdb->prefix;

    $promedio_gasolina   = (float) $wpdb->get_var(
        "SELECT AVG(monto) FROM {$p}asamblea_gasolina
         WHERE periodo >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 MONTH), '%Y-%m-01')"
    );
    $promedio_asistencia = (float) $wpdb->get_var(
        "SELECT AVG(porcentaje) FROM {$p}asamblea_asistencia
         WHERE anio = (SELECT MAX(anio) FROM {$p}asamblea_asistencia)"
    );

    return new WP_REST_Response([
        'diputados'                  => (int)  $wpdb->get_var("SELECT COUNT(*) FROM {$p}asamblea_diputados WHERE activo=1"),
        'votaciones_hoy'             => (int)  $wpdb->get_var("SELECT COUNT(*) FROM {$p}asamblea_votaciones WHERE DATE(COALESCE(fecha,created_at))=CURDATE()"),
        'votaciones_total'           => (int)  $wpdb->get_var("SELECT COUNT(*) FROM {$p}asamblea_votaciones"),
        'expedientes'                => (int)  $wpdb->get_var("SELECT COUNT(*) FROM {$p}asamblea_expedientes"),
        'telegram_mensajes'          => (int)  $wpdb->get_var("SELECT COUNT(*) FROM {$p}asamblea_eventos_telegram"),
        'promedio_nacional_gasolina' => round($promedio_gasolina, 2),
        'promedio_nacional_asistencia' => round($promedio_asistencia, 2),
        'ultima_votacion'            => $wpdb->get_row("SELECT titulo, resultado, votos_si, votos_no, created_at FROM {$p}asamblea_votaciones ORDER BY COALESCE(fecha,created_at) DESC LIMIT 1"),
        'ultima_actualizacion'       => current_time('c'),
    ], 200);
}

/**
 * Endpoint dedicado para promedios nacionales — usado por los perfiles
 */
function acontecer_api_get_promedios(): WP_REST_Response {
    global $wpdb;
    $p = $wpdb->prefix;

    $gasolina_6m = (float) $wpdb->get_var(
        "SELECT AVG(monto) FROM {$p}asamblea_gasolina
         WHERE periodo >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 MONTH), '%Y-%m-01')"
    );
    $asistencia  = (float) $wpdb->get_var(
        "SELECT AVG(porcentaje) FROM {$p}asamblea_asistencia
         WHERE anio = (SELECT MAX(anio) FROM {$p}asamblea_asistencia)"
    );
    $votaciones_aprobacion = (float) $wpdb->get_var(
        "SELECT (SUM(resultado='APROBADO') / COUNT(*)) * 100 FROM {$p}asamblea_votaciones"
    );

    return new WP_REST_Response([
        'gasolina_6m'           => round($gasolina_6m, 2),
        'asistencia'            => round($asistencia, 2),
        'tasa_aprobacion'       => round($votaciones_aprobacion, 1),
    ], 200);
}

function acontecer_api_get_gasolina(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $p = $wpdb->prefix;
    $meses = min(12, absint($r->get_param('meses') ?: 6));

    $promedio = (float) $wpdb->get_var($wpdb->prepare(
        "SELECT AVG(monto) FROM {$p}asamblea_gasolina
         WHERE periodo >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL %d MONTH), '%%Y-%%m-01')", $meses
    ));

    $ranking = $wpdb->get_results($wpdb->prepare(
        "SELECT g.nombre, AVG(g.monto) AS promedio, MAX(g.monto) AS maximo,
                d.slug, d.partido, d.fraccion
         FROM {$p}asamblea_gasolina g
         LEFT JOIN {$p}asamblea_diputados d
               ON d.nombre_completo LIKE CONCAT('%%', SUBSTRING_INDEX(g.nombre,' ',2), '%%')
         WHERE g.periodo >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL %d MONTH), '%%Y-%%m-01')
         GROUP BY g.nombre, d.slug, d.partido, d.fraccion
         ORDER BY promedio DESC LIMIT 57", $meses, $meses
    ));

    return new WP_REST_Response([
        'promedio_global' => round($promedio, 2),
        'ranking'         => $ranking,
        'meses'           => $meses,
    ], 200);
}

function acontecer_api_get_sesiones(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $limit = min(20, absint($r->get_param('limit') ?: 10));
    $rows  = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}asamblea_sesiones_youtube ORDER BY fecha DESC LIMIT %d", $limit
    ));
    return new WP_REST_Response($rows, 200);
}

function acontecer_api_recibir_alerta(WP_REST_Request $r): WP_REST_Response {
    $body = $r->get_json_params();
    do_action('acontecer_asamblea_nueva_alerta', $body);
    return new WP_REST_Response(['ok' => true], 200);
}

// ── Carga manual de votos desde texto pegado ──────────────────────────────────
function acontecer_api_cargar_votos_texto(WP_REST_Request $r): WP_REST_Response {
    global $wpdb;
    $p         = $wpdb->prefix;
    $id        = absint($r->get_param('id'));
    $texto     = sanitize_textarea_field($r->get_param('texto') ?? '');
    $resultado = strtoupper(sanitize_text_field($r->get_param('resultado') ?? ''));

    if (!$id || !$texto) {
        return new WP_REST_Response(['error' => 'id y texto son requeridos'], 400);
    }

    // Verificar que la votación existe
    $votacion = $wpdb->get_row($wpdb->prepare(
        "SELECT id FROM {$p}asamblea_votaciones WHERE id = %d", $id
    ));
    if (!$votacion) return new WP_REST_Response(['error' => 'votación no encontrada'], 404);

    // Mapeo de palabras clave → voto normalizado
    $voto_map = [
        'favor'       => 'SI',   'sí'         => 'SI',   'si '        => 'SI',
        ' si'         => 'SI',   'afavor'      => 'SI',   'aprob'      => 'SI',
        'contra'      => 'NO',   ' no'         => 'NO',   'no '        => 'NO',
        'rechaz'      => 'NO',   'encont'      => 'NO',
        'abstenc'     => 'ABSTENCION', 'absten' => 'ABSTENCION',
        'ausente'     => 'AUSENTE',    'absent' => 'AUSENTE',
    ];

    // Parser flexible: detecta secciones y nombres
    $lineas       = preg_split('/\r?\n/', mb_strtolower($texto));
    $voto_actual  = 'SI';   // default si no hay sección
    $votos_parsed = [];     // ['nombre' => voto]
    $sin_match    = [];

    foreach ($lineas as $linea) {
        $linea_trim = trim($linea);
        if (!$linea_trim) continue;

        // ¿Es una línea de sección? "A FAVOR", "EN CONTRA", "AUSENTES", etc.
        $es_seccion = false;
        foreach ($voto_map as $kw => $voto) {
            if (strpos($linea_trim, trim($kw)) !== false && mb_strlen($linea_trim) < 40) {
                $voto_actual = $voto;
                $es_seccion  = true;
                break;
            }
        }
        if ($es_seccion) continue;

        // Limpiar: quitar bullets, números, guiones al inicio
        $nombre_raw = preg_replace('/^[\s\-\•\*\d\.\)]+/', '', $linea_trim);
        $nombre_raw = preg_replace('/\s+/', ' ', $nombre_raw);
        $nombre_raw = trim($nombre_raw, ' .,;-');

        // Ignorar líneas demasiado cortas o que parecen encabezados
        if (mb_strlen($nombre_raw) < 6) continue;
        if (preg_match('/^\d+$/', $nombre_raw)) continue;

        // Si la línea tiene ":" o "-" puede ser "NOMBRE: VOTO" o "NOMBRE - VOTO"
        if (preg_match('/^(.+?)[\:\-–]\s*([\w\s]{2,20})$/u', $nombre_raw, $m)) {
            $posible_voto = trim($m[2]);
            $voto_inline  = null;
            foreach ($voto_map as $kw => $voto) {
                if (strpos(mb_strtolower($posible_voto), trim($kw)) !== false) {
                    $voto_inline = $voto;
                    break;
                }
            }
            if ($voto_inline) {
                $nombre_raw  = trim($m[1]);
                $voto_actual_temp = $voto_inline;
            } else {
                $voto_actual_temp = $voto_actual;
            }
        } else {
            $voto_actual_temp = $voto_actual;
        }

        $votos_parsed[mb_strtoupper($nombre_raw)] = $voto_actual_temp;
    }

    // Matchear nombres contra DB y guardar
    $guardados  = 0;
    $no_match   = [];

    foreach ($votos_parsed as $nombre_upper => $voto) {
        $tokens = array_filter(explode(' ', $nombre_upper), fn($t) => mb_strlen($t) > 2);
        if (empty($tokens)) continue;

        // Buscar por los 2-3 tokens más largos
        $tokens_sorted = $tokens;
        usort($tokens_sorted, fn($a, $b) => mb_strlen($b) - mb_strlen($a));
        $matched_id = null;

        for ($n = min(3, count($tokens_sorted)); $n >= 1; $n--) {
            $conditions = implode(' AND ', array_fill(0, $n, 'nombre_completo LIKE %s'));
            $vals = array_map(fn($t) => '%' . $t . '%', array_slice($tokens_sorted, 0, $n));
            $matched_id = $wpdb->get_var($wpdb->prepare(
                "SELECT id FROM {$p}asamblea_diputados WHERE $conditions LIMIT 1",
                ...$vals
            ));
            if ($matched_id) break;
        }

        if ($matched_id) {
            $wpdb->replace("{$p}asamblea_votos_individuales", [
                'votacion_id'  => $id,
                'diputado_id'  => $matched_id,
                'voto'         => $voto,
            ]);
            $guardados++;
        } else {
            $no_match[] = $nombre_upper;
        }
    }

    // Actualizar resultado de la votación si se proporcionó
    if ($resultado && in_array($resultado, ['APROBADO', 'RECHAZADO', 'VOTACION'])) {
        $wpdb->update("{$p}asamblea_votaciones", ['resultado' => $resultado], ['id' => $id]);
    }

    return new WP_REST_Response([
        'ok'        => true,
        'votacion_id' => $id,
        'parseados' => count($votos_parsed),
        'guardados' => $guardados,
        'sin_match' => $no_match,
    ], 200);
}

// ── Última Hora — timeline unificado ──────────────────────────────────────────
function acontecer_api_ultima_hora(): WP_REST_Response {
    global $wpdb;
    $p = $wpdb->prefix;

    $timeline = [];

    // 1. Últimas 10 votaciones
    $votaciones = $wpdb->get_results(
        "SELECT id, titulo, expediente, resultado, votos_si, votos_no, votos_abstencion,
                COALESCE(fecha, created_at) AS ts
         FROM {$p}asamblea_votaciones
         ORDER BY COALESCE(fecha, created_at) DESC
         LIMIT 10"
    );
    foreach ($votaciones as $v) {
        $timeline[] = [
            'tipo'      => 'votacion',
            'ts'        => $v->ts,
            'id'        => (int) $v->id,
            'titulo'    => $v->titulo,
            'expediente'=> $v->expediente ?: null,
            'resultado' => $v->resultado  ?: null,
            'votos_si'  => (int) $v->votos_si,
            'votos_no'  => (int) $v->votos_no,
            'votos_abs' => (int) $v->votos_abstencion,
        ];
    }

    // 2. Últimos 15 mensajes de Telegram
    $tg_rows = $wpdb->get_results(
        "SELECT id, sender, texto, ia_resumen, es_votacion, expediente,
                votos_si, votos_no, votos_abstencion, resultado, created_at AS ts
         FROM {$p}asamblea_eventos_telegram
         ORDER BY created_at DESC
         LIMIT 15"
    );
    foreach ($tg_rows as $t) {
        // Preferir ia_resumen como título; fallback a primeros 160 chars del texto
        $titulo = (!empty($t->ia_resumen))
            ? $t->ia_resumen
            : mb_substr($t->texto, 0, 160) . (mb_strlen($t->texto) > 160 ? '…' : '');
        // Texto completo (hasta 400 chars) para mostrar debajo del resumen IA
        $texto_corto = mb_substr(trim($t->texto), 0, 400);
        if (mb_strlen($t->texto) > 400) $texto_corto .= '…';
        $timeline[] = [
            'tipo'        => 'telegram',
            'ts'          => $t->ts,
            'id'          => (int) $t->id,
            'titulo'      => $titulo,
            'texto_corto' => $texto_corto,
            'expediente'  => $t->expediente ?: null,
            'resultado'   => $t->resultado  ?: null,
            'votos_si'    => (int) $t->votos_si,
            'votos_no'    => (int) $t->votos_no,
            'votos_abs'   => (int) $t->votos_abstencion,
            'es_votacion' => (bool) $t->es_votacion,
        ];
    }

    // 3. Expedientes nuevos (últimos 7 días)
    $expedientes = $wpdb->get_results(
        "SELECT id, numero, titulo, estado, proponente, updated_at AS ts
         FROM {$p}asamblea_expedientes
         WHERE updated_at >= NOW() - INTERVAL 7 DAY
         ORDER BY updated_at DESC
         LIMIT 10"
    );
    foreach ($expedientes as $e) {
        $timeline[] = [
            'tipo'       => 'expediente_nuevo',
            'ts'         => $e->ts,
            'id'         => (int) $e->id,
            'titulo'     => $e->titulo,
            'expediente' => $e->numero,
            'estado'     => $e->estado    ?: null,
            'proponente' => $e->proponente ? mb_substr($e->proponente, 0, 60) : null,
        ];
    }

    // Ordenar por ts descendente
    usort($timeline, fn($a, $b) => strcmp($b['ts'], $a['ts']));

    // Stats rápidas
    $stats = [
        'votaciones_hoy'    => (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM {$p}asamblea_votaciones WHERE DATE(COALESCE(fecha,created_at))=CURDATE()"
        ),
        'expedientes_nuevos' => (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM {$p}asamblea_expedientes WHERE updated_at >= NOW() - INTERVAL 7 DAY"
        ),
        'telegram_total'    => (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM {$p}asamblea_eventos_telegram WHERE DATE(created_at)=CURDATE()"
        ),
    ];

    return new WP_REST_Response([
        'timeline'           => array_slice($timeline, 0, 30),
        'stats'              => $stats,
        'ultima_actualizacion' => current_time('c'),
    ], 200);
}
