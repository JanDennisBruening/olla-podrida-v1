<?php
if (!defined('ABSPATH')) {
    exit;
}

$press = Olla_Podrida_Settings::get_section('press');
?>

<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="olla-form-box">
    <input type="hidden" name="action" value="olla_podrida_save_settings" />
    <input type="hidden" name="section" value="press" />
    <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>

    <div class="olla-card">
        <div class="olla-card-header">
            <h2>📰 Presse- &amp; Medienbereich verwalten</h2>
            <p>Verwalte hier das Pressematerial, Ensemble-Logos und druckfähige Ansichtsbilder für Zeitungen, Magazine und Veranstalter.</p>
        </div>

        <div class="olla-card-body">
            <!-- Titel & Untertitel -->
            <div class="olla-grid-2">
                <div class="olla-field-group">
                    <label for="title"><strong>Überschrift des Presse-Bereichs:</strong></label>
                    <input type="text" id="title" name="title" value="<?php echo esc_attr($press['title'] ?? 'Presse & Medienmaterial'); ?>" class="regular-text" />
                </div>
                <div class="olla-field-group">
                    <label for="subtitle"><strong>Untertitel / Kurzbeschreibung:</strong></label>
                    <input type="text" id="subtitle" name="subtitle" value="<?php echo esc_attr($press['subtitle'] ?? 'Offizielle Pressematerialien, Logos und Bilddateien des Ensemble Olla Podrida'); ?>" class="regular-text" />
                </div>
            </div>

            <!-- Pressetext / Boilerplate -->
            <div class="olla-field-group" style="margin-top: 15px;">
                <label for="intro_text"><strong>Offizieller Pressetext (Kurzfassung / Boilerplate für Redaktionen):</strong></label>
                <p class="description">Dieser Text wird im Presse-Modal angezeigt und kann von Journalisten und Veranstaltern mit einem Klick in die Zwischenablage kopiert werden.</p>
                <?php
                wp_editor(
                    $press['intro_text'] ?? '',
                    'intro_text',
                    ['textarea_rows' => 6, 'media_buttons' => false, 'teeny' => true]
                );
                ?>
            </div>

            <!-- Pressekontakt & Urheberrechte -->
            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />
            <h3>✉️ Ansprechpartner für die Presse</h3>
            <div class="olla-grid-2">
                <div class="olla-field-group">
                    <label for="contact_name"><strong>Name der Ansprechpartnerin / des Ansprechpartners:</strong></label>
                    <input type="text" id="contact_name" name="contact_name" value="<?php echo esc_attr($press['contact_name'] ?? 'Susanne Hoffmann (Ensembleleitung)'); ?>" class="regular-text" />
                </div>
                <div class="olla-field-group">
                    <label for="contact_email"><strong>Presse-E-Mail-Adresse:</strong></label>
                    <input type="email" id="contact_email" name="contact_email" value="<?php echo esc_attr($press['contact_email'] ?? 'info@olla-podrida.de'); ?>" class="regular-text" />
                </div>
            </div>

            <div class="olla-field-group" style="margin-top: 15px;">
                <label for="press_note"><strong>Nutzungs- &amp; Urheberrechtshinweis (z.B. Abdruck honorarfrei):</strong></label>
                <textarea id="press_note" name="press_note" rows="2" class="large-text"><?php echo esc_textarea($press['press_note'] ?? 'Die hier bereitgestellten Pressefotos und Grafiken dürfen im Rahmen redaktioneller Berichterstattung über das Ensemble Olla Podrida sowie zur Ankündigung von Veranstaltungen unter Nennung der Quelle honorarfrei verwendet werden.'); ?></textarea>
            </div>

            <!-- Logos & Bildmarken -->
            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />
            <h3>🎨 Ensemble-Logos &amp; Grafiken (Für Plakate, Magazine &amp; Online)</h3>

            <div class="olla-grid-2">
                <!-- 1. Topf-Emblem -->
                <div class="olla-field-group olla-media-field">
                    <label><strong>1. Freigestelltes Wappen (Topf-Emblem, PNG):</strong></label>
                    <div class="olla-media-row">
                        <input type="text" name="logo_pot" id="logo_pot" value="<?php echo esc_url($press['logo_pot'] ?? ''); ?>" class="regular-text olla-media-input" />
                        <button type="button" class="button olla-media-upload-btn" data-target="#logo_pot" data-preview="#logo_pot_preview">Wählen</button>
                    </div>
                    <div class="olla-media-preview" id="logo_pot_preview" style="background:#251811; padding:6px; border-radius:6px; margin-top:6px; display:inline-block;">
                        <?php if (!empty($press['logo_pot'])): ?>
                            <img src="<?php echo esc_url($press['logo_pot']); ?>" style="max-height: 60px;" />
                        <?php endif; ?>
                    </div>
                </div>

                <!-- 2. Logo-Banner -->
                <div class="olla-field-group olla-media-field">
                    <label><strong>2. Offizieller Schriftzug &amp; Banner (PNG mit Transparenz):</strong></label>
                    <div class="olla-media-row">
                        <input type="text" name="logo_banner" id="logo_banner" value="<?php echo esc_url($press['logo_banner'] ?? ''); ?>" class="regular-text olla-media-input" />
                        <button type="button" class="button olla-media-upload-btn" data-target="#logo_banner" data-preview="#logo_banner_preview">Wählen</button>
                    </div>
                    <div class="olla-media-preview" id="logo_banner_preview" style="background:#251811; padding:6px; border-radius:6px; margin-top:6px; display:inline-block;">
                        <?php if (!empty($press['logo_banner'])): ?>
                            <img src="<?php echo esc_url($press['logo_banner']); ?>" style="max-height: 60px;" />
                        <?php endif; ?>
                    </div>
                </div>

                <!-- 3. Rundsiegel -->
                <div class="olla-field-group olla-media-field">
                    <label><strong>3. Historisches Rundsiegel (PNG):</strong></label>
                    <div class="olla-media-row">
                        <input type="text" name="logo_seal" id="logo_seal" value="<?php echo esc_url($press['logo_seal'] ?? ''); ?>" class="regular-text olla-media-input" />
                        <button type="button" class="button olla-media-upload-btn" data-target="#logo_seal" data-preview="#logo_seal_preview">Wählen</button>
                    </div>
                    <div class="olla-media-preview" id="logo_seal_preview" style="background:#251811; padding:6px; border-radius:6px; margin-top:6px; display:inline-block;">
                        <?php if (!empty($press['logo_seal'])): ?>
                            <img src="<?php echo esc_url($press['logo_seal']); ?>" style="max-height: 60px;" />
                        <?php endif; ?>
                    </div>
                </div>

                <!-- 4. Druckfähiges Logo -->
                <div class="olla-field-group olla-media-field">
                    <label><strong>4. Druckfähiges Logo (RGB / Printqualität, JPG):</strong></label>
                    <div class="olla-media-row">
                        <input type="text" name="logo_print" id="logo_print" value="<?php echo esc_url($press['logo_print'] ?? ''); ?>" class="regular-text olla-media-input" />
                        <button type="button" class="button olla-media-upload-btn" data-target="#logo_print" data-preview="#logo_print_preview">Wählen</button>
                    </div>
                    <div class="olla-media-preview" id="logo_print_preview" style="margin-top:6px;">
                        <?php if (!empty($press['logo_print'])): ?>
                            <img src="<?php echo esc_url($press['logo_print']); ?>" style="max-height: 60px;" />
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Ansichtsbilder & Pressefotos -->
            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />
            <h3>📷 Ansichtsbilder &amp; Pressefotos (Hochauflösend für Redaktionen &amp; Zeitungen)</h3>

            <div class="olla-grid-2">
                <!-- Foto 1 -->
                <div class="olla-field-group olla-media-field" style="background:#fdfcf7; border:1px solid #e2dac8; padding:15px; border-radius:8px;">
                    <label><strong>Pressefoto 1: Gesamtensemble / Bühnenansicht</strong></label>
                    <input type="text" name="photo1_title" value="<?php echo esc_attr($press['photo1_title'] ?? 'Ensemble Olla Podrida Gesamtansicht'); ?>" placeholder="Bildtitel / Bildunterschrift" class="large-text" style="margin-bottom:8px;" />
                    <div class="olla-media-row">
                        <input type="text" name="photo1_url" id="photo1_url" value="<?php echo esc_url($press['photo1_url'] ?? ''); ?>" class="regular-text olla-media-input" />
                        <button type="button" class="button olla-media-upload-btn" data-target="#photo1_url" data-preview="#photo1_preview">Aus Mediathek</button>
                    </div>
                    <div class="olla-media-preview" id="photo1_preview" style="margin-top:6px;">
                        <?php if (!empty($press['photo1_url'])): ?>
                            <img src="<?php echo esc_url($press['photo1_url']); ?>" style="max-height: 80px; border-radius:4px;" />
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Foto 2 -->
                <div class="olla-field-group olla-media-field" style="background:#fdfcf7; border:1px solid #e2dac8; padding:15px; border-radius:8px;">
                    <label><strong>Pressefoto 2: Live-Auftritt / Markt / Open-Air</strong></label>
                    <input type="text" name="photo2_title" value="<?php echo esc_attr($press['photo2_title'] ?? 'Live-Auftritt Bio-Regio-Markt Stift Börstel'); ?>" placeholder="Bildtitel / Bildunterschrift" class="large-text" style="margin-bottom:8px;" />
                    <div class="olla-media-row">
                        <input type="text" name="photo2_url" id="photo2_url" value="<?php echo esc_url($press['photo2_url'] ?? ''); ?>" class="regular-text olla-media-input" />
                        <button type="button" class="button olla-media-upload-btn" data-target="#photo2_url" data-preview="#photo2_preview">Aus Mediathek</button>
                    </div>
                    <div class="olla-media-preview" id="photo2_preview" style="margin-top:6px;">
                        <?php if (!empty($press['photo2_url'])): ?>
                            <img src="<?php echo esc_url($press['photo2_url']); ?>" style="max-height: 80px; border-radius:4px;" />
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Foto 3 -->
                <div class="olla-field-group olla-media-field" style="background:#fdfcf7; border:1px solid #e2dac8; padding:15px; border-radius:8px;">
                    <label><strong>Pressefoto 3: Konzertsaal / Kirche / Historischer Raum</strong></label>
                    <input type="text" name="photo3_title" value="<?php echo esc_attr($press['photo3_title'] ?? 'Konzert St. Marienkirche Quakenbrück'); ?>" placeholder="Bildtitel / Bildunterschrift" class="large-text" style="margin-bottom:8px;" />
                    <div class="olla-media-row">
                        <input type="text" name="photo3_url" id="photo3_url" value="<?php echo esc_url($press['photo3_url'] ?? ''); ?>" class="regular-text olla-media-input" />
                        <button type="button" class="button olla-media-upload-btn" data-target="#photo3_url" data-preview="#photo3_preview">Aus Mediathek</button>
                    </div>
                    <div class="olla-media-preview" id="photo3_preview" style="margin-top:6px;">
                        <?php if (!empty($press['photo3_url'])): ?>
                            <img src="<?php echo esc_url($press['photo3_url']); ?>" style="max-height: 80px; border-radius:4px;" />
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Foto 4 -->
                <div class="olla-field-group olla-media-field" style="background:#fdfcf7; border:1px solid #e2dac8; padding:15px; border-radius:8px;">
                    <label><strong>Pressefoto 4: Kulisse / Instrumentarium / Detailaufnahme</strong></label>
                    <input type="text" name="photo4_title" value="<?php echo esc_attr($press['photo4_title'] ?? 'Bühnenkulisse & Instrumentarium'); ?>" placeholder="Bildtitel / Bildunterschrift" class="large-text" style="margin-bottom:8px;" />
                    <div class="olla-media-row">
                        <input type="text" name="photo4_url" id="photo4_url" value="<?php echo esc_url($press['photo4_url'] ?? ''); ?>" class="regular-text olla-media-input" />
                        <button type="button" class="button olla-media-upload-btn" data-target="#photo4_url" data-preview="#photo4_preview">Aus Mediathek</button>
                    </div>
                    <div class="olla-media-preview" id="photo4_preview" style="margin-top:6px;">
                        <?php if (!empty($press['photo4_url'])): ?>
                            <img src="<?php echo esc_url($press['photo4_url']); ?>" style="max-height: 80px; border-radius:4px;" />
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <div class="olla-card-footer">
            <button type="submit" class="button button-primary button-large">Pressematerialien speichern</button>
        </div>
    </div>
</form>
