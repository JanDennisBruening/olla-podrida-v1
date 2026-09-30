<?php
/**
 * Plugin Name: Ensemble Olla Podrida
 * Plugin URI: https://olla-podrida.de
 * Description: Eigenständige One-Page-Website & Content-Management-System für das Ensemble Olla Podrida (Klangvielfalt aus Mittelalter und Renaissance). Bietet eine theatralische Hero-Bühne, Pergament-Ensemble-Präsentation, Termine- und Konzertarchiv-Verwaltung, Kontaktformular mit Posteingang, konfigurierbaren Hintergrundmusik-Player und Rollen-Berechtigungssteuerung.
 * Version: 1.2.2
 * Author: Jan Dennis Brüning
 * Author URI: https://janbruening.de
 * License: GPL v2 or later
 * Text Domain: olla-podrida
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define Plugin Constants
define('OLLA_PODRIDA_VERSION', '1.2.2');
define('OLLA_PODRIDA_FILE', __FILE__);
define('OLLA_PODRIDA_PATH', plugin_dir_path(__FILE__));
define('OLLA_PODRIDA_URL', plugin_dir_url(__FILE__));

// Require Core Classes
require_once OLLA_PODRIDA_PATH . 'includes/class-settings.php';
require_once OLLA_PODRIDA_PATH . 'includes/class-roles.php';
require_once OLLA_PODRIDA_PATH . 'includes/class-events.php';
require_once OLLA_PODRIDA_PATH . 'includes/class-contact.php';
require_once OLLA_PODRIDA_PATH . 'includes/class-import.php';
require_once OLLA_PODRIDA_PATH . 'includes/class-admin.php';
require_once OLLA_PODRIDA_PATH . 'includes/class-frontend.php';
require_once OLLA_PODRIDA_PATH . 'includes/class-olla-podrida.php';

// Activation and Deactivation Hooks
register_activation_hook(__FILE__, ['Olla_Podrida', 'activate']);
register_deactivation_hook(__FILE__, ['Olla_Podrida', 'deactivate']);

// Initialize Plugin
function olla_podrida_init() {
    return Olla_Podrida::get_instance();
}
add_action('plugins_loaded', 'olla_podrida_init');
