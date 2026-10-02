<?php
if (!defined('ABSPATH')) {
    exit;
}

class OP_Gallery_Musicians {

    const OPTION_NAME = 'op_gallery_musicians';

    /**
     * Default list of 7 ensemble portraits with authentic quotes, instruments, lighting & audio presets
     */
    public static function get_defaults() {
        return [
            [
                'id'                 => 'klemens',
                'name'               => 'Klemens',
                'subtitle'           => 'Der Puls des Ensembles',
                'instrument'         => 'Große Landsknechtstrommel',
                'role'               => 'Schlagwerk & Rhythmus',
                'quote'              => '„Ein kräftiger Trommelschlag lässt das Herz im Takte alter Reigen schlagen.“',
                'image_id'           => 0,
                'image_url'          => '',
                'default_asset'      => 'klemens.webp',
                'lighting_color'     => '#e0a96d',
                'lighting_intensity' => 45,
                'lighting_blur'      => 32,
                'lighting_ambient'   => 35,
                'lighting_pulse'     => 0,
                'sound_type'         => 'drum',
                'sound_freq'         => 75,
                'custom_audio_id'    => 0,
                'custom_audio_url'   => '',
            ],
            [
                'id'                 => 'lutz',
                'name'               => 'Lutz',
                'subtitle'           => 'Klangmagier der Obertöne',
                'instrument'         => 'Streichpsalter & Zupfsaiten',
                'role'               => 'Saitenklang & Melodie',
                'quote'              => '„Zwischen Bogenstrich und schwebendem Ton liegt der Hauch vergangener Jahrhunderte.“',
                'image_id'           => 0,
                'image_url'          => '',
                'default_asset'      => 'lutz.png',
                'lighting_color'     => '#d4af37',
                'lighting_intensity' => 50,
                'lighting_blur'      => 35,
                'lighting_ambient'   => 40,
                'lighting_pulse'     => 0,
                'sound_type'         => 'psalter',
                'sound_freq'         => 440,
                'custom_audio_id'    => 0,
                'custom_audio_url'   => '',
            ],
            [
                'id'                 => 'ruth',
                'name'               => 'Ruth',
                'subtitle'           => 'Hüterin der Bordunklänge',
                'instrument'         => 'Historische Drehleier',
                'role'               => 'Bordunfundament & Melodik',
                'quote'              => '„Wenn das Rad sich dreht und die Schnarre schnarrt, erwacht die Taverne zum Leben.“',
                'image_id'           => 0,
                'image_url'          => '',
                'default_asset'      => 'ruth.webp',
                'lighting_color'     => '#3b82f6',
                'lighting_intensity' => 45,
                'lighting_blur'      => 32,
                'lighting_ambient'   => 35,
                'lighting_pulse'     => 0,
                'sound_type'         => 'hurdygurdy',
                'sound_freq'         => 220,
                'custom_audio_id'    => 0,
                'custom_audio_url'   => '',
            ],
            [
                'id'                 => 'sandra',
                'name'               => 'Sandra',
                'subtitle'           => 'Stimme des Minnesangs',
                'instrument'         => 'Renaissance-Laute & Gesang',
                'role'               => 'Gesang & Harmoniebegleitung',
                'quote'              => '„Ein Lied vermag mehr über alte Zeiten zu erzählen als tausend staubige Pergamente.“',
                'image_id'           => 0,
                'image_url'          => '',
                'default_asset'      => 'sandra.webp',
                'lighting_color'     => '#f59e0b',
                'lighting_intensity' => 55,
                'lighting_blur'      => 36,
                'lighting_ambient'   => 42,
                'lighting_pulse'     => 0,
                'sound_type'         => 'lute',
                'sound_freq'         => 330,
                'custom_audio_id'    => 0,
                'custom_audio_url'   => '',
            ],
            [
                'id'                 => 'silke',
                'name'               => 'Silke',
                'subtitle'           => 'Saitenkraft der Tiefe & Atem der Weite',
                'instrument'         => 'Historische Bassfidel & Sackpfeife',
                'role'               => 'Streicherfundament & Festliche Weckrufe',
                'quote'              => '„Die tiefen Saiten geben der Musik Halt und Wärme – wie der Stamm einer alten Eiche.“',
                'image_id'           => 0,
                'image_url'          => '',
                'default_asset'      => 'silke.webp',
                'lighting_color'     => '#0d9488',
                'lighting_intensity' => 50,
                'lighting_blur'      => 34,
                'lighting_ambient'   => 38,
                'lighting_pulse'     => 0,
                'sound_type'         => 'bagpipe',
                'sound_freq'         => 293.66,
                'custom_audio_id'    => 0,
                'custom_audio_url'   => '',
            ],
            [
                'id'                 => 'simone',
                'name'               => 'Simone',
                'subtitle'           => 'Die Melodien-Vagantin',
                'instrument'         => 'Historische Flöten & Schalmei',
                'role'               => 'Blasinstrumente & feine Perkussion',
                'quote'              => '„Die Flöte ist wie der Vogel im Geäst – flink, frei und voller Lebensfreude.“',
                'image_id'           => 0,
                'image_url'          => '',
                'default_asset'      => 'simone.webp',
                'lighting_color'     => '#10b981',
                'lighting_intensity' => 45,
                'lighting_blur'      => 30,
                'lighting_ambient'   => 35,
                'lighting_pulse'     => 0,
                'sound_type'         => 'flute',
                'sound_freq'         => 587.33,
                'custom_audio_id'    => 0,
                'custom_audio_url'   => '',
            ],
            [
                'id'                 => 'susanne',
                'name'               => 'Susanne',
                'subtitle'           => 'Die Flamme des Tanzes',
                'instrument'         => 'Historischer Tanz & Schellenring',
                'role'               => 'Tanz, Bewegung & Schellenrhythmus',
                'quote'              => '„Musik wird erst dann wahrhaft sichtbar, wenn sie sich im Schwung eines Gewandes dreht.“',
                'image_id'           => 0,
                'image_url'          => '',
                'default_asset'      => 'susanne.webp',
                'lighting_color'     => '#e11d48',
                'lighting_intensity' => 55,
                'lighting_blur'      => 35,
                'lighting_ambient'   => 40,
                'lighting_pulse'     => 1,
                'sound_type'         => 'jingle',
                'sound_freq'         => 880,
                'custom_audio_id'    => 0,
                'custom_audio_url'   => '',
            ],
        ];
    }

    /**
     * Get all musicians, resolved with fallback URLs if no custom media is attached
     */
    public static function get_all($resolve_urls = true) {
        $saved = get_option(self::OPTION_NAME, null);
        if ($saved === null) {
            $saved = self::get_defaults();
            update_option(self::OPTION_NAME, $saved);
        }

        if (!is_array($saved)) {
            $saved = [];
        }

        if ($resolve_urls) {
            foreach ($saved as &$m) {
                // If attachment ID exists, fetch URL from WP
                if (!empty($m['image_id'])) {
                    $src = wp_get_attachment_image_url($m['image_id'], 'full');
                    if ($src) {
                        $m['image_url'] = $src;
                    }
                }

                // If still empty and default asset exists, use bundled image
                if (empty($m['image_url']) && !empty($m['default_asset'])) {
                    $m['image_url'] = OP_GALLERY_URL . 'assets/images/' . $m['default_asset'];
                }

                // Custom audio file resolution
                if (!empty($m['custom_audio_id'])) {
                    $audio_src = wp_get_attachment_url($m['custom_audio_id']);
                    if ($audio_src) {
                        $m['custom_audio_url'] = $audio_src;
                    }
                }
            }
            unset($m);
        }

        return $saved;
    }

    /**
     * Get single musician by ID
     */
    public static function get($id) {
        $all = self::get_all(true);
        foreach ($all as $m) {
            if ($m['id'] === $id) {
                return $m;
            }
        }
        return null;
    }

    /**
     * Save/Update a musician
     */
    public static function save($data) {
        $all = self::get_all(false);
        $id = !empty($data['id']) ? sanitize_key($data['id']) : sanitize_title($data['name']);

        if (empty($id)) {
            $id = 'musiker_' . time();
        }

        $clean = [
            'id'                 => $id,
            'name'               => isset($data['name']) ? sanitize_text_field($data['name']) : 'Musiker',
            'subtitle'           => isset($data['subtitle']) ? sanitize_text_field($data['subtitle']) : '',
            'instrument'         => isset($data['instrument']) ? sanitize_text_field($data['instrument']) : '',
            'role'               => isset($data['role']) ? sanitize_text_field($data['role']) : '',
            'quote'              => isset($data['quote']) ? sanitize_textarea_field($data['quote']) : '',
            'image_id'           => isset($data['image_id']) ? absint($data['image_id']) : 0,
            'image_url'          => isset($data['image_url']) ? esc_url_raw($data['image_url']) : '',
            'default_asset'      => isset($data['default_asset']) ? sanitize_file_name($data['default_asset']) : '',
            'lighting_color'     => isset($data['lighting_color']) && preg_match('/^#[a-f0-9]{6}$/i', $data['lighting_color']) ? $data['lighting_color'] : '#d4af37',
            'lighting_intensity' => isset($data['lighting_intensity']) ? max(10, min(100, absint($data['lighting_intensity']))) : 45,
            'lighting_blur'      => isset($data['lighting_blur']) ? max(10, min(80, absint($data['lighting_blur']))) : 32,
            'lighting_ambient'   => isset($data['lighting_ambient']) ? max(0, min(80, absint($data['lighting_ambient']))) : 35,
            'lighting_pulse'     => !empty($data['lighting_pulse']) ? 1 : 0,
            'sound_type'         => isset($data['sound_type']) ? sanitize_text_field($data['sound_type']) : 'drum',
            'sound_freq'         => isset($data['sound_freq']) ? floatval($data['sound_freq']) : 440,
            'custom_audio_id'    => isset($data['custom_audio_id']) ? absint($data['custom_audio_id']) : 0,
            'custom_audio_url'   => isset($data['custom_audio_url']) ? esc_url_raw($data['custom_audio_url']) : '',
        ];

        // Find existing index or append
        $found = false;
        foreach ($all as $idx => $m) {
            if ($m['id'] === $id) {
                $all[$idx] = $clean;
                $found = true;
                break;
            }
        }

        if (!$found) {
            $all[] = $clean;
        }

        update_option(self::OPTION_NAME, $all);
        return $clean;
    }

    /**
     * Delete musician by ID
     */
    public static function delete($id) {
        $all = self::get_all(false);
        $updated = [];
        $deleted = false;

        foreach ($all as $m) {
            if ($m['id'] === $id) {
                $deleted = true;
                continue;
            }
            $updated[] = $m;
        }

        if ($deleted) {
            update_option(self::OPTION_NAME, $updated);
        }

        return $deleted;
    }

    /**
     * Reorder musicians based on an array of IDs
     */
    public static function reorder($ids) {
        if (!is_array($ids)) {
            return false;
        }

        $all = self::get_all(false);
        $indexed = [];
        foreach ($all as $m) {
            $indexed[$m['id']] = $m;
        }

        $reordered = [];
        foreach ($ids as $id) {
            if (isset($indexed[$id])) {
                $reordered[] = $indexed[$id];
                unset($indexed[$id]);
            }
        }

        // Append any that weren't in the id list
        foreach ($indexed as $m) {
            $reordered[] = $m;
        }

        update_option(self::OPTION_NAME, $reordered);
        return true;
    }

    /**
     * Reset to default ensemble portraits
     */
    public static function reset_defaults() {
        update_option(self::OPTION_NAME, self::get_defaults());
        return true;
    }

    /**
     * Initialize defaults if not present
     */
    public static function init_defaults() {
        if (get_option(self::OPTION_NAME) === false) {
            update_option(self::OPTION_NAME, self::get_defaults());
        }
    }
}
