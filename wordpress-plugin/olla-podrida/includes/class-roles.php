<?php
if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Roles {

    /**
     * All controllable sections within the plugin.
     */
    public static function get_all_sections() {
        return [
            'hero'     => ['label' => 'Start & Hero-Bühne',        'icon' => 'dashicons-format-image'],
            'ensemble' => ['label' => 'Ensemble & Musiker',         'icon' => 'dashicons-groups'],
            'events'   => ['label' => 'Termine & Konzerte',         'icon' => 'dashicons-calendar-alt'],
            'contact'  => ['label' => 'Kontakt & Postfach',         'icon' => 'dashicons-email-alt'],
            'audio'    => ['label' => 'Hintergrundmusik & Player',  'icon' => 'dashicons-format-audio'],
            'press'    => ['label' => 'Presse & Medienmaterial',    'icon' => 'dashicons-format-gallery'],
            'legal'    => ['label' => 'Rechtliches & Footer',       'icon' => 'dashicons-shield'],
            'display'  => ['label' => 'Einbindung & Ausspielung',   'icon' => 'dashicons-admin-generic'],
            'roles'    => ['label' => 'Rollen & Berechtigungen',    'icon' => 'dashicons-admin-users'],
        ];
    }

    /**
     * Retrieve all roles registered in this WordPress installation.
     */
    public static function get_all_wp_roles() {
        if (!function_exists('wp_roles')) {
            return [];
        }
        $wp_roles = wp_roles();
        return $wp_roles ? $wp_roles->get_names() : [];
    }

    /**
     * Get allowed sections configured for a specific role slug.
     */
    public static function get_sections_for_role($role_slug) {
        if ($role_slug === 'administrator') {
            return array_keys(self::get_all_sections());
        }

        $roles_config = Olla_Podrida_Settings::get_section('roles');
        
        // Check new universal structure: $roles_config['roles_permissions'][$role_slug]
        if (isset($roles_config['roles_permissions'][$role_slug]) && is_array($roles_config['roles_permissions'][$role_slug])) {
            return $roles_config['roles_permissions'][$role_slug];
        }

        // Backwards compatibility with legacy keys
        if ($role_slug === 'editor' && !empty($roles_config['editor_sections'])) {
            return (array) $roles_config['editor_sections'];
        }
        if ($role_slug === 'author' && !empty($roles_config['author_sections'])) {
            return (array) $roles_config['author_sections'];
        }

        return [];
    }

    /**
     * Check if current user has access to the main plugin menu.
     */
    public static function can_user_access_menu() {
        if (!is_user_logged_in()) {
            return false;
        }

        if (current_user_can('manage_options')) {
            return true;
        }

        $user = wp_get_current_user();
        foreach ((array) $user->roles as $role) {
            $sections = self::get_sections_for_role($role);
            if (!empty($sections)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if current user can manage a specific section.
     */
    public static function can_user_manage_section($section) {
        if (!is_user_logged_in()) {
            return false;
        }

        if (current_user_can('manage_options')) {
            return true;
        }

        // 'roles' section is strictly restricted to administrators
        if ($section === 'roles') {
            return false;
        }

        $user = wp_get_current_user();
        foreach ((array) $user->roles as $role) {
            $allowed = self::get_sections_for_role($role);
            if (in_array($section, $allowed, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get union of all allowed sections for the currently logged in user.
     */
    public static function get_allowed_sections_for_current_user() {
        $all_sections = array_keys(self::get_all_sections());

        if (current_user_can('manage_options')) {
            return $all_sections;
        }

        $user = wp_get_current_user();
        $allowed = [];

        foreach ((array) $user->roles as $role) {
            $role_allowed = self::get_sections_for_role($role);
            $allowed = array_merge($allowed, $role_allowed);
        }

        // Unique and only valid sections, excluding 'roles' for non-admins
        $allowed = array_unique($allowed);
        $allowed = array_intersect($allowed, $all_sections);
        $allowed = array_diff($allowed, ['roles']);

        return array_values($allowed);
    }
}
