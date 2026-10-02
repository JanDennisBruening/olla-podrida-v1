<?php
/**
 * Olla Podrida - Audit Trail & Activity Logger
 * Exclusively tracks logins, user actions, and system modifications for Administrators.
 */

if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Audit {

    const OPTION_KEY = 'olla_podrida_audit_log';
    const MAX_ENTRIES = 250;

    public static function init() {
        // Track Logins & Logouts
        add_action('wp_login', [__CLASS__, 'on_login'], 10, 2);
        add_action('wp_login_failed', [__CLASS__, 'on_login_failed'], 10, 1);
        add_action('wp_logout', [__CLASS__, 'on_logout']);

        // Admin AJAX Endpoints (Admin only)
        add_action('wp_ajax_olla_audit_clear', [__CLASS__, 'handle_ajax_clear']);
    }

    /**
     * Log a user or system action into the audit trail.
     *
     * @param string $type Action type: login|login_failed|event|contact|settings|music|roles|update
     * @param string $title Short title of the action
     * @param string $details Additional contextual details
     * @param WP_User|int|null $user Specific user, or null for current user
     */
    public static function log($type, $title, $details = '', $user = null) {
        $user_obj = null;
        if ($user instanceof WP_User) {
            $user_obj = $user;
        } elseif (is_numeric($user) && $user > 0) {
            $user_obj = get_user_by('id', $user);
        } elseif (is_user_logged_in()) {
            $user_obj = wp_get_current_user();
        }

        $user_id = $user_obj ? $user_obj->ID : 0;
        $user_login = $user_obj ? $user_obj->user_login : 'Gast / Unbekannt';
        $user_name = $user_obj ? (!empty($user_obj->display_name) ? $user_obj->display_name : $user_obj->user_login) : 'Besucher';
        
        $role_label = 'Gast';
        if ($user_obj && !empty($user_obj->roles)) {
            $role_label = self::format_role_label($user_obj->roles[0]);
        }

        $ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
        $ua = sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? '');
        $device = self::parse_device($ua);

        $now = current_time('timestamp');

        $entry = [
            'id'             => uniqid('audit_', true),
            'timestamp'      => $now,
            'date_formatted' => wp_date('d.m.Y · H:i', $now),
            'user_id'        => $user_id,
            'user_login'     => $user_login,
            'user_name'      => $user_name,
            'user_role'      => $role_label,
            'type'           => sanitize_key($type),
            'title'          => sanitize_text_field($title),
            'details'        => sanitize_text_field($details),
            'device'         => $device,
            'ip'             => $ip,
        ];

        $logs = self::get_raw_logs();
        array_unshift($logs, $entry);

        // Keep buffer bounded so database option stays small
        if (count($logs) > self::MAX_ENTRIES) {
            $logs = array_slice($logs, 0, self::MAX_ENTRIES);
        }

        update_option(self::OPTION_KEY, $logs, false);
    }

    /**
     * Handle successful login
     */
    public static function on_login($user_login, $user) {
        if (!$user instanceof WP_User) {
            $user = get_user_by('login', $user_login);
        }
        if (!$user) return;

        $ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
        $ua = sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? '');
        $device = self::parse_device($ua);
        $now = current_time('timestamp');

        // Update persistent user meta
        update_user_meta($user->ID, '_olla_last_login_time', $now);
        update_user_meta($user->ID, '_olla_last_login_ip', $ip);
        update_user_meta($user->ID, '_olla_last_login_device', $device);

        $role_label = !empty($user->roles) ? self::format_role_label($user->roles[0]) : 'Benutzer';

        self::log(
            'login',
            'Erfolgreich angemeldet',
            "Rolle: {$role_label} · Gerät: {$device} · IP: {$ip}",
            $user
        );
    }

    /**
     * Handle failed login attempt
     */
    public static function on_login_failed($username) {
        $ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
        $ua = sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? '');
        $device = self::parse_device($ua);

        self::log(
            'login_failed',
            'Fehlgeschlagener Anmeldeversuch',
            "Versuchter Benutzername: '{$username}' · Gerät: {$device} · IP: {$ip}",
            null
        );
    }

    /**
     * Handle logout
     */
    public static function on_logout() {
        if (is_user_logged_in()) {
            $user = wp_get_current_user();
            self::log('login', 'Abgemeldet', 'Benutzersitzung regulär beendet', $user);
        }
    }

    /**
     * Retrieve all stored audit logs
     */
    public static function get_logs($limit = 100, $type_filter = '') {
        $logs = self::get_raw_logs();
        if (!empty($type_filter)) {
            $logs = array_filter($logs, function($l) use ($type_filter) {
                return isset($l['type']) && $l['type'] === $type_filter;
            });
            $logs = array_values($logs);
        }
        if ($limit > 0 && count($logs) > $limit) {
            $logs = array_slice($logs, 0, $limit);
        }
        return $logs;
    }

    /**
     * Get raw log array from database
     */
    private static function get_raw_logs() {
        $logs = get_option(self::OPTION_KEY, []);
        return is_array($logs) ? $logs : [];
    }

    /**
     * Clear all logs (Admin only)
     */
    public static function clear_logs() {
        return delete_option(self::OPTION_KEY);
    }

    /**
     * AJAX handler to clear audit logs
     */
    public static function handle_ajax_clear() {
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Keine Administrator-Berechtigung.']);
        }
        check_ajax_referer('olla_audit_nonce', 'nonce');

        self::clear_logs();
        self::log('settings', 'Audit-Log zurückgesetzt', 'Das Protokoll wurde vom Administrator geleert.');

        wp_send_json_success(['message' => 'Aktivitätsprotokoll erfolgreich geleert.']);
    }

    /**
     * Get summary of all users with their last login info
     */
    public static function get_users_login_summary() {
        $current_user_id = get_current_user_id();
        if ($current_user_id) {
            $curr_last = get_user_meta($current_user_id, '_olla_last_login_time', true);
            if (!$curr_last) {
                $now = current_time('timestamp');
                $ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
                $ua = sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? '');
                $device = self::parse_device($ua);
                update_user_meta($current_user_id, '_olla_last_login_time', $now);
                update_user_meta($current_user_id, '_olla_last_login_ip', $ip);
                update_user_meta($current_user_id, '_olla_last_login_device', $device);
            }
        }

        $users = get_users(['number' => 25, 'orderby' => 'ID', 'order' => 'ASC']);
        $summary = [];

        foreach ($users as $u) {
            $last_login_ts = get_user_meta($u->ID, '_olla_last_login_time', true);
            $last_ip = get_user_meta($u->ID, '_olla_last_login_ip', true) ?: '—';
            $last_device = get_user_meta($u->ID, '_olla_last_login_device', true) ?: '—';

            $role_slug = !empty($u->roles) ? $u->roles[0] : 'none';
            $role_label = self::format_role_label($role_slug);

            $human_time = 'Noch nie eingeloggt';
            $date_str = '—';
            if ($last_login_ts) {
                $diff = current_time('timestamp') - $last_login_ts;
                if ($diff < 180) {
                    $human_time = '🟢 Gerade aktiv';
                } else {
                    $human_time = human_time_diff($last_login_ts, current_time('timestamp')) . ' her';
                }
                $date_str = wp_date('d.m.Y, H:i \U\h\r', $last_login_ts);
            }

            $summary[] = [
                'id'            => $u->ID,
                'login'         => $u->user_login,
                'name'          => !empty($u->display_name) ? $u->display_name : $u->user_login,
                'email'         => $u->user_email,
                'role_slug'     => $role_slug,
                'role_label'    => $role_label,
                'last_login_ts' => (int) $last_login_ts,
                'date_str'      => $date_str,
                'human_time'    => $human_time,
                'ip'            => $last_ip,
                'device'        => $last_device,
            ];
        }

        // Sort descending by last login (active first)
        usort($summary, function($a, $b) {
            return $b['last_login_ts'] <=> $a['last_login_ts'];
        });

        return $summary;
    }

    /**
     * Map role slug to user-friendly label
     */
    public static function format_role_label($role_slug) {
        $labels = [
            'administrator'          => 'Administrator & Webentwicklung',
            'olla_grossmeister'      => '👑 Großmeister (Admin)',
            'olla_ensemble_leitung'  => 'Ensemble-Leitung & Redaktion',
            'olla_hofkapellmeister'  => '🎵 Hofkapellmeister (Manager)',
            'olla_schreiber'         => '📜 Schreiber (Termine & Presse)',
            'olla_spielmann'         => '🎭 Spielmann (Gast)',
            'editor'                 => 'Redakteur',
            'author'                 => 'Autor',
            'contributor'            => 'Mitarbeiter',
            'subscriber'             => 'Abonnent',
        ];
        return $labels[$role_slug] ?? ucfirst($role_slug);
    }

    /**
     * Clean parser for device / browser string
     */
    public static function parse_device($ua) {
        if (empty($ua)) return 'Unbekanntes Gerät';

        $os = 'Unbekanntes OS';
        if (preg_match('/iPhone/i', $ua)) $os = '📱 iPhone';
        elseif (preg_match('/iPad/i', $ua)) $os = '📱 iPad';
        elseif (preg_match('/Android/i', $ua)) $os = '📱 Android';
        elseif (preg_match('/Macintosh|Mac OS X/i', $ua)) $os = '💻 Mac';
        elseif (preg_match('/Windows/i', $ua)) $os = '💻 Windows';
        elseif (preg_match('/Linux/i', $ua)) $os = '💻 Linux';

        $browser = '';
        if (preg_match('/Edg/i', $ua)) $browser = 'Edge';
        elseif (preg_match('/Chrome/i', $ua) && !preg_match('/Edg/i', $ua)) $browser = 'Chrome';
        elseif (preg_match('/Safari/i', $ua) && !preg_match('/Chrome/i', $ua)) $browser = 'Safari';
        elseif (preg_match('/Firefox/i', $ua)) $browser = 'Firefox';
        elseif (preg_match('/Opera|OPR/i', $ua)) $browser = 'Opera';

        return $browser ? "{$os} ({$browser})" : $os;
    }
}
