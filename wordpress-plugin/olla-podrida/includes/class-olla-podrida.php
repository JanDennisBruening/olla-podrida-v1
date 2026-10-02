<?php
if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida {

    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_hooks();
    }

    private function init_hooks() {
        add_action('init', ['Olla_Podrida_Roles', 'register_custom_roles']);
        add_action('rest_api_init', ['Olla_Podrida_Contact', 'register_routes']);
        add_action('admin_post_olla_podrida_export_messages_csv', ['Olla_Podrida_Contact', 'handle_export_csv']);
        add_action('admin_post_olla_podrida_print_messages_pdf', ['Olla_Podrida_Contact', 'handle_print_report']);

        // Inject favicon site-wide (frontend, admin, login) as long as plugin is active and enabled
        add_action('wp_head', [$this, 'inject_favicon'], 1);
        add_action('wp_head', [$this, 'inject_seo_meta'], 2);
        add_action('admin_head', [$this, 'inject_favicon'], 1);
        add_action('login_head', [$this, 'inject_favicon'], 1);
        add_filter('get_site_icon_url', [$this, 'filter_site_icon_url'], 99);
        add_filter('has_site_icon', [$this, 'filter_has_site_icon'], 99);

        // Security HTTP Headers (anti-sniffing, framing, referrer)
        add_action('send_headers', [$this, 'send_security_headers']);

        add_action('admin_init', [$this, 'maybe_run_auto_setup']);

        if (class_exists('Olla_Podrida_Audit')) {
            Olla_Podrida_Audit::init();
        }
        if (class_exists('Olla_Podrida_Updater')) {
            Olla_Podrida_Updater::init();
        }
        if (class_exists('Olla_Podrida_Admin')) {
            Olla_Podrida_Admin::init();
        }
        if (class_exists('Olla_Podrida_Frontend')) {
            Olla_Podrida_Frontend::init();
        }
        if (class_exists('Olla_Podrida_Import')) {
            Olla_Podrida_Import::init();
        }
        if (class_exists('Olla_Podrida_Consent')) {
            Olla_Podrida_Consent::init();
        }
    }

    /**
     * Outputs <link rel="icon"> pointing to the pure transparent pot logo (no background, no text).
     */
    public function inject_favicon() {
        $settings = Olla_Podrida_Settings::get_section('settings');
        if (isset($settings['favicon_enabled']) && empty($settings['favicon_enabled'])) {
            return;
        }

        $icon_url = !empty($settings['favicon_url']) 
            ? $settings['favicon_url'] 
            : (OLLA_PODRIDA_URL . 'assets/dist/images/Favicon-transparent.png?v=' . OLLA_PODRIDA_VERSION);
        $ico_url = OLLA_PODRIDA_URL . 'assets/dist/images/favicon.ico?v=' . OLLA_PODRIDA_VERSION;

        echo '<link rel="icon" type="image/x-icon" href="' . esc_url($ico_url) . '" />' . "\n";
        echo '<link rel="icon" type="image/png" sizes="32x32" href="' . esc_url($icon_url) . '" />' . "\n";
        echo '<link rel="icon" type="image/png" sizes="192x192" href="' . esc_url($icon_url) . '" />' . "\n";
        echo '<link rel="icon" type="image/png" sizes="512x512" href="' . esc_url($icon_url) . '" />' . "\n";
        echo '<link rel="shortcut icon" type="image/png" href="' . esc_url($icon_url) . '" />' . "\n";
        echo '<link rel="apple-touch-icon" href="' . esc_url($icon_url) . '" />' . "\n";
        echo '<meta name="msapplication-TileImage" content="' . esc_url($icon_url) . '" />' . "\n";
    }

    /**
     * Fallback for themes that check has_site_icon().
     */
    public function filter_has_site_icon($has_icon) {
        $settings = Olla_Podrida_Settings::get_section('settings');
        if (isset($settings['favicon_enabled']) && empty($settings['favicon_enabled'])) {
            return $has_icon;
        }
        return true;
    }

    /**
     * Fallback for themes that use get_site_icon_url().
     */
    public function filter_site_icon_url($url) {
        $settings = Olla_Podrida_Settings::get_section('settings');
        if (isset($settings['favicon_enabled']) && empty($settings['favicon_enabled'])) {
            return $url;
        }

        return !empty($settings['favicon_url']) 
            ? $settings['favicon_url'] 
            : (OLLA_PODRIDA_URL . 'assets/dist/images/Favicon-transparent.png?v=' . OLLA_PODRIDA_VERSION);
    }

    /**
     * Send robust HTTP security headers to protect against clickjacking, MIME sniffing, and referrer leaks.
     */
    public function send_security_headers() {
        if (!is_admin() && !headers_sent()) {
            header('X-Content-Type-Options: nosniff');
            header('X-Frame-Options: SAMEORIGIN');
            header('Referrer-Policy: strict-origin-when-cross-origin');
            header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
        }
    }

    /**
     * Output Google Search Console verification meta tag in wp_head if set.
     */
    public function inject_seo_meta() {
        $seo = Olla_Podrida_Settings::get_section('seo');
        if (!empty($seo['google_site_verification'])) {
            echo '<meta name="google-site-verification" content="' . esc_attr(trim($seo['google_site_verification'])) . '" />' . "\n";
        }
    }

    public static function activate() {
        // Register custom medieval roles
        if (class_exists('Olla_Podrida_Roles')) {
            Olla_Podrida_Roles::register_custom_roles();
        }

        // Create DB table for contact inquiries
        if (class_exists('Olla_Podrida_Contact')) {
            Olla_Podrida_Contact::create_table();
        }

        // Create DB table for cookie consent audit logs
        if (class_exists('Olla_Podrida_Consent')) {
            Olla_Podrida_Consent::create_table();
        }

        // Initialize default settings in wp_options if not present
        if (class_exists('Olla_Podrida_Settings')) {
            $defaults = Olla_Podrida_Settings::get_defaults();
            foreach ($defaults as $section => $data) {
                if (get_option('olla_podrida_' . $section) === false) {
                    update_option('olla_podrida_' . $section, $data);
                }
            }
        }

        // Automated Self-Setup for Canvas Page, Homepage, Permalinks and Rewrites
        self::run_auto_setup();
    }

    /**
     * Executes auto setup if the installed plugin version differs from current version
     */
    public function maybe_run_auto_setup() {
        $installed_ver = get_option('olla_podrida_installed_version', '');
        if ($installed_ver !== OLLA_PODRIDA_VERSION) {
            self::run_auto_setup();
        }
    }

    /**
     * Fully automated self-installation routine.
     * Ensures the Canvas Page exists, has canvas-page.php template assigned,
     * sets it as the static front page (if not already set), sets permalinks, and flushes rewrite rules.
     */
    public static function run_auto_setup() {
        // 0. Ensure database tables exist
        if (class_exists('Olla_Podrida_Contact')) {
            Olla_Podrida_Contact::ensure_table_exists();
        }
        if (class_exists('Olla_Podrida_Consent')) {
            Olla_Podrida_Consent::create_table();
        }

        // 1. Check or create the Canvas Page ("Ensemble Olla Podrida")
        $page_id = 0;
        $target_page = get_page_by_path('olla-podrida');
        if ($target_page && $target_page->post_status !== 'trash') {
            $page_id = $target_page->ID;
        }

        if (!$page_id) {
            $existing_pages = get_posts([
                'post_type'   => 'page',
                'post_status' => ['publish', 'draft', 'private'],
                'title'       => 'Ensemble Olla Podrida',
                'numberposts' => 1,
            ]);
            if (!empty($existing_pages)) {
                $page_id = $existing_pages[0]->ID;
            }
        }

        if (!$page_id) {
            $page_id = wp_insert_post([
                'post_title'     => 'Ensemble Olla Podrida',
                'post_name'      => 'olla-podrida',
                'post_status'    => 'publish',
                'post_type'      => 'page',
                'post_content'   => '[olla_podrida]',
                'comment_status' => 'closed',
                'ping_status'    => 'closed',
            ]);
        }

        if ($page_id && !is_wp_error($page_id)) {
            // Assign Canvas Page Template
            update_post_meta($page_id, '_wp_page_template', 'canvas-page.php');

            // Update display settings
            $display = get_option('olla_podrida_display', []);
            if (!is_array($display)) {
                $display = [];
            }
            $display['canvas_page_id'] = $page_id;
            $display['mode'] = 'canvas_page';
            if (!isset($display['preloader_enabled'])) {
                $display['preloader_enabled'] = true;
            }
            update_option('olla_podrida_display', $display);

            // Automatically set this page as static front page if default post archive is active or no front page is assigned
            $show_on_front = get_option('show_on_front');
            $current_front = intval(get_option('page_on_front'));
            if ($show_on_front !== 'page' || empty($current_front)) {
                update_option('show_on_front', 'page');
                update_option('page_on_front', $page_id);
            }
        }

        // Enable universal dominance in settings by default
        $settings = get_option('olla_podrida_settings', []);
        if (is_array($settings)) {
            $settings['universal_dominance'] = true;
            update_option('olla_podrida_settings', $settings);
        }

        // Set modern permalinks structure if plain/empty (?p=123)
        if (get_option('permalink_structure') === '') {
            update_option('permalink_structure', '/%postname%/');
        }

        // Register and flush rewrite rules so /login and /olla-podrida work immediately
        if (class_exists('Olla_Podrida_Frontend')) {
            Olla_Podrida_Frontend::register_rewrite_rules();
        }
        flush_rewrite_rules(false);

        update_option('olla_podrida_installed_version', OLLA_PODRIDA_VERSION);
    }

    public static function deactivate() {
        // Cleanup if needed
    }
}
