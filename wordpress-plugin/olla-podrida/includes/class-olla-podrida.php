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

        // Inject favicon site-wide (frontend, admin, login) as long as plugin is active and enabled
        add_action('wp_head', [$this, 'inject_favicon'], 1);
        add_action('admin_head', [$this, 'inject_favicon'], 1);
        add_action('login_head', [$this, 'inject_favicon'], 1);
        add_filter('get_site_icon_url', [$this, 'filter_site_icon_url'], 99);
        add_filter('has_site_icon', [$this, 'filter_has_site_icon'], 99);

        Olla_Podrida_Admin::init();
        Olla_Podrida_Frontend::init();
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

    public static function activate() {
        // Register custom medieval roles
        Olla_Podrida_Roles::register_custom_roles();

        // Create DB table for contact inquiries
        Olla_Podrida_Contact::create_table();

        // Initialize default settings in wp_options if not present
        $defaults = Olla_Podrida_Settings::get_defaults();
        foreach ($defaults as $section => $data) {
            if (get_option('olla_podrida_' . $section) === false) {
                update_option('olla_podrida_' . $section, $data);
            }
        }
    }

    public static function deactivate() {
        // Cleanup if needed
    }
}
