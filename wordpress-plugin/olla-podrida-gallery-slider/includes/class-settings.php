<?php
if (!defined('ABSPATH')) {
    exit;
}

class OP_Gallery_Settings {

    const OPTION_NAME = 'op_gallery_settings';

    /**
     * Get default settings for the gallery page & slider concept
     */
    public static function get_defaults() {
        return [
            'page_id'              => 0,
            'page_slug'            => 'galerie-olla-podrida',
            'page_title'           => 'Galerie Olla Podrida',
            'display_mode'         => 'canvas', // 'canvas' (fullscreen immersive) or 'theme' (embedded in theme)
            'back_link_url'        => home_url('/'),
            'back_link_text'       => 'Zurück zur Website',
            'autoplay_default'     => 1,
            'default_speed'        => 5000, // milliseconds
            'pause_on_hover'       => 1,
            'show_lighting_studio' => 1, // allow visitors to access lighting & atmosphere controls
            'sound_enabled'        => 1, // enable Web Audio synthesize / audio preview button
            'header_title'         => 'Olla Podrida',
            'header_subtitle'      => 'Historisches Musiker-Ensemble',
        ];
    }

    /**
     * Get all settings merged with defaults
     */
    public static function get_settings() {
        $saved = get_option(self::OPTION_NAME, []);
        $defaults = self::get_defaults();
        return wp_parse_args(is_array($saved) ? $saved : [], $defaults);
    }

    /**
     * Get a specific setting value
     */
    public static function get($key, $default = null) {
        $settings = self::get_settings();
        return isset($settings[$key]) ? $settings[$key] : $default;
    }

    /**
     * Update settings with sanitization
     */
    public static function update_settings($input) {
        $defaults = self::get_defaults();
        $clean = [];

        $clean['page_id']              = isset($input['page_id']) ? absint($input['page_id']) : 0;
        $clean['page_slug']            = isset($input['page_slug']) ? sanitize_title($input['page_slug']) : $defaults['page_slug'];
        $clean['page_title']           = isset($input['page_title']) ? sanitize_text_field($input['page_title']) : $defaults['page_title'];
        $clean['display_mode']         = (isset($input['display_mode']) && $input['display_mode'] === 'theme') ? 'theme' : 'canvas';
        $clean['back_link_url']        = isset($input['back_link_url']) ? esc_url_raw($input['back_link_url']) : $defaults['back_link_url'];
        $clean['back_link_text']       = isset($input['back_link_text']) ? sanitize_text_field($input['back_link_text']) : $defaults['back_link_text'];
        $clean['autoplay_default']     = !empty($input['autoplay_default']) ? 1 : 0;
        $clean['default_speed']        = isset($input['default_speed']) ? max(1000, absint($input['default_speed'])) : 5000;
        $clean['pause_on_hover']       = !empty($input['pause_on_hover']) ? 1 : 0;
        $clean['show_lighting_studio'] = !empty($input['show_lighting_studio']) ? 1 : 0;
        $clean['sound_enabled']        = !empty($input['sound_enabled']) ? 1 : 0;
        $clean['header_title']         = isset($input['header_title']) ? sanitize_text_field($input['header_title']) : $defaults['header_title'];
        $clean['header_subtitle']      = isset($input['header_subtitle']) ? sanitize_text_field($input['header_subtitle']) : $defaults['header_subtitle'];

        update_option(self::OPTION_NAME, $clean);
        return $clean;
    }

    /**
     * Initialize defaults if not already present
     */
    public static function init_defaults() {
        if (get_option(self::OPTION_NAME) === false) {
            update_option(self::OPTION_NAME, self::get_defaults());
        }
    }
}
