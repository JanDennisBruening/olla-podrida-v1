<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Olla_Podrida_Consent
 *
 * Manages DSGVO-compliant Cookie Consent documentation:
 * - Database logging with unique Session-IDs and anonymized IPs (Art. 7 Abs. 1 DSGVO)
 * - REST API endpoint for recording consent grants and revocations
 * - KPI statistics for the WordPress backend
 * - CSV export & Print/PDF report generation
 */
class Olla_Podrida_Consent {

    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
        add_action('admin_post_olla_podrida_export_consent_csv', [__CLASS__, 'handle_export_csv']);
        add_action('admin_post_olla_podrida_print_consent_report', [__CLASS__, 'handle_print_report']);
    }

    public static function create_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'olla_podrida_consent_logs';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            session_id varchar(64) NOT NULL,
            action varchar(50) DEFAULT 'grant' NOT NULL,
            essential tinyint(1) DEFAULT 1 NOT NULL,
            audio tinyint(1) DEFAULT 1 NOT NULL,
            ip_anonymized varchar(100) DEFAULT '' NOT NULL,
            user_agent text DEFAULT '' NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY (id),
            KEY session_id (session_id),
            KEY created_at (created_at)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    public static function register_routes() {
        register_rest_route('olla-podrida/v1', '/consent', [
            'methods'  => 'POST',
            'callback' => [__CLASS__, 'handle_rest_log'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function handle_rest_log(WP_REST_Request $request) {
        $params = $request->get_json_params() ?: $request->get_body_params();

        $session_id = sanitize_text_field($params['session_id'] ?? '');
        if (empty($session_id)) {
            $session_id = 'OP-' . strtoupper(wp_generate_password(10, false));
        }

        $action    = sanitize_key($params['action'] ?? 'grant');
        $essential = !empty($params['essential']) ? 1 : 1;
        $audio     = !empty($params['audio']) ? 1 : 0;

        $raw_ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
        $anonymized_ip = self::anonymize_ip($raw_ip);
        $user_agent = sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? 'Unbekannt');

        global $wpdb;
        $table = $wpdb->prefix . 'olla_podrida_consent_logs';

        // Check if table exists, if not create it
        if ($wpdb->get_var("SHOW TABLES LIKE '$table'") !== $table) {
            self::create_table();
        }

        $wpdb->insert($table, [
            'session_id'    => $session_id,
            'action'        => $action,
            'essential'     => $essential,
            'audio'         => $audio,
            'ip_anonymized' => $anonymized_ip,
            'user_agent'    => $user_agent,
            'created_at'    => current_time('mysql'),
        ], ['%s', '%s', '%d', '%d', '%s', '%s', '%s']);

        return new WP_REST_Response([
            'success'    => true,
            'session_id' => $session_id,
            'action'     => $action,
            'message'    => 'Einwilligung erfolgreich dokumentiert.'
        ], 200);
    }

    private static function anonymize_ip($ip) {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $parts = explode('.', $ip);
            if (count($parts) === 4) {
                return $parts[0] . '.' . $parts[1] . '.' . $parts[2] . '.xxx';
            }
        } elseif (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            $parts = explode(':', $ip);
            if (count($parts) >= 4) {
                return $parts[0] . ':' . $parts[1] . ':' . $parts[2] . ':xxxx:xxxx:xxxx';
            }
        }
        return 'xxx.xxx.xxx.xxx';
    }

    public static function get_logs($limit = 100, $offset = 0) {
        global $wpdb;
        $table = $wpdb->prefix . 'olla_podrida_consent_logs';
        if ($wpdb->get_var("SHOW TABLES LIKE '$table'") !== $table) {
            return [];
        }
        return $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $table ORDER BY created_at DESC LIMIT %d OFFSET %d", $limit, $offset),
            ARRAY_A
        );
    }

    public static function get_stats() {
        global $wpdb;
        $table = $wpdb->prefix . 'olla_podrida_consent_logs';
        if ($wpdb->get_var("SHOW TABLES LIKE '$table'") !== $table) {
            return ['total' => 0, 'last_30_days' => 0, 'revoked' => 0, 'active' => 0];
        }

        $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table");
        $last_30_days = (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM $table WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
        );
        $revoked = (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM $table WHERE action = 'revoke'"
        );
        $active = max(0, $total - $revoked);

        return compact('total', 'last_30_days', 'revoked', 'active');
    }

    public static function handle_export_csv() {
        if (!Olla_Podrida_Roles::can_user_manage_section('consent')) {
            wp_die('Keine ausreichenden Berechtigungen.');
        }

        check_admin_referer('olla_podrida_export_consent');

        $logs = self::get_logs(5000);

        $filename = 'olla-podrida-cookie-consent-log-' . date('Y-m-d-His') . '.csv';

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        $output = fopen('php://output', 'w');

        // UTF-8 BOM for Excel/Numbers compatibility
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

        // Header row
        fputcsv($output, [
            'ID',
            'Consent-Session-ID',
            'Datum & Uhrzeit',
            'Aktion / Status',
            'Essenziell',
            'Musik-Autoplay',
            'IP-Adresse (anonymisiert)',
            'Browser / Endgeraet'
        ], ';');

        foreach ($logs as $log) {
            fputcsv($output, [
                $log['id'],
                $log['session_id'],
                $log['created_at'],
                $log['action'] === 'grant' ? 'Einwilligung erteilt' : 'Widerrufen',
                !empty($log['essential']) ? 'Ja' : 'Nein',
                !empty($log['audio']) ? 'Ja' : 'Nein',
                $log['ip_anonymized'],
                $log['user_agent'],
            ], ';');
        }

        fclose($output);
        exit;
    }

    public static function handle_print_report() {
        if (!Olla_Podrida_Roles::can_user_manage_section('consent')) {
            wp_die('Keine ausreichenden Berechtigungen.');
        }

        check_admin_referer('olla_podrida_print_consent');

        $logs = self::get_logs(200);
        $stats = self::get_stats();

        ?>
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Cookie- &amp; Consent-Dokumentationsbericht – Ensemble Olla Podrida</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                    margin: 40px;
                    color: #222;
                    background: #fff;
                    font-size: 13px;
                }
                .report-header {
                    border-bottom: 2px solid #DAA520;
                    padding-bottom: 20px;
                    margin-bottom: 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .report-title h1 {
                    margin: 0 0 6px 0;
                    font-size: 24px;
                    color: #1a1510;
                }
                .report-title p {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                }
                .kpi-row {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 25px;
                }
                .kpi-box {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    background: #faf8f5;
                }
                .kpi-box strong {
                    display: block;
                    font-size: 20px;
                    color: #b45309;
                    margin-top: 4px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px 10px;
                    text-align: left;
                    font-size: 12px;
                }
                th {
                    background: #f4efe6;
                    color: #2c1810;
                    font-weight: 600;
                }
                tr:nth-child(even) {
                    background: #fbfaf8;
                }
                .status-grant {
                    color: #065f46;
                    font-weight: 600;
                }
                .status-revoke {
                    color: #991b1b;
                    font-weight: 600;
                }
                .session-code {
                    font-family: monospace;
                    font-weight: bold;
                    color: #1e3a8a;
                }
                .no-print {
                    margin-bottom: 20px;
                    display: flex;
                    gap: 10px;
                }
                .btn {
                    padding: 8px 16px;
                    background: #DAA520;
                    color: #000;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                }
                .btn-secondary {
                    background: #eee;
                    color: #333;
                }
                @media print {
                    .no-print { display: none; }
                    body { margin: 15px; }
                }
            </style>
        </head>
        <body>
            <div class="no-print">
                <button onclick="window.print()" class="btn">🖨️ Bericht drucken / als PDF speichern</button>
                <button onclick="window.close()" class="btn btn-secondary">Fenster schließen</button>
            </div>

            <div class="report-header">
                <div class="report-title">
                    <h1>DSGVO-Einwilligungsdokumentation</h1>
                    <p>Ensemble Olla Podrida · Nachweisprotokoll gemäß Art. 7 Abs. 1 DSGVO</p>
                </div>
                <div style="text-align: right; font-size: 12px; color: #555;">
                    Erstellt am: <strong><?php echo date_i18n('d.m.Y H:i:s'); ?></strong><br>
                    Website: <strong><?php echo esc_html(home_url()); ?></strong>
                </div>
            </div>

            <div class="kpi-row">
                <div class="kpi-box">
                    <span>Dokumentierte Einträge:</span>
                    <strong><?php echo $stats['total']; ?></strong>
                </div>
                <div class="kpi-box">
                    <span>Letzte 30 Tage:</span>
                    <strong><?php echo $stats['last_30_days']; ?></strong>
                </div>
                <div class="kpi-box">
                    <span>Widerrufen:</span>
                    <strong><?php echo $stats['revoked']; ?></strong>
                </div>
                <div class="kpi-box">
                    <span>Gültig &amp; Aktiv:</span>
                    <strong><?php echo $stats['active']; ?></strong>
                </div>
            </div>

            <p style="font-size: 12px; color: #555; line-height: 1.5;">
                Dieser Prüfbericht dient der datenschutzrechtlichen Nachweisführung erteilter und widerrufener Einwilligungen zur Cookie- und Speichernutzung. 
                IP-Adressen werden zum Schutz der Privatsphäre der Webseitenbesucher vor der Speicherung datenschutzkonform pseudonymisiert/gekürzt.
            </p>

            <table>
                <thead>
                    <tr>
                        <th style="width: 40px;">#</th>
                        <th style="width: 140px;">Datum &amp; Zeit</th>
                        <th style="width: 150px;">Consent-Session-ID</th>
                        <th style="width: 130px;">Status</th>
                        <th style="width: 130px;">IP (anonymisiert)</th>
                        <th>Browser / Endgerät</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($logs)): ?>
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 20px; color: #888;">Noch keine protokollierten Einwilligungen vorhanden.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($logs as $i => $log): ?>
                            <tr>
                                <td><?php echo $i + 1; ?></td>
                                <td><?php echo esc_html(date_i18n('d.m.Y H:i', strtotime($log['created_at']))); ?></td>
                                <td><span class="session-code"><?php echo esc_html($log['session_id']); ?></span></td>
                                <td>
                                    <?php if ($log['action'] === 'grant'): ?>
                                        <span class="status-grant">✓ Erteilt</span>
                                    <?php else: ?>
                                        <span class="status-revoke">✗ Widerrufen</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo esc_html($log['ip_anonymized']); ?></td>
                                <td style="font-size: 11px; color: #555;"><?php echo esc_html($log['user_agent']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>

            <div style="margin-top: 30px; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 12px; text-align: center;">
                Generiert durch das Olla Podrida Content Management System · Alle Daten verbleiben auf Ihrem eigenen Server.
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}
