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
        add_action('admin_bar_menu', [__CLASS__, 'customize_admin_bar_logo'], 11);
        add_action('admin_head', [__CLASS__, 'render_sidebar_styles']);
    }

    public static function register_admin_menu() {
        if (!Olla_Podrida_Roles::can_user_access_menu()) {
            return;
        }

        $allowed = Olla_Podrida_Roles::get_allowed_sections_for_current_user();
        if (empty($allowed)) {
            return;
        }

        // Main top-level menu page - Position 3 (directly after Dashboard which is position 2)
        add_menu_page(
            'Ensemble Olla Podrida',
            'Olla Podrida',
            'read',
            'olla-podrida',
            [__CLASS__, 'render_admin_page'],
            'dashicons-format-audio',
            3
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

        // 3. Register hidden page hook for olla-podrida-{$first_key}
        // Prevents native WordPress "Du bist leider nicht berechtigt" if someone visits page=olla-podrida-settings directly
        add_submenu_page(
            null,
            $first_info['label'] . ' - Olla Podrida',
            $first_info['label'],
            'read',
            'olla-podrida-' . $first_key,
            function() use ($first_key) {
                $_GET['tab'] = $first_key;
                self::render_admin_page();
            }
        );
    }

    /**
     * Replace WordPress admin bar logo with Ensemble Stew Pot Logo
     * and redirect link to Olla Podrida dashboard.
     */
    public static function customize_admin_bar_logo($wp_admin_bar) {
        $node = $wp_admin_bar->get_node('wp-logo');
        if ($node) {
            $node->title = '<span class="ab-icon olla-admin-bar-pot"></span><span class="screen-reader-text">Ensemble Olla Podrida</span>';
            $node->href = admin_url('admin.php?page=olla-podrida');
            $wp_admin_bar->add_node($node);
        }

        // Remove default external WordPress.org sub-links
        $wp_admin_bar->remove_node('about');
        $wp_admin_bar->remove_node('wporg');
        $wp_admin_bar->remove_node('documentation');
        $wp_admin_bar->remove_node('support-forums');
        $wp_admin_bar->remove_node('feedback');

        // Add Ensemble quick access sub-links
        $wp_admin_bar->add_node([
            'id'     => 'olla-bar-dashboard',
            'parent' => 'wp-logo',
            'title'  => '🍲 Olla Podrida Übersicht',
            'href'   => admin_url('admin.php?page=olla-podrida'),
        ]);
        $wp_admin_bar->add_node([
            'id'     => 'olla-bar-frontend',
            'parent' => 'wp-logo',
            'title'  => '🌐 Website ansehen',
            'href'   => home_url('/?olla_canvas=1'),
            'meta'   => ['target' => '_blank'],
        ]);
    }

    public static function render_sidebar_styles() {
        $pot_logo = esc_url(OLLA_PODRIDA_URL . 'assets/dist/images/logo-pot.png');
        ?>
        <style id="olla-podrida-admin-sidebar-css">
            /* ======================================================== */
            /* 1. TOP-LEFT ADMIN BAR: Ensemble Stew Pot Logo Replacement */
            /* ======================================================== */
            #wpadminbar #wp-admin-bar-wp-logo > .ab-item {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0 8px !important;
            }
            #wpadminbar #wp-admin-bar-wp-logo > .ab-item .ab-icon,
            #wpadminbar #wp-admin-bar-wp-logo > .ab-item .olla-admin-bar-pot {
                background-image: url('<?php echo $pot_logo; ?>') !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                width: 24px !important;
                height: 24px !important;
                display: inline-block !important;
                margin: 0 !important;
                padding: 0 !important;
                position: relative !important;
                top: 0 !important;
            }
            #wpadminbar #wp-admin-bar-wp-logo > .ab-item .ab-icon:before {
                display: none !important;
                content: "" !important;
            }
            #wpadminbar #wp-admin-bar-wp-logo:hover > .ab-item {
                background: #1c140f !important;
            }

            /* Admin Bar Dark Medieval Accent */
            #wpadminbar {
                background: #140e0b !important;
                border-bottom: 1px solid #2a1e16 !important;
            }
            #wpadminbar .menupop .ab-sub-wrapper,
            #wpadminbar .shortlink-input {
                background: #18120d !important;
                border: 1px solid #DAA520 !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
            }
            #wpadminbar .ab-submenu .ab-item {
                color: #e0d8c7 !important;
            }
            #wpadminbar .ab-submenu .ab-item:hover {
                color: #FFD700 !important;
                background: #281c14 !important;
            }

            /* ======================================================== */
            /* 2. PERMANENTLY EXPANDED SUBMENU FOR OLLA PODRIDA         */
            /* ======================================================== */
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu,
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida.wp-not-current-submenu .wp-submenu {
                display: block !important;
                position: static !important;
                top: auto !important;
                left: auto !important;
                right: auto !important;
                box-shadow: none !important;
                border-left: 3px solid #DAA520 !important;
                background: #160e0a !important;
                margin: 0 !important;
                padding: 4px 0 !important;
                float: none !important;
                width: auto !important;
            }
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li {
                display: block !important;
                margin: 0 !important;
            }
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a {
                display: block !important;
                padding: 6px 12px 6px 22px !important;
                font-size: 13px !important;
                line-height: 1.4 !important;
                color: #cfc4ac !important;
            }
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a:hover,
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li.current a {
                color: #FFD700 !important;
                background: #251912 !important;
            }
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li.current a {
                font-weight: 700 !important;
            }
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-menu-arrow {
                display: none !important;
            }

            /* Olla Podrida Top-Level Highlight */
            #adminmenu #toplevel_page_olla-podrida {
                border-left: 4px solid #DAA520 !important;
                background: #1c140f !important;
            }
            #adminmenu #toplevel_page_olla-podrida > a {
                color: #FFD700 !important;
                font-weight: 700 !important;
            }
            #adminmenu #toplevel_page_olla-podrida .wp-menu-image:before {
                color: #DAA520 !important;
            }

            /* ======================================================== */
            /* 3. COMPLETE WORDPRESS SIDEBAR MEDIEVAL DARK PALETTE      */
            /* ======================================================== */
            #adminmenuback, #adminmenuwrap, #adminmenu {
                background: #120b08 !important;
            }
            #adminmenu li.menu-top {
                background: #120b08 !important;
            }
            #adminmenu a.menu-top,
            #adminmenu .wp-submenu-head {
                color: #d1c7ac !important;
            }
            #adminmenu a.menu-top:hover,
            #adminmenu li.menu-top:hover,
            #adminmenu li.opensub > a.menu-top,
            #adminmenu li > a.menu-top:focus {
                background: #1f140f !important;
                color: #FFD700 !important;
            }
            #adminmenu li.current a.menu-top,
            #adminmenu li.wp-has-current-submenu a.wp-has-current-submenu {
                background: #241711 !important;
                color: #DAA520 !important;
                font-weight: 600 !important;
            }
            #adminmenu .wp-submenu {
                background: #1a110c !important;
            }
            #adminmenu .wp-submenu a {
                color: #c4b99e !important;
            }
            #adminmenu .wp-submenu a:hover,
            #adminmenu .wp-submenu a:focus {
                color: #FFD700 !important;
                background: #241711 !important;
            }
            #adminmenu .wp-submenu li.current a {
                color: #DAA520 !important;
                font-weight: 600 !important;
            }
            #collapse-menu {
                color: #a89f8d !important;
            }
            #collapse-menu:hover,
            #collapse-button:hover {
                color: #FFD700 !important;
                background: #1f140f !important;
            }
            #adminmenu div.separator {
                border-top: 1px solid #221610 !important;
                border-bottom: 1px solid #0d0705 !important;
            }

            /* ======================================================== */
            /* 4. UNIFORM ICON SIZING ACROSS ALL SIDEBAR MENU ITEMS     */
            /* ======================================================== */
            #adminmenu .wp-menu-image {
                width: 36px !important;
                height: 34px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                float: left !important;
            }
            #adminmenu .wp-menu-image:before {
                font-size: 20px !important;
                width: 20px !important;
                height: 20px !important;
                line-height: 20px !important;
                text-align: center !important;
                display: inline-block !important;
                padding: 0 !important;
                margin: 0 !important;
                color: #a89f8d !important;
            }
            #adminmenu li.menu-top:hover .wp-menu-image:before,
            #adminmenu li.current .wp-menu-image:before,
            #adminmenu li.wp-has-current-submenu .wp-menu-image:before {
                color: #DAA520 !important;
            }
            #adminmenu .wp-menu-image img {
                width: 20px !important;
                height: 20px !important;
                max-width: 20px !important;
                max-height: 20px !important;
                object-fit: contain !important;
                padding: 0 !important;
                margin: 0 !important;
                display: inline-block !important;
            }
        </style>
        <?php
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
            'import_nonce' => wp_create_nonce('olla_podrida_import'),
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
                            'offset_x' => intval($m['offset_x_desktop'] ?? $m['offset_x'] ?? 0),
                            'offset_y' => intval($m['offset_y_desktop'] ?? $m['offset_y'] ?? 0),
                            'offset_x_desktop' => intval($m['offset_x_desktop'] ?? $m['offset_x'] ?? 0),
                            'offset_y_desktop' => intval($m['offset_y_desktop'] ?? $m['offset_y'] ?? 0),
                            'offset_x_tablet' => intval($m['offset_x_tablet'] ?? 0),
                            'offset_y_tablet' => intval($m['offset_y_tablet'] ?? 0),
                            'offset_x_mobile' => intval($m['offset_x_mobile'] ?? 0),
                            'offset_y_mobile' => intval($m['offset_y_mobile'] ?? 0),
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
                    'loop' => !empty($_POST['loop']),
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

        wp_redirect(add_query_arg([
            'page' => 'olla-podrida',
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

        $can_events = Olla_Podrida_Roles::can_user_manage_section('events');
        $can_contact = Olla_Podrida_Roles::can_user_manage_section('contact');

        // Priority 1: Events Widget (if user has events rights, this goes at the very top)
        if ($can_events) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_events',
                '📅 Olla Podrida: Konzerttermine & Status',
                [__CLASS__, 'render_dashboard_events_widget'],
                null,
                null,
                'normal',
                'high'
            );
        }

        // Priority 2: Contact Widget
        if ($can_contact) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_contact',
                'Kontaktanfragen und Posteingang',
                [__CLASS__, 'render_dashboard_contact_widget'],
                null,
                null,
                'normal',
                'high'
            );
        }

        // Reorder dashboard widgets so that Olla Podrida widgets appear at the absolute top of the screen
        global $wp_meta_boxes;
        if (isset($wp_meta_boxes['dashboard']['normal']['high'])) {
            $normal_high = $wp_meta_boxes['dashboard']['normal']['high'];
            $prioritized = [];
            if ($can_events && isset($normal_high['olla_podrida_dashboard_events'])) {
                $prioritized['olla_podrida_dashboard_events'] = $normal_high['olla_podrida_dashboard_events'];
                unset($normal_high['olla_podrida_dashboard_events']);
            }
            if ($can_contact && isset($normal_high['olla_podrida_dashboard_contact'])) {
                $prioritized['olla_podrida_dashboard_contact'] = $normal_high['olla_podrida_dashboard_contact'];
                unset($normal_high['olla_podrida_dashboard_contact']);
            }
            $wp_meta_boxes['dashboard']['normal']['high'] = array_merge($prioritized, $normal_high);
        }
    }

    public static function render_dashboard_contact_widget() {
        $counts = Olla_Podrida_Contact::get_message_counts();
        $contact_url = admin_url('admin.php?page=olla-podrida&tab=contact');
        ?>
        <div class="olla-dashboard-widget" style="padding: 4px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <div>
                    <span style="font-size: 13px; font-weight: 600; color: #1d2327;">Eingegangene Nachrichten:</span>
                    <span style="background: <?php echo $counts['unread'] > 0 ? '#2e7d32' : '#DAA520'; ?>; color: #ffffff; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 4px;">
                        <?php echo intval($counts['total']); ?>
                    </span>
                </div>
                <a href="<?php echo esc_url($contact_url); ?>" class="button button-small button-primary" style="background: #DAA520; border-color: #b8860b; color: #141210; font-weight: 600;">
                    📥 Weiter zum Posteingang &rarr;
                </a>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 6px; padding: 8px 6px; text-align: center;">
                    <div style="font-size: 17px; font-weight: 700; color: <?php echo $counts['unread'] > 0 ? '#2e7d32' : '#666'; ?>;">
                        <?php echo intval($counts['unread']); ?>
                    </div>
                    <div style="font-size: 11px; color: #666; margin-top: 2px;">Neu / Ungelesen</div>
                </div>
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 6px; padding: 8px 6px; text-align: center;">
                    <div style="font-size: 17px; font-weight: 700; color: #555;">
                        <?php echo intval($counts['read']); ?>
                    </div>
                    <div style="font-size: 11px; color: #666; margin-top: 2px;">Archiviert / Gelesen</div>
                </div>
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 6px; padding: 8px 6px; text-align: center;">
                    <div style="font-size: 17px; font-weight: 700; color: #1d2327;">
                        <?php echo intval($counts['total']); ?>
                    </div>
                    <div style="font-size: 11px; color: #666; margin-top: 2px;">Gesamt</div>
                </div>
            </div>

            <div style="padding-top: 8px; border-top: 1px solid #f0f0f1; text-align: right;">
                <a href="<?php echo esc_url($contact_url); ?>" style="text-decoration: none; font-weight: 600; font-size: 12px; color: #2271b1;">
                    Alle Anfragen verwalten &rarr;
                </a>
            </div>
        </div>
        <?php
    }

    public static function render_dashboard_events_widget() {
        $events = Olla_Podrida_Events::get_all_events();
        $upcoming = [];
        $past = [];
        foreach ($events as $e) {
            if (!empty($e['is_upcoming'])) {
                $upcoming[] = $e;
            } else {
                $past[] = $e;
            }
        }
        $events_url = admin_url('admin.php?page=olla-podrida&tab=events');
        ?>
        <div class="olla-dashboard-widget" style="padding: 2px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <div>
                    <span style="font-size: 13px; font-weight: 600; color: #1d2327;">Geplante Konzerte:</span>
                    <span style="background: #2e7d32; color: #ffffff; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-left: 4px;">
                        <?php echo count($upcoming); ?> anstehend
                    </span>
                    <?php if (!empty($past)): ?>
                        <span style="color: #646970; font-size: 11px; margin-left: 4px;">
                            (<?php echo count($past); ?> Archiv)
                        </span>
                    <?php endif; ?>
                </div>
                <a href="<?php echo esc_url($events_url . '#new'); ?>" class="button button-small button-primary" style="background: #DAA520; border-color: #b8860b; color: #141210; font-weight: 600;">
                    + Neuen Termin anlegen
                </a>
            </div>

            <?php if (empty($upcoming)): ?>
                <div style="text-align: center; padding: 16px 10px; background: #faf8f5; border-radius: 6px; border: 1px dashed #d5ccbe;">
                    <p style="color: #666; font-style: italic; margin: 0 0 8px 0; font-size: 12px;">Aktuell sind keine bevorstehenden Konzerte eingetragen.</p>
                    <a href="<?php echo esc_url($events_url . '#new'); ?>" class="button button-small button-primary" style="background: #DAA520; border-color: #b8860b; color: #141210;">
                        + Neuen Termin anlegen
                    </a>
                </div>
            <?php else: ?>
                <ul style="margin: 0; padding: 0; list-style: none;">
                    <?php foreach (array_slice($upcoming, 0, 5) as $ev): ?>
                        <li style="padding: 8px 0; border-bottom: 1px dotted #e5e0d5;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 2px;">
                                <strong style="color: #1d2327; font-size: 13px;"><?php echo esc_html($ev['title'] ?? 'Konzert'); ?></strong>
                                <span style="font-size: 12px; color: #996515; font-weight: 700; white-space: nowrap;">
                                    📅 <?php echo esc_html($ev['date'] ?? ''); ?>
                                </span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 12px; color: #646970;">
                                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                                    📍 <?php echo esc_html(($ev['location'] ?? '') . (!empty($ev['city']) ? ' (' . $ev['city'] . ')' : '')); ?>
                                </div>
                                <div style="white-space: nowrap; font-size: 11px;">
                                    <?php if (!empty($ev['time'])): ?>
                                        <span>🕒 <?php echo esc_html($ev['time']); ?></span>
                                    <?php endif; ?>
                                    <span style="background: #e6f4ea; color: #137333; padding: 1px 5px; border-radius: 3px; font-weight: 600; margin-left: 4px;">
                                        Aktiv
                                    </span>
                                </div>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #f0f0f1; text-align: right;">
                    <a href="<?php echo esc_url($events_url); ?>" style="text-decoration: none; font-weight: 600; font-size: 12px; color: #2271b1;">
                        Alle <?php echo count($events); ?> Termine im Kalender anzeigen &rarr;
                    </a>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }
}
