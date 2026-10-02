<?php
if (!defined('ABSPATH')) {
    exit;
}

class OP_Gallery_Admin {

    public static function init() {
        add_action('admin_menu', [__CLASS__, 'register_menu']);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_assets']);

        // AJAX actions
        add_action('wp_ajax_op_gallery_save_musician', [__CLASS__, 'ajax_save_musician']);
        add_action('wp_ajax_op_gallery_delete_musician', [__CLASS__, 'ajax_delete_musician']);
        add_action('wp_ajax_op_gallery_reorder_musicians', [__CLASS__, 'ajax_reorder_musicians']);
        add_action('wp_ajax_op_gallery_reset_musicians', [__CLASS__, 'ajax_reset_musicians']);
        add_action('wp_ajax_op_gallery_save_settings', [__CLASS__, 'ajax_save_settings']);
        add_action('wp_ajax_op_gallery_create_page', [__CLASS__, 'ajax_create_page']);
    }

    public static function register_menu() {
        add_menu_page(
            __('Olla Podrida Galerie', 'olla-podrida-gallery'),
            __('Olla Galerie', 'olla-podrida-gallery'),
            'manage_options',
            'op-gallery-musicians',
            [__CLASS__, 'render_musicians_page'],
            'dashicons-format-gallery',
            31
        );

        add_submenu_page(
            'op-gallery-musicians',
            __('Musiker & Porträts', 'olla-podrida-gallery'),
            __('Musiker & Porträts', 'olla-podrida-gallery'),
            'manage_options',
            'op-gallery-musicians',
            [__CLASS__, 'render_musicians_page']
        );

        add_submenu_page(
            'op-gallery-musicians',
            __('Galerie Einstellungen', 'olla-podrida-gallery'),
            __('Einstellungen', 'olla-podrida-gallery'),
            'manage_options',
            'op-gallery-settings',
            [__CLASS__, 'render_settings_page']
        );
    }

    public static function enqueue_assets($hook) {
        if (strpos($hook, 'op-gallery-') === false) {
            return;
        }

        wp_enqueue_media();
        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('wp-color-picker');
        wp_enqueue_script('jquery-ui-sortable');

        wp_enqueue_style(
            'op-gallery-admin-css',
            OP_GALLERY_URL . 'assets/css/admin.css',
            ['wp-color-picker'],
            OP_GALLERY_VERSION
        );

        wp_enqueue_script(
            'op-gallery-admin-js',
            OP_GALLERY_URL . 'assets/js/admin.js',
            ['jquery', 'wp-color-picker', 'jquery-ui-sortable'],
            OP_GALLERY_VERSION,
            true
        );

        wp_localize_script('op-gallery-admin-js', 'OP_Gallery_Admin', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('op_gallery_admin_nonce'),
            'i18n'     => [
                'confirm_delete' => __('Möchtest du diesen Musiker wirklich entfernen?', 'olla-podrida-gallery'),
                'confirm_reset'  => __('Möchtest du alle Porträts auf die ursprünglichen 7 Standardmusiker zurücksetzen? Eigene Änderungen gehen dabei verloren.', 'olla-podrida-gallery'),
                'saving'         => __('Wird gespeichert...', 'olla-podrida-gallery'),
                'saved'          => __('Erfolgreich gespeichert!', 'olla-podrida-gallery'),
                'error'          => __('Fehler beim Speichern.', 'olla-podrida-gallery'),
                'select_image'   => __('Porträt-Bild auswählen', 'olla-podrida-gallery'),
                'use_image'      => __('Als Porträt verwenden', 'olla-podrida-gallery'),
                'select_audio'   => __('Audio-Datei auswählen', 'olla-podrida-gallery'),
                'use_audio'      => __('Als Hörprobe verwenden', 'olla-podrida-gallery'),
            ]
        ]);
    }

    /**
     * Render the Musician CRUD & Management screen
     */
    public static function render_musicians_page() {
        $musicians = OP_Gallery_Musicians::get_all(true);
        $settings = OP_Gallery_Settings::get_settings();
        $gallery_page = !empty($settings['page_id']) ? get_post($settings['page_id']) : null;
        $gallery_url = $gallery_page ? get_permalink($gallery_page->ID) : '';

        ?>
        <div class="wrap op-admin-wrap">
            <header class="op-admin-header">
                <div class="op-header-left">
                    <span class="op-badge">Olla Podrida</span>
                    <h1><?php esc_html_e('Musiker & Porträts', 'olla-podrida-gallery'); ?></h1>
                    <p class="op-subtitle"><?php esc_html_e('Verwalte die Ensemble-Mitglieder, lade Porträt-Bilder hoch und passe Licht & Hörproben an.', 'olla-podrida-gallery'); ?></p>
                </div>
                <div class="op-header-actions">
                    <?php if ($gallery_url): ?>
                        <a href="<?php echo esc_url($gallery_url); ?>" target="_blank" class="button op-btn-view">
                            <span class="dashicons dashicons-external"></span> <?php esc_html_e('Live-Unterseite ansehen', 'olla-podrida-gallery'); ?>
                        </a>
                    <?php endif; ?>
                    <button type="button" class="button button-primary op-btn-add" id="op-btn-add-musician">
                        <span class="dashicons dashicons-plus-alt2"></span> <?php esc_html_e('Musiker hinzufügen', 'olla-podrida-gallery'); ?>
                    </button>
                    <button type="button" class="button op-btn-reset" id="op-btn-reset-musicians" title="<?php esc_attr_e('Original-Ensemble wiederherstellen', 'olla-podrida-gallery'); ?>">
                        <span class="dashicons dashicons-image-rotate"></span>
                    </button>
                </div>
            </header>

            <div class="op-card-grid" id="op-musicians-grid">
                <?php if (empty($musicians)): ?>
                    <div class="op-empty-state">
                        <span class="dashicons dashicons-groups"></span>
                        <h3><?php esc_html_e('Noch keine Musiker vorhanden', 'olla-podrida-gallery'); ?></h3>
                        <p><?php esc_html_e('Füge deinen ersten Musiker hinzu oder stelle die Standard-Besetzung wieder her.', 'olla-podrida-gallery'); ?></p>
                    </div>
                <?php else: ?>
                    <?php foreach ($musicians as $idx => $m): ?>
                        <div class="op-musician-card" data-id="<?php echo esc_attr($m['id']); ?>">
                            <div class="op-card-handle" title="<?php esc_attr_e('Verschieben zum Sortieren', 'olla-podrida-gallery'); ?>">
                                <span class="dashicons dashicons-move"></span>
                            </div>
                            <div class="op-card-media" style="border-color: <?php echo esc_attr($m['lighting_color']); ?>;">
                                <?php if (!empty($m['image_url'])): ?>
                                    <img src="<?php echo esc_url($m['image_url']); ?>" alt="<?php echo esc_attr($m['name']); ?>" />
                                <?php else: ?>
                                    <div class="op-media-placeholder">
                                        <span class="dashicons dashicons-format-image"></span>
                                    </div>
                                <?php endif; ?>
                                <span class="op-color-pill" style="background-color: <?php echo esc_attr($m['lighting_color']); ?>;" title="Akzent: <?php echo esc_attr($m['lighting_color']); ?>"></span>
                            </div>
                            <div class="op-card-info">
                                <div class="op-card-index">0<?php echo $idx + 1; ?></div>
                                <h3 class="op-card-name"><?php echo esc_html($m['name']); ?></h3>
                                <p class="op-card-instrument"><?php echo esc_html($m['instrument']); ?></p>
                                <p class="op-card-role"><?php echo esc_html($m['role']); ?></p>
                                <?php if (!empty($m['quote'])): ?>
                                    <blockquote class="op-card-quote"><?php echo esc_html(wp_trim_words($m['quote'], 12)); ?></blockquote>
                                <?php endif; ?>
                            </div>
                            <div class="op-card-footer">
                                <span class="op-sound-badge" title="Hörprobe: <?php echo esc_attr($m['sound_type']); ?>">
                                    <span class="dashicons dashicons-controls-volumeon"></span> <?php echo esc_html($m['sound_type']); ?>
                                </span>
                                <div class="op-card-actions">
                                    <button type="button" class="button button-small op-btn-edit" data-musician="<?php echo esc_attr(wp_json_encode($m)); ?>">
                                        <span class="dashicons dashicons-edit"></span> <?php esc_html_e('Bearbeiten', 'olla-podrida-gallery'); ?>
                                    </button>
                                    <button type="button" class="button button-small button-link-delete op-btn-delete" data-id="<?php echo esc_attr($m['id']); ?>">
                                        <span class="dashicons dashicons-trash"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- MODAL: Musiker Bearbeiten / Hinzufügen -->
            <div class="op-modal-backdrop" id="op-musician-modal" style="display: none;">
                <div class="op-modal">
                    <div class="op-modal-header">
                        <h2 id="op-modal-title"><?php esc_html_e('Musiker bearbeiten', 'olla-podrida-gallery'); ?></h2>
                        <button type="button" class="op-modal-close" id="op-modal-close">&times;</button>
                    </div>
                    <form id="op-musician-form" class="op-modal-body">
                        <input type="hidden" name="id" id="op-m-id" value="" />
                        <input type="hidden" name="image_id" id="op-m-image-id" value="0" />
                        <input type="hidden" name="image_url" id="op-m-image-url" value="" />
                        <input type="hidden" name="default_asset" id="op-m-default-asset" value="" />
                        <input type="hidden" name="custom_audio_id" id="op-m-custom-audio-id" value="0" />
                        <input type="hidden" name="custom_audio_url" id="op-m-custom-audio-url" value="" />

                        <div class="op-modal-grid">
                            <!-- Linke Spalte: Porträt-Bild -->
                            <div class="op-modal-col-media">
                                <label class="op-label"><?php esc_html_e('Porträt-Bild', 'olla-podrida-gallery'); ?></label>
                                <div class="op-image-preview-box" id="op-image-preview-box">
                                    <img id="op-image-preview" src="" alt="Vorschau" style="display:none;" />
                                    <div class="op-preview-placeholder" id="op-image-placeholder">
                                        <span class="dashicons dashicons-format-image"></span>
                                        <p><?php esc_html_e('Kein Bild gewählt', 'olla-podrida-gallery'); ?></p>
                                    </div>
                                </div>
                                <div class="op-media-btn-row">
                                    <button type="button" class="button op-btn-select-image" id="op-btn-select-image">
                                        <span class="dashicons dashicons-upload"></span> <?php esc_html_e('Bild aus Mediathek', 'olla-podrida-gallery'); ?>
                                    </button>
                                    <button type="button" class="button op-btn-remove-image" id="op-btn-remove-image" style="display:none;">
                                        <?php esc_html_e('Entfernen', 'olla-podrida-gallery'); ?>
                                    </button>
                                </div>
                                <p class="description"><?php esc_html_e('Empfohlen: Hochformat 2:3 (z. B. 2048 × 3072 px oder 1200 × 1800 px).', 'olla-podrida-gallery'); ?></p>
                            </div>

                            <!-- Rechte Spalte: Stammdaten, Licht, Sound -->
                            <div class="op-modal-col-fields">
                                <div class="op-field-row">
                                    <div class="op-field-group">
                                        <label for="op-m-name" class="op-label"><?php esc_html_e('Name', 'olla-podrida-gallery'); ?> *</label>
                                        <input type="text" id="op-m-name" name="name" required class="regular-text" placeholder="z. B. Klemens" />
                                    </div>
                                    <div class="op-field-group">
                                        <label for="op-m-subtitle" class="op-label"><?php esc_html_e('Untertitel / Titel', 'olla-podrida-gallery'); ?></label>
                                        <input type="text" id="op-m-subtitle" name="subtitle" class="regular-text" placeholder="z. B. Der Puls des Ensembles" />
                                    </div>
                                </div>

                                <div class="op-field-row">
                                    <div class="op-field-group">
                                        <label for="op-m-instrument" class="op-label"><?php esc_html_e('Instrument', 'olla-podrida-gallery'); ?></label>
                                        <input type="text" id="op-m-instrument" name="instrument" class="regular-text" placeholder="z. B. Große Landsknechtstrommel" />
                                    </div>
                                    <div class="op-field-group">
                                        <label for="op-m-role" class="op-label"><?php esc_html_e('Rolle im Ensemble', 'olla-podrida-gallery'); ?></label>
                                        <input type="text" id="op-m-role" name="role" class="regular-text" placeholder="z. B. Schlagwerk & Rhythmus" />
                                    </div>
                                </div>

                                <div class="op-field-group">
                                    <label for="op-m-quote" class="op-label"><?php esc_html_e('Historisches Zitat / Leitspruch', 'olla-podrida-gallery'); ?></label>
                                    <textarea id="op-m-quote" name="quote" rows="2" class="large-text" placeholder="„Ein kräftiger Trommelschlag lässt das Herz im Takte alter Reigen schlagen.“"></textarea>
                                </div>

                                <!-- Lichtregie & Glow -->
                                <div class="op-section-box">
                                    <h4 class="op-section-title"><span class="dashicons dashicons-art"></span> <?php esc_html_e('Lichtregie & Atmosphäre', 'olla-podrida-gallery'); ?></h4>
                                    <div class="op-field-row op-lighting-row">
                                        <div class="op-field-group">
                                            <label class="op-label"><?php esc_html_e('Akzentfarbe', 'olla-podrida-gallery'); ?></label>
                                            <input type="text" id="op-m-lighting-color" name="lighting_color" value="#d4af37" class="op-color-field" />
                                        </div>
                                        <div class="op-field-group">
                                            <label class="op-label"><?php esc_html_e('Leuchtstärke', 'olla-podrida-gallery'); ?>: <span id="op-intensity-val">45</span>%</label>
                                            <input type="range" id="op-m-lighting-intensity" name="lighting_intensity" min="10" max="95" value="45" />
                                        </div>
                                        <div class="op-field-group">
                                            <label class="op-label"><?php esc_html_e('Lichtkegel (Radius)', 'olla-podrida-gallery'); ?>: <span id="op-blur-val">32</span>px</label>
                                            <input type="range" id="op-m-lighting-blur" name="lighting_blur" min="10" max="80" value="32" />
                                        </div>
                                        <div class="op-field-group">
                                            <label class="op-label"><?php esc_html_e('Raum-Ambiente', 'olla-podrida-gallery'); ?>: <span id="op-ambient-val">35</span>%</label>
                                            <input type="range" id="op-m-lighting-ambient" name="lighting_ambient" min="0" max="80" value="35" />
                                        </div>
                                        <div class="op-field-group op-checkbox-group">
                                            <label class="op-label">
                                                <input type="checkbox" id="op-m-lighting-pulse" name="lighting_pulse" value="1" />
                                                <?php esc_html_e('Pulsieren aktivieren', 'olla-podrida-gallery'); ?>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Hörprobe / Audio -->
                                <div class="op-section-box">
                                    <h4 class="op-section-title"><span class="dashicons dashicons-format-audio"></span> <?php esc_html_e('Hörprobe & Klangfarbe', 'olla-podrida-gallery'); ?></h4>
                                    <div class="op-field-row">
                                        <div class="op-field-group">
                                            <label for="op-m-sound-type" class="op-label"><?php esc_html_e('Klang-Preset', 'olla-podrida-gallery'); ?></label>
                                            <select id="op-m-sound-type" name="sound_type">
                                                <option value="drum"><?php esc_html_e('Trommel (Tiefes Schlagwerk)', 'olla-podrida-gallery'); ?></option>
                                                <option value="psalter"><?php esc_html_e('Psalter / Zupfsaiten', 'olla-podrida-gallery'); ?></option>
                                                <option value="hurdygurdy"><?php esc_html_e('Drehleier (Bordun)', 'olla-podrida-gallery'); ?></option>
                                                <option value="lute"><?php esc_html_e('Laute / Zupfklang', 'olla-podrida-gallery'); ?></option>
                                                <option value="bassfidel"><?php esc_html_e('Bassfidel (Tiefe Saiten)', 'olla-podrida-gallery'); ?></option>
                                                <option value="bagpipe"><?php esc_html_e('Sackpfeife / Dudelsack', 'olla-podrida-gallery'); ?></option>
                                                <option value="flute"><?php esc_html_e('Flöte / Schalmei', 'olla-podrida-gallery'); ?></option>
                                                <option value="jingle"><?php esc_html_e('Schellenring / Tanz', 'olla-podrida-gallery'); ?></option>
                                                <option value="custom"><?php esc_html_e('Eigene Audiodatei (MP3/WAV)', 'olla-podrida-gallery'); ?></option>
                                            </select>
                                        </div>
                                        <div class="op-field-group" id="op-freq-group">
                                            <label for="op-m-sound-freq" class="op-label"><?php esc_html_e('Grundfrequenz (Hz)', 'olla-podrida-gallery'); ?></label>
                                            <input type="number" id="op-m-sound-freq" name="sound_freq" step="0.1" value="440" />
                                        </div>
                                        <div class="op-field-group" id="op-custom-audio-group" style="display:none;">
                                            <label class="op-label"><?php esc_html_e('Audio-Datei (Mediathek)', 'olla-podrida-gallery'); ?></label>
                                            <div class="op-audio-row">
                                                <button type="button" class="button" id="op-btn-select-audio"><?php esc_html_e('MP3/WAV wählen', 'olla-podrida-gallery'); ?></button>
                                                <span id="op-audio-filename" class="op-file-label"></span>
                                                <button type="button" class="button op-btn-remove-audio" id="op-btn-remove-audio" style="display:none;">&times;</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="op-modal-footer">
                            <span class="op-save-spinner spinner"></span>
                            <button type="button" class="button" id="op-modal-cancel"><?php esc_html_e('Abbrechen', 'olla-podrida-gallery'); ?></button>
                            <button type="submit" class="button button-primary" id="op-modal-submit"><?php esc_html_e('Musiker speichern', 'olla-podrida-gallery'); ?></button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        <?php
    }

    /**
     * Render the General Gallery Settings screen
     */
    public static function render_settings_page() {
        $settings = OP_Gallery_Settings::get_settings();
        $gallery_page = !empty($settings['page_id']) ? get_post($settings['page_id']) : null;
        $gallery_url = $gallery_page ? get_permalink($gallery_page->ID) : '';
        ?>
        <div class="wrap op-admin-wrap">
            <header class="op-admin-header">
                <div class="op-header-left">
                    <span class="op-badge">Olla Podrida</span>
                    <h1><?php esc_html_e('Galerie-Einstellungen', 'olla-podrida-gallery'); ?></h1>
                    <p class="op-subtitle"><?php esc_html_e('Konfiguration der Unterseite, Slider-Steuerung, Autoplay und Theatralik-Modus.', 'olla-podrida-gallery'); ?></p>
                </div>
                <div class="op-header-actions">
                    <?php if ($gallery_url): ?>
                        <a href="<?php echo esc_url($gallery_url); ?>" target="_blank" class="button op-btn-view">
                            <span class="dashicons dashicons-external"></span> <?php esc_html_e('Live-Unterseite öffnen', 'olla-podrida-gallery'); ?>
                        </a>
                    <?php endif; ?>
                </div>
            </header>

            <form id="op-settings-form" class="op-settings-container">
                <!-- BOX 1: Unterseite & Verknüpfung -->
                <div class="op-box">
                    <h3 class="op-box-title"><span class="dashicons dashicons-admin-page"></span> <?php esc_html_e('Unterseiten-Initialisierung', 'olla-podrida-gallery'); ?></h3>
                    <div class="op-box-content">
                        <div class="op-page-status-card">
                            <div class="op-status-icon <?php echo $gallery_page ? 'active' : 'missing'; ?>">
                                <span class="dashicons <?php echo $gallery_page ? 'dashicons-yes-alt' : 'dashicons-warning'; ?>"></span>
                            </div>
                            <div class="op-status-details">
                                <h4>
                                    <?php if ($gallery_page): ?>
                                        <?php esc_html_e('Unterseite aktiv verknüpft:', 'olla-podrida-gallery'); ?> <strong><?php echo esc_html($gallery_page->post_title); ?></strong>
                                    <?php else: ?>
                                        <?php esc_html_e('Keine Unterseite verknüpft!', 'olla-podrida-gallery'); ?>
                                    <?php endif; ?>
                                </h4>
                                <p>
                                    <?php if ($gallery_page): ?>
                                        <code><?php echo esc_url($gallery_url); ?></code> · Shortcode: <code>[olla_podrida_gallery_slider]</code>
                                    <?php else: ?>
                                        <?php esc_html_e('Klicke auf den Button, um die Unterseite automatisch zu erstellen.', 'olla-podrida-gallery'); ?>
                                    <?php endif; ?>
                                </p>
                            </div>
                            <div class="op-status-actions">
                                <button type="button" class="button" id="op-btn-recreate-page">
                                    <span class="dashicons dashicons-update"></span> <?php esc_html_e('Unterseite neu anlegen / reparieren', 'olla-podrida-gallery'); ?>
                                </button>
                            </div>
                        </div>

                        <div class="op-form-grid" style="margin-top: 15px;">
                            <div class="op-form-group">
                                <label for="op-s-title"><?php esc_html_e('Seitentitel', 'olla-podrida-gallery'); ?></label>
                                <input type="text" id="op-s-title" name="page_title" value="<?php echo esc_attr($settings['page_title']); ?>" class="regular-text" />
                            </div>
                            <div class="op-form-group">
                                <label for="op-s-slug"><?php esc_html_e('Seiten-Slug (URL)', 'olla-podrida-gallery'); ?></label>
                                <input type="text" id="op-s-slug" name="page_slug" value="<?php echo esc_attr($settings['page_slug']); ?>" class="regular-text" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BOX 2: Darstellungsmodus & Theatralik -->
                <div class="op-box">
                    <h3 class="op-box-title"><span class="dashicons dashicons-visibility"></span> <?php esc_html_e('Darstellungsmodus', 'olla-podrida-gallery'); ?></h3>
                    <div class="op-box-content">
                        <div class="op-radio-cards">
                            <label class="op-radio-card <?php echo $settings['display_mode'] === 'canvas' ? 'selected' : ''; ?>">
                                <input type="radio" name="display_mode" value="canvas" <?php checked($settings['display_mode'], 'canvas'); ?> />
                                <div class="op-rc-icon"><span class="dashicons dashicons-slides"></span></div>
                                <div class="op-rc-body">
                                    <strong><?php esc_html_e('Theatralischer Vollbild-Canvas (Empfohlen)', 'olla-podrida-gallery'); ?></strong>
                                    <p><?php esc_html_e('Lädt die Galerie als immersive Vollbild-Bühne ohne Theme-Kopf-/Fußzeile. Ideal für die volle künstlerische Wirkung.', 'olla-podrida-gallery'); ?></p>
                                </div>
                            </label>

                            <label class="op-radio-card <?php echo $settings['display_mode'] === 'theme' ? 'selected' : ''; ?>">
                                <input type="radio" name="display_mode" value="theme" <?php checked($settings['display_mode'], 'theme'); ?> />
                                <div class="op-rc-icon"><span class="dashicons dashicons-layout"></span></div>
                                <div class="op-rc-body">
                                    <strong><?php esc_html_e('Theme-Standard (Eingebettet)', 'olla-podrida-gallery'); ?></strong>
                                    <p><?php esc_html_e('Fügt den Slider regulär in den Inhaltsbereich deines WordPress-Themes ein (mit Header & Footer des Themes).', 'olla-podrida-gallery'); ?></p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- BOX 3: Slider-Verhalten & Autoplay -->
                <div class="op-box">
                    <h3 class="op-box-title"><span class="dashicons dashicons-controls-play"></span> <?php esc_html_e('Slider-Verhalten & Autoplay', 'olla-podrida-gallery'); ?></h3>
                    <div class="op-box-content">
                        <div class="op-form-grid">
                            <div class="op-form-group">
                                <label for="op-s-speed"><?php esc_html_e('Standard-Verweildauer pro Porträt', 'olla-podrida-gallery'); ?></label>
                                <select id="op-s-speed" name="default_speed">
                                    <option value="3000" <?php selected($settings['default_speed'], 3000); ?>>3 Sekunden</option>
                                    <option value="5000" <?php selected($settings['default_speed'], 5000); ?>>5 Sekunden (Standard)</option>
                                    <option value="8000" <?php selected($settings['default_speed'], 8000); ?>>8 Sekunden</option>
                                    <option value="12000" <?php selected($settings['default_speed'], 12000); ?>>12 Sekunden</option>
                                </select>
                            </div>
                            <div class="op-form-group op-checkbox-group" style="padding-top: 25px;">
                                <label>
                                    <input type="checkbox" name="autoplay_default" value="1" <?php checked($settings['autoplay_default'], 1); ?> />
                                    <?php esc_html_e('Autoplay standardmäßig beim Laden starten', 'olla-podrida-gallery'); ?>
                                </label>
                            </div>
                            <div class="op-form-group op-checkbox-group" style="padding-top: 25px;">
                                <label>
                                    <input type="checkbox" name="pause_on_hover" value="1" <?php checked($settings['pause_on_hover'], 1); ?> />
                                    <?php esc_html_e('Autoplay pausieren, wenn Maus über Porträt ist', 'olla-podrida-gallery'); ?>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BOX 4: Besucher-Interaktion (Lichtstudio & Hörproben) -->
                <div class="op-box">
                    <h3 class="op-box-title"><span class="dashicons dashicons-admin-generic"></span> <?php esc_html_e('Besucher-Interaktion', 'olla-podrida-gallery'); ?></h3>
                    <div class="op-box-content">
                        <div class="op-form-grid">
                            <div class="op-form-group op-checkbox-group">
                                <label>
                                    <input type="checkbox" name="show_lighting_studio" value="1" <?php checked($settings['show_lighting_studio'], 1); ?> />
                                    <strong><?php esc_html_e('Lichtregie-Button für Besucher anzeigen', 'olla-podrida-gallery'); ?></strong>
                                </label>
                                <p class="description"><?php esc_html_e('Ermöglicht Besuchern, die Lichtfarben, Leuchtstärke und Pulseffekte live zu regeln.', 'olla-podrida-gallery'); ?></p>
                            </div>
                            <div class="op-form-group op-checkbox-group">
                                <label>
                                    <input type="checkbox" name="sound_enabled" value="1" <?php checked($settings['sound_enabled'], 1); ?> />
                                    <strong><?php esc_html_e('Hörproben-Funktion aktivieren', 'olla-podrida-gallery'); ?></strong>
                                </label>
                                <p class="description"><?php esc_html_e('Schaltet den Klang-Synthesizer und eigene Audiospuren für das Ensemble frei.', 'olla-podrida-gallery'); ?></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BOX 5: Branding & Navigation -->
                <div class="op-box">
                    <h3 class="op-box-title"><span class="dashicons dashicons-admin-site-alt3"></span> <?php esc_html_e('Kopfzeile & Zurück-Button', 'olla-podrida-gallery'); ?></h3>
                    <div class="op-box-content">
                        <div class="op-form-grid">
                            <div class="op-form-group">
                                <label for="op-s-htitle"><?php esc_html_e('Ensemble-Titel (Kopfzeile)', 'olla-podrida-gallery'); ?></label>
                                <input type="text" id="op-s-htitle" name="header_title" value="<?php echo esc_attr($settings['header_title']); ?>" class="regular-text" />
                            </div>
                            <div class="op-form-group">
                                <label for="op-s-hsub"><?php esc_html_e('Untertitel (Kopfzeile)', 'olla-podrida-gallery'); ?></label>
                                <input type="text" id="op-s-hsub" name="header_subtitle" value="<?php echo esc_attr($settings['header_subtitle']); ?>" class="regular-text" />
                            </div>
                            <div class="op-form-group">
                                <label for="op-s-back-url"><?php esc_html_e('Ziel-URL des „Zurück“-Buttons', 'olla-podrida-gallery'); ?></label>
                                <input type="text" id="op-s-back-url" name="back_link_url" value="<?php echo esc_attr($settings['back_link_url']); ?>" class="regular-text" />
                            </div>
                            <div class="op-form-group">
                                <label for="op-s-back-txt"><?php esc_html_e('Beschriftung des „Zurück“-Buttons', 'olla-podrida-gallery'); ?></label>
                                <input type="text" id="op-s-back-txt" name="back_link_text" value="<?php echo esc_attr($settings['back_link_text']); ?>" class="regular-text" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="op-settings-submit-bar">
                    <span class="op-save-spinner spinner"></span>
                    <button type="submit" class="button button-primary button-hero" id="op-settings-submit">
                        <span class="dashicons dashicons-saved"></span> <?php esc_html_e('Einstellungen speichern', 'olla-podrida-gallery'); ?>
                    </button>
                </div>
            </form>
        </div>
        <?php
    }

    /* =========================================================================
     * AJAX ENDPOINTS
     * ========================================================================= */

    public static function check_ajax_permissions() {
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Keine ausreichenden Berechtigungen.']);
        }
        check_ajax_referer('op_gallery_admin_nonce', 'nonce');
    }

    public static function ajax_save_musician() {
        self::check_ajax_permissions();
        $saved = OP_Gallery_Musicians::save($_POST);
        wp_send_json_success(['musician' => $saved, 'musicians' => OP_Gallery_Musicians::get_all(true)]);
    }

    public static function ajax_delete_musician() {
        self::check_ajax_permissions();
        $id = sanitize_key($_POST['id'] ?? '');
        if (empty($id)) {
            wp_send_json_error(['message' => 'ID fehlt.']);
        }
        $deleted = OP_Gallery_Musicians::delete($id);
        wp_send_json_success(['deleted' => $deleted, 'musicians' => OP_Gallery_Musicians::get_all(true)]);
    }

    public static function ajax_reorder_musicians() {
        self::check_ajax_permissions();
        $ids = isset($_POST['ids']) && is_array($_POST['ids']) ? array_map('sanitize_key', $_POST['ids']) : [];
        $reordered = OP_Gallery_Musicians::reorder($ids);
        wp_send_json_success(['reordered' => $reordered]);
    }

    public static function ajax_reset_musicians() {
        self::check_ajax_permissions();
        OP_Gallery_Musicians::reset_defaults();
        wp_send_json_success(['musicians' => OP_Gallery_Musicians::get_all(true)]);
    }

    public static function ajax_save_settings() {
        self::check_ajax_permissions();
        $updated = OP_Gallery_Settings::update_settings($_POST);

        // Update page title/slug in WordPress page if changed
        if (!empty($updated['page_id'])) {
            wp_update_post([
                'ID'         => $updated['page_id'],
                'post_title' => $updated['page_title'],
                'post_name'  => $updated['page_slug'],
            ]);
        }

        wp_send_json_success(['settings' => $updated]);
    }

    public static function ajax_create_page() {
        self::check_ajax_permissions();
        $page_id = OP_Gallery_Frontend::create_default_page(true);
        $settings = OP_Gallery_Settings::get_settings();
        wp_send_json_success([
            'page_id'  => $page_id,
            'page_url' => get_permalink($page_id),
            'settings' => $settings,
        ]);
    }
}
