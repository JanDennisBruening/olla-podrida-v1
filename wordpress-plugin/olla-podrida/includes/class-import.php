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
        'cfdb7'        => 'Contact Form 7 (CFDB7 Datenbank)',
        'formidable'   => 'Formidable Forms',
        'gravityforms' => 'Gravity Forms',
        'fluentforms'  => 'Fluent Forms',
        'ninjaforms'   => 'Ninja Forms',
    ];

    /* ───────────────────────────────── AJAX handlers ── */

    public static function init() {
        add_action('wp_ajax_olla_podrida_import_detect',        [__CLASS__, 'ajax_detect_sources']);
        add_action('wp_ajax_olla_podrida_import_forms',         [__CLASS__, 'ajax_get_forms']);
        add_action('wp_ajax_olla_podrida_import_preview',       [__CLASS__, 'ajax_preview']);
        add_action('wp_ajax_olla_podrida_import_execute',       [__CLASS__, 'ajax_execute']);
        add_action('wp_ajax_olla_podrida_import_csv_preview',   [__CLASS__, 'ajax_csv_preview']);
        add_action('wp_ajax_olla_podrida_import_csv_execute',   [__CLASS__, 'ajax_csv_execute']);
        add_action('wp_ajax_olla_podrida_add_manual_message',   [__CLASS__, 'ajax_add_manual_message']);
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

    private static function is_available_cfdb7() {
        global $wpdb;
        $table = $wpdb->prefix . 'db7_forms';
        return $wpdb->get_var("SHOW TABLES LIKE '$table'") === $table;
    }

    private static function is_available_formidable() {
        global $wpdb;
        $table = $wpdb->prefix . 'frm_items';
        return $wpdb->get_var("SHOW TABLES LIKE '$table'") === $table;
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

    /* ── Contact Form 7 / CFDB7 ── */

    private static function list_forms_cfdb7() {
        global $wpdb;
        $table = $wpdb->prefix . 'db7_forms';
        $rows = $wpdb->get_results("SELECT DISTINCT form_post_id FROM $table ORDER BY form_post_id ASC");
        $forms = [];
        foreach ($rows as $row) {
            $title = get_the_title($row->form_post_id);
            $forms[] = [
                'id'    => (string) $row->form_post_id,
                'label' => !empty($title) ? $title : ('CF7 Formular #' . $row->form_post_id),
                'count' => (int) $wpdb->get_var($wpdb->prepare(
                    "SELECT COUNT(*) FROM $table WHERE form_post_id = %d", $row->form_post_id
                )),
            ];
        }
        return $forms;
    }

    /* ── Formidable Forms ── */

    private static function list_forms_formidable() {
        global $wpdb;
        $table = $wpdb->prefix . 'frm_items';
        $forms_table = $wpdb->prefix . 'frm_forms';
        $forms = [];
        if ($wpdb->get_var("SHOW TABLES LIKE '$forms_table'") === $forms_table) {
            $rows = $wpdb->get_results("SELECT id, name FROM $forms_table WHERE is_template = 0 ORDER BY name ASC");
            foreach ($rows as $r) {
                $count = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table WHERE form_id = %d", $r->id));
                $forms[] = [
                    'id'    => (string) $r->id,
                    'label' => $r->name ?: ('Formular #' . $r->id),
                    'count' => $count,
                ];
            }
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

        if (class_exists('Olla_Podrida_Contact')) {
            Olla_Podrida_Contact::ensure_table_exists();
        }

        global $wpdb;
        $table = $wpdb->prefix . 'olla_podrida_messages';

        foreach ($entries as $entry) {
            $name    = sanitize_text_field($entry['name'] ?? '');
            $email   = sanitize_email($entry['email'] ?? '');
            $message = sanitize_textarea_field($entry['message'] ?? '');
            $date    = $entry['date'] ?? current_time('mysql');

            if (empty($name) && empty($email) && empty($message)) {
                $skipped++;
                continue;
            }

            if (empty($name)) {
                $name = !empty($email) ? explode('@', $email)[0] : '(Unbekannter Absender)';
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
                'email'      => $email ?: '',
                'message'    => $message ?: '(Kein Text)',
                'created_at' => $date,
                'is_read'    => 1, // imported entries are pre-read
                'source'     => $source_label,
            ], ['%s', '%s', '%s', '%s', '%d', '%s']);

            $imported++;
        }

        if ($imported > 0 && class_exists('Olla_Podrida_Audit')) {
            Olla_Podrida_Audit::log('contact', 'Kontaktformular-Einträge importiert', "Quelle: {$source_label} ({$imported} importiert, {$skipped} übersprungen)");
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

    /* ── Contact Form 7 / CFDB7 ── */

    private static function fetch_entries_cfdb7($form_id, $limit = 5) {
        global $wpdb;
        $table = $wpdb->prefix . 'db7_forms';
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT form_value, form_date FROM $table WHERE form_post_id = %d ORDER BY form_date DESC LIMIT %d",
            $form_id, $limit
        ));
        $entries = [];
        foreach ($rows as $row) {
            $val = maybe_unserialize($row->form_value);
            if (!is_array($val)) {
                $val = json_decode($row->form_value, true) ?: [];
            }
            $data = [];
            foreach ($val as $k => $v) {
                $data[strtolower($k)] = is_array($v) ? implode(', ', $v) : $v;
            }
            $name    = $data['your-name'] ?? $data['name'] ?? $data['vorname'] ?? $data['full_name'] ?? '';
            $email   = $data['your-email'] ?? $data['email'] ?? $data['mail'] ?? '';
            $message = $data['your-message'] ?? $data['message'] ?? $data['nachricht'] ?? $data['text'] ?? '';

            // Fallback scan if fields are named differently
            if (empty($email)) {
                foreach ($data as $k => $v) {
                    if (is_email($v)) { $email = $v; break; }
                }
            }
            if (empty($message)) {
                foreach ($data as $k => $v) {
                    if (strlen($v) > 25 && $v !== $name && $v !== $email) { $message = $v; break; }
                }
            }

            $entries[] = [
                'name'    => $name ?: ($email ? explode('@', $email)[0] : '(Unbekannter Absender)'),
                'email'   => $email,
                'message' => $message,
                'date'    => $row->form_date,
            ];
        }
        return $entries;
    }

    private static function count_entries_cfdb7($form_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'db7_forms';
        return (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE form_post_id = %d", $form_id
        ));
    }

    /* ── Formidable Forms ── */

    private static function fetch_entries_formidable($form_id, $limit = 5) {
        global $wpdb;
        $items_table = $wpdb->prefix . 'frm_items';
        $meta_table  = $wpdb->prefix . 'frm_item_metas';
        $items = $wpdb->get_results($wpdb->prepare(
            "SELECT id, created_at FROM $items_table WHERE form_id = %d ORDER BY created_at DESC LIMIT %d",
            $form_id, $limit
        ));
        $entries = [];
        foreach ($items as $item) {
            $metas = $wpdb->get_results($wpdb->prepare(
                "SELECT meta_value FROM $meta_table WHERE item_id = %d", $item->id
            ));
            $name = $email = $message = '';
            foreach ($metas as $m) {
                $v = maybe_unserialize($m->meta_value);
                if (is_string($v)) {
                    if (is_email($v) && empty($email)) {
                        $email = $v;
                    } elseif (strlen($v) > 50 && empty($message)) {
                        $message = $v;
                    } elseif (empty($name) && strlen($v) < 50 && !is_numeric($v)) {
                        $name = $v;
                    }
                }
            }
            $entries[] = [
                'name'    => $name ?: ($email ? explode('@', $email)[0] : '(Unbekannter Absender)'),
                'email'   => $email,
                'message' => $message,
                'date'    => $item->created_at,
            ];
        }
        return $entries;
    }

    private static function count_entries_formidable($form_id) {
        global $wpdb;
        $table = $wpdb->prefix . 'frm_items';
        return (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE form_id = %d", $form_id
        ));
    }

    /* ──────────────── CSV & Text Import Engine ── */

    public static function parse_csv_rows($content) {
        $content = str_replace(["\r\n", "\r"], "\n", trim($content));
        if (empty($content)) {
            return [];
        }

        $lines = explode("\n", $content);
        if (empty($lines)) {
            return [];
        }

        // Auto-detect delimiter from the first row
        $first_line = $lines[0];
        $semicolons = substr_count($first_line, ';');
        $commas     = substr_count($first_line, ',');
        $tabs       = substr_count($first_line, "\t");

        $delim = ';';
        if ($tabs > $semicolons && $tabs > $commas) {
            $delim = "\t";
        } elseif ($commas > $semicolons) {
            $delim = ',';
        }

        $rows = [];
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;
            $row = str_getcsv($line, $delim);
            if (!empty($row)) {
                $rows[] = array_map('trim', $row);
            }
        }

        if (empty($rows)) {
            return [];
        }

        // Check if row 0 is a header
        $header = $rows[0];
        $is_header = false;
        $name_idx = -1;
        $email_idx = -1;
        $msg_idx = -1;
        $date_idx = -1;

        foreach ($header as $idx => $col) {
            $col_lower = strtolower($col);
            if ($name_idx === -1 && preg_match('/(name|vorname|nachname|absender|sender|author)/i', $col_lower)) {
                $name_idx = $idx;
                $is_header = true;
            } elseif ($email_idx === -1 && preg_match('/(mail|e-mail|email)/i', $col_lower)) {
                $email_idx = $idx;
                $is_header = true;
            } elseif ($msg_idx === -1 && preg_match('/(nachricht|message|text|anfrage|kommentar|body|inhalt)/i', $col_lower)) {
                $msg_idx = $idx;
                $is_header = true;
            } elseif ($date_idx === -1 && preg_match('/(datum|date|zeit|time|created|timestamp)/i', $col_lower)) {
                $date_idx = $idx;
                $is_header = true;
            }
        }

        $start_idx = 0;
        if ($is_header) {
            $start_idx = 1;
        } else {
            // Default positional mapping
            $col_count = count($rows[0]);
            if ($col_count >= 4) {
                $name_idx = 0; $email_idx = 1; $msg_idx = 2; $date_idx = 3;
            } elseif ($col_count === 3) {
                $name_idx = 0; $email_idx = 1; $msg_idx = 2;
            } elseif ($col_count === 2) {
                $name_idx = 0; $msg_idx = 1;
            } else {
                $msg_idx = 0;
            }
        }

        $parsed_entries = [];
        for ($i = $start_idx; $i < count($rows); $i++) {
            $r = $rows[$i];
            $name    = ($name_idx >= 0 && isset($r[$name_idx])) ? sanitize_text_field($r[$name_idx]) : '';
            $email   = ($email_idx >= 0 && isset($r[$email_idx])) ? sanitize_email($r[$email_idx]) : '';
            $message = ($msg_idx >= 0 && isset($r[$msg_idx])) ? sanitize_textarea_field($r[$msg_idx]) : '';
            $date    = ($date_idx >= 0 && isset($r[$date_idx])) ? sanitize_text_field($r[$date_idx]) : '';

            // Try to find email if not at email_idx
            if (empty($email)) {
                foreach ($r as $c) {
                    if (is_email($c)) {
                        $email = sanitize_email($c);
                        break;
                    }
                }
            }

            // Normalise date
            if (!empty($date)) {
                $ts = strtotime($date);
                $date = $ts ? date('Y-m-d H:i:s', $ts) : current_time('mysql');
            } else {
                $date = current_time('mysql');
            }

            if (empty($name) && empty($email) && empty($message)) {
                continue;
            }

            if (empty($name)) {
                $name = !empty($email) ? explode('@', $email)[0] : '(Unbekannter Absender)';
            }

            $parsed_entries[] = [
                'name'    => $name,
                'email'   => $email,
                'message' => $message,
                'date'    => $date,
            ];
        }

        return $parsed_entries;
    }

    public static function execute_csv_import($content) {
        if (class_exists('Olla_Podrida_Contact')) {
            Olla_Podrida_Contact::ensure_table_exists();
        }

        $entries = self::parse_csv_rows($content);
        if (empty($entries)) {
            return ['imported' => 0, 'skipped' => 0, 'total' => 0];
        }

        global $wpdb;
        $table = $wpdb->prefix . 'olla_podrida_messages';
        $imported = 0;
        $skipped  = 0;

        foreach ($entries as $entry) {
            $name    = $entry['name'];
            $email   = $entry['email'];
            $message = $entry['message'];
            $date    = $entry['date'];

            // Duplicate check
            $exists = $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM $table WHERE email = %s AND LEFT(message, 100) = LEFT(%s, 100) AND created_at = %s",
                $email, $message, $date
            ));
            if ($exists > 0) {
                $skipped++;
                continue;
            }

            $wpdb->insert($table, [
                'name'       => $name,
                'email'      => $email,
                'message'    => $message,
                'created_at' => $date,
                'is_read'    => 1,
                'source'     => 'CSV / Text-Import',
            ], ['%s', '%s', '%s', '%s', '%d', '%s']);

            $imported++;
        }

        if ($imported > 0 && class_exists('Olla_Podrida_Audit')) {
            Olla_Podrida_Audit::log('contact', 'CSV-Kontaktanfragen importiert', "{$imported} Einträge importiert, {$skipped} übersprungen");
        }

        return [
            'imported' => $imported,
            'skipped'  => $skipped,
            'total'    => count($entries),
        ];
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

    public static function ajax_csv_preview() {
        check_ajax_referer('olla_podrida_import', '_nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('contact')) {
            wp_send_json_error('Keine Berechtigung.');
        }
        $content = wp_unslash($_POST['csv_data'] ?? '');
        $entries = self::parse_csv_rows($content);
        wp_send_json_success([
            'count'  => count($entries),
            'sample' => array_slice($entries, 0, 5)
        ]);
    }

    public static function ajax_csv_execute() {
        check_ajax_referer('olla_podrida_import', '_nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('contact')) {
            wp_send_json_error('Keine Berechtigung.');
        }
        $content = wp_unslash($_POST['csv_data'] ?? '');
        $result = self::execute_csv_import($content);
        wp_send_json_success($result);
    }

    public static function ajax_add_manual_message() {
        check_ajax_referer('olla_podrida_import', '_nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('contact')) {
            wp_send_json_error('Keine Berechtigung.');
        }
        $name    = sanitize_text_field($_POST['name'] ?? '');
        $email   = sanitize_email($_POST['email'] ?? '');
        $message = sanitize_textarea_field($_POST['message'] ?? '');
        $date    = sanitize_text_field($_POST['date'] ?? '');

        if (empty($name) && empty($email)) {
            wp_send_json_error('Bitte mindestens einen Namen oder eine E-Mail-Adresse angeben.');
        }
        if (empty($message)) {
            wp_send_json_error('Bitte geben Sie einen Nachrichtentext ein.');
        }

        $id = Olla_Podrida_Contact::add_manual_message($name, $email, $message, $date, 'Manuell erfasst');
        if ($id) {
            $created_time = !empty($date) ? strtotime($date) : current_time('timestamp');
            wp_send_json_success([
                'id'        => $id,
                'name'      => $name ?: '(Kein Name)',
                'email'     => $email,
                'message'   => $message,
                'date_day'  => date_i18n('d.m.Y', $created_time),
                'date_time' => date_i18n('H:i', $created_time),
            ]);
        } else {
            wp_send_json_error('Fehler beim Speichern der Nachricht.');
        }
    }
}
