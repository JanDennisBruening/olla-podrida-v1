<?php
if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Contact {

    public static function create_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'olla_podrida_messages';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            message text NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            is_read tinyint(1) DEFAULT 0 NOT NULL,
            source varchar(100) DEFAULT '' NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    public static function register_routes() {
        register_rest_route('olla-podrida/v1', '/contact', [
            'methods' => 'POST',
            'callback' => [__CLASS__, 'handle_submission'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function handle_submission(WP_REST_Request $request) {
        $params = $request->get_json_params();
        if (empty($params)) {
            $params = $request->get_body_params();
        }

        $contact_settings = Olla_Podrida_Settings::get_section('contact');

        // 1. Honeypot check: If invisible honeypot field is filled, reject immediately
        $honeypot = trim($params['hp_website'] ?? $params['website_check'] ?? '');
        if (!empty($honeypot)) {
            // Silently return success to mislead bots, or 400
            return new WP_REST_Response([
                'success' => true,
                'message' => 'Vielen Dank für Ihre Anfrage.'
            ], 200);
        }

        // 2. Timing check: reject submissions under 2.5 seconds (human impossible)
        $form_ts = intval($params['_form_ts'] ?? 0);
        if ($form_ts > 0 && (time() - $form_ts < 2)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'Die Anfrage wurde zu schnell versendet. Bitte versuchen Sie es erneut.'
            ], 400);
        }

        // 3. IP Rate Limiting via WordPress Transients (max 5 submissions per 10 minutes)
        $ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
        $rate_key = 'olla_rate_' . md5($ip);
        $attempts = (int) get_transient($rate_key);
        if ($attempts >= 5) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'Zu viele Anfragen in kurzer Zeit. Bitte warten Sie einige Minuten vor dem nächsten Versuch.'
            ], 429);
        }
        set_transient($rate_key, $attempts + 1, 10 * MINUTE_IN_SECONDS);

        $name = str_replace(["\r", "\n"], '', sanitize_text_field($params['name'] ?? ''));
        $email = str_replace(["\r", "\n"], '', sanitize_email($params['email'] ?? ''));
        $message = sanitize_textarea_field($params['message'] ?? '');
        $acceptance = !empty($params['acceptance']);

        if (empty($name) || empty($email) || !is_email($email) || !$acceptance) {
            return new WP_REST_Response([
                'success' => false,
                'message' => $contact_settings['error_message'] ?? 'Bitte füllen Sie alle Pflichtfelder aus und akzeptieren Sie die Datenschutzhinweise.'
            ], 400);
        }

        // Save to Database
        global $wpdb;
        $table_name = $wpdb->prefix . 'olla_podrida_messages';
        $inserted = $wpdb->insert($table_name, [
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'created_at' => current_time('mysql'),
            'is_read' => 0
        ]);

        if ($inserted && class_exists('Olla_Podrida_Audit')) {
            Olla_Podrida_Audit::log('contact', 'Neue Kontaktanfrage eingegangen', "Von: {$name} ({$email})", null);
        }

        // Send Email Notification to one or multiple recipients
        $recipient_setting = $contact_settings['recipient_email'] ?: get_option('admin_email');
        $recipients = array_filter(array_map('trim', explode(',', $recipient_setting)), 'is_email');
        if (empty($recipients)) {
            $recipients = [get_option('admin_email')];
        }
        $subject = str_replace(["\r", "\n"], '', $contact_settings['subject'] ?: 'Neue Kontaktanfrage über Olla Podrida');

        $body = "Neue Nachricht über das Olla Podrida Kontaktformular:\n\n";
        $body .= "Name: " . $name . "\n";
        $body .= "E-Mail: " . $email . "\n";
        $body .= "Datum: " . current_time('d.m.Y H:i') . "\n\n";
        $body .= "Nachricht:\n" . $message . "\n\n";
        $body .= "---\nDiese E-Mail wurde automatisch von Ihrer WordPress-Website generiert.";

        $headers = [
            'Content-Type: text/plain; charset=UTF-8',
            'Reply-To: ' . $name . ' <' . $email . '>'
        ];

        @wp_mail($recipients, $subject, $body, $headers);

        return new WP_REST_Response([
            'success' => true,
            'message' => $contact_settings['success_message'] ?? 'Vielen Dank für Ihre Nachricht. Sie wurde erfolgreich versendet.'
        ], 200);
    }

    public static function get_messages($limit = 50) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'olla_podrida_messages';

        // Check if table exists
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
            return [];
        }

        return $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $table_name ORDER BY created_at DESC LIMIT %d", $limit),
            ARRAY_A
        );
    }

    public static function delete_message($id) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'olla_podrida_messages';
        $res = $wpdb->delete($table_name, ['id' => intval($id)]);
        if ($res && class_exists('Olla_Podrida_Audit')) {
            Olla_Podrida_Audit::log('contact', 'Kontaktanfrage gelöscht', "Nachrichten-ID: {$id}");
        }
        return $res;
    }

    public static function mark_as_read($id) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'olla_podrida_messages';
        $res = $wpdb->update($table_name, ['is_read' => 1], ['id' => intval($id)]);
        if ($res && class_exists('Olla_Podrida_Audit')) {
            Olla_Podrida_Audit::log('contact', 'Kontaktanfrage als gelesen markiert', "Nachrichten-ID: {$id}");
        }
        return $res;
    }

    public static function get_message_counts() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'olla_podrida_messages';
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
            return ['total' => 0, 'unread' => 0, 'read' => 0];
        }
        $total = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
        $unread = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE is_read = 0");
        $read = max(0, $total - $unread);
        return [
            'total' => $total,
            'unread' => $unread,
            'read' => $read,
        ];
    }
}
