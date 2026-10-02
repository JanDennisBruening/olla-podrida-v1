<?php
if (!defined('ABSPATH')) {
    exit;
}

$legal = Olla_Podrida_Settings::get_section('legal');
?>

<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="olla-form-box">
    <input type="hidden" name="action" value="olla_podrida_save_settings" />
    <input type="hidden" name="section" value="legal" />
    <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>

    <div class="olla-card">
        <div class="olla-card-header">
            <h2>⚖️ Rechtliches, Footer &amp; Cookie-Hinweise</h2>
            <p>Passe Impressum, Datenschutzerklärung, Footer-Siegel und Cookie-Banner an.</p>
        </div>

        <div class="olla-card-body">
            <?php
            $defaults = Olla_Podrida_Settings::get_defaults();
            $impressum_val = $legal['impressum_html'] ?? '';
            if (empty($impressum_val) || strlen(strip_tags($impressum_val)) < 1400) {
                $impressum_val = $defaults['legal']['impressum_html'];
            }

            $datenschutz_val = $legal['datenschutz_html'] ?? '';
            if (empty($datenschutz_val) || strlen(strip_tags($datenschutz_val)) < 1200) {
                $datenschutz_val = $defaults['legal']['datenschutz_html'];
            }
            ?>

            <!-- 1. Impressum-Text -->
            <div class="olla-field-group">
                <label for="impressum_html"><strong>1. Impressum-Text (Modal-Inhalt):</strong></label>
                <p class="description" style="margin-bottom: 6px; color: #666;">
                    Wird im modalen Fenster „Impressum“ auf der Website angezeigt.
                </p>
                <?php
                wp_editor(
                    $impressum_val,
                    'impressum_html',
                    ['textarea_rows' => 14, 'media_buttons' => false, 'teeny' => true]
                );
                ?>
            </div>

            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />

            <!-- 2. Datenschutzerklärung -->
            <div class="olla-field-group">
                <label for="datenschutz_html"><strong>2. Datenschutzerklärung (Modal-Inhalt):</strong></label>
                <p class="description" style="margin-bottom: 6px; color: #666;">
                    Vollständige Datenschutzerklärung (DSGVO / DDG mit 7 Kapiteln, inkl. IONOS AVV Art. 28 DSGVO). Änderungen hier werden 1:1 im modalen Fenster auf der Website übernommen.
                </p>
                <?php
                wp_editor(
                    $datenschutz_val,
                    'datenschutz_html',
                    ['textarea_rows' => 22, 'media_buttons' => false, 'teeny' => true]
                );
                ?>
            </div>

            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />

            <!-- 3. Cookie-Banner -->
            <h3>🍪 3. Cookie-Banner</h3>
            <div class="olla-field-group">
                <label for="cookie_banner_text"><strong>Banner-Hinweistext:</strong></label>
                <textarea id="cookie_banner_text" name="cookie_banner_text" rows="3" class="large-text"><?php echo esc_textarea($legal['cookie_banner_text'] ?? ''); ?></textarea>
            </div>

            <div class="olla-grid-2">
                <div class="olla-field-group">
                    <label for="cookie_accept_text"><strong>Text Akzeptieren-Button:</strong></label>
                    <input type="text" id="cookie_accept_text" name="cookie_accept_text" value="<?php echo esc_attr($legal['cookie_accept_text'] ?? 'Einverstanden'); ?>" class="regular-text" />
                </div>
                <div class="olla-field-group">
                    <label for="cookie_decline_text"><strong>Text Ablehnen-Button:</strong></label>
                    <input type="text" id="cookie_decline_text" name="cookie_decline_text" value="<?php echo esc_attr($legal['cookie_decline_text'] ?? 'Nur Notwendige'); ?>" class="regular-text" />
                </div>
            </div>

            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />

            <!-- 4. Copyright-Zeile im Footer -->
            <div class="olla-field-group">
                <label for="copyright_text"><strong>4. Copyright-Zeile im Footer:</strong></label>
                <input type="text" id="copyright_text" name="copyright_text" value="<?php echo esc_attr($legal['copyright_text'] ?? ''); ?>" class="large-text" />
                <p class="description" style="margin-top: 5px; color: #666;">
                    💡 <strong>Hinweis:</strong> Die Jahreszahl wird im Frontend automatisch fortlaufend aktuell gehalten (z. B. <code><?php echo date('Y'); ?> © Ensemble Olla Podrida</code>). Angaben zu Design, Webentwicklung und Fotografie werden separat darunter gerendert.
                </p>
            </div>

            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />

            <!-- 5. Footersiegel -->
            <div class="olla-field-group olla-media-field">
                <label><strong>5. Footer-Siegel (Historisches Rundsiegel über dem Footer):</strong></label>
                <p class="description" style="margin-bottom: 6px; color: #666;">
                    Hier kann das historische Wachs- bzw. Rundsiegel aus der WordPress-Mediathek ausgewählt oder ausgetauscht werden.
                </p>
                <div class="olla-media-row">
                    <input type="text" name="seal_image" id="seal_image" value="<?php echo esc_url($legal['seal_image'] ?? ''); ?>" class="regular-text olla-media-input" placeholder="https://..." />
                    <button type="button" class="button button-secondary olla-media-upload-btn" data-target="#seal_image" data-preview="#seal_image_preview">Aus Mediathek wählen</button>
                    <button type="button" class="button olla-media-remove-btn" data-target="#seal_image" data-preview="#seal_image_preview" style="<?php echo empty($legal['seal_image']) ? 'display: none;' : ''; ?>">Entfernen</button>
                </div>
                <div class="olla-media-preview" id="seal_image_preview">
                    <?php if (!empty($legal['seal_image'])): ?>
                        <img src="<?php echo esc_url($legal['seal_image']); ?>" style="max-height: 80px; margin-top: 6px; border-radius: 4px;" />
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <div class="olla-card-footer">
            <button type="submit" class="button button-primary button-large">Rechtliches &amp; Footer speichern</button>
        </div>
    </div>
</form>
