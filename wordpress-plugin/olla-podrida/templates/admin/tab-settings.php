<?php
if (!defined('ABSPATH')) {
    exit;
}

$settings = Olla_Podrida_Settings::get_section('settings');
?>

<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="olla-admin-form">
    <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>
    <input type="hidden" name="action" value="olla_podrida_save_settings" />
    <input type="hidden" name="section" value="settings" />

    <!-- 1. Identität & Basis -->
    <div class="olla-card">
        <div class="olla-card-header">
            <h2>👑 Allgemeine Einstellungen &amp; System</h2>
            <p>Zentrale Identitäts-, Favicon-, Sicherheits- und Automatisierungseinstellungen für Olla Podrida.</p>
        </div>
        <div class="olla-card-body">
            <div class="olla-field-group">
                <label for="site_title"><strong>Website- / Ensemble-Titel:</strong></label>
                <input type="text" id="site_title" name="site_title" value="<?php echo esc_attr($settings['site_title'] ?? 'Ensemble Olla Podrida'); ?>" class="large-text" />
                <span class="description">Der offizielle Name des Ensembles für Titelzeilen, Benachrichtigungen und Ausgaben.</span>
            </div>

            <div class="olla-field-group">
                <label for="site_tagline"><strong>Untertitel / Slogan:</strong></label>
                <input type="text" id="site_tagline" name="site_tagline" value="<?php echo esc_attr($settings['site_tagline'] ?? 'Klangvielfalt aus Mittelalter und Renaissance'); ?>" class="large-text" />
                <span class="description">Beschreibender Leitspruch des Ensembles.</span>
            </div>
        </div>
    </div>

    <!-- 2. Favicon -->
    <div class="olla-card">
        <div class="olla-card-header">
            <h2>🏺 Favicon &amp; Browser-Icon (Seitenweit)</h2>
            <p>Festlegung des Browser-Icons. Reines Topf-Emblem ohne Text und ohne Hintergrund.</p>
        </div>
        <div class="olla-card-body">
            <div class="olla-field-group">
                <label>
                    <input type="checkbox" name="favicon_enabled" value="1" <?php checked(!empty($settings['favicon_enabled'])); ?> />
                    <strong>Seitenweites Olla Podrida Favicon aktivieren</strong>
                </label>
                <span class="description" style="display:block; margin-top:4px;">
                    Sobald aktiv, wird das freigestellte Favicon im Frontend, Backend und Login-Bereich ausgespielt. Bei Deaktivierung greift wieder das Theme-Standard-Icon.
                </span>
            </div>

            <div class="olla-field-group olla-media-field">
                <label for="favicon_url"><strong>Favicon-Bilddatei (PNG / ICO):</strong></label>
                <div class="olla-media-row">
                    <input type="text" name="favicon_url" id="favicon_url" value="<?php echo esc_attr($settings['favicon_url'] ?? ''); ?>" class="regular-text olla-media-input" />
                    <button type="button" class="button olla-media-upload-btn" data-target="#favicon_url" data-preview="#favicon_preview">Aus Mediathek wählen</button>
                </div>
                <div class="olla-media-preview" id="favicon_preview" style="background:#111; display:inline-block; padding:8px; border-radius:6px; margin-top:8px;">
                    <?php if (!empty($settings['favicon_url'])): ?>
                        <img src="<?php echo esc_url($settings['favicon_url']); ?>" style="max-height: 48px; max-width: 48px; object-fit: contain;" />
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. Universelle Dominanz -->
    <div class="olla-card">
        <div class="olla-card-header">
            <h2>🌐 Universelle Dominanz (Canvas Takeover)</h2>
            <p>Vollflächige, universelle Theme-Übernahme für jedes beliebige WordPress-Theme.</p>
        </div>
        <div class="olla-card-body">
            <div class="olla-field-group">
                <label>
                    <input type="checkbox" name="universal_dominance" value="1" <?php checked(!empty($settings['universal_dominance'])); ?> />
                    <strong>Universellen Dominanz-Modus auf der Startseite aktivieren</strong>
                </label>
                <p class="description" style="margin-top: 6px;">
                    Wenn aktiviert, übernimmt Olla Podrida automatisch die Startseite / Front Page der WordPress-Installation im immersiven Fullscreen-Canvas-Modus – unabhängig davon, welches Theme (z. B. Astra, Hello, Twenty Twenty-Four) aktiv ist. Standard-Header, Footer und störende Theme-Layouts werden nahtlos durch die Olla Podrida Inszenierung ersetzt.
                </p>
            </div>
        </div>
    </div>

    <!-- 4. Archiv-Automatik -->
    <div class="olla-card">
        <div class="olla-card-header">
            <h2>📅 Archiv-Automatik für Konzerttermine</h2>
            <p>Automatisches Verschieben vergangener Konzerte in die Konzertchronik.</p>
        </div>
        <div class="olla-card-body">
            <div class="olla-field-group">
                <label>
                    <input type="checkbox" name="auto_expire_events" value="1" <?php checked(!empty($settings['auto_expire_events'])); ?> />
                    <strong>Abgelaufene Termine automatisch archivieren</strong>
                </label>
                <p class="description" style="margin-top: 6px;">
                    Sobald Datum und Uhrzeit einer Veranstaltung überschritten sind, wechselt der Status im Frontend automatisch von „Aktuelle Termine“ zur „Konzertchronik / Archiv“. Es ist kein manuelles Eingreifen oder Deaktivieren nach dem Konzert notwendig.
                </p>
            </div>
        </div>
    </div>

    <!-- 5. Kontaktformular Sicherheit -->
    <div class="olla-card">
        <div class="olla-card-header">
            <h2>🛡️ Kontaktformular Sicherheits- &amp; Anti-Bot-Schutz</h2>
            <p>Schutz vor Spam-Bots ohne störende CAPTCHAs für menschliche Besucher.</p>
        </div>
        <div class="olla-card-body">
            <div class="olla-field-group">
                <label>
                    <input type="checkbox" name="bot_protection_enabled" value="1" <?php checked(!empty($settings['bot_protection_enabled'])); ?> />
                    <strong>Mehrstufigen Anti-Bot-Schutz aktivieren</strong>
                </label>
                <ul class="description" style="margin-top: 6px; list-style: disc; padding-left: 20px;">
                    <li><strong>Unsichtbares Honeypot-Feld:</strong> Füllen Bots das versteckte Feld aus, wird die Einsendung verworfen.</li>
                    <li><strong>Timing-Prüfung:</strong> Einsendungen unter 2 Sekunden (menschlich unmöglich) werden blockiert.</li>
                    <li><strong>IP-Rate-Limiting:</strong> Schutz vor Massen-Absendungen (Transients-Drosselung).</li>
                </ul>
            </div>

            <div class="olla-grid-2">
                <div class="olla-field-group">
                    <label for="min_submit_seconds"><strong>Minimale Ausfüllzeit (Sekunden):</strong></label>
                    <input type="number" id="min_submit_seconds" name="min_submit_seconds" value="<?php echo esc_attr($settings['min_submit_seconds'] ?? 2); ?>" min="1" max="10" class="small-text" />
                    <span class="description">Schnellere Absendungen gelten als Bot.</span>
                </div>
                <div class="olla-field-group">
                    <label for="rate_limit_submissions"><strong>Max. Einsendungen je IP (pro 10 Min):</strong></label>
                    <input type="number" id="rate_limit_submissions" name="rate_limit_submissions" value="<?php echo esc_attr($settings['rate_limit_submissions'] ?? 5); ?>" min="1" max="50" class="small-text" />
                    <span class="description">Verhindert Spam-Wellen.</span>
                </div>
            </div>
        </div>
    </div>

    <div class="olla-form-actions">
        <button type="submit" class="button button-primary button-large">
            Einstellungen speichern
        </button>
    </div>
</form>
