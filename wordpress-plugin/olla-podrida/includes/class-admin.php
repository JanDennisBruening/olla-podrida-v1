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
        add_action('admin_post_olla_podrida_run_auto_setup', [__CLASS__, 'handle_run_auto_setup']);
        add_action('wp_ajax_olla_podrida_save_event', [__CLASS__, 'handle_ajax_save_event']);
        add_action('wp_ajax_olla_podrida_delete_event', [__CLASS__, 'handle_ajax_delete_event']);
        add_action('wp_ajax_olla_podrida_toggle_event', [__CLASS__, 'handle_ajax_toggle_event']);
        add_action('wp_ajax_olla_podrida_delete_message', [__CLASS__, 'handle_ajax_delete_message']);
        add_action('wp_ajax_olla_cockpit_check_update', [__CLASS__, 'handle_ajax_cockpit_check_update']);
        add_action('wp_ajax_olla_cockpit_run_update', [__CLASS__, 'handle_ajax_cockpit_run_update']);
        add_action('admin_bar_menu', [__CLASS__, 'customize_admin_bar_logo'], 11);
        add_action('admin_head', [__CLASS__, 'render_sidebar_styles']);
        add_action('wp_head', [__CLASS__, 'render_admin_bar_frontend_styles']);
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

        // For non-admin roles (specifically Ensemble-Leitung), remove Kommentare (Comments) and Beiträge (Posts)
        if (!current_user_can('manage_options')) {
            $user = wp_get_current_user();
            if (in_array('olla_ensemble_leitung', (array) $user->roles, true)) {
                remove_menu_page('edit-comments.php');
                remove_menu_page('edit.php');
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
            /* 2. UNIFORM SIDEBAR MENU STYLING & ACCENT LINES           */
            /* ======================================================== */
            /* Ensure all top-level items share the exact same baseline geometry */
            #adminmenu li.menu-top,
            #adminmenu #toplevel_page_olla-podrida {
                border-left: none !important;
                box-sizing: border-box !important;
                margin-left: 0 !important;
            }
            #adminmenu #toplevel_page_olla-podrida {
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
            /* SUBMENU BEHAVIOR: EMBEDDED ON WIDE DESKTOP, HOVER-ONLY ON FOLDED/TABLET */
            /* ======================================================== */

            /* 1. DESKTOP EXPANDED SIDEBAR (>960px AND not body.folded):
               Submenu is ALWAYS visible directly beneath the main menu item, flush in the sidebar with NO hover required. */
            @media (min-width: 961px) {
                body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu,
                body:not(.folded) #adminmenu li.toplevel_page_olla-podrida.wp-not-current-submenu .wp-submenu,
                body:not(.folded) #adminmenu li.toplevel_page_olla-podrida.opensub .wp-submenu,
                body:not(.folded) #adminmenu li.toplevel_page_olla-podrida.wp-has-current-submenu .wp-submenu {
                    display: block !important;
                    position: static !important;
                    top: auto !important;
                    left: auto !important;
                    right: auto !important;
                    box-shadow: none !important;
                    border: none !important;
                    border-left: none !important;
                    background: #160e0a !important;
                    margin: 0 !important;
                    padding: 4px 0 6px 0 !important;
                    float: none !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }
                body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li:not(.wp-submenu-head) {
                    display: block !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                }
                body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a {
                    display: block !important;
                    padding: 7px 10px 7px 16px !important;
                    font-size: 13px !important;
                    line-height: 1.4 !important;
                    color: #cfc4ac !important;
                    border: none !important;
                    border-left: none !important;
                    box-shadow: none !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    box-sizing: border-box !important;
                    width: 100% !important;
                }
            }

            /* 2. TABLET / RESPONSIVE (<=960px): Sidebar is collapsed to 36px icon bar; submenu floats on hover */
            @media (max-width: 960px) {
                #adminmenu li.toplevel_page_olla-podrida .wp-submenu,
                #adminmenu li.toplevel_page_olla-podrida.wp-has-current-submenu .wp-submenu {
                    display: none !important;
                    position: absolute !important;
                    top: -1px !important;
                    left: 36px !important;
                    width: 200px !important;
                    background: #160e0a !important;
                    border: 1px solid #3c2415 !important;
                    border-left: none !important;
                    box-shadow: 4px 6px 20px rgba(0, 0, 0, 0.65) !important;
                    z-index: 99999 !important;
                    padding: 4px 0 6px 0 !important;
                    margin: 0 !important;
                    border-radius: 0 6px 6px 0 !important;
                }
                #adminmenu li.toplevel_page_olla-podrida:hover .wp-submenu,
                #adminmenu li.toplevel_page_olla-podrida.opensub .wp-submenu,
                #adminmenu li.toplevel_page_olla-podrida:focus-within .wp-submenu {
                    display: block !important;
                }
                #adminmenu li.toplevel_page_olla-podrida .wp-submenu li:not(.wp-submenu-head) {
                    display: block !important;
                }
                #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a {
                    display: block !important;
                    padding: 8px 14px !important;
                    font-size: 13px !important;
                    color: #cfc4ac !important;
                    white-space: nowrap !important;
                }
            }

            /* 3. MANUALLY FOLDED SIDEBAR (Desktop with body.folded): Floating flyout submenu on hover */
            body.folded #adminmenu li.toplevel_page_olla-podrida .wp-submenu,
            body.folded #adminmenu li.toplevel_page_olla-podrida.wp-has-current-submenu .wp-submenu {
                display: none !important;
                position: absolute !important;
                top: -1px !important;
                left: 36px !important;
                width: 200px !important;
                background: #160e0a !important;
                border: 1px solid #3c2415 !important;
                border-left: none !important;
                box-shadow: 4px 6px 20px rgba(0, 0, 0, 0.65) !important;
                z-index: 99999 !important;
                padding: 4px 0 6px 0 !important;
                margin: 0 !important;
                border-radius: 0 6px 6px 0 !important;
            }
            body.folded #adminmenu li.toplevel_page_olla-podrida:hover .wp-submenu,
            body.folded #adminmenu li.toplevel_page_olla-podrida.opensub .wp-submenu,
            body.folded #adminmenu li.toplevel_page_olla-podrida:focus-within .wp-submenu {
                display: block !important;
            }
            body.folded #adminmenu li.toplevel_page_olla-podrida .wp-submenu li:not(.wp-submenu-head) {
                display: block !important;
            }
            body.folded #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a {
                display: block !important;
                padding: 8px 14px !important;
                font-size: 13px !important;
                color: #cfc4ac !important;
                white-space: nowrap !important;
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

            /* NO ACCENT LINES ON MENU ITEMS (Selected state indicated solely by background color) */
            #adminmenu,
            #adminmenu *,
            #adminmenu *:before,
            #adminmenu *:after {
                box-shadow: none !important;
                -webkit-box-shadow: none !important;
            }
            #adminmenu li,
            #adminmenu li a,
            #adminmenu .wp-submenu,
            #adminmenu .wp-submenu li,
            #adminmenu .wp-submenu li a {
                border-left: none !important;
                border-right: none !important;
            }
            #adminmenu li:after,
            #adminmenu li a:after,
            #adminmenu .wp-menu-arrow,
            #adminmenu .wp-menu-arrow div {
                display: none !important;
                content: none !important;
            }

            /* ACTIVE / SELECTED MENU ITEM: Pure background highlight, no border, no side line */
            #adminmenu li.current > a.menu-top,
            #adminmenu li.wp-has-current-submenu > a.wp-has-current-submenu,
            #adminmenu #toplevel_page_olla-podrida.current > a,
            #adminmenu #toplevel_page_olla-podrida.wp-has-current-submenu > a {
                background: #2c1c14 !important;
                color: #f7eed8 !important;
                font-weight: 600 !important;
                box-shadow: none !important;
                border: none !important;
                border-left: none !important;
            }

            #adminmenu .wp-submenu li.current > a,
            body:not(.folded) #adminmenu li.toplevel_page_olla-podrida .wp-submenu li.current > a {
                color: #f7eed8 !important;
                font-weight: 600 !important;
                background: #251810 !important;
                box-shadow: none !important;
                border: none !important;
                border-left: none !important;
            }

            /* HOVER STATE: Only subtle background color change, text color stays consistent, absolutely NO lines */
            #adminmenu a.menu-top:hover,
            #adminmenu li.menu-top:hover > a,
            #adminmenu li.opensub > a.menu-top,
            #adminmenu li > a.menu-top:focus,
            #adminmenu .wp-submenu a:hover,
            #adminmenu .wp-submenu a:focus,
            #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a:hover,
            #adminmenu li.toplevel_page_olla-podrida .wp-submenu li a:focus {
                background: #20140e !important;
                color: #FFD700 !important;
                box-shadow: none !important;
                border: none !important;
                border-left: none !important;
            }

            /* Hover on already selected items */
            #adminmenu li.current > a.menu-top:hover,
            #adminmenu li.wp-has-current-submenu > a.wp-has-current-submenu:hover,
            #adminmenu .wp-submenu li.current > a:hover,
            #adminmenu li.toplevel_page_olla-podrida .wp-submenu li.current > a:hover {
                background: #362217 !important;
                color: #f7eed8 !important;
                box-shadow: none !important;
                border: none !important;
                border-left: none !important;
            }

            #adminmenu li.toplevel_page_olla-podrida .wp-menu-arrow {
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
            #adminmenu .wp-submenu {
                background: #1a110c !important;
            }
            #adminmenu .wp-submenu a {
                color: #c4b99e !important;
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

            /* ======================================================== */
            /* 6. IMMERSIVE OLLA PODRIDA DASHBOARD COCKPIT & CENTERED WRAP */
            /* ======================================================== */
            .index-php #dashboard-widgets-wrap,
            .olla-podrida-admin-wrap,
            .toplevel_page_olla-podrida #wpbody-content > .wrap,
            body[class*="olla-podrida"] #wpbody-content > .wrap {
                max-width: 1350px !important;
                margin-left: 0 !important;
                margin-right: auto !important;
                box-sizing: border-box !important;
            }
            @media (min-width: 1600px) {
                .index-php #dashboard-widgets-wrap,
                .olla-podrida-admin-wrap,
                .toplevel_page_olla-podrida #wpbody-content > .wrap,
                body[class*="olla-podrida"] #wpbody-content > .wrap {
                    margin-left: auto !important;
                    margin-right: auto !important;
                }
            }
            .index-php #dashboard-widgets .postbox-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .index-php #dashboard-widgets #postbox-container-2,
            .index-php #dashboard-widgets #postbox-container-3,
            .index-php #dashboard-widgets #postbox-container-4 {
                display: none !important;
            }
            #olla_podrida_dashboard_welcome {
                border: 1px solid rgba(218, 165, 32, 0.45) !important;
                border-radius: 12px !important;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08) !important;
                overflow: hidden !important;
                background: #ffffff !important;
                margin-top: 15px !important;
                margin-bottom: 30px !important;
            }
            #olla_podrida_dashboard_welcome .postbox-header {
                background: linear-gradient(90deg, #18110b 0%, #241710 100%) !important;
                border-bottom: 2px solid #DAA520 !important;
                padding: 12px 18px !important;
            }
            #olla_podrida_dashboard_welcome .postbox-header h2 {
                color: #DAA520 !important;
                font-size: 15px !important;
                font-weight: 700 !important;
                letter-spacing: 0.03em !important;
                text-shadow: 0 1px 2px rgba(0,0,0,0.6) !important;
            }
            #olla_podrida_dashboard_welcome .handlediv {
                display: none !important;
            }
            #olla_podrida_dashboard_welcome .inside {
                padding: 18px 22px !important;
                margin: 0 !important;
            }
        </style>
        <?php
    }

    public static function render_admin_bar_frontend_styles() {
        if (!is_admin_bar_showing()) {
            return;
        }
        ?>
        <style id="olla-podrida-admin-bar-frontend-css">
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
            }
            #wpadminbar #wp-admin-bar-wp-logo .olla-admin-bar-pot-img {
                width: 21px !important;
                height: 21px !important;
                max-width: 21px !important;
                max-height: 21px !important;
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
        if (strpos($hook, 'olla-podrida') === false && $hook !== 'index.php') {
            return;
        }

        // Native WordPress Media Library (only on plugin pages)
        if (strpos($hook, 'olla-podrida') !== false) {
            wp_enqueue_media();
        }

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
                    // Website-Texte & Passagen
                    'text_nav_start' => sanitize_text_field($_POST['text_nav_start'] ?? 'Start'),
                    'text_nav_ensemble' => sanitize_text_field($_POST['text_nav_ensemble'] ?? 'Ensemble'),
                    'text_nav_termine' => sanitize_text_field($_POST['text_nav_termine'] ?? 'Termine'),
                    'text_nav_kontakt' => sanitize_text_field($_POST['text_nav_kontakt'] ?? 'Kontakt'),
                    'text_nav_presse' => sanitize_text_field($_POST['text_nav_presse'] ?? 'Presse'),
                    'text_termine_title' => sanitize_text_field($_POST['text_termine_title'] ?? 'Aktuelle Termine'),
                    'text_termine_empty' => sanitize_text_field($_POST['text_termine_empty'] ?? 'Zurzeit sind keine weiteren Konzerttermine in Planung.'),
                    'text_termine_empty_sub' => sanitize_text_field($_POST['text_termine_empty_sub'] ?? 'Schauen Sie bald wieder vorbei oder stöbern Sie in unserer Konzertchronik!'),
                    'text_scroll_top' => sanitize_text_field($_POST['text_scroll_top'] ?? 'Nach oben'),
                    'text_footer_dev' => sanitize_text_field($_POST['text_footer_dev'] ?? 'Design, Konzept und Webentwicklung · Jan Dennis Brüning'),
                    // Wichtige Dokumente & Cloud-Ablage (Google Drive)
                    'drive_folder_url' => esc_url_raw($_POST['drive_folder_url'] ?? ''),
                    'drive_folder_title' => sanitize_text_field($_POST['drive_folder_title'] ?? 'Gemeinsame Google Drive-Ablage'),
                    'drive_folder_notes' => sanitize_textarea_field($_POST['drive_folder_notes'] ?? ''),
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
                $raw_verification = trim($_POST['google_site_verification'] ?? '');
                // Auto-extract content attribute if user pasted complete meta tag
                if (preg_match('/content=["\']([^"\']+)["\']/i', $raw_verification, $matches)) {
                    $raw_verification = $matches[1];
                }

                $data = [
                    'meta_title' => sanitize_text_field($_POST['meta_title'] ?? ''),
                    'meta_description' => sanitize_textarea_field($_POST['meta_description'] ?? ''),
                    'meta_keywords' => sanitize_text_field($_POST['meta_keywords'] ?? ''),
                    'canonical_url' => esc_url_raw($_POST['canonical_url'] ?? ''),
                    'google_site_verification' => sanitize_text_field($raw_verification),
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

    public static function handle_run_auto_setup() {
        if (!current_user_can('manage_options')) {
            wp_die('Keine Berechtigung.');
        }
        check_admin_referer('olla_podrida_run_auto_setup', 'olla_setup_nonce');

        if (class_exists('Olla_Podrida')) {
            Olla_Podrida::run_auto_setup();
        }

        wp_redirect(add_query_arg([
            'page' => 'olla-podrida',
            'tab' => 'display',
            'updated' => 'auto_setup_success'
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
     * AJAX: Check for plugin updates directly from dashboard cockpit
     */
    public static function handle_ajax_cockpit_check_update() {
        check_ajax_referer('olla_podrida_admin_nonce', 'nonce');

        if (!Olla_Podrida_Roles::can_user_access_menu() && !current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Keine ausreichenden Berechtigungen zur Prüfung von Updates.']);
        }

        // Force fresh check from remote
        $remote = Olla_Podrida_Updater::get_remote_info(true);
        if (!$remote || empty($remote['version'])) {
            wp_send_json_error(['message' => 'Update-Server antwortet derzeit nicht. Bitte prüfe deine Internetverbindung.']);
        }

        $remote_version = trim($remote['version']);
        $has_update = version_compare($remote_version, OLLA_PODRIDA_VERSION, '>');

        // Trigger WordPress update transient check
        if (file_exists(ABSPATH . 'wp-admin/includes/update.php')) {
            require_once ABSPATH . 'wp-admin/includes/update.php';
            wp_update_plugins();
        }

        wp_send_json_success([
            'has_update'      => $has_update,
            'current_version' => OLLA_PODRIDA_VERSION,
            'new_version'     => $remote_version,
            'message'         => $has_update 
                ? 'Neue Version v' . $remote_version . ' verfügbar!' 
                : 'Du nutzt bereits die aktuellste Version v' . OLLA_PODRIDA_VERSION . '.',
        ]);
    }

    /**
     * AJAX: Run plugin update in-place from dashboard cockpit
     */
    public static function handle_ajax_cockpit_run_update() {
        check_ajax_referer('olla_podrida_admin_nonce', 'nonce');

        if (!Olla_Podrida_Roles::can_user_access_menu() && !current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Keine ausreichenden Berechtigungen zur Durchführung von Updates.']);
        }

        // Force clearing of cached transients
        delete_site_transient('update_plugins');
        delete_transient('olla_podrida_remote_version');

        if (file_exists(ABSPATH . 'wp-admin/includes/update.php')) {
            require_once ABSPATH . 'wp-admin/includes/update.php';
            wp_update_plugins();
        }

        if (file_exists(ABSPATH . 'wp-admin/includes/class-wp-upgrader.php')) {
            require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        }
        if (file_exists(ABSPATH . 'wp-admin/includes/class-wp-ajax-upgrader-skin.php')) {
            require_once ABSPATH . 'wp-admin/includes/class-wp-ajax-upgrader-skin.php';
        }
        if (file_exists(ABSPATH . 'wp-admin/includes/plugin.php')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $skin = class_exists('WP_Ajax_Upgrader_Skin') ? new WP_Ajax_Upgrader_Skin() : null;
        $upgrader = new Plugin_Upgrader($skin);
        $plugin_file = 'olla-podrida/olla-podrida.php';

        $result = $upgrader->upgrade($plugin_file);

        if (is_wp_error($result)) {
            wp_send_json_error(['message' => $result->get_error_message()]);
        } elseif ($result === false) {
            $error_msg = 'Aktualisierung fehlgeschlagen. Bitte versuche es über die WordPress Plugins-Seite.';
            if ($skin && method_exists($skin, 'get_errors')) {
                $errs = $skin->get_errors();
                if (is_wp_error($errs) && $errs->has_errors()) {
                    $error_msg = $errs->get_error_message();
                }
            }
            wp_send_json_error(['message' => $error_msg]);
        } else {
            if (function_exists('is_plugin_active') && function_exists('activate_plugin')) {
                if (!is_plugin_active($plugin_file)) {
                    activate_plugin($plugin_file);
                }
            }
            $new_ver = '';
            if (function_exists('get_plugin_data') && defined('WP_PLUGIN_DIR')) {
                $full_file = WP_PLUGIN_DIR . '/' . $plugin_file;
                if (file_exists($full_file)) {
                    $plugin_data = get_plugin_data($full_file, false, false);
                    $new_ver = !empty($plugin_data['Version']) ? $plugin_data['Version'] : '';
                }
            }
            wp_send_json_success([
                'new_version' => $new_ver,
                'message'     => 'Plugin erfolgreich auf Version ' . ($new_ver ? 'v' . $new_ver : '') . ' aktualisiert!',
            ]);
        }
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

        // Remove standard WordPress core and clutter widgets for a clean, distraction-free dashboard
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
                                unset($wp_meta_boxes['dashboard'][$context][$priority][$widget_id]);
                            }
                        }
                    }
                }
            }
        }

        // Register the Sole, Central Dashboard Cockpit
        wp_add_dashboard_widget(
            'olla_podrida_dashboard_welcome',
            '✨ Leitungs- &amp; Verwaltungs-Cockpit · Ensemble Olla Podrida',
            [__CLASS__, 'render_dashboard_welcome_widget'],
            null,
            null,
            'normal',
            'high'
        );

        // Prioritize Olla Podrida Cockpit at the absolute top of the screen
        if (isset($wp_meta_boxes['dashboard']['normal']['high'])) {
            $normal_high = $wp_meta_boxes['dashboard']['normal']['high'];
            $prioritized = [];
            if (isset($normal_high['olla_podrida_dashboard_welcome'])) {
                $prioritized['olla_podrida_dashboard_welcome'] = $normal_high['olla_podrida_dashboard_welcome'];
                unset($normal_high['olla_podrida_dashboard_welcome']);
            }
            $wp_meta_boxes['dashboard']['normal']['high'] = array_merge($prioritized, $normal_high);
        }
    }

    public static function render_dashboard_welcome_widget() {
        $user = wp_get_current_user();
        $display_name = !empty($user->first_name) ? $user->first_name : (!empty($user->display_name) ? $user->display_name : 'liebe Leitung');
        $is_admin = current_user_can('manage_options');
        $role_badge = $is_admin ? 'Administrator & Webentwicklung' : 'Ensemble-Leitung & Redaktion';
        $pot_logo = OLLA_PODRIDA_URL . 'assets/dist/images/logo-pot.png';
        $live_url = home_url('/?olla_canvas=1');

        // Fetch live metrics
        $events = Olla_Podrida_Events::get_all_events();
        $upcoming = [];
        $past = [];
        foreach ($events as $e) {
            if (!empty($e['is_upcoming']) && !Olla_Podrida_Events::is_event_expired($e)) {
                $upcoming[] = $e;
            } else {
                $past[] = $e;
            }
        }
        $upcoming_count = count($upcoming);
        $past_count = count($past);

        $counts = Olla_Podrida_Contact::get_message_counts();
        $unread_count = intval($counts['unread']);
        $total_count = intval($counts['total']);

        $audio = Olla_Podrida_Settings::get_section('audio');
        $audio_title = !empty($audio['title']) ? $audio['title'] : 'Riu Riu Chiu';
        $audio_loop_text = !empty($audio['loop']) ? 'Endlos-Loop aktiv' : 'Einmalige Wiedergabe';

        $settings = Olla_Podrida_Settings::get_section('settings');
        $drive_url = trim($settings['drive_folder_url'] ?? '');
        $drive_title = trim($settings['drive_folder_title'] ?? 'Gemeinsame Google Drive-Ablage');
        $drive_notes = trim($settings['drive_folder_notes'] ?? 'Zentraler Ordner für Noten, Verträge, Programmhefte und Ablaufpläne des Ensembles.');
        ?>
        <div class="olla-cockpit-wrap" style="color: #2c3338; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;">
            
            <!-- 1. Hero Welcome Header with Atmospheric Medieval Drift Smoke -->
            <div style="position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; background: radial-gradient(circle at 80% 25%, rgba(218, 165, 32, 0.16) 0%, transparent 60%), linear-gradient(135deg, #140d09 0%, #070302 100%); border: 1.5px solid #DAA520; border-radius: 12px; padding: 38px 24px 20px 24px; margin-bottom: 22px; box-shadow: 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,215,0,0.25);">
                
                <!-- Atmospheric Medieval Drifting Smoke Background -->
                <div style="position: absolute; inset: 0; pointer-events: none; overflow: hidden; opacity: 0.28; mix-blend-mode: screen; z-index: 1;">
                    <img src="<?php echo esc_url(OLLA_PODRIDA_URL . 'assets/dist/images/Rauch-neu.webp'); ?>" alt="" style="position: absolute; top: -20%; left: -20%; width: 140%; height: 140%; object-fit: cover; animation: ollaAdminSmoke 20s ease-in-out infinite;" />
                </div>

                <!-- Top-Left Version Badge (always visible) -->
                <div class="olla-cockpit-version-tag" style="position: absolute; top: 11px; left: 16px; z-index: 10; display: inline-flex; align-items: center; gap: 6px; background: rgba(22, 14, 10, 0.92); border: 1.2px solid #DAA520; border-radius: 20px; padding: 2px 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
                    <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #00e676; box-shadow: 0 0 6px #00e676;"></span>
                    <span style="font-size: 11px; font-weight: 700; color: #FFD700; letter-spacing: 0.05em; text-transform: uppercase;">Plugin v<?php echo esc_html(OLLA_PODRIDA_VERSION); ?></span>
                </div>

                <div style="position: relative; z-index: 2; display: flex; align-items: center; gap: 18px;">
                    <div style="flex-shrink: 0; width: 64px; height: 64px; background: radial-gradient(circle, #2f1d13 0%, #150d08 100%); border: 2.5px solid #DAA520; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 3px 12px rgba(218,165,32,0.4);">
                        <img src="<?php echo esc_url($pot_logo); ?>" alt="Olla Podrida" style="width: 46px; height: 46px; object-fit: contain;" />
                    </div>
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px;">
                            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #DAA520; line-height: 1.2;">
                                Hallo <?php echo esc_html($display_name); ?>, herzlich willkommen! 👋
                            </h2>
                            <span style="background: rgba(218,165,32,0.20); border: 1px solid #DAA520; color: #FFD700; font-size: 11px; padding: 2px 10px; border-radius: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;">
                                <?php echo esc_html($role_badge); ?>
                            </span>
                        </div>
                        <p style="margin: 0; font-size: 13.5px; color: #f5f5dc; line-height: 1.45; max-width: 820px;">
                            Willkommen in Deinem zentralen Verwaltungs-Cockpit für die Website des <strong>Ensemble Olla Podrida</strong>. Hier kannst Du alle Termine, Musik, Anfragen und Texte direkt bearbeiten – Änderungen sind sofort für die Besucher live!
                        </p>
                    </div>
                </div>
                <div style="position: relative; z-index: 2;">
                    <a href="<?php echo esc_url($live_url); ?>" target="_blank" rel="noopener noreferrer" class="button button-primary button-large" style="background: linear-gradient(135deg, #f5bc38 0%, #df9e1a 100%); border-color: #cb8b10; color: #070202; font-weight: 700; padding: 7px 20px; font-size: 13.5px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border-radius: 6px;">
                        🌐 Website live ansehen ↗
                    </a>
                </div>
            </div>

            <!-- 2. Live System Status Bar -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 22px;">
                <!-- Stat 1: Konzerte -->
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; color: #777; font-weight: 600;">Konzerttermine</div>
                        <div style="font-size: 17px; font-weight: 700; color: #1d2327; margin-top: 2px;">
                            <?php echo $upcoming_count; ?> anstehend
                        </div>
                        <div style="font-size: 11px; color: #888; margin-top: 1px;"><?php echo $past_count; ?> in Konzertchronik</div>
                    </div>
                    <span style="font-size: 26px;">🗓️</span>
                </div>

                <!-- Stat 2: Posteingang -->
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; color: #777; font-weight: 600;">Posteingang</div>
                        <div style="font-size: 17px; font-weight: 700; color: <?php echo $unread_count > 0 ? '#2e7d32' : '#1d2327'; ?>; margin-top: 2px;">
                            <?php echo $unread_count; ?> neu ungelesen
                        </div>
                        <div style="font-size: 11px; color: #888; margin-top: 1px;"><?php echo $total_count; ?> Anfragen archiviert</div>
                    </div>
                    <span style="font-size: 26px;">📬</span>
                </div>

                <!-- Stat 3: Musik -->
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; color: #777; font-weight: 600;">Hintergrundmusik</div>
                        <div style="font-size: 14.5px; font-weight: 700; color: #1d2327; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px;">
                            <?php echo esc_html($audio_title); ?>
                        </div>
                        <div style="font-size: 11px; color: #888; margin-top: 1px;"><?php echo esc_html($audio_loop_text); ?></div>
                    </div>
                    <span style="font-size: 26px;">🎵</span>
                </div>

                <!-- Stat 4: Datenschutz & Sicherheit -->
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; color: #777; font-weight: 600;">Datenschutz (DSGVO)</div>
                        <div style="font-size: 14.5px; font-weight: 700; color: #2e7d32; margin-top: 2px;">
                            100% Sicher &amp; Lokal
                        </div>
                        <div style="font-size: 11px; color: #888; margin-top: 1px;">Kein Drittanbieter-Tracking</div>
                    </div>
                    <span style="font-size: 26px;">🛡️</span>
                </div>

                <!-- Stat 5: Plugin-Version & Updates -->
                <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 8px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.05em; color: #777; font-weight: 600;">System &amp; Updates</div>
                        <div style="font-size: 14.5px; font-weight: 700; color: #1d2327; margin-top: 2px;">
                            v<?php echo esc_html(OLLA_PODRIDA_VERSION); ?> (Aktiv)
                        </div>
                        <div style="font-size: 11px; color: #888; margin-top: 1px;">
                            <?php 
                            $auto_updates = (array) get_site_option('auto_update_plugins', []);
                            $is_auto = in_array('olla-podrida/olla-podrida.php', $auto_updates, true);
                            echo $is_auto ? '⚡ Auto-Updates aktiv' : 'Manuelle Updates';
                            ?>
                        </div>
                    </div>
                    <span style="font-size: 26px;">🔄</span>
                </div>
            </div>

            <!-- 3. Navigation & Actions Grid (6 Kacheln) -->
            <h3 style="font-size: 15px; font-weight: 700; color: #1d2327; margin: 0 0 12px 0; border-bottom: 1px solid #e5dfd5; padding-bottom: 6px;">
                🧭 Bereiche &amp; Schnelleinstieg
            </h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 14px; margin-bottom: 22px;">
                <!-- Kachel 1: Termine -->
                <div style="background: #ffffff; border: 1px solid #e0d8cc; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="font-size: 20px;">📅</span>
                            <strong style="font-size: 14.5px; color: #1d2327;">Konzerte &amp; Termine</strong>
                        </div>
                        <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #555; line-height: 1.45;">
                            Trage neue Auftritte und Konzerte ein, bearbeite Uhrzeit, Ort und Vorverkauf. Abgelaufene Termine wandern automatisch in die Chronik.
                        </p>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida&tab=events#new')); ?>" class="button button-primary" style="background: #e8a825; border-color: #cb8b10; color: #070202; font-weight: 700; font-size: 12px;">
                            + Neuer Termin
                        </a>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida&tab=events')); ?>" class="button" style="font-size: 12px;">
                            Alle Termine &rarr;
                        </a>
                    </div>
                </div>

                <!-- Kachel 2: Posteingang -->
                <div style="background: #ffffff; border: 1px solid #e0d8cc; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="font-size: 20px;">📬</span>
                            <strong style="font-size: 14.5px; color: #1d2327;">Posteingang &amp; Anfragen</strong>
                        </div>
                        <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #555; line-height: 1.45;">
                            Hier landen alle Nachrichten und Buchungsanfragen, die Besucher über das Webseitenformular senden. Du kannst sie direkt lesen und archivieren.
                        </p>
                    </div>
                    <div>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida&tab=contact')); ?>" class="button button-primary" style="background: <?php echo $unread_count > 0 ? '#2e7d32' : '#e8a825'; ?>; border-color: <?php echo $unread_count > 0 ? '#1b5e20' : '#cb8b10'; ?>; color: <?php echo $unread_count > 0 ? '#ffffff' : '#070202'; ?>; font-weight: 700; font-size: 12px;">
                            Posteingang öffnen (<?php echo $unread_count; ?> neu) &rarr;
                        </a>
                    </div>
                </div>

                <!-- Kachel 3: Musik -->
                <div style="background: #ffffff; border: 1px solid #e0d8cc; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="font-size: 20px;">🎵</span>
                            <strong style="font-size: 14.5px; color: #1d2327;">Musik &amp; Player</strong>
                        </div>
                        <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #555; line-height: 1.45;">
                            Tausche das Hintergrundlied für die Website bequem über die Mediathek aus, passe die Lautstärke an oder steuere den Endlos-Loop.
                        </p>
                    </div>
                    <div>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida&tab=audio')); ?>" class="button" style="border-color: #DAA520; color: #8a6508; font-weight: 600; font-size: 12px;">
                            Musik &amp; Player anpassen &rarr;
                        </a>
                    </div>
                </div>

                <!-- Kachel 4: Ensemble -->
                <div style="background: #ffffff; border: 1px solid #e0d8cc; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="font-size: 20px;">👥</span>
                            <strong style="font-size: 14.5px; color: #1d2327;">Ensemble &amp; Musiker</strong>
                        </div>
                        <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #555; line-height: 1.45;">
                            Pflege die Besetzung des Ensembles: Ändere Porträtfotos, Instrumentenlisten, biografische Texte oder die Positionierung der Musiker auf der Bühne.
                        </p>
                    </div>
                    <div>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida&tab=ensemble')); ?>" class="button" style="font-size: 12px;">
                            Ensemble bearbeiten &rarr;
                        </a>
                    </div>
                </div>

                <!-- Kachel 5: Presse -->
                <div style="background: #ffffff; border: 1px solid #e0d8cc; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="font-size: 20px;">📰</span>
                            <strong style="font-size: 14.5px; color: #1d2327;">Presse &amp; Medien</strong>
                        </div>
                        <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #555; line-height: 1.45;">
                            Stelle offizielle Pressemitteilungen, Logos und hochauflösende Fotodownloads für Veranstalter, Zeitungen und Redakteure bereit.
                        </p>
                    </div>
                    <div>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida&tab=press')); ?>" class="button" style="font-size: 12px;">
                            Pressebereich &rarr;
                        </a>
                    </div>
                </div>

                <!-- Kachel 6: Google Drive / Dokumente -->
                <div style="background: #fdfaf3; border: 1.5px solid #d4a954; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="font-size: 20px;">📁</span>
                            <strong style="font-size: 14.5px; color: #1d2327;"><?php echo esc_html($drive_title); ?></strong>
                        </div>
                        <p style="margin: 0 0 12px 0; font-size: 12.5px; color: #555; line-height: 1.45;">
                            <?php echo esc_html($drive_notes); ?>
                        </p>
                    </div>
                    <div>
                        <?php if (!empty($drive_url)): ?>
                            <a href="<?php echo esc_url($drive_url); ?>" target="_blank" rel="noopener noreferrer" class="button button-primary" style="background: #1a73e8; border-color: #1557b0; color: #ffffff; font-weight: 600; font-size: 12px;">
                                📂 Google Drive öffnen ↗
                            </a>
                        <?php else: ?>
                            <?php if ($is_admin): ?>
                                <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida&tab=settings#drive_section')); ?>" class="button" style="border-color: #DAA520; color: #8a6508; font-weight: 600; font-size: 11.5px;">
                                    ⚙️ Link in Einstellungen hinterlegen &rarr;
                                </a>
                            <?php else: ?>
                                <span style="font-size: 11.5px; color: #777; font-style: italic;">
                                    Noch kein Link hinterlegt. Wende Dich an Jan Dennis Brüning, um die Ablage zu verknüpfen.
                                </span>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Kachel 7: Plugin-Aktualisierung & Systemstatus (neben Google Drive, bis zu 2 Spalten breit) -->
                <div id="olla-cockpit-update-box" class="olla-cockpit-update-card" style="background: linear-gradient(135deg, #fdfbf7 0%, #f7f0df 100%); border: 1.5px solid #d4a954; border-radius: 10px; padding: 16px 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 8px rgba(218,165,32,0.12);">
                    <div>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 20px;">⚡</span>
                                <strong style="font-size: 14.5px; color: #1d2327;">Plugin-Aktualisierung &amp; Systemstatus</strong>
                            </div>
                            <span style="background: #251810; color: #FFD700; border: 1px solid #DAA520; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px;">
                                v<?php echo esc_html(OLLA_PODRIDA_VERSION); ?>
                            </span>
                        </div>
                        <p style="margin: 0 0 10px 0; font-size: 12.5px; color: #555; line-height: 1.45;">
                            Prüfe das System hier direkt auf neue Versionen. Liegt ein Update vor, verwandelt sich dieser Button automatisch und Du kannst es mit einem Klick sofort installieren.
                        </p>

                        <!-- Dynamic Notification Message Box -->
                        <div id="olla-cockpit-update-msg" style="display: none; padding: 10px 14px; border-radius: 6px; font-size: 12.5px; line-height: 1.4; margin-bottom: 12px;"></div>
                    </div>

                    <div style="padding-top: 10px; border-top: 1px solid rgba(218,165,32,0.25); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span id="olla-cockpit-update-spinner" class="spinner" style="float: none; margin: 0;"></span>
                            <!-- Der sich verwandelnde Hauptbutton -->
                            <button type="button" id="olla-cockpit-transform-btn" class="button button-primary" data-state="check" style="background: linear-gradient(135deg, #e8a825 0%, #cb8b10 100%); border-color: #b77908; color: #070202; font-weight: 700; font-size: 12.5px; padding: 5px 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.15); transition: all 0.2s ease;">
                                🔍 Nach neuen Updates suchen
                            </button>
                        </div>
                        <a href="<?php echo esc_url(admin_url('plugins.php')); ?>" class="button" style="font-size: 11.5px; color: #666;">
                            Plugins &rarr;
                        </a>
                    </div>
                </div>
            </div>

            <!-- 4. Praxistipps & Leitfaden -->
            <div style="background: #faf8f5; border: 1px solid #e5dfd5; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 16px;">💡</span>
                    <strong style="font-size: 13.5px; color: #1d2327;">Leitfaden &amp; Praxistipps für die Website-Pflege:</strong>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; font-size: 12px; color: #555; line-height: 1.45;">
                    <div>
                        <strong style="color: #1d2327;">🗓️ Automatische Chronik:</strong> Vergangene Konzerte müssen nicht gelöscht werden. Nach Ablauf von Datum und Uhrzeit wandern sie automatisch in die Konzertchronik.
                    </div>
                    <div>
                        <strong style="color: #1d2327;">🖼️ Bilder &amp; Porträts:</strong> Fotos können direkt über die WordPress-Mediathek hochgeladen und eingebunden werden.
                    </div>
                    <div>
                        <strong style="color: #1d2327;">🔒 100% DSGVO-konform:</strong> Alle Schriftarten, Audios und Medien laufen ohne externe Server oder US-CDNs – höchste Sicherheit für das Ensemble.
                    </div>
                </div>
            </div>

            <!-- 5. Footer & Support -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding-top: 12px; border-top: 1px solid #eee;">
                <div style="font-size: 12px; color: #646970;">
                    Design, Konzept &amp; Entwicklung: <strong>Jan Dennis Brüning</strong> · <a href="https://www.janbruening.de" target="_blank" rel="noopener noreferrer" style="color: #DAA520; text-decoration: none; font-weight: 600;">www.janbruening.de</a>
                </div>
                <div>
                    <a href="<?php echo esc_url($live_url); ?>" target="_blank" rel="noopener noreferrer" class="button button-primary" style="background: #e8a825; border-color: #cb8b10; color: #070202; font-weight: 700; font-size: 13px;">
                        🌐 Zur Live-Website ↗
                    </a>
                </div>
            </div>

        </div>
        <?php
    }

    public static function render_dashboard_contact_widget() {
        $counts = Olla_Podrida_Contact::get_message_counts();
        $contact_url = admin_url('admin.php?page=olla-podrida&tab=contact');
        ?>
        <div class="olla-dashboard-widget" style="padding: 4px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                <div>
                    <span style="font-size: 13px; font-weight: 600; color: #1d2327;">Eingegangene Nachrichten:</span>
                    <span style="background: <?php echo $counts['unread'] > 0 ? '#2e7d32' : '#e8a825'; ?>; color: <?php echo $counts['unread'] > 0 ? '#ffffff' : '#070202'; ?>; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 4px;">
                        <?php echo intval($counts['total']); ?>
                    </span>
                </div>
                <a href="<?php echo esc_url($contact_url); ?>" class="button button-small button-primary" style="background: #e8a825; border-color: #cb8b10; color: #070202; font-weight: 700;">
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
                <a href="<?php echo esc_url($events_url . '#new'); ?>" class="button button-small button-primary" style="background: #e8a825; border-color: #cb8b10; color: #070202; font-weight: 700;">
                    + Neuen Termin anlegen
                </a>
            </div>

            <?php if (empty($upcoming)): ?>
                <div style="text-align: center; padding: 16px 10px; background: #faf8f5; border-radius: 6px; border: 1px dashed #d5ccbe;">
                    <p style="color: #666; font-style: italic; margin: 0 0 8px 0; font-size: 12px;">Aktuell sind keine bevorstehenden Konzerte eingetragen.</p>
                    <a href="<?php echo esc_url($events_url . '#new'); ?>" class="button button-small button-primary" style="background: #e8a825; border-color: #cb8b10; color: #070202; font-weight: 700;">
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
                <span style="background: #e8a825; color: #070202; font-weight: 700; padding: 2px 8px; border-radius: 10px; font-size: 11px;">
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
