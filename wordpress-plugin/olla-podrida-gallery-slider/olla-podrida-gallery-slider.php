<?php
/**
 * Plugin Name: Olla Podrida – Artwork Gallery Slider
 * Plugin URI: https://github.com/JanDennisBruening/gallery-slider-olla-podrida-v1
 * Description: Unabhängiges Galerie-Slider-Plugin für das historische Musiker-Ensemble Olla Podrida. Bietet theatralische Vollbild-Präsentation, Musiker-CRUD im Backend mit WordPress-Mediathek, interaktive Lichtregie, Audio-Hörproben und automatische Unterseiten-Initialisierung.
 * Version: 1.0.0
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author: Jan Dennis Brüning
 * Author URI: https://janbruening.de
 * License: GPL v2 or later
 * Text Domain: olla-podrida-gallery
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OP_GALLERY_VERSION', '1.0.0');
define('OP_GALLERY_FILE', __FILE__);
define('OP_GALLERY_PATH', plugin_dir_path(__FILE__));
define('OP_GALLERY_URL', plugin_dir_url(__FILE__));

// Require Core Files
require_once OP_GALLERY_PATH . 'includes/class-settings.php';
require_once OP_GALLERY_PATH . 'includes/class-musicians.php';
require_once OP_GALLERY_PATH . 'includes/class-admin.php';
require_once OP_GALLERY_PATH . 'includes/class-frontend.php';

/**
 * Activation Hook: Setup defaults and create dedicated subpage
 */
function op_gallery_activate() {
    OP_Gallery_Settings::init_defaults();
    OP_Gallery_Musicians::init_defaults();
    OP_Gallery_Frontend::create_default_page();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'op_gallery_activate');

/**
 * Deactivation Hook: Clean up rewrites without deleting user data
 */
function op_gallery_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'op_gallery_deactivate');

/**
 * Initialize Plugin Components
 */
function op_gallery_init() {
    if (is_admin()) {
        OP_Gallery_Admin::init();
    }
    OP_Gallery_Frontend::init();
}
add_action('plugins_loaded', 'op_gallery_init');
