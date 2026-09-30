<?php
if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Admin {

    public static function init() {
        Olla_Podrida_Settings::maybe_sync_legal_options();
        add_action('admin_menu', [__CLASS__, 'register_admin_menu']);
        add_action('admin_menu', [__CLASS__, 'cleanup_unwanted_menus'], 999);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_admin_assets']);
        add_action('wp_dashboard_setup', [__CLASS__, 'register_dashboard_widgets']);
        add_action('admin_post_olla_podrida_save_settings', [__CLASS__, 'handle_save_settings']);
        add_action('wp_ajax_olla_podrida_save_event', [__CLASS__, 'handle_ajax_save_event']);
        add_action('wp_ajax_olla_podrida_delete_event', [__CLASS__, 'handle_ajax_delete_event']);
        add_action('wp_ajax_olla_podrida_toggle_event', [__CLASS__, 'handle_ajax_toggle_event']);
        add_action('wp_ajax_olla_podrida_delete_message', [__CLASS__, 'handle_ajax_delete_message']);
        add_action('admin_bar_menu', [__CLASS__, 'customize_admin_bar_logo'], 11);
        add_action('admin_head', [__CLASS__, 'render_sidebar_styles']);
        add_filter('admin_body_class', [__CLASS__, 'add_admin_body_classes']);
        add_action('login_enqueue_scripts', [__CLASS__, 'customize_login_page']);
        add_filter('login_headerurl', [__CLASS__, 'customize_login_headerurl']);
        add_filter('login_headertext', [__CLASS__, 'customize_login_headertext']);
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
        
        foreach ($allowed as $key) {
            if (!isset($sections[$key])) {
                continue;
            }
            $info = $sections[$key];

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

    /**
     * Remove redundant duplicate menu items and unwanted items for specific roles
     */
    public static function cleanup_unwanted_menus() {
        global $submenu;
        // Remove the duplicate first item ("Olla Podrida") from the Olla Podrida submenu
        remove_submenu_page('olla-podrida', 'olla-podrida');
        if (isset($submenu['olla-podrida'])) {
            foreach ($submenu['olla-podrida'] as $idx => $item) {
                if (isset($item[2]) && $item[2] === 'olla-podrida') {
                    unset($submenu['olla-podrida'][$idx]);
                }
            }
        }

        // For non-admin roles (specifically Ensemble-Leitung), remove Kommentare (Comments)
        if (!current_user_can('manage_options')) {
            $user = wp_get_current_user();
            if (in_array('olla_ensemble_leitung', (array) $user->roles, true)) {
                remove_menu_page('edit-comments.php');
            }
        }
    }

    /**
     * Replace WordPress admin bar logo with Ensemble Stew Pot Logo
     * and redirect link to Olla Podrida dashboard.
     */
    public static function customize_admin_bar_logo($wp_admin_bar) {
        $node = $wp_admin_bar->get_node('wp-logo');
        $pot_logo = esc_url(OLLA_PODRIDA_URL . 'assets/dist/images/logo-pot.png');
        if ($node) {
            $node->title = '<span class="olla-admin-bar-badge"><img src="' . $pot_logo . '" alt="Olla Podrida" class="olla-admin-bar-pot-img" /></span><span class="olla-admin-bar-title">Olla Podrida</span>';
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
            /* 1. TOP-LEFT ADMIN BAR: Glowing Emblem & Warm Medieval Bar */
            /* ======================================================== */
            #wpadminbar {
                background: linear-gradient(90deg, #180f0a 0%, #29180f 40%, #29180f 60%, #180f0a 100%) !important;
                border-bottom: 2px solid #DAA520 !important;
                box-shadow: 0 3px 12px rgba(0,0,0,0.6) !important;
            }
            #wpadminbar .ab-item, 
            #wpadminbar a.ab-item,
            #wpadminbar #wp-admin-bar-my-account .ab-item {
                color: #f5f5dc !important;
                transition: color 0.15s ease, background 0.15s ease !important;
            }
            #wpadminbar:not(.mobile) .ab-top-menu > li > .ab-item:focus, 
            #wpadminbar:not(.mobile) .ab-top-menu > li:hover > .ab-item, 
            #wpadminbar:not(.mobile) .ab-top-menu > li.hover > .ab-item {
                background: #3a2316 !important;
                color: #FFD700 !important;
            }
            #wpadminbar #wp-admin-bar-wp-logo > .ab-item {
                display: flex !important;
                align-items: center !important;
                padding: 0 12px 0 10px !important;
                height: 32px !important;
            }
            #wpadminbar #wp-admin-bar-wp-logo .ab-icon,
            #wpadminbar #wp-admin-bar-wp-logo .ab-icon:before {
                display: none !important;
                content: "" !important;
            }
            #wpadminbar #wp-admin-bar-wp-logo .olla-admin-bar-badge {
                width: 25px !important;
                height: 25px !important;
                border-radius: 50% !important;
                background: radial-gradient(circle, #fffaf0 0%, #faecd0 70%, #dfb547 100%) !important;
                border: 1.5px solid #FFD700 !important;
                box-shadow: 0 0 6px rgba(218, 165, 32, 0.7), inset 0 0 3px rgba(0,0,0,0.25) !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
                flex-shrink: 0 !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            }
            #wpadminbar #wp-admin-bar-wp-logo:hover .olla-admin-bar-badge {
                transform: scale(1.08) !important;
                box-shadow: 0 0 12px rgba(255, 215, 0, 1) !important;
            }
            #wpadminbar #wp-admin-bar-wp-logo .olla-admin-bar-pot-img {
                width: 21px !important;
                height: 21px !important;
                object-fit: contain !important;
                display: block !important;
            }
            #wpadminbar #wp-admin-bar-wp-logo .olla-admin-bar-title {
                color: #FFD700 !important;
                font-weight: 700 !important;
                font-size: 13px !important;
                letter-spacing: 0.04em !important;
                margin-left: 8px !important;
                display: inline-block !important;
                text-shadow: 0 1px 2px rgba(0,0,0,0.8) !important;
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
            /* Single clean gold border on the parent container ONLY */
            #adminmenu #toplevel_page_olla-podrida {
                border-left: 4px solid #DAA520 !important;
                background: #1c140f !important;
                box-sizing: border-box !important;
            }
            #adminmenu #toplevel_page_olla-podrida > a {
                color: #FFD700 !important;
                font-weight: 700 !important;
            }
            #adminmenu #toplevel_page_olla-podrida .wp-menu-image:before {
                color: #DAA520 !important;
            }

            /* Submenu inside Olla Podrida: NO extra left border, flush with sidebar */
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu,
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida.wp-not-current-submenu .wp-submenu,
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida.opensub .wp-submenu {
                display: block !important;
                position: static !important;
                top: auto !important;
                left: 0 !important;
                right: auto !important;
                box-shadow: none !important;
                border: none !important;
                border-left: none !important; /* NO DOUBLE BORDER */
                background: #160e0a !important;
                margin: 0 !important;
                padding: 4px 0 6px 0 !important;
                float: none !important;
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            /* STRICTLY HIDE WordPress auto-generated submenu-head and duplicate Olla Podrida link */
            #adminmenu li.toplevel_page_olla-podrida .wp-submenu li.wp-submenu-head,
            #adminmenu li.toplevel_page_olla-podrida .wp-submenu .wp-submenu-head,
            #adminmenu li.toplevel_page_olla-podrida .wp-submenu > li:first-child.wp-submenu-head,
            #adminmenu li.toplevel_page_olla-podrida .wp-submenu li:has(a[href$="page=olla-podrida"]),
            #adminmenu li.toplevel_page_olla-podrida .wp-submenu li.wp-first-item:has(a[href$="page=olla-podrida"]),
            #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a[href="admin.php?page=olla-podrida"] {
                display: none !important;
                height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }

            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li:not(.wp-submenu-head) {
                display: block !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
            }
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a {
                display: block !important;
                padding: 6px 10px 6px 16px !important;
                font-size: 13px !important;
                line-height: 1.4 !important;
                color: #cfc4ac !important;
                border: none !important;
                border-left: none !important; /* NO HOVER BAR */
                box-shadow: none !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                box-sizing: border-box !important;
                width: 100% !important;
            }
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a:hover,
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a:focus {
                color: #FFD700 !important;
                background: #251912 !important;
                border: none !important;
                border-left: none !important; /* NO HOVER BAR */
                box-shadow: none !important;
            }
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li.current a {
                color: #DAA520 !important;
                font-weight: 700 !important;
                background: #221610 !important;
                border: none !important;
                border-left: none !important;
            }
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-menu-arrow {
                display: none !important;
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
            /* ======================================================== */
            /* 5. HIDE REDUNDANT TAB BAR FOR ENSEMBLE-LEITUNG          */
            /* ======================================================== */
            body.role-olla_ensemble_leitung .olla-nav-tab-wrapper,
            body.role-olla_ensemble_leitung .nav-tab-wrapper,
            .role-olla_ensemble_leitung .olla-nav-tab-wrapper {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }
        </style>
        <?php
    }

    public static function add_admin_body_classes($classes) {
        $user = wp_get_current_user();
        if ($user && !empty($user->roles)) {
            foreach ($user->roles as $role) {
                $classes .= ' role-' . sanitize_html_class($role);
            }
        }
        return $classes;
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

        $user = wp_get_current_user();
        $is_admin = current_user_can('manage_options');

        // For non-admin roles (specifically Ensemble-Leitung), remove ALL standard WP core and third-party widgets
        if (!$is_admin) {
            remove_action('welcome_panel', 'wp_welcome_panel');
            remove_meta_box('dashboard_primary', 'dashboard', 'side');
            remove_meta_box('dashboard_quick_press', 'dashboard', 'side');
            remove_meta_box('dashboard_right_now', 'dashboard', 'normal');
            remove_meta_box('dashboard_activity', 'dashboard', 'normal');
            remove_meta_box('dashboard_site_health', 'dashboard', 'normal');

            global $wp_meta_boxes;
            if (isset($wp_meta_boxes['dashboard'])) {
                foreach (['normal', 'side', 'column3', 'column4'] as $context) {
                    if (isset($wp_meta_boxes['dashboard'][$context])) {
                        foreach (['high', 'core', 'default', 'low'] as $priority) {
                            if (isset($wp_meta_boxes['dashboard'][$context][$priority])) {
                                foreach ($wp_meta_boxes['dashboard'][$context][$priority] as $widget_id => $widget) {
                                    if (strpos($widget_id, 'olla_podrida_dashboard_') !== 0) {
                                        unset($wp_meta_boxes['dashboard'][$context][$priority][$widget_id]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Allowed sections for current user
        $allowed = Olla_Podrida_Roles::get_allowed_sections_for_current_user();

        // 1. Events Widget (Konzerttermine & Status)
        if (in_array('events', $allowed, true)) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_events',
                '📅 Konzerttermine & Status',
                [__CLASS__, 'render_dashboard_events_widget'],
                null,
                null,
                'normal',
                'high'
            );
        }

        // 2. Contact Widget (Kontaktanfragen & Posteingang)
        if (in_array('contact', $allowed, true)) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_contact',
                '📬 Kontaktanfragen & Posteingang',
                [__CLASS__, 'render_dashboard_contact_widget'],
                null,
                null,
                'normal',
                'high'
            );
        }

        // 3. Cookie & Consent Widget
        if (in_array('consent', $allowed, true)) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_consent',
                '🛡️ Cookie & Consent (DSGVO)',
                [__CLASS__, 'render_dashboard_consent_widget'],
                null,
                null,
                'side',
                'high'
            );
        }

        // 4. Presse & Medienmaterial Widget
        if (in_array('press', $allowed, true)) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_press',
                '📰 Presse & Medienmaterial',
                [__CLASS__, 'render_dashboard_press_widget'],
                null,
                null,
                'side',
                'high'
            );
        }

        // 5. Hintergrundmusik & Player Widget
        if (in_array('audio', $allowed, true)) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_audio',
                '🎵 Hintergrundmusik & Player',
                [__CLASS__, 'render_dashboard_audio_widget'],
                null,
                null,
                'side',
                'default'
            );
        }

        // 6. Ensemble & Musiker Widget
        if (in_array('ensemble', $allowed, true)) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_ensemble',
                '👥 Ensemble & Besetzung',
                [__CLASS__, 'render_dashboard_ensemble_widget'],
                null,
                null,
                'normal',
                'default'
            );
        }

        // 7. SEO & Metadaten Widget
        if (in_array('seo', $allowed, true)) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_seo',
                '🔍 SEO & Suchmaschinen',
                [__CLASS__, 'render_dashboard_seo_widget'],
                null,
                null,
                'side',
                'low'
            );
        }

        // 8. Rechtliches & Footer Widget
        if (in_array('legal', $allowed, true)) {
            wp_add_dashboard_widget(
                'olla_podrida_dashboard_legal',
                '⚖️ Rechtliches & Footer',
                [__CLASS__, 'render_dashboard_legal_widget'],
                null,
                null,
                'side',
                'low'
            );
        }

        // Reorder dashboard widgets so that Olla Podrida widgets appear at the absolute top of the screen
        global $wp_meta_boxes;
        if (isset($wp_meta_boxes['dashboard']['normal']['high'])) {
            $normal_high = $wp_meta_boxes['dashboard']['normal']['high'];
            $prioritized = [];
            foreach (['olla_podrida_dashboard_events', 'olla_podrida_dashboard_contact', 'olla_podrida_dashboard_ensemble'] as $wid) {
                if (isset($normal_high[$wid])) {
                    $prioritized[$wid] = $normal_high[$wid];
                    unset($normal_high[$wid]);
                }
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

    public static function render_dashboard_consent_widget() {
        $stats = Olla_Podrida_Consent::get_stats();
        $consent_url = admin_url('admin.php?page=olla-podrida&tab=consent');
        $csv_url = wp_nonce_url(admin_url('admin-post.php?action=olla_podrida_export_consent_csv'), 'olla_podrida_export_consent');
        $print_url = wp_nonce_url(admin_url('admin-post.php?action=olla_podrida_print_consent_report'), 'olla_podrida_print_consent');
        ?>
        <div class="olla-dashboard-widget" style="padding: 2px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <span style="font-size: 13px; font-weight: 600; color: #1d2327;">DSGVO-Nachweise:</span>
                <span style="background: #2e7d32; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 11px;">
                    <?php echo intval($stats['total']); ?> protokolliert
                </span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 6px; padding: 8px; text-align: center;">
                    <div style="font-size: 16px; font-weight: 700; color: #065f46;"><?php echo intval($stats['last_30_days']); ?></div>
                    <div style="font-size: 11px; color: #666;">Letzte 30 Tage</div>
                </div>
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 6px; padding: 8px; text-align: center;">
                    <div style="font-size: 16px; font-weight: 700; color: #1e3a8a;"><?php echo intval($stats['active']); ?></div>
                    <div style="font-size: 11px; color: #666;">Aktiv / Gültig</div>
                </div>
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: space-between; padding-top: 8px; border-top: 1px solid #f0f0f1;">
                <div style="display: flex; gap: 4px;">
                    <a href="<?php echo esc_url($csv_url); ?>" class="button button-small" title="CSV herunterladen">📥 CSV</a>
                    <a href="<?php echo esc_url($print_url); ?>" target="_blank" class="button button-small" title="Druckbericht / PDF öffnen">🖨️ PDF</a>
                </div>
                <a href="<?php echo esc_url($consent_url); ?>" style="text-decoration: none; font-weight: 600; font-size: 12px; color: #2271b1; align-self: center;">
                    Verwalten &rarr;
                </a>
            </div>
        </div>
        <?php
    }

    public static function render_dashboard_press_widget() {
        $press = Olla_Podrida_Settings::get_section('press');
        $press_url = admin_url('admin.php?page=olla-podrida&tab=press');
        ?>
        <div class="olla-dashboard-widget" style="padding: 2px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <span style="font-size: 13px; font-weight: 600; color: #1d2327;">Pressematerialien:</span>
                <span style="background: #DAA520; color: #141210; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 11px;">
                    Bereit
                </span>
            </div>
            <p style="font-size: 12px; color: #555; margin: 0 0 10px 0; line-height: 1.4;">
                Pressefotos, helle &amp; dunkle Ensemble-Logos sowie der Pressetext stehen zum Download bereit.
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #f0f0f1;">
                <span style="font-size: 11px; color: #777;">Kontakt: <?php echo esc_html($press['contact_name'] ?? 'Susanne Hoffmann'); ?></span>
                <a href="<?php echo esc_url($press_url); ?>" style="text-decoration: none; font-weight: 600; font-size: 12px; color: #2271b1;">
                    Pressemappe &rarr;
                </a>
            </div>
        </div>
        <?php
    }

    public static function render_dashboard_audio_widget() {
        $audio = Olla_Podrida_Settings::get_section('audio');
        $audio_url = admin_url('admin.php?page=olla-podrida&tab=audio');
        $is_loop = !empty($audio['loop']);
        $enabled = !empty($audio['enabled']);
        ?>
        <div class="olla-dashboard-widget" style="padding: 2px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <span style="font-size: 13px; font-weight: 600; color: #1d2327;">Musikstück:</span>
                <span style="background: <?php echo $enabled ? '#2e7d32' : '#888'; ?>; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 11px;">
                    <?php echo $enabled ? 'Aktiv' : 'Deaktiviert'; ?>
                </span>
            </div>
            <div style="font-size: 12px; color: #333; margin-bottom: 8px;">
                🎵 <strong><?php echo esc_html($audio['track_title'] ?? 'Riu, riu, chiu'); ?></strong><br/>
                <span style="font-size: 11px; color: #666;">Modus: <strong><?php echo $is_loop ? 'Endlosschleife (Loop)' : 'Einmalig abspielen'; ?></strong></span>
            </div>
            <div style="text-align: right; padding-top: 8px; border-top: 1px solid #f0f0f1;">
                <a href="<?php echo esc_url($audio_url); ?>" style="text-decoration: none; font-weight: 600; font-size: 12px; color: #2271b1;">
                    Player konfigurieren &rarr;
                </a>
            </div>
        </div>
        <?php
    }

    public static function render_dashboard_ensemble_widget() {
        $ensemble_url = admin_url('admin.php?page=olla-podrida&tab=ensemble');
        ?>
        <div class="olla-dashboard-widget" style="padding: 2px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <span style="font-size: 13px; font-weight: 600; color: #1d2327;">Ensemble-Präsentation:</span>
                <span style="background: #2e7d32; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 11px;">
                    7 Musiker
                </span>
            </div>
            <p style="font-size: 12px; color: #555; margin: 0 0 10px 0; line-height: 1.4;">
                Silke, Simone, Susanne, Sandra, Ruth, Lutz und Klemens – Texte &amp; Musiker-Porträts auf der Pergamentrolle.
            </p>
            <div style="text-align: right; padding-top: 8px; border-top: 1px solid #f0f0f1;">
                <a href="<?php echo esc_url($ensemble_url); ?>" style="text-decoration: none; font-weight: 600; font-size: 12px; color: #2271b1;">
                    Musiker bearbeiten &rarr;
                </a>
            </div>
        </div>
        <?php
    }

    public static function render_dashboard_seo_widget() {
        $seo = Olla_Podrida_Settings::get_section('seo');
        $seo_url = admin_url('admin.php?page=olla-podrida&tab=seo');
        ?>
        <div class="olla-dashboard-widget" style="padding: 2px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <span style="font-size: 13px; font-weight: 600; color: #1d2327;">Suchmaschinen (SEO):</span>
                <span style="background: #2e7d32; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 11px;">
                    <?php echo esc_html($seo['robots_index'] ?? 'index, follow'); ?>
                </span>
            </div>
            <div style="font-size: 12px; color: #444; margin-bottom: 8px;">
                Titel: <em><?php echo esc_html(mb_strimwidth($seo['meta_title'] ?? 'Ensemble Olla Podrida', 0, 36, '...')); ?></em><br/>
                <span style="font-size: 11px; color: #666;">Schema: MusicGroup (Mittelalter &amp; Renaissance)</span>
            </div>
            <div style="text-align: right; padding-top: 8px; border-top: 1px solid #f0f0f1;">
                <a href="<?php echo esc_url($seo_url); ?>" style="text-decoration: none; font-weight: 600; font-size: 12px; color: #2271b1;">
                    SEO anpassen &rarr;
                </a>
            </div>
        </div>
        <?php
    }

    public static function render_dashboard_legal_widget() {
        $legal_url = admin_url('admin.php?page=olla-podrida&tab=legal');
        ?>
        <div class="olla-dashboard-widget" style="padding: 2px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <span style="font-size: 13px; font-weight: 600; color: #1d2327;">Rechtliches &amp; Footer:</span>
                <span style="background: #2e7d32; color: #fff; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 11px;">
                    Gepflegt
                </span>
            </div>
            <p style="font-size: 12px; color: #555; margin: 0 0 10px 0; line-height: 1.4;">
                Impressum, Datenschutzerklärung, Footer-Texte und Urheberrechtshinweise (Freepik / Jan Dennis Brüning).
            </p>
            <div style="text-align: right; padding-top: 8px; border-top: 1px solid #f0f0f1;">
                <a href="<?php echo esc_url($legal_url); ?>" style="text-decoration: none; font-weight: 600; font-size: 12px; color: #2271b1;">
                    Rechtstexte ansehen &rarr;
                </a>
            </div>
        </div>
        <?php
    }

    /**
     * Medieval styling for the WordPress login page (wp-login.php)
     */
    public static function customize_login_page() {
        $pot_logo = esc_url(OLLA_PODRIDA_URL . 'assets/dist/images/logo-pot.png');
        ?>
        <style id="olla-podrida-login-css">
            body.login {
                background: #0d0806 radial-gradient(circle at center, #1b120c 0%, #0a0604 100%) !important;
                color: #e5dec9 !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
            body.login div#login h1 a {
                background-image: url('<?php echo $pot_logo; ?>') !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                width: 90px !important;
                height: 90px !important;
                margin-bottom: 15px !important;
                filter: drop-shadow(0 4px 12px rgba(218, 165, 32, 0.45)) !important;
            }
            body.login div#login form#loginform {
                background: #18110c !important;
                border: 1px solid #DAA520 !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(218, 165, 32, 0.2) !important;
                border-radius: 10px !important;
                padding: 26px 24px 24px !important;
            }
            body.login div#login form#loginform label {
                color: #d1c7ac !important;
                font-weight: 600 !important;
                font-size: 13px !important;
            }
            body.login div#login form#loginform input[type="text"],
            body.login div#login form#loginform input[type="password"] {
                background: #231811 !important;
                border: 1px solid #4a382c !important;
                color: #f5f5dc !important;
                border-radius: 6px !important;
                padding: 6px 12px !important;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.5) !important;
            }
            body.login div#login form#loginform input[type="text"]:focus,
            body.login div#login form#loginform input[type="password"]:focus {
                border-color: #DAA520 !important;
                box-shadow: 0 0 8px rgba(218, 165, 32, 0.5) !important;
                outline: none !important;
            }
            body.login div#login form#loginform .forgetmenot label {
                color: #b0a48e !important;
                font-weight: normal !important;
            }
            body.login div#login form#loginform input[type="submit"]#wp-submit {
                background: linear-gradient(135deg, #DAA520 0%, #b8860b 100%) !important;
                border: 1px solid #FFD700 !important;
                color: #120b08 !important;
                font-weight: 700 !important;
                text-shadow: none !important;
                border-radius: 6px !important;
                padding: 4px 18px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
                transition: all 0.2s ease !important;
            }
            body.login div#login form#loginform input[type="submit"]#wp-submit:hover {
                background: linear-gradient(135deg, #FFD700 0%, #DAA520 100%) !important;
                box-shadow: 0 0 15px rgba(218, 165, 32, 0.6) !important;
                transform: scale(1.02) !important;
            }
            body.login #nav a,
            body.login #backtoblog a {
                color: #cfc4ac !important;
                transition: color 0.15s ease !important;
            }
            body.login #nav a:hover,
            body.login #backtoblog a:hover {
                color: #FFD700 !important;
            }
            body.login .notice,
            body.login .message,
            body.login #login_error {
                background: #251a13 !important;
                border-left-color: #DAA520 !important;
                color: #f5f5dc !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
            }
        </style>
        <?php
    }

    public static function customize_login_headerurl() {
        return home_url('/');
    }

    public static function customize_login_headertext() {
        return 'Ensemble Olla Podrida – Klangvielfalt aus Mittelalter und Renaissance';
    }
}
