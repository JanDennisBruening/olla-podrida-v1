<?php
if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Events {

    public static function get_all_events() {
        $events = get_option('olla_podrida_events', null);
        if ($events === null) {
            $defaults = Olla_Podrida_Settings::get_defaults();
            $events = $defaults['events'];
            update_option('olla_podrida_events', $events);
        }
        return is_array($events) ? $events : [];
    }

    public static function save_events(array $events) {
        return update_option('olla_podrida_events', $events);
    }

    public static function get_event_by_id($id) {
        $events = self::get_all_events();
        foreach ($events as $event) {
            if ($event['id'] === $id) {
                return $event;
            }
        }
        return null;
    }

    public static function add_or_update_event(array $event_data) {
        $events = self::get_all_events();
        $id = !empty($event_data['id']) ? sanitize_key($event_data['id']) : sanitize_title($event_data['title']) . '-' . time();

        $clean_event = [
            'id' => $id,
            'title' => sanitize_text_field($event_data['title'] ?? ''),
            'category' => sanitize_text_field($event_data['category'] ?? 'Konzert'),
            'date' => sanitize_text_field($event_data['date'] ?? ''),
            'time' => sanitize_text_field($event_data['time'] ?? ''),
            'location' => sanitize_text_field($event_data['location'] ?? ''),
            'city' => sanitize_text_field($event_data['city'] ?? ''),
            'description' => wp_kses_post($event_data['description'] ?? ''),
            'link' => esc_url_raw($event_data['link'] ?? ''),
            'image_url' => esc_url_raw($event_data['image_url'] ?? ''),
            'is_upcoming' => !empty($event_data['is_upcoming']),
            'ticket_info' => sanitize_text_field($event_data['ticket_info'] ?? ''),
        ];

        $found = false;
        foreach ($events as $key => $existing) {
            if ($existing['id'] === $id) {
                $events[$key] = $clean_event;
                $found = true;
                break;
            }
        }

        if (!$found) {
            array_unshift($events, $clean_event);
        }

        self::save_events($events);
        return $clean_event;
    }

    public static function delete_event($id) {
        $events = self::get_all_events();
        $filtered = array_values(array_filter($events, function($e) use ($id) {
            return $e['id'] !== $id;
        }));
        return self::save_events($filtered);
    }

    public static function toggle_status($id) {
        $events = self::get_all_events();
        foreach ($events as &$event) {
            if ($event['id'] === $id) {
                $event['is_upcoming'] = !$event['is_upcoming'];
                break;
            }
        }
        return self::save_events($events);
    }
}
