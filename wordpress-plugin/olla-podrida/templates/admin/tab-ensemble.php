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
            <p>Bearbeite die Profile, Rollen, Instrumente, das Bühnenbild mit feiner Viewport-Positionierung sowie das Galerie-Porträtbild.</p>
        </div>

        <div class="olla-card-body">
            <div class="olla-musicians-accordion" id="olla-musicians-list">
                <?php foreach ($musicians as $idx => $m): 
                    $off_x_desk = intval($m['offset_x_desktop'] ?? $m['offset_x'] ?? 0);
                    $off_y_desk = intval($m['offset_y_desktop'] ?? $m['offset_y'] ?? 0);
                    $off_x_tab  = intval($m['offset_x_tablet'] ?? 0);
                    $off_y_tab  = intval($m['offset_y_tablet'] ?? 0);
                    $off_x_mob  = intval($m['offset_x_mobile'] ?? 0);
                    $off_y_mob  = intval($m['offset_y_mobile'] ?? 0);
                ?>
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

                            <!-- Musiker Basis-Daten -->
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

                            <!-- SEKTION 1: Bühnenbild & Hero-Bühne -->
                            <div class="olla-musician-stage-box" style="background:#f9f7f2; border:1px solid #dcd3c1; border-radius:8px; padding:16px; margin-top:16px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #e5dccb; padding-bottom:8px;">
                                    <h4 style="margin:0; font-size:15px; color:#2c1810; display:flex; align-items:center; gap:6px;">
                                        <span class="dashicons dashicons-format-image" style="color:#b45309;"></span>
                                        <strong>1. Bühnenbild &amp; Hero-Bühne (Startbereich oben)</strong>
                                    </h4>
                                    <label style="cursor:pointer; font-weight:600; font-size:13px; color:#2c1810;">
                                        <input type="checkbox" name="musicians[<?php echo $idx; ?>][show_hero]" value="1" <?php checked(!isset($m['show_hero']) || !empty($m['show_hero'])); ?> /> 
                                        Auf der Hero-Bühne anzeigen
                                    </label>
                                </div>

                                <div class="olla-field-group olla-media-field" style="margin-bottom:14px;">
                                    <label><strong>Freisteller-Bühnenbild (HeroStage):</strong></label>
                                    <div class="olla-media-row">
                                        <input type="text" name="musicians[<?php echo $idx; ?>][stage_image]" id="stage_img_<?php echo $idx; ?>" value="<?php echo esc_url($m['stage_image']); ?>" class="regular-text olla-media-input" placeholder="https://.../figur.webp" />
                                        <button type="button" class="button olla-media-upload-btn" data-target="#stage_img_<?php echo $idx; ?>" data-preview="#stage_preview_<?php echo $idx; ?>">Aus Mediathek wählen</button>
                                    </div>
                                    <div class="olla-media-preview" id="stage_preview_<?php echo $idx; ?>">
                                        <?php if (!empty($m['stage_image'])): ?>
                                            <img src="<?php echo esc_url($m['stage_image']); ?>" style="max-height: 85px; margin-top: 6px; border-radius: 4px; background: rgba(0,0,0,0.06); padding: 4px;" />
                                        <?php endif; ?>
                                    </div>
                                </div>

                                <!-- Viewport-Positioning & Feinjustierung -->
                                <div class="olla-positioning-wrap" style="background:#fff; border:1px solid #d4c8b2; border-radius:6px; padding:12px 14px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                                        <div>
                                            <strong style="font-size:13px; color:#2c1810;">🎯 Positionierung &amp; Feinjustierung (Versatz in Pixeln):</strong>
                                            <span style="font-size:12px; color:#666; display:block;">Passe die Position für jeden Viewport unabhängig an.</span>
                                        </div>
                                        <!-- Viewport Switcher Tabs -->
                                        <div class="olla-vp-tabs" style="display:flex; gap:4px;">
                                            <button type="button" class="button olla-vp-tab-btn active" data-vp="desktop" style="display:inline-flex; align-items:center; gap:4px; font-weight:600; background:#e2d7c5; border-color:#bdae97;">
                                                <span class="dashicons dashicons-desktop" style="font-size:14px; width:14px; height:14px;"></span> Desktop
                                            </button>
                                            <button type="button" class="button olla-vp-tab-btn" data-vp="tablet" style="display:inline-flex; align-items:center; gap:4px; background:#f4efe6; border-color:#d5c9b6;">
                                                <span class="dashicons dashicons-tablet" style="font-size:14px; width:14px; height:14px;"></span> Tablet
                                            </button>
                                            <button type="button" class="button olla-vp-tab-btn" data-vp="mobile" style="display:inline-flex; align-items:center; gap:4px; background:#f4efe6; border-color:#d5c9b6;">
                                                <span class="dashicons dashicons-smartphone" style="font-size:14px; width:14px; height:14px;"></span> Smartphone
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Desktop Viewport Panel -->
                                    <div class="olla-vp-panel olla-vp-desktop" style="display:block;">
                                        <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                                            <div style="display:flex; align-items:center; gap:6px;">
                                                <span style="font-size:12px; font-weight:600; min-width:85px;">X (Horizontal):</span>
                                                <input type="number" name="musicians[<?php echo $idx; ?>][offset_x_desktop]" value="<?php echo $off_x_desk; ?>" class="small-text olla-offset-x" style="width:65px;" />
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="-5" title="5px nach links">
                                                    <span class="dashicons dashicons-arrow-left-alt2"></span>
                                                </button>
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="5" title="5px nach rechts">
                                                    <span class="dashicons dashicons-arrow-right-alt2"></span>
                                                </button>
                                            </div>
                                            <div style="display:flex; align-items:center; gap:6px;">
                                                <span style="font-size:12px; font-weight:600; min-width:70px;">Y (Vertikal):</span>
                                                <input type="number" name="musicians[<?php echo $idx; ?>][offset_y_desktop]" value="<?php echo $off_y_desk; ?>" class="small-text olla-offset-y" style="width:65px;" />
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="-5" title="5px nach oben">
                                                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                                                </button>
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="5" title="5px nach unten">
                                                    <span class="dashicons dashicons-arrow-down-alt2"></span>
                                                </button>
                                            </div>
                                            <button type="button" class="button button-small olla-nudge-reset" title="Desktop-Offset auf 0 zurücksetzen">
                                                <span class="dashicons dashicons-image-rotate" style="font-size:14px; width:14px; height:14px; vertical-align:text-bottom;"></span> Reset
                                            </button>
                                            <span style="font-size:11px; color:#777; margin-left:auto;">Standardwert: 0px (zentriert auf Bühne)</span>
                                        </div>
                                    </div>

                                    <!-- Tablet Viewport Panel -->
                                    <div class="olla-vp-panel olla-vp-tablet" style="display:none;">
                                        <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                                            <div style="display:flex; align-items:center; gap:6px;">
                                                <span style="font-size:12px; font-weight:600; min-width:85px;">X (Horizontal):</span>
                                                <input type="number" name="musicians[<?php echo $idx; ?>][offset_x_tablet]" value="<?php echo $off_x_tab; ?>" class="small-text olla-offset-x" style="width:65px;" />
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="-5" title="5px nach links">
                                                    <span class="dashicons dashicons-arrow-left-alt2"></span>
                                                </button>
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="5" title="5px nach rechts">
                                                    <span class="dashicons dashicons-arrow-right-alt2"></span>
                                                </button>
                                            </div>
                                            <div style="display:flex; align-items:center; gap:6px;">
                                                <span style="font-size:12px; font-weight:600; min-width:70px;">Y (Vertikal):</span>
                                                <input type="number" name="musicians[<?php echo $idx; ?>][offset_y_tablet]" value="<?php echo $off_y_tab; ?>" class="small-text olla-offset-y" style="width:65px;" />
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="-5" title="5px nach oben">
                                                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                                                </button>
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="5" title="5px nach unten">
                                                    <span class="dashicons dashicons-arrow-down-alt2"></span>
                                                </button>
                                            </div>
                                            <button type="button" class="button button-small olla-nudge-reset" title="Tablet-Offset auf 0 zurücksetzen">
                                                <span class="dashicons dashicons-image-rotate" style="font-size:14px; width:14px; height:14px; vertical-align:text-bottom;"></span> Reset
                                            </button>
                                            <span style="font-size:11px; color:#777; margin-left:auto;">Gilt für Viewports zwischen 768px und 1024px.</span>
                                        </div>
                                    </div>

                                    <!-- Mobile Viewport Panel -->
                                    <div class="olla-vp-panel olla-vp-mobile" style="display:none;">
                                        <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                                            <div style="display:flex; align-items:center; gap:6px;">
                                                <span style="font-size:12px; font-weight:600; min-width:85px;">X (Horizontal):</span>
                                                <input type="number" name="musicians[<?php echo $idx; ?>][offset_x_mobile]" value="<?php echo $off_x_mob; ?>" class="small-text olla-offset-x" style="width:65px;" />
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="-5" title="5px nach links">
                                                    <span class="dashicons dashicons-arrow-left-alt2"></span>
                                                </button>
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="5" title="5px nach rechts">
                                                    <span class="dashicons dashicons-arrow-right-alt2"></span>
                                                </button>
                                            </div>
                                            <div style="display:flex; align-items:center; gap:6px;">
                                                <span style="font-size:12px; font-weight:600; min-width:70px;">Y (Vertikal):</span>
                                                <input type="number" name="musicians[<?php echo $idx; ?>][offset_y_mobile]" value="<?php echo $off_y_mob; ?>" class="small-text olla-offset-y" style="width:65px;" />
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="-5" title="5px nach oben">
                                                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                                                </button>
                                                <button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="5" title="5px nach unten">
                                                    <span class="dashicons dashicons-arrow-down-alt2"></span>
                                                </button>
                                            </div>
                                            <button type="button" class="button button-small olla-nudge-reset" title="Smartphone-Offset auf 0 zurücksetzen">
                                                <span class="dashicons dashicons-image-rotate" style="font-size:14px; width:14px; height:14px; vertical-align:text-bottom;"></span> Reset
                                            </button>
                                            <span style="font-size:11px; color:#777; margin-left:auto;">Gilt für Bildschirme kleiner als 768px.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- SEKTION 2: Porträtbild & Pergament-Galerie -->
                            <div class="olla-musician-portrait-box" style="background:#faf8f5; border:1px solid #e2d7c5; border-radius:8px; padding:16px; margin-top:16px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eae1d2; padding-bottom:8px;">
                                    <h4 style="margin:0; font-size:15px; color:#2c1810; display:flex; align-items:center; gap:6px;">
                                        <span class="dashicons dashicons-id-alt" style="color:#b45309;"></span>
                                        <strong>2. Porträtbild (Pergament-Galerie &amp; Presse)</strong>
                                    </h4>
                                    <div style="display:flex; gap:16px; flex-wrap:wrap;">
                                        <label style="cursor:pointer; font-weight:600; font-size:13px; color:#2c1810;">
                                            <input type="checkbox" name="musicians[<?php echo $idx; ?>][show_ensemble]" value="1" <?php checked(!isset($m['show_ensemble']) || !empty($m['show_ensemble'])); ?> /> 
                                            In Ensemble-Galerie (#ensemble)
                                        </label>
                                        <label style="cursor:pointer; font-weight:600; font-size:13px; color:#2c1810;">
                                            <input type="checkbox" name="musicians[<?php echo $idx; ?>][show_press]" value="1" <?php checked(!isset($m['show_press']) || !empty($m['show_press'])); ?> /> 
                                            Im Pressematerial (Download)
                                        </label>
                                    </div>
                                </div>

                                <div class="olla-field-group olla-media-field">
                                    <label><strong>Porträtfoto:</strong></label>
                                    <div class="olla-media-row">
                                        <input type="text" name="musicians[<?php echo $idx; ?>][portrait_image]" id="portrait_img_<?php echo $idx; ?>" value="<?php echo esc_url($m['portrait_image']); ?>" class="regular-text olla-media-input" placeholder="https://.../portrait.webp" />
                                        <button type="button" class="button olla-media-upload-btn" data-target="#portrait_img_<?php echo $idx; ?>" data-preview="#portrait_preview_<?php echo $idx; ?>">Aus Mediathek wählen</button>
                                    </div>
                                    <p class="description" style="font-size:12px; color:#666; margin-top:4px;">
                                        Wird auf den Pergamentkarten im Ensemblebereich angezeigt. Das Porträt wird automatisch zentriert und eingepasst (keine manuelle Feinjustierung erforderlich).
                                    </p>
                                    <div class="olla-media-preview" id="portrait_preview_<?php echo $idx; ?>">
                                        <?php if (!empty($m['portrait_image'])): ?>
                                            <img src="<?php echo esc_url($m['portrait_image']); ?>" style="max-height: 85px; margin-top: 6px; border-radius: 4px;" />
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
            <button type="submit" class="button button-primary button-large">Ensemble &amp; Musiker speichern</button>
        </div>
    </div>
</form>
