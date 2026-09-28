<?php
if (!defined('ABSPATH')) {
    exit;
}

$hero = Olla_Podrida_Settings::get_section('hero');
?>

<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="olla-form-box">
    <input type="hidden" name="action" value="olla_podrida_save_settings" />
    <input type="hidden" name="section" value="hero" />
    <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>

    <div class="olla-card">
        <div class="olla-card-header">
            <h2>🏰 Start & Theatralische Hero-Bühne (#Start)</h2>
            <p>Verwalte die Eröffnungsszene, Hintergrundbilder und den atmosphärischen Bodennebel.</p>
        </div>

        <div class="olla-card-body">
            <div class="olla-field-group">
                <label for="slogan"><strong>Haupttitel / Ensemble-Name:</strong></label>
                <input type="text" id="slogan" name="slogan" value="<?php echo esc_attr($hero['slogan'] ?? 'Ensemble Olla Podrida'); ?>" class="regular-text" />
            </div>

            <div class="olla-field-group">
                <label for="subtitle"><strong>Untertitel / Slogan:</strong></label>
                <input type="text" id="subtitle" name="subtitle" value="<?php echo esc_attr($hero['subtitle'] ?? 'Klangvielfalt aus Mittelalter und Renaissance'); ?>" class="large-text" />
            </div>

            <div class="olla-field-group olla-media-field">
                <label><strong>Hintergrundbild Desktop (Großer Steinwand-Saal):</strong></label>
                <div class="olla-media-row">
                    <input type="text" name="bg_desktop" id="bg_desktop" value="<?php echo esc_url($hero['bg_desktop'] ?? ''); ?>" class="regular-text olla-media-input" />
                    <button type="button" class="button olla-media-upload-btn" data-target="#bg_desktop" data-preview="#bg_desktop_preview">Aus Mediathek wählen</button>
                </div>
                <div class="olla-media-preview" id="bg_desktop_preview">
                    <?php if (!empty($hero['bg_desktop'])): ?>
                        <img src="<?php echo esc_url($hero['bg_desktop']); ?>" style="max-height: 120px; border-radius: 6px; margin-top: 8px; border: 1px solid #ddd;" />
                    <?php endif; ?>
                </div>
            </div>

            <div class="olla-field-group olla-media-field">
                <label><strong>Hintergrundbild Mobilgeräte (Hochformat / optimiert):</strong></label>
                <div class="olla-media-row">
                    <input type="text" name="bg_mobile" id="bg_mobile" value="<?php echo esc_url($hero['bg_mobile'] ?? ''); ?>" class="regular-text olla-media-input" />
                    <button type="button" class="button olla-media-upload-btn" data-target="#bg_mobile" data-preview="#bg_mobile_preview">Aus Mediathek wählen</button>
                </div>
                <div class="olla-media-preview" id="bg_mobile_preview">
                    <?php if (!empty($hero['bg_mobile'])): ?>
                        <img src="<?php echo esc_url($hero['bg_mobile']); ?>" style="max-height: 120px; border-radius: 6px; margin-top: 8px; border: 1px solid #ddd;" />
                    <?php endif; ?>
                </div>
            </div>

            <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />

            <div class="olla-field-group">
                <label>
                    <input type="checkbox" name="smoke_enabled" value="1" <?php checked(!empty($hero['smoke_enabled'])); ?> />
                    <strong>Atmosphärischen Bodennebel & Rauch aktivieren</strong>
                </label>
                <p class="description">Erzeugt den geheimnisvollen, animierten Nebelschleier am unteren Bühnenrand.</p>
            </div>

            <div class="olla-field-group">
                <label for="smoke_opacity"><strong>Deckkraft des Nebels (%):</strong></label>
                <input type="number" id="smoke_opacity" name="smoke_opacity" min="0" max="100" value="<?php echo esc_attr($hero['smoke_opacity'] ?? 20); ?>" style="width: 80px;" /> %
            </div>
        </div>

        <div class="olla-card-footer">
            <button type="submit" class="button button-primary button-large">Hero-Einstellungen speichern</button>
        </div>
    </div>
</form>
