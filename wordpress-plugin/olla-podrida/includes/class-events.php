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
        if (!is_array($events)) {
            $events = [];
        }
        foreach ($events as &$ev) {
            if (!isset($ev['badge_music'])) {
                $ev['badge_music'] = '🎵 Historische Musik der Renaissance & des Mittelalters';
            }
            if (!isset($ev['badge_music_show'])) {
                $ev['badge_music_show'] = true;
            }
            if (!isset($ev['badge_seating'])) {
                $ev['badge_seating'] = '🏛️ Freie Platzwahl vor Ort';
            }
            if (!isset($ev['badge_seating_show'])) {
                $ev['badge_seating_show'] = true;
            }
            if (!isset($ev['badge_admission'])) {
                $ev['badge_admission'] = '📜 Eintritt frei / Spende erbeten';
            }
            if (!isset($ev['badge_admission_show'])) {
                $ev['badge_admission_show'] = true;
            }
        }
        return $events;
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
            'contact_registration' => sanitize_text_field($event_data['contact_registration'] ?? ''),
            'badge_music' => sanitize_text_field($event_data['badge_music'] ?? '🎵 Historische Musik der Renaissance & des Mittelalters'),
            'badge_music_show' => filter_var($event_data['badge_music_show'] ?? true, FILTER_VALIDATE_BOOLEAN),
            'badge_seating' => sanitize_text_field($event_data['badge_seating'] ?? '🏛️ Freie Platzwahl vor Ort'),
            'badge_seating_show' => filter_var($event_data['badge_seating_show'] ?? true, FILTER_VALIDATE_BOOLEAN),
            'badge_admission' => sanitize_text_field($event_data['badge_admission'] ?? '📜 Eintritt frei / Spende erbeten'),
            'badge_admission_show' => filter_var($event_data['badge_admission_show'] ?? true, FILTER_VALIDATE_BOOLEAN),
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

        if (class_exists('Olla_Podrida_Audit')) {
            $act = $found ? 'Konzerttermin aktualisiert' : 'Neuer Konzerttermin erstellt';
            $details = "Titel: '{$clean_event['title']}' · Datum: {$clean_event['date']} ({$clean_event['time']}) · Ort: {$clean_event['location']}";
            Olla_Podrida_Audit::log('event', $act, $details);
        }

        return $clean_event;
    }

    public static function is_event_expired($event) {
        $date_str = trim($event['date'] ?? '');
        if (empty($date_str)) {
            return false;
        }

        $day = 0; $month = 0; $year = 0;
        $dot_parts = explode('.', $date_str);
        if (count($dot_parts) === 3) {
            $day = intval($dot_parts[0]);
            $month = intval($dot_parts[1]);
            $year = intval($dot_parts[2]);
        } else {
            $dash_parts = explode('-', $date_str);
            if (count($dash_parts) === 3) {
                $year = intval($dash_parts[0]);
                $month = intval($dash_parts[1]);
                $day = intval($dash_parts[2]);
            }
        }

        if (!$year || !$month || !$day) {
            return false;
        }

        $hour = 23;
        $minute = 59;
        $time_str = trim($event['time'] ?? '');
        if (!empty($time_str) && preg_match('/(\d{1,2})[:.](\d{2})/', $time_str, $matches)) {
            $hour = intval($matches[1]);
            $minute = intval($matches[2]);
        }

        $event_ts = mktime($hour, $minute, 0, $month, $day, $year);
        $current_ts = current_time('timestamp');
        return ($event_ts !== false && $event_ts < $current_ts);
    }

    public static function delete_event($id) {
        $events = self::get_all_events();
        $target_title = $id;
        foreach ($events as $e) {
            if ($e['id'] === $id) {
                $target_title = $e['title'];
                break;
            }
        }
        $filtered = array_values(array_filter($events, function($e) use ($id) {
            return $e['id'] !== $id;
        }));
        $res = self::save_events($filtered);

        if ($res && class_exists('Olla_Podrida_Audit')) {
            Olla_Podrida_Audit::log('event', 'Konzerttermin gelöscht', "Titel: '{$target_title}' (ID: {$id})");
        }
        return $res;
    }

    public static function toggle_status($id) {
        $events = self::get_all_events();
        $target_title = $id;
        $new_status = false;
        foreach ($events as &$event) {
            if ($event['id'] === $id) {
                $event['is_upcoming'] = !$event['is_upcoming'];
                $target_title = $event['title'];
                $new_status = $event['is_upcoming'];
                break;
            }
        }
        $res = self::save_events($events);
        if ($res && class_exists('Olla_Podrida_Audit')) {
            $status_str = $new_status ? 'Aktiv (anstehend)' : 'In die Chronik verschoben';
            Olla_Podrida_Audit::log('event', 'Termin-Status geändert', "Titel: '{$target_title}' · Neuer Status: {$status_str}");
        }
        return $res;
    }
}
