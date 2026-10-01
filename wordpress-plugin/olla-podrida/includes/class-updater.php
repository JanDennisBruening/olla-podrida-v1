<?php
/**
 * GitHub Self-Hosted Plugin Updater for Ensemble Olla Podrida.
 * Enables automatic updates and one-click upgrades directly from GitHub.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Updater {

    const GITHUB_REPO = 'JanDennisBruening/olla-podrida-v1';
    const GITHUB_BRANCH = 'main';
    const GITHUB_RAW_PHP = 'https://raw.githubusercontent.com/JanDennisBruening/olla-podrida-v1/main/wordpress-plugin/olla-podrida/olla-podrida.php';
    const GITHUB_ZIP_URL = 'https://raw.githubusercontent.com/JanDennisBruening/olla-podrida-v1/main/wordpress-plugin/olla-podrida.zip';
    const TRANSIENT_KEY = 'olla_podrida_remote_version';

    public static function init() {
        if (!is_admin()) {
            return;
        }

        add_filter('pre_set_site_transient_update_plugins', [__CLASS__, 'check_for_update']);
        add_filter('plugins_api', [__CLASS__, 'plugin_popup_info'], 20, 3);
        add_filter('upgrader_post_install', [__CLASS__, 'post_install_cleanup'], 10, 3);
        add_action('admin_post_olla_check_updates', [__CLASS__, 'handle_manual_update_check']);
    }

    /**
     * Get remote plugin information from GitHub.
     */
    public static function get_remote_info($force = false) {
        if (!$force) {
            $cached = get_transient(self::TRANSIENT_KEY);
            if ($cached !== false && is_array($cached)) {
                return $cached;
            }
        }

        $response = wp_remote_get(self::GITHUB_RAW_PHP, [
            'timeout' => 8,
            'sslverify' => true,
            'headers' => [
                'User-Agent' => 'WordPress/' . get_bloginfo('version') . '; Olla-Podrida/' . OLLA_PODRIDA_VERSION,
                'Cache-Control' => 'no-cache',
            ],
        ]);

        if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
            return false;
        }

        $body = wp_remote_retrieve_body($response);
        if (empty($body)) {
            return false;
        }

        // Parse Plugin Header
        preg_match('/Version:\s*([0-9]+\.[0-9]+\.[0-9]+)/i', $body, $version_match);
        preg_match('/Description:\s*(.+)/i', $body, $desc_match);
        preg_match('/Requires at least:\s*([0-9]+\.[0-9]+)/i', $body, $requires_match);
        preg_match('/Requires PHP:\s*([0-9]+\.[0-9]+)/i', $body, $php_match);

        $remote_version = !empty($version_match[1]) ? trim($version_match[1]) : '';
        if (empty($remote_version)) {
            return false;
        }

        $info = [
            'version' => $remote_version,
            'description' => !empty($desc_match[1]) ? trim($desc_match[1]) : '',
            'requires' => !empty($requires_match[1]) ? trim($requires_match[1]) : '5.8',
            'requires_php' => !empty($php_match[1]) ? trim($php_match[1]) : '7.4',
            'package' => self::GITHUB_ZIP_URL,
            'url' => 'https://github.com/' . self::GITHUB_REPO,
            'checked_at' => time(),
        ];

        set_transient(self::TRANSIENT_KEY, $info, 6 * HOUR_IN_SECONDS);
        return $info;
    }

    /**
     * Hook into WordPress plugin updates transient.
     */
    public static function check_for_update($transient) {
        if (!is_object($transient)) {
            $transient = new stdClass();
        }

        $plugin_file = 'olla-podrida/olla-podrida.php';
        $force = !empty($_GET['force-check']);
        $remote = self::get_remote_info($force);

        if (!$remote || empty($remote['version'])) {
            return $transient;
        }

        if (version_compare($remote['version'], OLLA_PODRIDA_VERSION, '>')) {
            $item = (object) [
                'id' => 'olla-podrida',
                'slug' => 'olla-podrida',
                'plugin' => $plugin_file,
                'new_version' => $remote['version'],
                'url' => $remote['url'],
                'package' => $remote['package'],
                'tested' => '6.7',
                'requires' => $remote['requires'],
                'requires_php' => $remote['requires_php'],
                'icons' => [
                    'default' => OLLA_PODRIDA_URL . 'assets/dist/images/logo-pot.png',
                    '2x' => OLLA_PODRIDA_URL . 'assets/dist/images/logo-pot.png',
                ],
                'banners' => [
                    'default' => OLLA_PODRIDA_URL . 'assets/dist/images/Menu-Background-2048x238.png',
                ],
            ];

            $transient->response[$plugin_file] = $item;
            unset($transient->no_update[$plugin_file]);
        } else {
            $transient->no_update[$plugin_file] = (object) [
                'id' => 'olla-podrida',
                'slug' => 'olla-podrida',
                'plugin' => $plugin_file,
                'new_version' => OLLA_PODRIDA_VERSION,
                'url' => $remote['url'],
                'package' => '',
            ];
        }

        return $transient;
    }

    /**
     * Provide details modal info when user clicks "View version x.x.x details".
     */
    public static function plugin_popup_info($res, $action, $args) {
        if ($action !== 'plugin_information' || empty($args->slug) || $args->slug !== 'olla-podrida') {
            return $res;
        }

        $remote = self::get_remote_info();
        $version = $remote ? $remote['version'] : OLLA_PODRIDA_VERSION;

        $res = new stdClass();
        $res->name = 'Ensemble Olla Podrida';
        $res->slug = 'olla-podrida';
        $res->version = $version;
        $res->author = '<a href="https://janbruening.de">Jan Dennis Brüning</a>';
        $res->homepage = 'https://github.com/' . self::GITHUB_REPO;
        $res->requires = '5.8';
        $res->tested = '6.7';
        $res->requires_php = '7.4';
        $res->download_link = self::GITHUB_ZIP_URL;
        $res->last_updated = date('Y-m-d');
        $res->sections = [
            'description' => 'Eigenständige One-Page-Website & Content-Management-System für das Ensemble Olla Podrida. Dieses Plugin wird direkt über das offizielle GitHub-Repository gepflegt und aktualisiert.',
            'changelog' => 'Aktuelle Version: ' . $version . '<br/><br/>Entwicklung und Quellcode: <a href="https://github.com/' . self::GITHUB_REPO . '" target="_blank">GitHub Repository öffnen &rarr;</a>',
            'installation' => 'Automatische Aktualisierung über das WordPress-Backend per 1-Klick oder durch Hochladen der ZIP-Datei.',
        ];
        $res->banners = [
            'low' => OLLA_PODRIDA_URL . 'assets/dist/images/Menu-Background-2048x238.png',
            'high' => OLLA_PODRIDA_URL . 'assets/dist/images/Menu-Background-2048x238.png',
        ];

        return $res;
    }

    /**
     * Ensure correct folder name after unzipping update package.
     */
    public static function post_install_cleanup($response, $hook_extra, $result) {
        global $wp_filesystem;

        if (empty($hook_extra['plugin']) || $hook_extra['plugin'] !== 'olla-podrida/olla-podrida.php') {
            return $response;
        }

        // Destination folder is already plugins/olla-podrida/
        $plugin_dir = WP_PLUGIN_DIR . '/olla-podrida';
        if (isset($result['destination']) && $result['destination'] !== $plugin_dir) {
            $wp_filesystem->move($result['destination'], $plugin_dir);
            $result['destination'] = $plugin_dir;
        }

        delete_transient(self::TRANSIENT_KEY);
        return $response;
    }

    /**
     * Handle manual update check button click in WP Admin.
     */
    public static function handle_manual_update_check() {
        if (!current_user_can('update_plugins')) {
            wp_die('Keine Berechtigung.');
        }

        check_admin_referer('olla_check_updates_nonce');
        delete_transient(self::TRANSIENT_KEY);
        delete_site_transient('update_plugins');

        self::get_remote_info(true);

        wp_safe_redirect(admin_url('admin.php?page=olla-podrida&tab=settings&update_checked=1'));
        exit;
    }
}
