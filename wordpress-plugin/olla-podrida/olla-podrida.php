<?php
/**
 * Plugin Name: Ensemble Olla Podrida
 * Plugin URI: https://olla-podrida.de
 * Description: Eigenständige One-Page-Website & Content-Management-System für das Ensemble Olla Podrida (Klangvielfalt aus Mittelalter und Renaissance). Bietet eine theatralische Hero-Bühne, Pergament-Ensemble-Präsentation, Termine- und Konzertarchiv-Verwaltung, Kontaktformular mit Posteingang, konfigurierbaren Hintergrundmusik-Player und Rollen-Berechtigungssteuerung.
 * Version: 1.3.1
 * Requires at least: 5.8
 * Requires PHP: 7.4
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
define('OLLA_PODRIDA_VERSION', '1.3.1');
define('OLLA_PODRIDA_FILE', __FILE__);
define('OLLA_PODRIDA_PATH', plugin_dir_path(__FILE__));
define('OLLA_PODRIDA_URL', plugin_dir_url(__FILE__));

// Require Core Classes
$olla_required_files = [
    'includes/class-settings.php',
    'includes/class-roles.php',
    'includes/class-events.php',
    'includes/class-contact.php',
    'includes/class-import.php',
    'includes/class-consent.php',
    'includes/class-admin.php',
    'includes/class-frontend.php',
    'includes/class-olla-podrida.php',
];
foreach ($olla_required_files as $olla_file) {
    $olla_path = OLLA_PODRIDA_PATH . $olla_file;
    if (file_exists($olla_path)) {
        require_once $olla_path;
    }
}

// Activation and Deactivation Hooks
register_activation_hook(__FILE__, ['Olla_Podrida', 'activate']);
register_deactivation_hook(__FILE__, ['Olla_Podrida', 'deactivate']);

// Initialize Plugin
function olla_podrida_init() {
    return Olla_Podrida::get_instance();
}
add_action('plugins_loaded', 'olla_podrida_init');
