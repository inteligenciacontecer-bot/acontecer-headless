<?php
/**
 * Plugin Name: Acontecer Indexing Webhook
 * Description: Avisa a IndexNow (Google, Bing, Yandex) via Next.js cuando se publica o actualiza una nota.
 * Version: 1.1
 * Author: Acontecer
 */

if (!defined('ABSPATH')) exit;

// Disparar al publicar o actualizar
add_action('publish_post',        'acontecer_indexing_ping', 10, 2);
add_action('post_updated',        'acontecer_indexing_ping_on_update', 10, 3);

function acontecer_get_post_url(int $post_id): string {
    $post = get_post($post_id);
    if (!$post || $post->post_status !== 'publish') return '';

    $categories = wp_get_post_categories($post_id, ['fields' => 'slugs']);
    $cat_slug   = !empty($categories) ? $categories[0] : 'nacionales';

    return "https://acontecer.co.cr/{$cat_slug}/{$post->post_name}";
}

function acontecer_send_indexing_ping(string $url, string $type = 'URL_UPDATED'): void {
    if (empty($url)) return;

    $secret   = defined('ACONTECER_INDEXING_SECRET') ? ACONTECER_INDEXING_SECRET : '';
    $endpoint = 'https://acontecer.co.cr/api/index-url';

    wp_remote_post($endpoint, [
        'method'    => 'POST',
        'timeout'   => 10,
        'blocking'  => false, // no bloquea la publicación
        'headers'   => [
            'Content-Type'      => 'application/json',
            'x-webhook-secret'  => $secret,
        ],
        'body' => wp_json_encode(['url' => $url]),
    ]);

    error_log("[acontecer-indexing] ping enviado: {$type} → {$url}");
}

// Al publicar por primera vez
function acontecer_indexing_ping(int $post_id, WP_Post $post): void {
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) return;
    if ($post->post_type !== 'post') return;

    $url = acontecer_get_post_url($post_id);
    acontecer_send_indexing_ping($url, 'URL_UPDATED');
}

// Al actualizar un post ya publicado
function acontecer_indexing_ping_on_update(int $post_id, WP_Post $post_after, WP_Post $post_before): void {
    if ($post_after->post_status !== 'publish') return;
    if ($post_after->post_type !== 'post') return;
    if (wp_is_post_revision($post_id)) return;

    $url = acontecer_get_post_url($post_id);
    acontecer_send_indexing_ping($url, 'URL_UPDATED');
}
