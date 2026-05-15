<?php
/**
 * Endpoint: GET /acontecer/v1/asamblea/comisiones
 * Devuelve índice invertido: comisión → [diputados]
 * Agregar dentro de acontecer-asamblea.php en el bloque register_rest_route
 */

// ── Endpoint /comisiones ──────────────────────────────────────────────────────
register_rest_route('acontecer/v1', '/asamblea/comisiones', [
    'methods'             => 'GET',
    'callback'            => 'acontecer_asamblea_comisiones',
    'permission_callback' => '__return_true',
]);

function acontecer_asamblea_comisiones(WP_REST_Request $request): WP_REST_Response {
    global $wpdb;
    $table = $wpdb->prefix . 'asamblea_diputados';

    $rows = $wpdb->get_results(
        "SELECT id, slug, nombre_completo, fraccion, partido, foto_url, provincia, comisiones
         FROM {$table}
         WHERE comisiones IS NOT NULL AND comisiones != ''
         ORDER BY nombre_completo ASC",
        ARRAY_A
    );

    // Construir índice invertido
    $indice = [];
    foreach ($rows as $d) {
        $lista = preg_split('/[,;|\n]/', $d['comisiones']);
        foreach ($lista as $raw) {
            $nombre = trim($raw);
            if ($nombre === '') continue;
            if (!isset($indice[$nombre])) {
                $indice[$nombre] = [];
            }
            $indice[$nombre][] = [
                'id'             => (int) $d['id'],
                'slug'           => $d['slug'],
                'nombre_completo'=> $d['nombre_completo'],
                'fraccion'       => $d['fraccion'],
                'partido'        => $d['partido'],
                'foto_url'       => $d['foto_url'],
                'provincia'      => $d['provincia'],
            ];
        }
    }

    // Ordenar: permanentes primero, luego alfabético
    uksort($indice, function($a, $b) {
        $aPerm = stripos($a, 'permanente') !== false;
        $bPerm = stripos($b, 'permanente') !== false;
        if ($aPerm && !$bPerm) return -1;
        if (!$aPerm && $bPerm) return 1;
        return strcoll($a, $b);
    });

    $comisiones = [];
    foreach ($indice as $nombre => $miembros) {
        $comisiones[] = [
            'nombre'    => $nombre,
            'permanente'=> stripos($nombre, 'permanente') !== false,
            'total'     => count($miembros),
            'miembros'  => $miembros,
        ];
    }

    return new WP_REST_Response([
        'total'      => count($comisiones),
        'comisiones' => $comisiones,
    ], 200);
}
