<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Olla_Podrida_Import
 *
 * Detects installed WordPress form plugins, lists their individual forms,
 * previews the entries, and imports them into the Olla Podrida messages table.
 *
 * Supported plugins:
 *  - Elementor Pro Forms
 *  - WPForms (Lite & Pro)
 *  - Contact Form 7 + Flamingo
 *  - Gravity Forms
 *  - Fluent Forms
 *  - Ninja Forms
 */
class Olla_Podrida_Import {

    /* ───────────────────────────── adapters registry ── */

    private static $adapters = [
        'elementor'    => 'Elementor Pro Forms',
        'wpforms'      => 'WPForms',
        'cf7_flamingo' => 'Contact Form 7 (Flamingo)',
        'gravityforms' => 'Gravity Forms',
        'fluentforms'  => 'Fluent Forms',
        'ninjaforms'   => 'Ninja Forms',
    ];

    /* ───────────────────────────────── AJAX handlers ── */

    public static function init() {
        add_action('wp_ajax_olla_podrida_import_detect', [__CLASS__, 'ajax_detect_sources']);
        add_action('wp_ajax_olla_podrida_import_forms',  [__CLASS__, 'ajax_get_forms']);
        add_action('wp_ajax_olla_podrida_import_preview', [__CLASS__, 'ajax_preview']);
        add_action('wp_ajax_olla_podrida_import_execute', [__CLASS__, 'ajax_execute']);
    }

    /* ──────────────────── 1. Detect installed plugins ── */

    public static function detect_sources() {
        $sources = [];

        foreach (self::$adapters as $key => $label) {
            $method = 'is_available_' . $key;
            if (method_exists(__CLASS__, $method) && self::$method()) {
                $sources[$key] = $label;
            }
        }

        return $sources;
    }

    /* ── availability checks ── */

    private static function is_available_elementor() {
        global $wpdb;
        $table = $wpdb->prefix . 'e_submissions';
        return $wpdb->get_var("SHOW TABLES LIKE '$table'") === $table;
    }

    private static function is_available_wpforms() {
        return class_exists('WPForms') || function_exists('wpforms');
    }

    private static function is_available_cf7_flamingo() {
        return post_type_exists('flamingo_inbound') || class_exists('Flamingo_Inbound_Message');
    }

    private static function is_available_gravityforms() {
        return class_exists('GFAPI') || class_exists('GFFormsModel');
    }

    private static function is_available_fluentforms() {
        global $wpdb;
        $table = $wpdb->prefix . 'fluentform_submissions';
        return $wpdb->get_var("SHOW TABLES LIKE '$table'") === $table;
    }

    private static function is_available_ninjaforms() {
        global $wpdb;
        $table = $wpdb->prefix . 'nf3_objects';
        return $wpdb->get_var("SHOW TABLES LIKE '$table'") === $table;
    }

    /* ──────────────────── 2. List forms for a source ── */

    public static function get_forms($source) {
        $method = 'list_forms_' . $source;
        if (!method_exists(__CLASS__, $method)) {
            return [];
        }
        return self::$method();
    }

    /* ── Elementor ── */

    private static function list_forms_elementor() {
        global $wpdb;
        $table = $wpdb->prefix . 'e_submissions';
        $rows = $wpdb->get_results(
            "SELECT DISTINCT element_id, form_name FROM $table ORDER BY form_name ASC"
        );
        $forms = [];
        foreach ($rows as $row) {
            $forms[] = [
                'id'    => $row->element_id,
                'label' => !empty($row->form_name) ? $row->form_name : 'Formular ' . $row->element_id,
                'count' => (int) $wpdb->get_var($wpdb->prepare(
                    "SELECT COUNT(*) FROM $table WHERE element_id = %s", $row->element_id
                )),
            ];
        }
        return $forms;
    }

    /* ── WPForms ── */

    private static function list_forms_wpforms() {
        $posts = get_posts([
            'post_type'   => 'wpforms',
            'numberposts' => 200,
            'post_status' => 'publish',
        ]);
        global $wpdb;
        $forms = [];
        foreach ($posts as $p) {
            $entry_table = $wpdb->prefix . 'wpforms_entries';
            $has_table = $wpdb->get_var("SHOW TABLES LIKE '$entry_table'") === $entry_table;
            $count = 0;
            if ($has_table) {
                $count = (int) $wpdb->get_var($wpdb->prepare(
                    "SELECT COUNT(*) FROM $entry_table WHERE form_id = %d", $p->ID
                ));
            }
            $forms[] = [
                'id'    => (string) $p->ID,
                'label' => $p->post_title ?: 'Formular #' . $p->ID,
                'count' => $count,
            ];
        }
        return $forms;
    }

    /* ── Contact Form 7 / Flamingo ── */

    private static function list_forms_cf7_flamingo() {
        $channels = get_terms([
            'taxonomy'   => 'flamingo_inbound_channel',
            'hide_empty' => false,
        ]);
        $forms = [];
        if (is_wp_error($channels) || empty($channels)) {
            // Fallback: list all as one group
            $count = (int) wp_count_posts('flamingo_inbound')->publish;
            if ($count > 0) {
                $forms[] = [
                    'id'    => '_all',
                    'label' => 'Alle CF7-Formulare',
                    'count' => $count,
                ];
            }
            return $forms;
        }
        foreach ($channels as $term) {
            $forms[] = [
                'id'    => (string) $term->term_id,
                'label' => $term->name,
                'count' => (int) $term->count,
            ];
        }
        return $forms;
    }

    /* ── Gravity Forms ── */

    private static function list_forms_gravityforms() {
        if (!class_exists('GFAPI')) {
            return [];
        }
        $gf_forms = GFAPI::get_forms();
        $forms = [];
        foreach ($gf_forms as $f) {
            $count = (int) GFAPI::count_entries($f['id']);
            $forms[] = [
                'id'    => (string) $f['id'],
                'label' => $f['title'],
                'count' => $count,
            ];
        }
        return $forms;
    }

    /* ── Fluent Forms ── */

    private static function list_forms_fluentforms() {
        global $wpdb;
        $table = $wpdb->prefix . 'fluentform_submissions';
        $forms_table = $wpdb->prefix . 'fluentform_forms';
        $has_forms_table = $wpdb->get_var("SHOW TABLES LIKE '$forms_table'") === $forms_table;

        if ($has_forms_table) {
            $rows = $wpdb->get_results("SELECT id, title FROM $forms_table ORDER BY title ASC");
            $forms = [];
            foreach ($rows as $row) {
                $count = (int) $wpdb->get_var($wpdb->prepare(
                    "SELECT COUNT(*) FROM $table WHERE form_id = %d", $row->id
                ));
                $forms[] = [
                    'id'    => (string) $row->id,
                    'label' => $row->title ?: 'Formular #' . $row->id,
                    'count' => $count,
                ];
            }
            return $forms;
        }

        // Fallback: group by form_id
        $rows = $wpdb->get_results("SELECT DISTINCT form_id, COUNT(*) as cnt FROM $table GROUP BY form_id");
        $forms = [];
        foreach ($rows as $row) {
            $forms[] = [
                'id'    => (string) $row->form_id,
                'label' => 'Formular #' . $row->form_id,
                'count' => (int) $row->cnt,
            ];
        }
        return $forms;
    }

    /* ── Ninja Forms ── */

    private static function list_forms_ninjaforms() {
        global $wpdb;
        $objects = $wpdb->prefix . 'nf3_objects';
        $rows = $wpdb->get_results("SELECT id, title FROM $objects WHERE type = 'form' ORDER BY title ASC");
        $subs_table = $wpdb->prefix . 'nf3_objects';
        $forms = [];
        foreach ($rows as $row) {
            $count = (int) $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM $subs_table WHERE type = 'submission' AND parent_id = %d", $row->id
            ));
            $forms[] = [
                'id'    => (string) $row->id,
                'label' => $row->title ?: 'Formular #' . $row->id,
                'count' => $count,
            ];
        }
        return $forms;
    }

    /* ──────────────── 3. Preview: count + sample entries ── */

    public static function preview($source, $form_id) {
        $method = 'fetch_entries_' . $source;
        if (!method_exists(__CLASS__, $method)) {
            return ['count' => 0, 'sample' => []];
        }
        $entries = self::$method($form_id, 5);
        $method_count = 'count_entries_' . $source;
        $total = method_exists(__CLASS__, $method_count)
            ? self::$method_count($form_id)
            : count($entries);

        return [
            'count'  => $total,
            'sample' => $entries,
        ];
    }

    /* ──────────────── 4. Execute: import into messages ── */

    public static function execute_import($source, $form_id) {
        $method = 'fetch_entries_' . $source;
        if (!method_exists(__CLASS__, $method)) {
            return ['imported' => 0, 'skipped' => 0];
        }

        $entries  = self::$method($form_id, 99999);
        $imported = 0;
        $skipped  = 0;
        $source_label = self::$adapters[$source] ?? $source;

        global $wpdb;
        $table = $wpdb->prefix . 'olla_podrida_messages';

        foreach ($entries as $entry) {
            $name    = sanitize_text_field($entry['name'] ?? '');
            $email   = sanitize_email($entry['email'] ?? '');
            $message = sanitize_textarea_field($entry['message'] ?? '');
            $date    = $entry['date'] ?? current_time('mysql');

            if (empty($name) && empty($email)) {
                $skipped++;
                continue;
            }

            // Duplicate check: same email + same message (first 100 chars) + same date
            $exists = $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM $table WHERE email = %s AND LEFT(message, 100) = LEFT(%s, 100) AND created_at = %s",
                $email, $message, $date
            ));
            if ($exists > 0) {
                $skipped++;
                continue;
            }

            $wpdb->insert($table, [
                'name'       => $name ?: '(Kein Name)',
                'email'      => $email ?: '(Keine E-Mail)',
                'message'    => $message ?: '(Kein Text)',
                'created_at' => $date,
                'is_read'    => 1, // imported entries are pre-read
                'source'     => $source_label,
            ], ['%s', '%s', '%s', '%s', '%d', '%s']);

            $imported++;
        }

        return [
            'imported' => $imported,
            'skipped'  => $skipped,
            'source'   => $source_label,
        ];
    }

    /* ──────────────── Entry fetcher adapters ── */

    /* ── Elementor ── */

    private static function fetch_entries_elementor($form_id, $limit = 5) {
        global $wpdb;
        $subs  = $wpdb->prefix . 'e_submissions';
        $vals  = $wpdb->prefix . 'e_submissions_values';

        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT id, created_at_gmt FROM $subs WHERE element_id = %s ORDER BY created_at_gmt DESC LIMIT %d",
            $form_id, $limit
        ));

        $entries = [];
        foreach ($rows as $row) {
            $fields = $wpdb->get_results($wpdb->prepare(
                "SELECT `key`, `value` FROM $vals WHERE submission_id = %d", $row->id
            ));
            $data = [];
            foreach ($fields as $f) {
                $data[strtolower($f->key)] = $f->value;
            }
            $entries[] = [
                'name'    => $data['name'] ?? $data['your-name'] ?? $data['full_name'] ?? $data['vorname'] ?? '',
                'email'   => $data['email'] ?? $data['your-email'] ?? $data['e-mail'] ?? $data['mail'] ?? '',
                'message' => $data['message'] ?? $data['your-message'] ?? $data['nachricht'] ?? $data['textarea'] ?? '',
                'date'    => $row->created_at_gmt,
            ];
        }
        return $entries;
    }

    private static function count_entries_elementor($form_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'e_submissions';
        return (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE element_id = %s", $form_id
        ));
    }

    /* ── WPForms ── */

    private static function fetch_entries_wpforms($form_id, $limit = 5) {
        global $wpdb;
        $table = $wpdb->prefix . 'wpforms_entries';
        if ($wpdb->get_var("SHOW TABLES LIKE '$table'") !== $table) {
            return [];
        }
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT fields, date FROM $table WHERE form_id = %d AND status = '' ORDER BY date DESC LIMIT %d",
            $form_id, $limit
        ));
        $entries = [];
        foreach ($rows as $row) {
            $fields = json_decode($row->fields, true) ?: [];
            $name = $email = $message = '';
            foreach ($fields as $f) {
                $type = strtolower($f['type'] ?? '');
                $val  = $f['value'] ?? '';
                if ($type === 'name' || stripos($f['name'] ?? '', 'name') !== false) {
                    $name = $val;
                } elseif ($type === 'email') {
                    $email = $val;
                } elseif ($type === 'textarea' || stripos($f['name'] ?? '', 'message') !== false || stripos($f['name'] ?? '', 'nachricht') !== false) {
                    $message = $val;
                }
            }
            $entries[] = compact('name', 'email', 'message') + ['date' => $row->date];
        }
        return $entries;
    }

    private static function count_entries_wpforms($form_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'wpforms_entries';
        if ($wpdb->get_var("SHOW TABLES LIKE '$table'") !== $table) {
            return 0;
        }
        return (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE form_id = %d AND status = ''", $form_id
        ));
    }

    /* ── CF7 / Flamingo ── */

    private static function fetch_entries_cf7_flamingo($form_id, $limit = 5) {
        $args = [
            'post_type'   => 'flamingo_inbound',
            'numberposts' => $limit,
            'post_status' => 'any',
            'orderby'     => 'date',
            'order'       => 'DESC',
        ];
        if ($form_id !== '_all') {
            $args['tax_query'] = [[
                'taxonomy' => 'flamingo_inbound_channel',
                'field'    => 'term_id',
                'terms'    => intval($form_id),
            ]];
        }
        $posts = get_posts($args);
        $entries = [];
        foreach ($posts as $p) {
            $meta = get_post_meta($p->ID, '_meta', true);
            $fields = is_array($meta) ? $meta : [];
            $entries[] = [
                'name'    => $fields['your-name'] ?? $fields['name'] ?? get_post_meta($p->ID, '_from_name', true) ?: $p->post_title,
                'email'   => $fields['your-email'] ?? $fields['email'] ?? get_post_meta($p->ID, '_from_email', true) ?: '',
                'message' => $fields['your-message'] ?? $fields['message'] ?? $p->post_content,
                'date'    => $p->post_date,
            ];
        }
        return $entries;
    }

    private static function count_entries_cf7_flamingo($form_id) {
        $args = [
            'post_type'   => 'flamingo_inbound',
            'numberposts' => -1,
            'post_status' => 'any',
            'fields'      => 'ids',
        ];
        if ($form_id !== '_all') {
            $args['tax_query'] = [[
                'taxonomy' => 'flamingo_inbound_channel',
                'field'    => 'term_id',
                'terms'    => intval($form_id),
            ]];
        }
        return count(get_posts($args));
    }

    /* ── Gravity Forms ── */

    private static function fetch_entries_gravityforms($form_id, $limit = 5) {
        if (!class_exists('GFAPI')) {
            return [];
        }
        $gf_entries = GFAPI::get_entries($form_id, [], null, ['offset' => 0, 'page_size' => $limit]);
        $form = GFAPI::get_form($form_id);
        $field_map = [];
        if (!empty($form['fields'])) {
            foreach ($form['fields'] as $f) {
                $field_map[$f->id] = strtolower($f->type);
            }
        }

        $entries = [];
        foreach ($gf_entries as $ge) {
            $name = $email = $message = '';
            foreach ($field_map as $fid => $type) {
                $val = $ge[$fid] ?? '';
                if ($type === 'name') $name = $val;
                elseif ($type === 'email') $email = $val;
                elseif ($type === 'textarea') $message = $val;
            }
            $entries[] = [
                'name'    => $name,
                'email'   => $email,
                'message' => $message,
                'date'    => $ge['date_created'] ?? '',
            ];
        }
        return $entries;
    }

    private static function count_entries_gravityforms($form_id) {
        return class_exists('GFAPI') ? (int) GFAPI::count_entries($form_id) : 0;
    }

    /* ── Fluent Forms ── */

    private static function fetch_entries_fluentforms($form_id, $limit = 5) {
        global $wpdb;
        $table = $wpdb->prefix . 'fluentform_submissions';
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT response, created_at FROM $table WHERE form_id = %d ORDER BY created_at DESC LIMIT %d",
            $form_id, $limit
        ));
        $entries = [];
        foreach ($rows as $row) {
            $data = json_decode($row->response, true) ?: [];
            // Flatten nested arrays
            $flat = [];
            foreach ($data as $k => $v) {
                $flat[strtolower($k)] = is_array($v) ? implode(' ', $v) : $v;
            }
            $entries[] = [
                'name'    => $flat['name'] ?? $flat['names'] ?? $flat['your-name'] ?? $flat['vorname'] ?? '',
                'email'   => $flat['email'] ?? $flat['your-email'] ?? $flat['e-mail'] ?? '',
                'message' => $flat['message'] ?? $flat['your-message'] ?? $flat['nachricht'] ?? '',
                'date'    => $row->created_at,
            ];
        }
        return $entries;
    }

    private static function count_entries_fluentforms($form_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'fluentform_submissions';
        return (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE form_id = %d", $form_id
        ));
    }

    /* ── Ninja Forms ── */

    private static function fetch_entries_ninjaforms($form_id, $limit = 5) {
        global $wpdb;
        $objects = $wpdb->prefix . 'nf3_objects';
        $meta    = $wpdb->prefix . 'nf3_object_meta';

        $sub_ids = $wpdb->get_col($wpdb->prepare(
            "SELECT id FROM $objects WHERE type = 'submission' AND parent_id = %d ORDER BY id DESC LIMIT %d",
            $form_id, $limit
        ));
        if (empty($sub_ids)) return [];

        $entries = [];
        foreach ($sub_ids as $sid) {
            $metas = $wpdb->get_results($wpdb->prepare(
                "SELECT `key`, `value` FROM $meta WHERE parent_id = %d", $sid
            ));
            $data = [];
            foreach ($metas as $m) {
                $data[strtolower($m->key)] = $m->value;
            }
            $entries[] = [
                'name'    => $data['name'] ?? $data['your-name'] ?? '',
                'email'   => $data['email'] ?? $data['your-email'] ?? '',
                'message' => $data['message'] ?? $data['your-message'] ?? '',
                'date'    => $data['_date_created'] ?? current_time('mysql'),
            ];
        }
        return $entries;
    }

    private static function count_entries_ninjaforms($form_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'nf3_objects';
        return (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE type = 'submission' AND parent_id = %d", $form_id
        ));
    }

    /* ──────────────── AJAX endpoint implementations ── */

    public static function ajax_detect_sources() {
        check_ajax_referer('olla_podrida_import', '_nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('contact')) {
            wp_send_json_error('Keine Berechtigung.');
        }
        wp_send_json_success(self::detect_sources());
    }

    public static function ajax_get_forms() {
        check_ajax_referer('olla_podrida_import', '_nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('contact')) {
            wp_send_json_error('Keine Berechtigung.');
        }
        $source = sanitize_key($_POST['source'] ?? '');
        wp_send_json_success(self::get_forms($source));
    }

    public static function ajax_preview() {
        check_ajax_referer('olla_podrida_import', '_nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('contact')) {
            wp_send_json_error('Keine Berechtigung.');
        }
        $source  = sanitize_key($_POST['source'] ?? '');
        $form_id = sanitize_text_field($_POST['form_id'] ?? '');
        wp_send_json_success(self::preview($source, $form_id));
    }

    public static function ajax_execute() {
        check_ajax_referer('olla_podrida_import', '_nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('contact')) {
            wp_send_json_error('Keine Berechtigung.');
        }
        $source  = sanitize_key($_POST['source'] ?? '');
        $form_id = sanitize_text_field($_POST['form_id'] ?? '');
        $result  = self::execute_import($source, $form_id);
        wp_send_json_success($result);
    }
}
