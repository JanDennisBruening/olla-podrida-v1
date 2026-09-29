<?php
if (!defined('ABSPATH')) {
    exit;
}

$ensemble = Olla_Podrida_Settings::get_section('ensemble');
$musicians = Olla_Podrida_Settings::get_section('musicians');
?>

<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="olla-form-box">
    <input type="hidden" name="action" value="olla_podrida_save_settings" />
    <input type="hidden" name="section" value="ensemble" />
    <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>

    <!-- Ensemble Texte & Wappen -->
    <div class="olla-card">
        <div class="olla-card-header">
            <h2>📜 Ensemble-Pergament & Texte (#ensemble)</h2>
            <p>Passe die Überschrift, die drei Entstehungsabsätze und das zentrale Eintopf-Wappen an.</p>
        </div>

        <div class="olla-card-body">
            <div class="olla-field-group">
                <label for="ensemble_title"><strong>Hauptüberschrift:</strong></label>
                <input type="text" id="ensemble_title" name="title" value="<?php echo esc_attr($ensemble['title'] ?? 'Ensemble Olla Podrida'); ?>" class="large-text" />
            </div>

            <div class="olla-field-group">
                <label for="paragraph1"><strong>Absatz 1 (Bedeutung des Namens & Eintopf):</strong></label>
                <textarea id="paragraph1" name="paragraph1" rows="5" class="large-text"><?php echo esc_textarea($ensemble['paragraph1'] ?? ''); ?></textarea>
            </div>

            <div class="olla-field-group olla-media-field">
                <label><strong>Wappen-Grafik / Brodelnder Eintopf:</strong></label>
                <div class="olla-media-row">
                    <input type="text" name="logo" id="ensemble_logo" value="<?php echo esc_url($ensemble['logo'] ?? ''); ?>" class="regular-text olla-media-input" />
                    <button type="button" class="button olla-media-upload-btn" data-target="#ensemble_logo" data-preview="#ensemble_logo_preview">Aus Mediathek wählen</button>
                </div>
                <div class="olla-media-preview" id="ensemble_logo_preview">
                    <?php if (!empty($ensemble['logo'])): ?>
                        <img src="<?php echo esc_url($ensemble['logo']); ?>" style="max-height: 100px; margin-top: 8px; border-radius: 4px;" />
                    <?php endif; ?>
                </div>
            </div>

            <div class="olla-field-group">
                <label for="paragraph2"><strong>Absatz 2 (Klangvielfalt aus Mittelalter und Renaissance):</strong></label>
                <textarea id="paragraph2" name="paragraph2" rows="4" class="large-text"><?php echo esc_textarea($ensemble['paragraph2'] ?? ''); ?></textarea>
            </div>

            <div class="olla-field-group">
                <label for="paragraph3"><strong>Absatz 3 (Ensemblegeschichte seit 2017 & Mercks wol!):</strong></label>
                <textarea id="paragraph3" name="paragraph3" rows="4" class="large-text"><?php echo esc_textarea($ensemble['paragraph3'] ?? ''); ?></textarea>
            </div>
        </div>
    </div>

    <!-- Musiker-Verwaltung -->
    <div class="olla-card" style="margin-top: 25px;">
        <div class="olla-card-header">
            <h2>👥 Musikerinnen & Musiker verwalten</h2>
            <p>Bearbeite die Profile, Rollen, Instrumente und Bilder der Ensemblemitglieder.</p>
        </div>

        <div class="olla-card-body">
            <div class="olla-musicians-accordion" id="olla-musicians-list">
                <?php foreach ($musicians as $idx => $m): ?>
                    <div class="olla-musician-item">
                        <div class="olla-musician-header" onclick="this.parentElement.classList.toggle('is-open');">
                            <span class="olla-musician-drag-icon">☰</span>
                            <strong><?php echo esc_html($m['name']); ?></strong>
                            <span class="olla-musician-subrole">— <?php echo esc_html($m['role']); ?></span>
                            
                            <span class="dashicons dashicons-arrow-down-alt2 olla-accordion-arrow" style="float: right;"></span>
                            <button type="button" class="button button-link-delete button-small" style="float: right; margin-right: 12px;" onclick="event.stopPropagation(); if (confirm('Diesen Musiker wirklich aus dem Ensemble entfernen?')) { this.closest('.olla-musician-item').remove(); }">Löschen</button>
                        </div>

                        <div class="olla-musician-content">
                            <input type="hidden" name="musicians[<?php echo $idx; ?>][id]" value="<?php echo esc_attr($m['id']); ?>" />

                            <div class="olla-grid-2">
                                <div class="olla-field-group">
                                    <label><strong>Name:</strong></label>
                                    <input type="text" name="musicians[<?php echo $idx; ?>][name]" value="<?php echo esc_attr($m['name']); ?>" class="regular-text" />
                                </div>
                                <div class="olla-field-group">
                                    <label><strong>Rolle / Stimme:</strong></label>
                                    <input type="text" name="musicians[<?php echo $idx; ?>][role]" value="<?php echo esc_attr($m['role']); ?>" class="regular-text" />
                                </div>
                            </div>

                            <div class="olla-field-group">
                                <label><strong>Gespielte Instrumente (Komma-getrennt):</strong></label>
                                <input type="text" name="musicians[<?php echo $idx; ?>][instruments]" value="<?php echo esc_attr(is_array($m['instruments'] ?? null) ? implode(', ', $m['instruments']) : ($m['instruments'] ?? '')); ?>" class="large-text" />
                            </div>

                            <div class="olla-field-group">
                                <label><strong>Kurzbiografie:</strong></label>
                                <textarea name="musicians[<?php echo $idx; ?>][bio]" rows="2" class="large-text"><?php echo esc_textarea($m['bio']); ?></textarea>
                            </div>

                            <div class="olla-field-group">
                                <label><strong>Tooltip-Text beim Hovern:</strong></label>
                                <input type="text" name="musicians[<?php echo $idx; ?>][tooltip]" value="<?php echo esc_attr($m['tooltip'] ?? $m['name']); ?>" class="regular-text" />
                            </div>

                            <!-- Visibility Toggles -->
                            <div class="olla-field-group" style="background:#faf8f5; border:1px solid #e2d7c5; border-radius:6px; padding:10px 14px; margin-top:10px;">
                                <label style="display:block; margin-bottom:6px;"><strong>Sichtbarkeit in den Sektionen:</strong></label>
                                <div style="display:flex; gap:18px; flex-wrap:wrap;">
                                    <label><input type="checkbox" name="musicians[<?php echo $idx; ?>][show_hero]" value="1" <?php checked(!isset($m['show_hero']) || !empty($m['show_hero'])); ?> /> 🏰 Hero-Bühne (Oben)</label>
                                    <label><input type="checkbox" name="musicians[<?php echo $idx; ?>][show_ensemble]" value="1" <?php checked(!isset($m['show_ensemble']) || !empty($m['show_ensemble'])); ?> /> 📜 Ensemble-Galerie (Mitte)</label>
                                    <label><input type="checkbox" name="musicians[<?php echo $idx; ?>][show_press]" value="1" <?php checked(!isset($m['show_press']) || !empty($m['show_press'])); ?> /> 📰 Pressematerial (Download)</label>
                                </div>
                            </div>

                            <!-- Interactive Nudge Position Controls -->
                            <div class="olla-field-group" style="background:#f0ede6; border:1px solid #d4c8b2; border-radius:6px; padding:10px 14px; margin-top:10px;">
                                <label style="display:block; margin-bottom:6px;"><strong>Positionierung &amp; Feinjustierung (Bühnen-Offset in Pixeln):</strong></label>
                                <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
                                    <div style="display:flex; align-items:center; gap:6px;">
                                        <span style="font-size:12px; font-weight:600;">X (Horizontal):</span>
                                        <input type="number" name="musicians[<?php echo $idx; ?>][offset_x]" value="<?php echo intval($m['offset_x'] ?? 0); ?>" class="small-text olla-offset-x" style="width:60px;" />
                                        <button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="-5" title="5px nach links">◄</button>
                                        <button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="5" title="5px nach rechts">►</button>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:6px;">
                                        <span style="font-size:12px; font-weight:600;">Y (Vertikal):</span>
                                        <input type="number" name="musicians[<?php echo $idx; ?>][offset_y]" value="<?php echo intval($m['offset_y'] ?? 0); ?>" class="small-text olla-offset-y" style="width:60px;" />
                                        <button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="-5" title="5px nach oben">▲</button>
                                        <button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="5" title="5px nach unten">▼</button>
                                    </div>
                                    <button type="button" class="button button-small olla-nudge-reset" title="Auf 0 zurücksetzen">↺ Reset</button>
                                </div>
                            </div>

                            <div class="olla-grid-2" style="margin-top:10px;">
                                <div class="olla-field-group olla-media-field">
                                    <label><strong>Bühnenbild / Freisteller (HeroStage):</strong></label>
                                    <div class="olla-media-row">
                                        <input type="text" name="musicians[<?php echo $idx; ?>][stage_image]" id="stage_img_<?php echo $idx; ?>" value="<?php echo esc_url($m['stage_image']); ?>" class="regular-text olla-media-input" />
                                        <button type="button" class="button olla-media-upload-btn" data-target="#stage_img_<?php echo $idx; ?>" data-preview="#stage_preview_<?php echo $idx; ?>">Wählen</button>
                                    </div>
                                    <div class="olla-media-preview" id="stage_preview_<?php echo $idx; ?>">
                                        <?php if (!empty($m['stage_image'])): ?>
                                            <img src="<?php echo esc_url($m['stage_image']); ?>" style="max-height: 80px; margin-top: 5px; border-radius: 4px;" />
                                        <?php endif; ?>
                                    </div>
                                </div>

                                <div class="olla-field-group olla-media-field">
                                    <label><strong>Porträtbild (Pergament-Galerie):</strong></label>
                                    <div class="olla-media-row">
                                        <input type="text" name="musicians[<?php echo $idx; ?>][portrait_image]" id="portrait_img_<?php echo $idx; ?>" value="<?php echo esc_url($m['portrait_image']); ?>" class="regular-text olla-media-input" />
                                        <button type="button" class="button olla-media-upload-btn" data-target="#portrait_img_<?php echo $idx; ?>" data-preview="#portrait_preview_<?php echo $idx; ?>">Wählen</button>
                                    </div>
                                    <div class="olla-media-preview" id="portrait_preview_<?php echo $idx; ?>">
                                        <?php if (!empty($m['portrait_image'])): ?>
                                            <img src="<?php echo esc_url($m['portrait_image']); ?>" style="max-height: 80px; margin-top: 5px; border-radius: 4px;" />
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div style="margin-top: 20px;">
                <button type="button" class="button button-secondary" id="olla-add-musician-btn">
                    <span class="dashicons dashicons-plus-alt" style="margin-top: 3px;"></span> Weiteren Musiker hinzufügen
                </button>
            </div>
        </div>

        <div class="olla-card-footer">
            <button type="submit" class="button button-primary button-large">Ensemble & Musiker speichern</button>
        </div>
    </div>
</form>
