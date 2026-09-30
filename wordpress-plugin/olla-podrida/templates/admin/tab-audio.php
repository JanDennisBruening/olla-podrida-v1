<?php
if (!defined('ABSPATH')) {
    exit;
}

$audio = Olla_Podrida_Settings::get_section('audio');
?>

<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="olla-form-box">
    <input type="hidden" name="action" value="olla_podrida_save_settings" />
    <input type="hidden" name="section" value="audio" />
    <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>

    <div class="olla-card">
        <div class="olla-card-header">
            <h2>🎵 Hintergrundmusik &amp; Schwebender Audio-Player</h2>
            <p>Verwalte den musikalischen Hintergrund, Dateiverlinkungen und das Verhalten des runden Musik-Buttons.</p>
        </div>

        <div class="olla-card-body">
            <div class="olla-field-group">
                <label>
                    <input type="checkbox" name="enabled" value="1" <?php checked(!empty($audio['enabled'])); ?> />
                    <strong>Musik-Player grundsätzlich aktivieren</strong>
                </label>
                <p class="description">Steuert, ob der schwebende Player unten rechts im Frontend sichtbar sein soll.</p>
            </div>

            <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />

            <!-- Dateiverlinkung für das Musikstück (vom Nutzer gewünscht) -->
            <div class="olla-field-group olla-media-field">
                <label for="audio_src">
                    <strong>Dateiverlinkung für das Musikstück (Audio-URL / MP3-Link) *:</strong>
                </label>
                <div class="olla-media-row">
                    <input type="url" name="src" id="audio_src" value="<?php echo esc_url($audio['src'] ?? ''); ?>" class="large-text olla-media-input" placeholder="https://.../mein-musikstueck.mp3 (oder über die Mediathek wählen)" />
                    <button type="button" class="button button-secondary olla-audio-upload-btn" data-target="#audio_src">
                        <span class="dashicons dashicons-format-audio" style="margin-top: 4px;"></span> Audio aus Mediathek wählen
                    </button>
                </div>
                <p class="description" style="margin-top: 8px; color: #666;">
                    💡 <strong>Hinweis:</strong> Wenn dieses Feld leer gelassen wird, bleibt der schwebende Player im Frontend automatisch ausgeblendet, bis ein gültiger Audio-Link hinterlegt wird. Sie können hier einen direkten Web-Link eintragen oder eine MP3-Datei über den Button aus Ihrer WordPress-Mediathek auswählen.
                </p>
            </div>

            <div class="olla-grid-2" style="margin-top: 20px;">
                <div class="olla-field-group">
                    <label for="audio_title"><strong>Titel des Musikstücks:</strong></label>
                    <input type="text" id="audio_title" name="title" value="<?php echo esc_attr($audio['title'] ?? 'Riu Riu Chiu'); ?>" class="regular-text" />
                </div>
                <div class="olla-field-group">
                    <label for="audio_subtitle"><strong>Untertitel / Interpretation:</strong></label>
                    <input type="text" id="audio_subtitle" name="subtitle" value="<?php echo esc_attr($audio['subtitle'] ?? 'Live in Atter (Spanisches Renaissance-Villancico)'); ?>" class="regular-text" />
                </div>
            </div>

            <div class="olla-field-group" style="margin-top: 15px;">
                <label for="button_text"><strong>Umlaufender Text auf dem rotierenden Button:</strong></label>
                <input type="text" id="button_text" name="button_text" value="<?php echo esc_attr($audio['button_text'] ?? '• Musik an / aus • Musik an / aus'); ?>" class="large-text" />
                <p class="description">Wird kreisförmig um den Noten-Button animiert und signalisiert dem Besucher die Interaktivität.</p>
            </div>

            <div class="olla-grid-2" style="margin-top: 15px;">
                <div class="olla-field-group">
                    <label>
                        <input type="checkbox" name="autoplay" value="1" <?php checked(!empty($audio['autoplay'])); ?> />
                        <strong>Automatisches Abspielen versuchen (Autoplay)</strong>
                    </label>
                    <p class="description">Falls der Browser Autoplay blockiert, startet die Musik sauber beim ersten Klick oder Scrollen des Nutzers.</p>
                </div>

                <div class="olla-field-group">
                    <label for="audio_volume"><strong>Standard-Lautstärke (0 bis 100%):</strong></label>
                    <input type="range" id="audio_volume" name="volume" min="0" max="100" value="<?php echo esc_attr($audio['volume'] ?? 50); ?>" oninput="document.getElementById('vol_val').textContent = this.value + '%';" />
                    <span id="vol_val" style="font-weight: bold; margin-left: 10px;"><?php echo esc_html($audio['volume'] ?? 50); ?>%</span>
                </div>
            </div>

            <!-- Wiedergabe-Modus (Loop vs. Einmalig) -->
            <div class="olla-field-group" style="margin-top: 20px; background: #faf8f5; border: 1px solid #e5dfd5; padding: 15px 18px; border-radius: 8px;">
                <label style="font-size: 14px; color: #1d2327;"><strong>Wiedergabe-Verhalten nach Ende des Musikstücks:</strong></label>
                <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
                    <label style="font-weight: normal; cursor: pointer; display: flex; align-items: flex-start; gap: 8px;">
                        <input type="radio" name="loop" value="0" style="margin-top: 3px;" <?php checked(empty($audio['loop'])); ?> />
                        <span>
                            <strong>Nur einmalig durchlaufen (Empfohlen):</strong><br/>
                            <span style="color: #666; font-size: 12px;">Das Musikstück wird einmal komplett abgespielt und schaltet sich danach automatisch ab. Der Besucher kann es bei Bedarf durch Klick auf den Button erneut starten.</span>
                        </span>
                    </label>
                    <label style="font-weight: normal; cursor: pointer; display: flex; align-items: flex-start; gap: 8px;">
                        <input type="radio" name="loop" value="1" style="margin-top: 3px;" <?php checked(!empty($audio['loop'])); ?> />
                        <span>
                            <strong>Endlosschleife (Loop):</strong><br/>
                            <span style="color: #666; font-size: 12px;">Das Musikstück wiederholt sich nach dem Durchlaufen permanent und ununterbrochen im Hintergrund, bis der Besucher den Button drückt.</span>
                        </span>
                    </label>
                </div>
            </div>
        </div>

        <div class="olla-card-footer">
            <button type="submit" class="button button-primary button-large">Audio-Einstellungen speichern</button>
        </div>
    </div>
</form>
