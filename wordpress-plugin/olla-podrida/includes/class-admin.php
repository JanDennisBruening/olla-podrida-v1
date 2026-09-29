<?php
if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Admin {

    public static function init() {
        add_action('admin_menu', [__CLASS__, 'register_admin_menu']);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_admin_assets']);
        add_action('wp_dashboard_setup', [__CLASS__, 'register_dashboard_widgets']);
        add_action('admin_post_olla_podrida_save_settings', [__CLASS__, 'handle_save_settings']);
        add_action('wp_ajax_olla_podrida_save_event', [__CLASS__, 'handle_ajax_save_event']);
        add_action('wp_ajax_olla_podrida_delete_event', [__CLASS__, 'handle_ajax_delete_event']);
        add_action('wp_ajax_olla_podrida_toggle_event', [__CLASS__, 'handle_ajax_toggle_event']);
        add_action('wp_ajax_olla_podrida_delete_message', [__CLASS__, 'handle_ajax_delete_message']);
    }

    public static function register_admin_menu() {
        if (!Olla_Podrida_Roles::can_user_access_menu()) {
            return;
        }

        $allowed = Olla_Podrida_Roles::get_allowed_sections_for_current_user();
        if (empty($allowed)) {
            return;
        }

        // Main top-level menu page
        add_menu_page(
            'Ensemble Olla Podrida',
            'Olla Podrida',
            'read',
            'olla-podrida',
            [__CLASS__, 'render_admin_page'],
            'dashicons-format-audio',
            28
        );

        // Register submenus for each section the current user is permitted to see
        $sections = Olla_Podrida_Roles::get_all_sections();
        
        // 1. First submenu item overrides the duplicate top-level menu item name
        $first_key = $allowed[0];
        $first_info = $sections[$first_key] ?? ['label' => 'Übersicht'];
        add_submenu_page(
            'olla-podrida',
            $first_info['label'] . ' - Olla Podrida',
            $first_info['label'],
            'read',
            'olla-podrida',
            [__CLASS__, 'render_admin_page']
        );

        // 2. Add individual submenu items for all other permitted sections
        foreach ($sections as $key => $info) {
            if ($key === $first_key || !in_array($key, $allowed, true)) {
                continue;
            }

            add_submenu_page(
                'olla-podrida',
                $info['label'] . ' - Olla Podrida',
                $info['label'],
                'read',
                'olla-podrida-' . $key,
                function() use ($key) {
                    $_GET['tab'] = $key;
                    self::render_admin_page();
                }
            );
        }
    }

    public static function enqueue_admin_assets($hook) {
        if (strpos($hook, 'olla-podrida') === false) {
            return;
        }

        // Native WordPress Media Library
        wp_enqueue_media();

        wp_enqueue_style(
            'olla-podrida-admin-style',
            OLLA_PODRIDA_URL . 'assets/css/admin.css',
            [],
            OLLA_PODRIDA_VERSION
        );

        wp_enqueue_script(
            'olla-podrida-admin-script',
            OLLA_PODRIDA_URL . 'assets/js/admin.js',
            ['jquery'],
            OLLA_PODRIDA_VERSION,
            true
        );

        wp_localize_script('olla-podrida-admin-script', 'OllaPodridaAdmin', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('olla_podrida_admin_nonce'),
            'choose_image' => 'Bild aus Mediathek wählen',
            'use_image' => 'Dieses Bild verwenden',
            'choose_audio' => 'Audiodatei aus Mediathek wählen',
            'use_audio' => 'Diese Audiodatei verwenden',
        ]);
    }

    public static function render_admin_page() {
        if (!Olla_Podrida_Roles::can_user_access_menu()) {
            wp_die('Sie haben keine ausreichenden Berechtigungen, um auf diese Seite zuzugreifen.');
        }

        $allowed_sections = Olla_Podrida_Roles::get_allowed_sections_for_current_user();
        if (empty($allowed_sections)) {
            wp_die('Für Ihre Benutzerrolle sind derzeit keine Bereiche im Plugin freigeschaltet.');
        }

        // Determine active tab: check page slug (e.g. olla-podrida-events) or ?tab=
        $page = sanitize_key($_GET['page'] ?? 'olla-podrida');
        if (strpos($page, 'olla-podrida-') === 0) {
            $active_tab = substr($page, strlen('olla-podrida-'));
        } elseif (isset($_GET['tab'])) {
            $active_tab = sanitize_key($_GET['tab']);
        } else {
            $active_tab = $allowed_sections[0];
        }

        if (!in_array($active_tab, $allowed_sections, true)) {
            $active_tab = $allowed_sections[0];
        }

        include OLLA_PODRIDA_PATH . 'templates/admin/main.php';
    }

    public static function handle_save_settings() {
        if (!isset($_POST['olla_podrida_nonce']) || !wp_verify_nonce($_POST['olla_podrida_nonce'], 'olla_podrida_save_settings')) {
            wp_die('Sicherheitsüberprüfung fehlgeschlagen.');
        }

        $section = sanitize_key($_POST['section'] ?? '');
        if (!Olla_Podrida_Roles::can_user_manage_section($section)) {
            wp_die('Keine Berechtigung für diesen Bereich.');
        }

        switch ($section) {
            case 'settings':
                $data = [
                    'site_title' => sanitize_text_field($_POST['site_title'] ?? ''),
                    'site_tagline' => sanitize_text_field($_POST['site_tagline'] ?? ''),
                    'favicon_enabled' => !empty($_POST['favicon_enabled']),
                    'favicon_url' => esc_url_raw($_POST['favicon_url'] ?? ''),
                    'universal_dominance' => !empty($_POST['universal_dominance']),
                    'auto_expire_events' => !empty($_POST['auto_expire_events']),
                    'bot_protection_enabled' => !empty($_POST['bot_protection_enabled']),
                    'min_submit_seconds' => intval($_POST['min_submit_seconds'] ?? 2),
                    'rate_limit_submissions' => intval($_POST['rate_limit_submissions'] ?? 5),
                ];
                Olla_Podrida_Settings::update_section('settings', $data);
                break;

            case 'hero':
                $data = [
                    'slogan' => sanitize_text_field($_POST['slogan'] ?? ''),
                    'subtitle' => sanitize_text_field($_POST['subtitle'] ?? ''),
                    'bg_desktop' => esc_url_raw($_POST['bg_desktop'] ?? ''),
                    'bg_mobile' => esc_url_raw($_POST['bg_mobile'] ?? ''),
                    'smoke_enabled' => !empty($_POST['smoke_enabled']),
                    'smoke_opacity' => intval($_POST['smoke_opacity'] ?? 20),
                ];
                Olla_Podrida_Settings::update_section('hero', $data);
                break;

            case 'ensemble':
                $data = [
                    'title' => sanitize_text_field($_POST['title'] ?? ''),
                    'paragraph1' => wp_kses_post($_POST['paragraph1'] ?? ''),
                    'paragraph2' => wp_kses_post($_POST['paragraph2'] ?? ''),
                    'paragraph3' => wp_kses_post($_POST['paragraph3'] ?? ''),
                    'logo' => esc_url_raw($_POST['logo'] ?? ''),
                ];
                Olla_Podrida_Settings::update_section('ensemble', $data);

                // Save musicians list if posted
                if (isset($_POST['musicians']) && is_array($_POST['musicians'])) {
                    $musicians = [];
                    foreach ($_POST['musicians'] as $m) {
                        if (empty($m['name'])) continue;
                        $musicians[] = [
                            'id' => sanitize_key($m['id'] ?? sanitize_title($m['name'])),
                            'name' => sanitize_text_field($m['name'] ?? ''),
                            'role' => sanitize_text_field($m['role'] ?? ''),
                            'instruments' => sanitize_text_field($m['instruments'] ?? ''),
                            'bio' => sanitize_textarea_field($m['bio'] ?? ''),
                            'tooltip' => sanitize_text_field($m['tooltip'] ?? ''),
                            'stage_image' => esc_url_raw($m['stage_image'] ?? ''),
                            'portrait_image' => esc_url_raw($m['portrait_image'] ?? ''),
                            'show_hero' => !empty($m['show_hero']),
                            'show_ensemble' => !empty($m['show_ensemble']),
                            'show_press' => !empty($m['show_press']),
                            'offset_x' => intval($m['offset_x'] ?? 0),
                            'offset_y' => intval($m['offset_y'] ?? 0),
                        ];
                    }
                    Olla_Podrida_Settings::update_section('musicians', $musicians);
                }
                break;

            case 'contact':
                $data = [
                    // Support single or multiple comma-separated email addresses
                    'recipient_email' => sanitize_text_field($_POST['recipient_email'] ?? ''),
                    'subject' => sanitize_text_field($_POST['subject'] ?? ''),
                    'portrait' => esc_url_raw($_POST['portrait'] ?? ''),
                    'title' => sanitize_text_field($_POST['title'] ?? ''),
                    'intro_paragraph1' => sanitize_textarea_field($_POST['intro_paragraph1'] ?? ''),
                    'intro_paragraph2' => sanitize_text_field($_POST['intro_paragraph2'] ?? ''),
                    'email_display' => sanitize_text_field($_POST['email_display'] ?? ''),
                    'consent_text' => sanitize_textarea_field($_POST['consent_text'] ?? ''),
                    'success_message' => sanitize_text_field($_POST['success_message'] ?? ''),
                    'error_message' => sanitize_text_field($_POST['error_message'] ?? ''),
                ];
                Olla_Podrida_Settings::update_section('contact', $data);
                break;

            case 'audio':
                $data = [
                    'enabled' => !empty($_POST['enabled']),
                    'src' => esc_url_raw(trim($_POST['src'] ?? '')),
                    'title' => sanitize_text_field($_POST['title'] ?? ''),
                    'subtitle' => sanitize_text_field($_POST['subtitle'] ?? ''),
                    'autoplay' => !empty($_POST['autoplay']),
                    'volume' => intval($_POST['volume'] ?? 50),
                    'button_text' => sanitize_text_field($_POST['button_text'] ?? '• Musik an / aus • Musik an / aus'),
                ];
                Olla_Podrida_Settings::update_section('audio', $data);
                break;

            case 'legal':
                $data = [
                    'seal_image' => esc_url_raw($_POST['seal_image'] ?? ''),
                    'copyright_text' => sanitize_text_field($_POST['copyright_text'] ?? ''),
                    'impressum_html' => wp_kses_post($_POST['impressum_html'] ?? ''),
                    'datenschutz_html' => wp_kses_post($_POST['datenschutz_html'] ?? ''),
                    'cookie_banner_text' => sanitize_textarea_field($_POST['cookie_banner_text'] ?? ''),
                    'cookie_accept_text' => sanitize_text_field($_POST['cookie_accept_text'] ?? ''),
                    'cookie_decline_text' => sanitize_text_field($_POST['cookie_decline_text'] ?? ''),
                ];
                Olla_Podrida_Settings::update_section('legal', $data);
                break;

            case 'press':
                $data = [
                    'title' => sanitize_text_field($_POST['title'] ?? ''),
                    'subtitle' => sanitize_text_field($_POST['subtitle'] ?? ''),
                    'intro_text' => wp_kses_post($_POST['intro_text'] ?? ''),
                    'contact_name' => sanitize_text_field($_POST['contact_name'] ?? ''),
                    'contact_email' => sanitize_email($_POST['contact_email'] ?? ''),
                    'contact_phone' => sanitize_text_field($_POST['contact_phone'] ?? ''),
                    'press_note' => sanitize_textarea_field($_POST['press_note'] ?? ''),
                    'logo_pot' => esc_url_raw($_POST['logo_pot'] ?? ''),
                    'logo_banner' => esc_url_raw($_POST['logo_banner'] ?? ''),
                    'logo_seal' => esc_url_raw($_POST['logo_seal'] ?? ''),
                    'logo_print' => esc_url_raw($_POST['logo_print'] ?? ''),
                    'photo1_url' => esc_url_raw($_POST['photo1_url'] ?? ''),
                    'photo1_title' => sanitize_text_field($_POST['photo1_title'] ?? ''),
                    'photo2_url' => esc_url_raw($_POST['photo2_url'] ?? ''),
                    'photo2_title' => sanitize_text_field($_POST['photo2_title'] ?? ''),
                    'photo3_url' => esc_url_raw($_POST['photo3_url'] ?? ''),
                    'photo3_title' => sanitize_text_field($_POST['photo3_title'] ?? ''),
                    'photo4_url' => esc_url_raw($_POST['photo4_url'] ?? ''),
                    'photo4_title' => sanitize_text_field($_POST['photo4_title'] ?? ''),
                ];
                Olla_Podrida_Settings::update_section('press', $data);
                break;

            case 'seo':
                $data = [
                    'meta_title' => sanitize_text_field($_POST['meta_title'] ?? ''),
                    'meta_description' => sanitize_textarea_field($_POST['meta_description'] ?? ''),
                    'meta_keywords' => sanitize_text_field($_POST['meta_keywords'] ?? ''),
                    'canonical_url' => esc_url_raw($_POST['canonical_url'] ?? ''),
                    'robots_index' => sanitize_text_field($_POST['robots_index'] ?? 'index, follow'),
                    'og_title' => sanitize_text_field($_POST['og_title'] ?? ''),
                    'og_description' => sanitize_textarea_field($_POST['og_description'] ?? ''),
                    'og_image' => esc_url_raw($_POST['og_image'] ?? ''),
                    'og_type' => sanitize_text_field($_POST['og_type'] ?? 'website'),
                    'twitter_card' => sanitize_text_field($_POST['twitter_card'] ?? 'summary_large_image'),
                    'schema_enabled' => !empty($_POST['schema_enabled']),
                    'schema_type' => sanitize_text_field($_POST['schema_type'] ?? 'MusicGroup'),
                    'schema_genre' => sanitize_text_field($_POST['schema_genre'] ?? 'Mittelaltermusik, Renaissancemusik, Alte Musik'),
                ];
                Olla_Podrida_Settings::update_section('seo', $data);
                break;

            case 'roles':
                if (current_user_can('manage_options')) {
                    $roles_permissions = [];
                    if (isset($_POST['roles_permissions']) && is_array($_POST['roles_permissions'])) {
                        foreach ($_POST['roles_permissions'] as $role_slug => $sections) {
                            $sanitized_role = sanitize_key($role_slug);
                            $sanitized_sections = array_map('sanitize_key', (array) $sections);
                            $roles_permissions[$sanitized_role] = $sanitized_sections;
                        }
                    }

                    Olla_Podrida_Settings::update_section('roles', [
                        'roles_permissions' => $roles_permissions,
                        'editor_sections' => $roles_permissions['editor'] ?? [],
                        'author_sections' => $roles_permissions['author'] ?? [],
                    ]);
                }
                break;

            case 'display':
                $data = [
                    'mode' => sanitize_key($_POST['mode'] ?? 'shortcode'),
                    'canvas_page_id' => intval($_POST['canvas_page_id'] ?? 0),
                    'preloader_enabled' => !empty($_POST['preloader_enabled']),
                ];
                Olla_Podrida_Settings::update_section('display', $data);
                break;
        }

        $redirect_page = ($section === 'settings' || $section === 'hero') ? 'olla-podrida' : 'olla-podrida-' . $section;
        wp_redirect(add_query_arg([
            'page' => $redirect_page,
            'tab' => $section,
            'updated' => 'true'
        ], admin_url('admin.php')));
        exit;
    }

    public static function handle_ajax_save_event() {
        check_ajax_referer('olla_podrida_admin_nonce', 'nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('events')) {
            wp_send_json_error('Keine Berechtigung.');
        }

        $event_data = $_POST['event'] ?? [];
        $saved = Olla_Podrida_Events::add_or_update_event($event_data);

        wp_send_json_success($saved);
    }

    public static function handle_ajax_delete_event() {
        check_ajax_referer('olla_podrida_admin_nonce', 'nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('events')) {
            wp_send_json_error('Keine Berechtigung.');
        }

        $id = sanitize_key($_POST['id'] ?? '');
        Olla_Podrida_Events::delete_event($id);

        wp_send_json_success();
    }

    public static function handle_ajax_toggle_event() {
        check_ajax_referer('olla_podrida_admin_nonce', 'nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('events')) {
            wp_send_json_error('Keine Berechtigung.');
        }

        $id = sanitize_key($_POST['id'] ?? '');
        Olla_Podrida_Events::toggle_status($id);

        wp_send_json_success();
    }

    public static function handle_ajax_delete_message() {
        check_ajax_referer('olla_podrida_admin_nonce', 'nonce');
        if (!Olla_Podrida_Roles::can_user_manage_section('contact')) {
            wp_send_json_error('Keine Berechtigung.');
        }

        $id = intval($_POST['id'] ?? 0);
        Olla_Podrida_Contact::delete_message($id);

        wp_send_json_success();
    }

    /**
     * Register WordPress Dashboard Widgets.
     */
    public static function register_dashboard_widgets() {
        if (!Olla_Podrida_Roles::can_user_access_menu()) {
            return;
        }

        if (Olla_Podrida_Roles::can_user_manage_section('contact')) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_contact',
                '✉️ Olla Podrida: Kontaktanfragen & Posteingang',
                [__CLASS__, 'render_dashboard_contact_widget']
            );
        }

        if (Olla_Podrida_Roles::can_user_manage_section('events')) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_events',
                '📅 Olla Podrida: Konzerttermine & Status',
                [__CLASS__, 'render_dashboard_events_widget']
            );
        }
    }

    public static function render_dashboard_contact_widget() {
        $messages = Olla_Podrida_Contact::get_messages(5);
        $total = count($messages);
        ?>
        <div class="olla-dashboard-widget" style="padding: 6px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <div>
                    <span style="font-size: 15px; font-weight: 600;">Eingegangene Anfragen:</span>
                    <span style="background: #DAA520; color: #141210; font-weight: 700; padding: 2px 8px; border-radius: 10px; margin-left: 6px; font-size: 12px;"><?php echo intval($total); ?></span>
                </div>
                <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida-contact')); ?>" class="button button-small button-primary">
                    Zum Posteingang &rarr;
                </a>
            </div>

            <?php if (empty($messages)): ?>
                <p style="color: #666; font-style: italic;">Aktuell liegen keine Kontaktanfragen vor.</p>
            <?php else: ?>
                <ul style="margin: 0; padding: 0; list-style: none;">
                    <?php foreach ($messages as $msg): ?>
                        <li style="padding: 8px 0; border-bottom: 1px dotted #e5e5e5;">
                            <div style="display: flex; justify-content: space-between;">
                                <strong><?php echo esc_html($msg->name); ?></strong>
                                <span style="font-size: 11px; color: #888;"><?php echo esc_html(date_i18n('d.m.Y H:i', strtotime($msg->created_at))); ?></span>
                            </div>
                            <div style="font-size: 12px; color: #555; margin-top: 2px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                                <?php echo esc_html(wp_trim_words($msg->message, 15)); ?>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>
        <?php
    }

    public static function render_dashboard_events_widget() {
        $events = Olla_Podrida_Events::get_all_events();
        $upcoming = array_filter($events, function($e) {
            return !empty($e['is_upcoming']);
        });
        ?>
        <div class="olla-dashboard-widget" style="padding: 6px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <div>
                    <span style="font-size: 15px; font-weight: 600;">Geplante Konzerte:</span>
                    <span style="background: #251d18; color: #DAA520; border: 1px solid #DAA520; font-weight: 700; padding: 2px 8px; border-radius: 10px; margin-left: 6px; font-size: 12px;"><?php echo count($upcoming); ?></span>
                </div>
                <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida-events')); ?>" class="button button-small button-primary">
                    Termine verwalten &rarr;
                </a>
            </div>

            <?php if (empty($upcoming)): ?>
                <p style="color: #666; font-style: italic;">Keine bevorstehenden Konzerte eingetragen.</p>
            <?php else: ?>
                <ul style="margin: 0; padding: 0; list-style: none;">
                    <?php foreach (array_slice($upcoming, 0, 4) as $ev): ?>
                        <li style="padding: 8px 0; border-bottom: 1px dotted #e5e5e5;">
                            <div style="display: flex; justify-content: space-between;">
                                <strong><?php echo esc_html($ev['title'] ?? 'Konzert'); ?></strong>
                                <span style="font-size: 12px; color: #DAA520; font-weight: 600;"><?php echo esc_html($ev['date'] ?? ''); ?></span>
                            </div>
                            <div style="font-size: 12px; color: #666; margin-top: 2px;">
                                📍 <?php echo esc_html(($ev['location'] ?? '') . (!empty($ev['city']) ? ' (' . $ev['city'] . ')' : '')); ?>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>
        <?php
    }
}
