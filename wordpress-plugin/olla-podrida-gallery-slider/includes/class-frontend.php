<?php
if (!defined('ABSPATH')) {
    exit;
}

class OP_Gallery_Frontend {

    public static function init() {
        add_shortcode('olla_podrida_gallery_slider', [__CLASS__, 'render_shortcode']);
        add_shortcode('olla_gallery_slider', [__CLASS__, 'render_shortcode']); // convenient alias
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
                $canvas_file = OP_GALLERY_PATH . 'templates/canvas-gallery.php';
                if (file_exists($canvas_file)) {
                    return $canvas_file;
                }
            }
        }
        return $template;
    }

    /**
     * Enqueue all frontend styles and scripts
     */
    public static function enqueue_assets() {
        // Enqueue Google Fonts
        wp_enqueue_style(
            'op-gallery-google-fonts',
            'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap',
            [],
            null
        );

        // Enqueue Main CSS
        wp_enqueue_style(
            'op-gallery-frontend-css',
            OP_GALLERY_URL . 'assets/css/gallery.css',
            ['op-gallery-google-fonts'],
            OP_GALLERY_VERSION
        );

        // Enqueue Main JS
        wp_enqueue_script(
            'op-gallery-frontend-js',
            OP_GALLERY_URL . 'assets/js/gallery.js',
            [],
            OP_GALLERY_VERSION,
            true
        );

        $musicians = OP_Gallery_Musicians::get_all(true);
        $settings = OP_Gallery_Settings::get_settings();

        wp_localize_script('op-gallery-frontend-js', 'OP_Gallery_Data', [
            'musicians'  => $musicians,
            'settings'   => $settings,
            'plugin_url' => OP_GALLERY_URL,
        ]);
    }

    /**
     * Render the gallery slider via Shortcode
     */
    public static function render_shortcode($atts = []) {
        self::enqueue_assets();
        $musicians = OP_Gallery_Musicians::get_all(true);
        $settings = OP_Gallery_Settings::get_settings();

        ob_start();
        ?>
        <div id="op-gallery-app" class="op-gallery-root" data-speed="<?php echo esc_attr($settings['default_speed']); ?>" data-autoplay="<?php echo esc_attr($settings['autoplay_default']); ?>" data-hover-pause="<?php echo esc_attr($settings['pause_on_hover']); ?>">
            <!-- Dynamic Background Glow & Ambient Atmosphere -->
            <div id="op-bg-atmosphere" class="op-bg-atmosphere"></div>
            <div class="op-bg-fog"></div>

            <!-- HEADER (Inside App) -->
            <header class="op-viewport-header">
                <div class="op-header-brand">
                    <?php if (!empty($settings['back_link_url'])): ?>
                        <a href="<?php echo esc_url($settings['back_link_url']); ?>" class="op-back-btn" title="<?php echo esc_attr($settings['back_link_text']); ?>">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            <span class="op-back-text"><?php echo esc_html($settings['back_link_text']); ?></span>
                        </a>
                        <div class="op-header-sep"></div>
                    <?php endif; ?>
                    <div class="op-brand-emblem">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e5c158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    </div>
                    <div class="op-brand-titles">
                        <span class="op-brand-main"><?php echo esc_html($settings['header_title']); ?></span>
                        <span class="op-brand-sub"><?php echo esc_html($settings['header_subtitle']); ?></span>
                    </div>
                </div>

                <div class="op-header-controls">
                    <button type="button" id="op-btn-open-grid" class="op-icon-btn" title="Alle Porträts anzeigen (G)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                    </button>
                </div>
            </header>

            <!-- MAIN STAGE: MONUMENTAL PORTRAIT -->
            <main class="op-stage-main">
                <div class="op-portrait-frame-wrap">
                    <!-- Dynamic Halo Glow Filter -->
                    <div id="op-halo-glow" class="op-halo-glow"></div>

                    <!-- Portrait Card -->
                    <div class="op-portrait-canvas" id="op-portrait-canvas">
                        <div id="op-slide-container" class="op-slide-container">
                            <!-- Injected dynamically by JS -->
                        </div>

                        <!-- Vignette & Antique Corners -->
                        <div class="op-vignette-overlay"></div>
                        <div class="op-corner-ornament op-corner-tl"></div>
                        <div class="op-corner-ornament op-corner-tr"></div>
                        <div class="op-corner-ornament op-corner-bl"></div>
                        <div class="op-corner-ornament op-corner-br"></div>

                        <!-- Zoom / Lightbox Trigger -->
                        <button type="button" id="op-btn-open-lightbox" class="op-lightbox-trigger" title="Vollbild-Inspektion">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>
                        </button>
                    </div>

                    <!-- Prev / Next Lateral Arrows -->
                    <button type="button" id="op-btn-prev" class="op-arrow-btn op-arrow-prev" title="Vorheriges Porträt (Pfeiltaste links)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button type="button" id="op-btn-next" class="op-arrow-btn op-arrow-next" title="Nächstes Porträt (Pfeiltaste rechts)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>

                <!-- COLLAPSIBLE STUDIO LIGHTING BAR -->
                <?php if (!empty($settings['show_lighting_studio'])): ?>
                    <div id="op-lighting-studio" class="op-lighting-studio" style="display: none;">
                        <div class="op-studio-bar">
                            <div class="op-studio-header">
                                <div class="op-studio-title">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                                    <span id="op-studio-member-label">Lichtregie & Atmosphäre</span>
                                </div>
                                <div class="op-studio-actions">
                                    <button type="button" id="op-btn-apply-all" class="op-studio-action-btn">Auf alle anwenden</button>
                                    <button type="button" id="op-btn-reset-lighting" class="op-studio-action-btn" title="Zurücksetzen">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                                    </button>
                                    <button type="button" id="op-btn-close-studio" class="op-studio-close-btn">&times;</button>
                                </div>
                            </div>

                            <div class="op-studio-controls">
                                <div class="op-sc-col">
                                    <div class="op-sc-label"><span>Farbe</span><span id="op-sc-color-hex" class="op-sc-hex">#d4af37</span></div>
                                    <div class="op-sc-color-row">
                                        <input type="color" id="op-sc-color" value="#d4af37" />
                                        <div class="op-sc-presets" id="op-sc-presets">
                                            <button type="button" data-color="#e0a96d" style="background:#e0a96d" title="Bernstein"></button>
                                            <button type="button" data-color="#d4af37" style="background:#d4af37" title="Kaisergold"></button>
                                            <button type="button" data-color="#f59e0b" style="background:#f59e0b" title="Sonnengold"></button>
                                            <button type="button" data-color="#e11d48" style="background:#e11d48" title="Karmesinrot"></button>
                                            <button type="button" data-color="#3b82f6" style="background:#3b82f6" title="Saphirblau"></button>
                                            <button type="button" data-color="#0d9488" style="background:#0d9488" title="Waldtürkis"></button>
                                            <button type="button" data-color="#10b981" style="background:#10b981" title="Smaragd"></button>
                                        </div>
                                    </div>
                                </div>

                                <div class="op-sc-col">
                                    <div class="op-sc-label"><span>Leuchtstärke</span><span id="op-sc-intensity-val">45%</span></div>
                                    <input type="range" id="op-sc-intensity" min="10" max="95" value="45" />
                                </div>

                                <div class="op-sc-col">
                                    <div class="op-sc-label"><span>Lichtkegel</span><span id="op-sc-blur-val">32px</span></div>
                                    <input type="range" id="op-sc-blur" min="10" max="80" value="32" />
                                </div>

                                <div class="op-sc-col">
                                    <div class="op-sc-label"><span>Raum-Ambiente</span><span id="op-sc-ambient-val">35%</span></div>
                                    <div class="op-sc-ambient-row">
                                        <input type="range" id="op-sc-ambient" min="0" max="80" value="35" />
                                        <button type="button" id="op-sc-pulse-toggle" class="op-pulse-btn">Pulsieren Aus</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>
            </main>

            <!-- FOOTER BAR: 3-ZONEN NAVIGATION -->
            <footer class="op-viewport-footer">
                <!-- Slim Progress Bar -->
                <div class="op-progress-bar-wrap">
                    <div id="op-progress-bar" class="op-progress-bar" style="width: 0%;"></div>
                </div>

                <div class="op-footer-3zones">
                    <!-- ZONE LINKS: Details zum Musiker -->
                    <div class="op-zone-left">
                        <div class="op-counter-badge">
                            <span id="op-roman-numeral" class="op-roman">I</span>
                            <span class="op-counter-dot">·</span>
                            <span id="op-index-counter" class="op-index">01 / 0<?php echo count($musicians); ?></span>
                        </div>
                        <h2 id="op-current-name" class="op-current-name">Musiker</h2>
                        <p id="op-current-instrument" class="op-current-instrument">Instrument</p>
                        <p id="op-current-role" class="op-current-role">Rolle</p>
                    </div>

                    <!-- ZONE MITTE: Thumbnails & Slider Controls -->
                    <div class="op-zone-center">
                        <!-- Musiker Thumbnails (Slide-Out on Hover) -->
                        <div class="op-thumb-strip" id="op-thumb-strip">
                            <!-- Injected dynamically by JS -->
                        </div>

                        <!-- Steuerung & Hilfstasten -->
                        <div class="op-controls-row">
                            <?php if (!empty($settings['sound_enabled'])): ?>
                                <button type="button" id="op-btn-sound" class="op-pill-btn" title="Hörprobe abspielen">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                                    <span id="op-sound-label">Hörprobe</span>
                                </button>
                            <?php endif; ?>

                            <?php if (!empty($settings['show_lighting_studio'])): ?>
                                <button type="button" id="op-btn-studio-toggle" class="op-pill-btn" title="Licht & Farben einstellen (L)">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>
                                    <span>Licht & Farben</span>
                                </button>
                            <?php endif; ?>

                            <button type="button" id="op-btn-play-pause" class="op-pill-btn" title="Leertaste">
                                <span id="op-play-pause-icon">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
                                </span>
                                <span id="op-play-pause-label">Pause</span>
                            </button>

                            <div class="op-speed-selector">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <button type="button" class="op-speed-btn" data-speed="3000">3s</button>
                                <button type="button" class="op-speed-btn op-speed-active" data-speed="5000">5s</button>
                                <button type="button" class="op-speed-btn" data-speed="8000">8s</button>
                                <button type="button" class="op-speed-btn" data-speed="12000">12s</button>
                            </div>

                            <button type="button" id="op-btn-autoplay-toggle" class="op-pill-btn">
                                <span id="op-autoplay-dot" class="op-dot-active"></span>
                                <span id="op-autoplay-label">Autoplay An</span>
                            </button>
                        </div>
                    </div>

                    <!-- ZONE RECHTS: Historisches Zitat -->
                    <div class="op-zone-right">
                        <span class="op-context-label">Historischer Kontext</span>
                        <blockquote id="op-current-quote" class="op-current-quote">
                            „Musik wird erst dann wahrhaft sichtbar, wenn sie sich im Schwung eines Gewandes dreht.“
                        </blockquote>
                    </div>
                </div>
            </footer>

            <!-- ALL PORTRAITS GRID MODAL -->
            <div id="op-grid-modal" class="op-modal-overlay" style="display:none;">
                <div class="op-grid-modal-window">
                    <div class="op-grid-modal-header">
                        <div>
                            <span class="op-gm-pre">Olla Podrida Galerie</span>
                            <h2 class="op-gm-title">Alle Musiker-Porträts</h2>
                        </div>
                        <button type="button" id="op-btn-close-grid" class="op-gm-close">&times;</button>
                    </div>
                    <div class="op-grid-modal-body" id="op-grid-cards">
                        <!-- Injected dynamically by JS -->
                    </div>
                </div>
            </div>

            <!-- FULLSCREEN LIGHTBOX MODAL -->
            <div id="op-lightbox-modal" class="op-lightbox-overlay" style="display:none;">
                <div class="op-lightbox-header">
                    <div>
                        <span class="op-lb-pre">Olla Podrida Artwork</span>
                        <h3 id="op-lb-title" class="op-lb-title">Musiker</h3>
                    </div>
                    <div class="op-lb-controls">
                        <button type="button" id="op-lb-zoom-in" title="Vergrößern">+</button>
                        <button type="button" id="op-lb-zoom-out" title="Verkleinern">&minus;</button>
                        <button type="button" id="op-lb-zoom-reset" title="100% Reset">&#8634;</button>
                        <div class="op-lb-sep"></div>
                        <button type="button" id="op-btn-close-lightbox" title="Schließen">&times;</button>
                    </div>
                </div>
                <div class="op-lightbox-stage">
                    <img id="op-lb-img" src="" alt="Großansicht" />
                </div>
                <div class="op-lightbox-footer">
                    <span id="op-lb-caption"></span>
                    <span id="op-lb-zoom-level" class="op-lb-badge">Zoom: 100%</span>
                </div>
            </div>

        </div>
        <?php
        return ob_get_clean();
    }
}
