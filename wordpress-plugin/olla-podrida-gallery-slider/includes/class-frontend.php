<?php
if (!defined('ABSPATH')) {
    exit;
}

class OP_Gallery_Frontend {

    public static function init() {
        add_shortcode('olla_podrida_gallery_slider', [__CLASS__, 'render_shortcode']);
        add_shortcode('olla_gallery_slider', [__CLASS__, 'render_shortcode']);
        add_filter('template_include', [__CLASS__, 'intercept_canvas_template'], 99);
    }

    /**
     * Create or restore the default gallery subpage
     */
    public static function create_default_page($force_recreate = false) {
        $settings = OP_Gallery_Settings::get_settings();
        $page_id = $settings['page_id'];

        if (!$force_recreate && $page_id && get_post_status($page_id)) {
            return $page_id;
        }

        // Search by path/slug
        $target_slug = !empty($settings['page_slug']) ? $settings['page_slug'] : 'galerie-olla-podrida';
        $existing = get_page_by_path($target_slug);

        if (!$force_recreate && $existing && $existing->post_status !== 'trash') {
            $settings['page_id'] = $existing->ID;
            OP_Gallery_Settings::update_settings($settings);
            return $existing->ID;
        }

        // Create new page
        $new_page_id = wp_insert_post([
            'post_title'     => !empty($settings['page_title']) ? $settings['page_title'] : 'Galerie Olla Podrida',
            'post_name'      => $target_slug,
            'post_status'    => 'publish',
            'post_type'      => 'page',
            'post_content'   => '[olla_podrida_gallery_slider]',
            'comment_status' => 'closed',
            'ping_status'    => 'closed',
        ]);

        if ($new_page_id && !is_wp_error($new_page_id)) {
            $settings['page_id'] = $new_page_id;
            OP_Gallery_Settings::update_settings($settings);
            flush_rewrite_rules();
            return $new_page_id;
        }

        return 0;
    }

    /**
     * Checks if current query is the dedicated gallery subpage
     */
    public static function is_gallery_page() {
        if (!is_page()) {
            return false;
        }

        $settings = OP_Gallery_Settings::get_settings();
        if (!empty($settings['page_id']) && is_page($settings['page_id'])) {
            return true;
        }

        $target_slug = !empty($settings['page_slug']) ? $settings['page_slug'] : 'galerie-olla-podrida';
        if (is_page($target_slug)) {
            return true;
        }

        return false;
    }

    /**
     * Intercept template if display_mode is 'canvas'
     */
    public static function intercept_canvas_template($template) {
        if (self::is_gallery_page()) {
            $settings = OP_Gallery_Settings::get_settings();
            if ($settings['display_mode'] === 'canvas') {
                self::enqueue_assets();
                $canvas_file = OP_GALLERY_PATH . 'templates/canvas-gallery.php';
                if (file_exists($canvas_file)) {
                    return $canvas_file;
                }
            }
        }
        return $template;
    }

    /**
     * Enqueue the compiled React & Tailwind CSS assets
     */
    public static function enqueue_assets() {
        // Enqueue Google Fonts
        wp_enqueue_style(
            'op-gallery-google-fonts',
            'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap',
            [],
            null
        );

        // Enqueue Compiled Tailwind 4 CSS
        wp_enqueue_style(
            'op-gallery-app-css',
            OP_GALLERY_URL . 'assets/css/gallery.css',
            ['op-gallery-google-fonts'],
            OP_GALLERY_VERSION
        );

        // Enqueue Compiled React 19 Bundle (ES Module)
        wp_enqueue_script(
            'op-gallery-app-js',
            OP_GALLERY_URL . 'assets/js/gallery.js',
            [],
            OP_GALLERY_VERSION,
            true
        );

        // Add type="module" to script tag for Vite build
        add_filter('script_loader_tag', function ($tag, $handle, $src) {
            if ($handle === 'op-gallery-app-js') {
                return '<script type="module" crossorigin src="' . esc_url($src) . '"></script>' . "\n";
            }
            return $tag;
        }, 10, 3);
    }

    /**
     * Render Shortcode container for mounting React
     */
    public static function render_shortcode($atts = []) {
        self::enqueue_assets();
        $musicians = OP_Gallery_Musicians::get_all(true);
        $settings = OP_Gallery_Settings::get_settings();

        $data_json = wp_json_encode($musicians);
        $settings_json = wp_json_encode($settings);

        return '<script>window.__OP_INITIAL_MEMBERS__ = ' . $data_json . '; window.__OP_SETTINGS__ = ' . $settings_json . ';</script>'
             . '<div id="root" class="op-gallery-container w-full min-h-screen"></div>';
    }
}
