<?php
if (!defined('ABSPATH')) {
    exit;
}

$seo = Olla_Podrida_Settings::get_section('seo');
$settings_all = Olla_Podrida_Settings::get_section('settings');
$default_favicon = !empty($settings_all['favicon_url']) ? $settings_all['favicon_url'] : get_site_icon_url(64);
if (empty($default_favicon)) {
    $default_favicon = OLLA_PODRIDA_URL . 'assets/dist/images/logo-pot.png';
}
$current_snippet_icon = !empty($seo['google_snippet_icon']) ? $seo['google_snippet_icon'] : '';
$serp_icon_preview = !empty($current_snippet_icon) ? $current_snippet_icon : $default_favicon;
?>

<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
    <input type="hidden" name="action" value="olla_podrida_save_settings" />
    <input type="hidden" name="section" value="seo" />
    <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>

    <!-- 1. Google SERP Snippet Live Preview -->
    <div class="olla-card" style="margin-bottom: 24px; border: 1px solid #d0c29f;">
        <div class="olla-card-header" style="background: linear-gradient(135deg, #1f1812 0%, #15110e 100%); border-bottom: 2px solid #DAA520; color: #F5F5DC;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="color: #DAA520; margin: 0 0 4px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                        <span class="dashicons dashicons-search" style="font-size: 20px; width: 20px; height: 20px; color: #DAA520;"></span>
                        Live Google-Suchergebnis-Vorschau (SERP)
                    </h2>
                    <p style="color: #d8ceb8; font-size: 13px; margin: 0;">So erscheint die Website bei Google &amp; anderen Suchmaschinen.</p>
                </div>
                <span class="olla-status-pill is-upcoming" style="font-size: 11px;">Echtzeit-Vorschau</span>
            </div>
        </div>
        <div class="olla-card-body" style="background: #faf8f5;">
            <div class="olla-serp-preview-box" style="background: #ffffff; border: 1px solid #dfe1e5; border-radius: 8px; padding: 18px 22px; max-width: 660px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background: #15110e; border: 1px solid #DAA520; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
                        <img id="serp-preview-icon" src="<?php echo esc_url($serp_icon_preview); ?>" style="width: 20px; height: 20px; object-fit: contain;" alt="Favicon" />
                    </div>
                    <div>
                        <div style="font-size: 13px; color: #202124; line-height: 1.3; font-weight: 500;"><?php echo esc_html(get_option('blogname', 'Ensemble Olla Podrida')); ?></div>
                        <div style="font-size: 11.5px; color: #4d5156; line-height: 1.2;" id="serp-preview-url"><?php echo esc_html(home_url('/')); ?></div>
                    </div>
                </div>
                <h3 id="serp-preview-title" style="color: #1a0dab; font-size: 19px; line-height: 1.3; margin: 4px 0 6px 0; font-weight: normal; cursor: pointer; text-decoration: none;">
                    <?php echo esc_html(!empty($seo['meta_title']) ? $seo['meta_title'] : 'Ensemble Olla Podrida | Musik aus Mittelalter & Renaissance'); ?>
                </h3>
                <p id="serp-preview-desc" style="color: #4d5156; font-size: 13.5px; line-height: 1.5; margin: 0;">
                    <?php echo esc_html(!empty($seo['meta_description']) ? $seo['meta_description'] : 'Das Ensemble Olla Podrida erweckt mit Krummhörnern, Harfe, Sackpfeifen, Flöten und Gesang historische Musik aus Mittelalter und Renaissance zu neuem Leben.'); ?>
                </p>
            </div>

            <!-- Snippet Icon Selector -->
            <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #e5dac9; max-width: 660px;">
                <label for="google_snippet_icon" style="font-weight: 600; color: #2c1810; display: block; margin-bottom: 4px; font-size: 13px;">
                    🔍 Google-Suchergebnis Favicon / Vorschau-Logo (Optional):
                </label>
                <p class="description" style="margin-bottom: 8px; color: #666; font-size: 12px; line-height: 1.4;">
                    Wird als kleines rundes Website-Icon neben der Domain im Google-Suchergebnis angezeigt. Bleibt dieses Feld leer, nutzt das System automatisch das hinterlegte <strong>Website-Favicon</strong>.
                </p>
                <div class="olla-media-row" style="display: flex; gap: 8px; align-items: center;">
                    <input type="text" name="google_snippet_icon" id="google_snippet_icon" value="<?php echo esc_url($current_snippet_icon); ?>" class="regular-text olla-media-input" placeholder="Standard: Website-Favicon verwenden (<?php echo esc_attr(basename($default_favicon)); ?>)" style="flex: 1;" />
                    <button type="button" class="button button-secondary olla-media-upload-btn" data-target="#google_snippet_icon" data-preview="#google_snippet_icon_preview">Aus Mediathek wählen</button>
                    <button type="button" class="button olla-media-remove-btn" data-target="#google_snippet_icon" data-preview="#google_snippet_icon_preview" style="<?php echo empty($current_snippet_icon) ? 'display: none;' : ''; ?>">Entfernen</button>
                </div>
                <div class="olla-media-preview" id="google_snippet_icon_preview" style="margin-top: 6px;">
                    <?php if (!empty($current_snippet_icon)): ?>
                        <img src="<?php echo esc_url($current_snippet_icon); ?>" style="max-height: 36px; border-radius: 4px; border: 1px solid #ddd; padding: 2px;" />
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Meta Tags & Basiseinstellungen -->
    <div class="olla-card" style="margin-bottom: 24px;">
        <div class="olla-card-header">
            <h2>Suchmaschinen-Metadaten (SEO)</h2>
            <p>Konfigurieren Sie Titel, Kurzbeschreibung und Suchbegriffe für Suchmaschinen (Google, Bing, Ecosia).</p>
        </div>
        <div class="olla-card-body">
            <div class="olla-field-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label for="meta_title" style="margin: 0; font-weight: 600;">Meta-Titel (Title Tag) <span style="color:#d63638;">*</span></label>
                    <span id="meta_title_count" style="font-size: 12px; color: #646970;">0 / 60 Zeichen</span>
                </div>
                <input type="text" id="meta_title" name="meta_title" value="<?php echo esc_attr($seo['meta_title'] ?? ''); ?>" class="large-text" placeholder="z. B. Ensemble Olla Podrida | Musik aus Mittelalter & Renaissance" />
                <p class="description">Optimal: 50 bis 60 Zeichen. Der Meta-Titel erscheint prominent als Überschrift in den Suchergebnissen und als Tab-Titel im Webbrowser.</p>
            </div>

            <div class="olla-field-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label for="meta_description" style="margin: 0; font-weight: 600;">Meta-Beschreibung (Meta Description) <span style="color:#d63638;">*</span></label>
                    <span id="meta_desc_count" style="font-size: 12px; color: #646970;">0 / 160 Zeichen</span>
                </div>
                <textarea id="meta_description" name="meta_description" rows="3" class="large-text" placeholder="Kurze, ansprechende Zusammenfassung für Suchergebnisse"><?php echo esc_textarea($seo['meta_description'] ?? ''); ?></textarea>
                <p class="description">Optimal: 140 bis 160 Zeichen. Die Meta-Beschreibung fasst den Inhalt prägnant zusammen und animiert Nutzer zum Anklicken des Suchtreffers.</p>
            </div>

            <div class="olla-grid-2">
                <div class="olla-field-group">
                    <label for="meta_keywords" style="font-weight: 600;">Suchbegriffe / Meta-Keywords</label>
                    <input type="text" id="meta_keywords" name="meta_keywords" value="<?php echo esc_attr($seo['meta_keywords'] ?? ''); ?>" placeholder="Mittelaltermusik, Renaissance, Krummhorn, Harfe, Konzerte, Osnabrück" />
                    <p class="description">Kommagetrennte Schlagwörter zur thematischen Einordnung.</p>
                </div>

                <div class="olla-field-group">
                    <label for="robots_index" style="font-weight: 600;">Suchmaschinen-Robots (Indexierung)</label>
                    <select id="robots_index" name="robots_index">
                        <option value="index, follow" <?php selected($seo['robots_index'] ?? 'index, follow', 'index, follow'); ?>>index, follow (Standard – Seite indexieren & Links folgen)</option>
                        <option value="noindex, follow" <?php selected($seo['robots_index'] ?? '', 'noindex, follow'); ?>>noindex, follow (Nicht indexieren, Links jedoch folgen)</option>
                        <option value="noindex, nofollow" <?php selected($seo['robots_index'] ?? '', 'noindex, nofollow'); ?>>noindex, nofollow (Komplett von Suchmaschinen fernhalten)</option>
                    </select>
                    <p class="description">Steuert, ob Suchmaschinen-Crawler die Seite in ihren Suchindex aufnehmen dürfen.</p>
                </div>
            </div>

            <div class="olla-field-group" style="margin-bottom: 0;">
                <label for="canonical_url" style="font-weight: 600;">Kanonische URL (Canonical URL)</label>
                <input type="url" id="canonical_url" name="canonical_url" value="<?php echo esc_url($seo['canonical_url'] ?? ''); ?>" class="large-text" placeholder="<?php echo esc_url(home_url('/')); ?>" />
                <p class="description">Standardmäßig leer lassen (wird automatisch auf die Hauptadresse gesetzt). Verhindert Probleme durch doppelten Inhalt (Duplicate Content).</p>
            </div>
        </div>
    </div>

    <!-- 3. Google Search Console & Webmaster-Verifizierung -->
    <div class="olla-card" style="margin-bottom: 24px; border-left: 4px solid #DAA520;">
        <div class="olla-card-header">
            <h2>Google Search Console &amp; Webmaster-Verifizierung</h2>
            <p>Bestätigen Sie die Inhaberschaft der Website für die Google Search Console und weitere Suchmaschinen.</p>
        </div>
        <div class="olla-card-body">
            <div class="olla-field-group" style="margin-bottom: 0;">
                <label for="google_site_verification" style="font-weight: 600;">Google Site Verification Code (HTML-Tag-Methode)</label>
                <input type="text" id="google_site_verification" name="google_site_verification" value="<?php echo esc_attr($seo['google_site_verification'] ?? ''); ?>" class="large-text code" placeholder="z. B. 4x8ABCdefGHIjklMNOpqrsTUVwxyz123 oder das vollständige &lt;meta name=...&gt;" />
                <p class="description">
                    Tragen Sie hier den Verifizierungscode ein, den Sie in der <strong>Google Search Console</strong> unter <em>Einstellungen &rarr; Bestätigung der Inhaberschaft &rarr; HTML-Tag</em> erhalten. Sie können entweder nur den Schlüsselcode oder das gesamte <code>&lt;meta name="google-site-verification" content="..." /&gt;</code> einfügen – das System erkennt und bereinigt den Code automatisch und platziert den Meta-Tag an der optimalen Stelle im HTML-Kopf.
                </p>
                <?php if (!empty($seo['google_site_verification'])): ?>
                    <div style="margin-top: 12px; padding: 10px 14px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; font-size: 13px; color: #166534; display: flex; align-items: center; gap: 8px;">
                        <span class="dashicons dashicons-yes-alt" style="color: #22c55e;"></span>
                        <span><strong>Aktiv im Quellcode eingebunden:</strong> <code>&lt;meta name="google-site-verification" content="<?php echo esc_attr($seo['google_site_verification']); ?>" /&gt;</code></span>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- 4. Social Media Sharing & Open Graph -->
    <div class="olla-card" style="margin-bottom: 24px;">
        <div class="olla-card-header">
            <h2>Social Media &amp; Open Graph (Facebook, WhatsApp, LinkedIn, etc.)</h2>
            <p>Definiert Vorschaubilder, Überschriften und Texte beim Teilen des Links über Messaging-Dienste und soziale Netzwerke.</p>
        </div>
        <div class="olla-card-body">
            <div class="olla-grid-2">
                <div class="olla-field-group">
                    <label for="og_title" style="font-weight: 600;">OpenGraph-Titel</label>
                    <input type="text" id="og_title" name="og_title" value="<?php echo esc_attr($seo['og_title'] ?? ''); ?>" placeholder="Ensemble Olla Podrida – Klangvielfalt aus Mittelalter und Renaissance" />
                    <p class="description">Titel bei Facebook / WhatsApp-Vorschau. Leer lassen, um den Meta-Titel zu verwenden.</p>
                </div>

                <div class="olla-field-group">
                    <label for="og_type" style="font-weight: 600;">OpenGraph-Typ</label>
                    <select id="og_type" name="og_type">
                        <option value="website" <?php selected($seo['og_type'] ?? 'website', 'website'); ?>>website (Allgemeine Webpräsenz)</option>
                        <option value="music.group" <?php selected($seo['og_type'] ?? '', 'music.group'); ?>>music.group (Musikalische Gruppe)</option>
                        <option value="article" <?php selected($seo['og_type'] ?? '', 'article'); ?>>article (Beitrag / Publikation)</option>
                    </select>
                </div>
            </div>

            <div class="olla-field-group">
                <label for="og_description" style="font-weight: 600;">OpenGraph-Beschreibung</label>
                <textarea id="og_description" name="og_description" rows="2" class="large-text" placeholder="Kurze Beschreibung beim Teilen auf Social Media..."><?php echo esc_textarea($seo['og_description'] ?? ''); ?></textarea>
            </div>

            <div class="olla-field-group">
                <label for="og_image" style="font-weight: 600;">Social Media Vorschaubild (Share Image / OG Image)</label>
                <div class="olla-media-row">
                    <input type="text" id="og_image" name="og_image" value="<?php echo esc_url($seo['og_image'] ?? ''); ?>" class="large-text" />
                    <button type="button" class="button button-secondary olla-upload-button" data-target="#og_image">
                        <span class="dashicons dashicons-upload" style="margin-top:4px;"></span> Bild wählen
                    </button>
                </div>
                <p class="description">Empfohlene Auflösung: 1200 × 630 Pixel (Querformat) oder 1080 × 1080 Pixel (Quadrat). Mindestgröße 600 × 315 Pixel.</p>
                <?php if (!empty($seo['og_image'])): ?>
                    <div class="olla-media-preview" style="margin-top: 10px;">
                        <img src="<?php echo esc_url($seo['og_image']); ?>" style="max-height: 120px; border-radius: 4px; border: 1px solid #ccc;" alt="Social Preview" />
                    </div>
                <?php endif; ?>
            </div>

            <div class="olla-field-group" style="margin-bottom: 0;">
                <label for="twitter_card" style="font-weight: 600;">Twitter / X Kartentyp (Twitter Card)</label>
                <select id="twitter_card" name="twitter_card">
                    <option value="summary_large_image" <?php selected($seo['twitter_card'] ?? 'summary_large_image', 'summary_large_image'); ?>>summary_large_image (Großes Vorschaubild – empfohlen)</option>
                    <option value="summary" <?php selected($seo['twitter_card'] ?? '', 'summary'); ?>>summary (Kompakte Vorschau mit kleinem Quadrat)</option>
                </select>
            </div>
        </div>
    </div>

    <!-- 5. Strukturierte Daten (Schema.org / JSON-LD) -->
    <div class="olla-card" style="margin-bottom: 24px;">
        <div class="olla-card-header">
            <h2>Strukturierte Daten (Schema.org JSON-LD)</h2>
            <p>Macht das Ensemble und die Konzerte für Suchmaschinen maschinenlesbar (Knowledge Graph, Rich Snippets, Veranstaltungskalender).</p>
        </div>
        <div class="olla-card-body">
            <div class="olla-field-group">
                <label style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" name="schema_enabled" value="1" <?php checked(!empty($seo['schema_enabled'])); ?> />
                    Strukturierte Daten im HTML-Quellcode ausgeben (JSON-LD)
                </label>
                <p class="description" style="margin-left: 24px;">Aktiviert die Ausgabe von Google-zertifiziertem Schema.org JSON-LD mit Musikerangaben, Instrumentarium und kommenden Konzertterminen.</p>
            </div>

            <div class="olla-grid-2">
                <div class="olla-field-group">
                    <label for="schema_type" style="font-weight: 600;">Ensemble-Schema-Typ</label>
                    <select id="schema_type" name="schema_type">
                        <option value="MusicGroup" <?php selected($seo['schema_type'] ?? 'MusicGroup', 'MusicGroup'); ?>>MusicGroup (Musikgruppe / Ensemble – empfohlen)</option>
                        <option value="PerformingGroup" <?php selected($seo['schema_type'] ?? '', 'PerformingGroup'); ?>>PerformingGroup (Künstler- / Darstellergruppe)</option>
                    </select>
                </div>

                <div class="olla-field-group">
                    <label for="schema_genre" style="font-weight: 600;">Musikgenre(s)</label>
                    <input type="text" id="schema_genre" name="schema_genre" value="<?php echo esc_attr($seo['schema_genre'] ?? 'Mittelaltermusik, Renaissancemusik, Alte Musik'); ?>" />
                </div>
            </div>
        </div>
    </div>

    <!-- Save Button Footer -->
    <div class="olla-card-footer" style="background: #fff; border: 1px solid #e2e4e7; border-radius: 8px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #646970; font-size: 13px;">
            <span class="dashicons dashicons-yes-alt" style="color: #46b450; vertical-align: middle;"></span> Alle Änderungen werden sofort auf der Website wirksam.
        </span>
        <button type="submit" class="button button-primary button-hero" style="background: #e8a825; border-color: #cb8b10; color: #070202; font-weight: 700; text-shadow: none;">
            <span class="dashicons dashicons-saved" style="margin-top:4px;"></span> SEO-Einstellungen speichern
        </button>
    </div>
</form>

<script>
(function() {
    // Character counters & real-time SERP sync
    const titleInput = document.getElementById('meta_title');
    const descInput = document.getElementById('meta_description');
    const titleCount = document.getElementById('meta_title_count');
    const descCount = document.getElementById('meta_desc_count');
    const serpTitle = document.getElementById('serp-preview-title');
    const serpDesc = document.getElementById('serp-preview-desc');

    function updateTitle() {
        if (!titleInput) return;
        const val = titleInput.value.trim();
        const len = val.length;
        if (titleCount) {
            titleCount.textContent = len + ' / 60 Zeichen';
            titleCount.style.color = (len >= 40 && len <= 60) ? '#46b450' : (len > 60 ? '#d63638' : '#646970');
        }
        if (serpTitle) {
            serpTitle.textContent = val || 'Ensemble Olla Podrida | Musik aus Mittelalter & Renaissance';
        }
    }

    function updateDesc() {
        if (!descInput) return;
        const val = descInput.value.trim();
        const len = val.length;
        if (descCount) {
            descCount.textContent = len + ' / 160 Zeichen';
            descCount.style.color = (len >= 120 && len <= 160) ? '#46b450' : (len > 160 ? '#d63638' : '#646970');
        }
        if (serpDesc) {
            serpDesc.textContent = val || 'Das Ensemble Olla Podrida erweckt mit Krummhörnern, Harfe, Sackpfeifen, Flöten und Gesang historische Musik aus Mittelalter und Renaissance zu neuem Leben.';
        }
    }

    const iconInput = document.getElementById('google_snippet_icon');
    const serpIcon = document.getElementById('serp-preview-icon');
    const defaultIconUrl = <?php echo wp_json_encode($default_favicon); ?>;

    function updateIcon() {
        if (!serpIcon) return;
        const val = iconInput ? iconInput.value.trim() : '';
        serpIcon.src = val || defaultIconUrl;
    }

    if (titleInput) {
        titleInput.addEventListener('input', updateTitle);
        updateTitle();
    }
    if (descInput) {
        descInput.addEventListener('input', updateDesc);
        updateDesc();
    }
    if (iconInput) {
        iconInput.addEventListener('input', updateIcon);
        iconInput.addEventListener('change', updateIcon);
        // Also observe when media picker sets value
        jQuery(iconInput).on('change input', updateIcon);
    }
})();
</script>
