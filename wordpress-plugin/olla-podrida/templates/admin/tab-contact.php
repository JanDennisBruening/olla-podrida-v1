<?php
if (!defined('ABSPATH')) {
    exit;
}

$contact = Olla_Podrida_Settings::get_section('contact');
$messages = Olla_Podrida_Contact::get_messages(100);
$total_messages = count($messages);
?>

<div class="olla-contact-container">

    <!-- 1. POSTEINGANG (Oben platziert): Eingegangene Anfragen -->
    <div class="olla-card" style="margin-bottom: 30px;">
        <div class="olla-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
                <h2>📥 Posteingang: Eingegangene Anfragen</h2>
                <p>Hier werden alle Kontaktanfragen aus dem Frontend und importierte Einsendungen dauerhaft archiviert.</p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <button type="button" id="olla-open-manual-message-btn" class="button button-secondary" style="font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                    <span class="dashicons dashicons-plus-alt2" style="font-size: 16px; width: 16px; height: 16px; line-height: 16px;"></span>
                    + Nachricht manuell erfassen
                </button>
                <span id="olla-inbox-counter" style="background: #e8a825; color: #070202; font-weight: 700; padding: 4px 12px; border-radius: 12px; font-size: 13px;">
                    <?php echo intval($total_messages); ?> <?php echo $total_messages === 1 ? 'Anfrage' : 'Anfragen'; ?>
                </span>
            </div>
        </div>

        <div class="olla-card-body">

            <!-- Manuelle Erfassung Box -->
            <div id="olla-manual-message-box" style="display: none; background: #faf8f5; border: 1px solid #d4c8b2; border-radius: 8px; padding: 18px 22px; margin-bottom: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #e5dac9; padding-bottom: 8px;">
                    <h3 style="margin: 0; color: #2c1810; font-size: 15px; display: flex; align-items: center; gap: 6px;">
                        <span>✍️ Neue Anfrage manuell ins Postfach eintragen</span>
                    </h3>
                    <button type="button" id="olla-close-manual-message-btn" class="button button-small" style="font-size: 11px;">✕ Schließen</button>
                </div>
                <p style="font-size: 13px; color: #666; margin-bottom: 16px;">
                    Erfasse telefonische Anfragen, direkte E-Mails oder Altanfragen direkt in der Postfach-Chronik des Ensembles.
                </p>
                <div class="olla-grid-2" style="margin-bottom: 14px;">
                    <div class="olla-field-group">
                        <label for="olla-manual-name"><strong>Name / Absender:*</strong></label>
                        <input type="text" id="olla-manual-name" class="regular-text" style="width: 100%;" placeholder="z. B. Dr. Johannes Müller" />
                    </div>
                    <div class="olla-field-group">
                        <label for="olla-manual-email"><strong>E-Mail-Adresse:</strong></label>
                        <input type="email" id="olla-manual-email" class="regular-text" style="width: 100%;" placeholder="z. B. johannes.mueller@kulturverein.de" />
                    </div>
                </div>
                <div class="olla-grid-2" style="margin-bottom: 14px;">
                    <div class="olla-field-group">
                        <label for="olla-manual-date"><strong>Datum &amp; Uhrzeit:</strong></label>
                        <input type="datetime-local" id="olla-manual-date" class="regular-text" style="width: 100%; max-width: 260px;" value="<?php echo date('Y-m-d\TH:i'); ?>" />
                    </div>
                    <div class="olla-field-group">
                        <label for="olla-manual-source"><strong>Herkunft / Kanal:</strong></label>
                        <input type="text" id="olla-manual-source" class="regular-text" style="width: 100%; max-width: 260px;" value="Manuell erfasst" />
                    </div>
                </div>
                <div class="olla-field-group" style="margin-bottom: 16px;">
                    <label for="olla-manual-message"><strong>Nachricht / Anfrage-Inhalt:*</strong></label>
                    <textarea id="olla-manual-message" rows="4" style="width: 100%; border-radius: 4px; padding: 8px;" placeholder="Konzertanfrage, Buchungswunsch, Fragen zum Repertoire..."></textarea>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <button type="button" id="olla-save-manual-message-btn" class="button button-primary" style="font-weight: 600;">
                        📥 Nachricht jetzt speichern
                    </button>
                    <span id="olla-manual-message-spinner" class="spinner" style="float: none;"></span>
                    <span id="olla-manual-message-status" style="font-size: 13px; font-weight: 600;"></span>
                </div>
            </div>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th style="width: 140px;">Datum &amp; Zeit</th>
                        <th style="width: 200px;">Absender / E-Mail</th>
                        <th>Nachricht</th>
                        <th style="width: 90px; text-align: right;">Aktion</th>
                    </tr>
                </thead>
                <tbody id="olla-inbox-table-body">
                    <?php if (empty($messages)): ?>
                        <tr id="olla-empty-inbox-row">
                            <td colspan="4" style="text-align: center; padding: 25px; color: #777; font-style: italic;">
                                Noch keine Kontaktanfragen eingegangen.
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($messages as $idx => $msg): 
                            $is_hidden = $idx >= 3;
                        ?>
                            <tr id="message-row-<?php echo esc_attr($msg['id']); ?>" class="<?php echo $is_hidden ? 'olla-hidden-message-row' : ''; ?>" style="<?php echo $is_hidden ? 'display: none;' : ''; ?>">
                                <td>
                                    <strong><?php echo esc_html(date_i18n('d.m.Y', strtotime($msg['created_at']))); ?></strong><br/>
                                    <span style="font-size: 11px; color: #888;"><?php echo esc_html(date_i18n('H:i', strtotime($msg['created_at']))); ?> Uhr</span>
                                </td>
                                <td>
                                    <strong style="color: #2c1810;"><?php echo esc_html($msg['name']); ?></strong><br/>
                                    <?php if (!empty($msg['email'])): ?>
                                        <a href="mailto:<?php echo esc_attr($msg['email']); ?>" style="color: #2271b1; text-decoration: none;">
                                            <?php echo esc_html($msg['email']); ?>
                                        </a><br/>
                                    <?php endif; ?>
                                    <?php if (!empty($msg['source'])): ?>
                                        <span style="display: inline-block; font-size: 10px; background: #eef2f6; color: #3b5998; border: 1px solid #d0dbe5; padding: 1px 6px; border-radius: 8px; margin-top: 3px;">
                                            <?php echo esc_html($msg['source']); ?>
                                        </span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <div style="max-height: 80px; overflow-y: auto; white-space: pre-wrap; font-size: 13px;">
                                        <?php echo esc_html($msg['message']); ?>
                                    </div>
                                </td>
                                <td style="text-align: right;">
                                    <button type="button" class="button button-small button-link-delete olla-delete-message-btn" data-id="<?php echo esc_attr($msg['id']); ?>">Löschen</button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>

            <?php if ($total_messages > 3): ?>
                <div class="olla-load-more-container" style="text-align: center; padding: 14px 0 4px 0; border-top: 1px solid #f0f0f1; margin-top: 10px;">
                    <button type="button" id="olla-load-more-messages-btn" class="button button-secondary" style="font-weight: 600;">
                        📥 Mehr laden (<?php echo ($total_messages - 3); ?> weitere Anfragen)
                    </button>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- 2. IMPORT: Kontaktformular-Einträge importieren -->
    <div class="olla-card" style="margin-bottom: 30px;">
        <div class="olla-card-header">
            <h2>📂 Kontaktformular-Einträge importieren</h2>
            <p>Importiere vorhandene Anfragen aus anderen WordPress-Plugins (Elementor Forms, WPForms, Contact Form 7 / CFDB7 / Flamingo, Gravity Forms, Fluent Forms, Ninja Forms, Formidable Forms) oder per Datei-Upload (CSV / Excel) in den Olla Podrida Posteingang.</p>
        </div>

        <div class="olla-card-body" id="olla-import-section">

            <!-- Subtab Navigation -->
            <div class="olla-subtab-bar" style="display: flex; gap: 6px; border-bottom: 2px solid #e2d7c5; margin-bottom: 20px;">
                <button type="button" class="olla-subtab-btn active" data-tab="plugin" style="background: #fff; border: 1px solid #e2d7c5; border-bottom: 2px solid #fff; padding: 9px 16px; font-weight: 700; cursor: pointer; border-radius: 6px 6px 0 0; color: #2c1810; margin-bottom: -2px;">
                    🔍 Aus Formular-Plugin suchen
                </button>
                <button type="button" class="olla-subtab-btn" data-tab="csv-file" style="background: #f4efe6; border: 1px solid #d5c9b6; border-bottom: none; padding: 9px 16px; font-weight: 600; cursor: pointer; border-radius: 6px 6px 0 0; color: #666; margin-bottom: -2px;">
                    📄 CSV- / Datei-Upload
                </button>
                <button type="button" class="olla-subtab-btn" data-tab="csv-paste" style="background: #f4efe6; border: 1px solid #d5c9b6; border-bottom: none; padding: 9px 16px; font-weight: 600; cursor: pointer; border-radius: 6px 6px 0 0; color: #666; margin-bottom: -2px;">
                    📋 Text / CSV direkt einfügen (Copy &amp; Paste)
                </button>
            </div>

            <!-- PANEL 1: Formular-Plugins Suche -->
            <div id="olla-import-panel-plugin" class="olla-import-panel">
                <!-- Step 1: Detect Sources -->
                <div id="olla-import-step-detect" style="padding: 10px 0 16px 0;">
                    <button type="button" id="olla-import-detect-btn" class="button button-secondary" style="font-weight: 600;">
                        🔍 Installierte Formular-Plugins suchen
                    </button>
                    <span id="olla-import-detect-spinner" class="spinner" style="float: none; margin-left: 8px;"></span>
                    <div id="olla-import-no-sources" style="display: none; margin-top: 14px; padding: 14px 18px; background: #fef9e7; border-left: 4px solid #daa520; border-radius: 4px; font-size: 13px; color: #555;">
                        ⚠️ <strong>Keine aktiven Formular-Plugins mit gespeicherten Einträgen auf dieser Website gefunden.</strong><br/>
                        Unterstützt werden: <em>Elementor Pro Forms, WPForms, Contact Form 7 (Flamingo &amp; CFDB7), Formidable Forms, Gravity Forms, Fluent Forms und Ninja Forms</em>.<br/><br/>
                        💡 <strong>Tipp:</strong> Falls du eine Liste oder Exportdatei (CSV, Excel) hast, nutze einfach den Reiter <strong>„📄 CSV- / Datei-Upload“</strong> oder <strong>„📋 Text direkt einfügen“</strong> oben, um die Einträge mit einem Klick zu importieren!
                    </div>
                </div>

                <!-- Step 2: Choose Source + Form -->
                <div id="olla-import-step-select" style="display: none; padding: 16px 0; border-top: 1px solid #f0f0f1;">
                    <div class="olla-grid-2" style="margin-bottom: 14px;">
                        <div class="olla-field-group">
                            <label for="olla-import-source"><strong>Formular-Plugin auswählen:</strong></label>
                            <select id="olla-import-source" class="regular-text" style="width: 100%; max-width: 360px;">
                                <option value="">— Bitte wählen —</option>
                            </select>
                        </div>
                        <div class="olla-field-group">
                            <label for="olla-import-form"><strong>Formular auswählen:</strong></label>
                            <select id="olla-import-form" class="regular-text" style="width: 100%; max-width: 360px;" disabled>
                                <option value="">— Erst Plugin wählen —</option>
                            </select>
                            <span id="olla-import-form-spinner" class="spinner" style="float: none; margin-left: 8px;"></span>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Preview + Execute -->
                <div id="olla-import-step-preview" style="display: none; padding: 16px 0; border-top: 1px solid #f0f0f1;">
                    <div id="olla-import-preview-info" style="margin-bottom: 14px; padding: 12px 16px; background: #f0f6fc; border-left: 4px solid #2271b1; border-radius: 4px;">
                        <!-- Filled by JS -->
                    </div>
                    <div id="olla-import-preview-table" style="margin-bottom: 14px; overflow-x: auto;">
                        <!-- Sample entries table filled by JS -->
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <button type="button" id="olla-import-execute-btn" class="button button-primary" style="font-weight: 600;">
                            ✅ Einträge jetzt importieren
                        </button>
                        <span id="olla-import-execute-spinner" class="spinner" style="float: none;"></span>
                    </div>
                </div>

                <!-- Step 4: Result -->
                <div id="olla-import-step-result" style="display: none; padding: 16px 0; border-top: 1px solid #f0f0f1;">
                    <div id="olla-import-result-box" style="padding: 14px 18px; border-radius: 4px; font-size: 13px;">
                        <!-- Filled by JS -->
                    </div>
                </div>
            </div>

            <!-- PANEL 2: CSV-Datei Upload -->
            <div id="olla-import-panel-csv-file" class="olla-import-panel" style="display: none; padding: 10px 0;">
                <p style="font-size: 13px; color: #555; margin-bottom: 14px;">
                    Lade eine CSV- oder Textdatei hoch (z. B. aus Excel, Google Sheets, einem alten Kontaktformular oder Mail-Export).<br/>
                    Spalten wie <strong>Name</strong>, <strong>E-Mail</strong>, <strong>Nachricht</strong> und <strong>Datum</strong> werden automatisch erkannt.
                </p>
                <div style="background: #faf8f5; border: 2px dashed #d5c9b6; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 16px;">
                    <span class="dashicons dashicons-upload" style="font-size: 36px; width: 36px; height: 36px; color: #b45309; margin-bottom: 8px;"></span><br/>
                    <label for="olla-csv-file-input" class="button button-secondary" style="font-weight: 600; cursor: pointer;">
                        📁 CSV-Datei auswählen
                    </label>
                    <input type="file" id="olla-csv-file-input" accept=".csv,.txt" style="display: none;" />
                    <p id="olla-csv-file-name" style="margin: 10px 0 0 0; font-size: 12px; color: #777;">Unterstützte Formate: .csv, .txt (Trennzeichen: Komma, Semikolon oder Tabulator)</p>
                </div>

                <!-- CSV Preview + Execute -->
                <div id="olla-csv-file-preview-wrap" style="display: none;">
                    <div id="olla-csv-file-preview-info" style="margin-bottom: 14px; padding: 12px 16px; background: #f0f6fc; border-left: 4px solid #2271b1; border-radius: 4px;"></div>
                    <div id="olla-csv-file-preview-table" style="margin-bottom: 14px; overflow-x: auto;"></div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <button type="button" id="olla-csv-file-execute-btn" class="button button-primary" style="font-weight: 600;">
                            ✅ CSV-Einträge jetzt importieren
                        </button>
                        <span id="olla-csv-file-spinner" class="spinner" style="float: none;"></span>
                    </div>
                </div>

                <!-- CSV Result -->
                <div id="olla-csv-file-result-box" style="display: none; margin-top: 14px; padding: 14px 18px; border-radius: 4px; font-size: 13px;"></div>
            </div>

            <!-- PANEL 3: Text / CSV direkt einfügen (Copy & Paste) -->
            <div id="olla-import-panel-csv-paste" class="olla-import-panel" style="display: none; padding: 10px 0;">
                <p style="font-size: 13px; color: #555; margin-bottom: 12px;">
                    Kopiere Zeilen direkt aus Excel, Google Tabellen oder einer E-Mail und füge sie hier ein:
                </p>
                <div class="olla-field-group" style="margin-bottom: 14px;">
                    <textarea id="olla-csv-paste-textarea" rows="6" style="width: 100%; font-family: monospace; font-size: 12px; border-radius: 4px; padding: 10px;" placeholder="Name;E-Mail;Nachricht;Datum&#10;Anna Schmidt;anna@example.de;Wir freuen uns auf das Konzert!;2026-05-12&#10;Klaus Meier;klaus@web.de;Gibt es noch Karten für Juni?;2026-05-15"></textarea>
                </div>
                <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px;">
                    <button type="button" id="olla-csv-paste-preview-btn" class="button button-secondary" style="font-weight: 600;">
                        🔍 Vorschau prüfen
                    </button>
                    <button type="button" id="olla-csv-paste-execute-btn" class="button button-primary" style="font-weight: 600; display: none;">
                        ✅ Eingefügte Einträge importieren
                    </button>
                    <span id="olla-csv-paste-spinner" class="spinner" style="float: none;"></span>
                </div>

                <!-- Paste Preview Table -->
                <div id="olla-csv-paste-preview-wrap" style="display: none;">
                    <div id="olla-csv-paste-preview-info" style="margin-bottom: 14px; padding: 12px 16px; background: #f0f6fc; border-left: 4px solid #2271b1; border-radius: 4px;"></div>
                    <div id="olla-csv-paste-preview-table" style="margin-bottom: 14px; overflow-x: auto;"></div>
                </div>

                <!-- Paste Result -->
                <div id="olla-csv-paste-result-box" style="display: none; margin-top: 14px; padding: 14px 18px; border-radius: 4px; font-size: 13px;"></div>
            </div>

        </div>
    </div>

    <!-- 3. KONTAKTFORMULAR-EINSTELLUNGEN (Unten platziert) -->
    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="olla-form-box">
        <input type="hidden" name="action" value="olla_podrida_save_settings" />
        <input type="hidden" name="section" value="contact" />
        <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>

        <div class="olla-card">
            <div class="olla-card-header">
                <h2>⚙️ Kontaktformular-Einstellungen (#kontakt)</h2>
                <p>Konfiguriere den E-Mail-Empfang, die Texte und das Porträt der Ensembleleitung.</p>
            </div>

            <div class="olla-card-body">
                <div class="olla-grid-2">
                    <div class="olla-field-group">
                        <label for="recipient_email"><strong>Empfänger-E-Mail(s) (an wen gehen Anfragen?) *:</strong></label>
                        <input type="text" id="recipient_email" name="recipient_email" required value="<?php echo esc_attr($contact['recipient_email']); ?>" class="large-text" placeholder="kontakt@ihre-domain.de" />
                        <p class="description" style="margin-top: 5px; font-size: 12px; color: #666;">
                            💡 <strong>Mehrere Empfänger möglich:</strong> Sie können eine oder mehrere E-Mail-Adressen kommagetrennt eingeben. Alle hinterlegten Adressen erhalten eingehende Anfragen zeitgleich als Benachrichtigung.
                        </p>
                    </div>
                    <div class="olla-field-group">
                        <label for="subject"><strong>E-Mail-Betreffzeile:</strong></label>
                        <input type="text" id="subject" name="subject" value="<?php echo esc_attr($contact['subject']); ?>" class="large-text" />
                    </div>
                </div>

                <div class="olla-grid-2">
                    <div class="olla-field-group">
                        <label for="contact_title"><strong>Überschrift der Sektion:</strong></label>
                        <input type="text" id="contact_title" name="title" value="<?php echo esc_attr($contact['title']); ?>" class="large-text" />
                    </div>
                    <div class="olla-field-group">
                        <label for="email_display"><strong>Sichtbare Kontakt-E-Mail:</strong></label>
                        <input type="text" id="email_display" name="email_display" value="<?php echo esc_attr($contact['email_display']); ?>" class="large-text" />
                    </div>
                </div>

                <div class="olla-field-group">
                    <label for="intro_paragraph1"><strong>Einleitungstext 1:</strong></label>
                    <textarea id="intro_paragraph1" name="intro_paragraph1" rows="2" class="large-text"><?php echo esc_textarea($contact['intro_paragraph1']); ?></textarea>
                </div>

                <div class="olla-field-group">
                    <label for="intro_paragraph2"><strong>Einleitungstext 2:</strong></label>
                    <input type="text" id="intro_paragraph2" name="intro_paragraph2" value="<?php echo esc_attr($contact['intro_paragraph2']); ?>" class="large-text" />
                </div>

                <div class="olla-field-group olla-media-field">
                    <label><strong>Porträt Ensembleleitung / Ansprechpartner(in) (neben dem Formular):</strong></label>
                    <div class="olla-media-row">
                        <input type="text" name="portrait" id="contact_portrait" value="<?php echo esc_url($contact['portrait']); ?>" class="regular-text olla-media-input" />
                        <button type="button" class="button olla-media-upload-btn" data-target="#contact_portrait" data-preview="#contact_portrait_preview">Aus Mediathek wählen</button>
                    </div>
                    <div class="olla-media-preview" id="contact_portrait_preview">
                        <?php if (!empty($contact['portrait'])): ?>
                            <img src="<?php echo esc_url($contact['portrait']); ?>" style="max-height: 90px; margin-top: 6px; border-radius: 4px;" />
                        <?php endif; ?>
                    </div>
                </div>

                <div class="olla-field-group">
                    <label for="consent_text"><strong>Datenschutz-Checkbox Text (DSGVO-Zustimmung) *:</strong></label>
                    <textarea id="consent_text" name="consent_text" rows="3" class="large-text"><?php echo esc_textarea($contact['consent_text']); ?></textarea>
                </div>

                <div class="olla-grid-2">
                    <div class="olla-field-group">
                        <label for="success_message"><strong>Erfolgsmeldung nach Absenden:</strong></label>
                        <input type="text" id="success_message" name="success_message" value="<?php echo esc_attr($contact['success_message']); ?>" class="large-text" />
                    </div>
                    <div class="olla-field-group">
                        <label for="error_message"><strong>Fehlermeldung (Pflichtfeld fehlt):</strong></label>
                        <input type="text" id="error_message" name="error_message" value="<?php echo esc_attr($contact['error_message']); ?>" class="large-text" />
                    </div>
                </div>
            </div>

            <div class="olla-card-footer">
                <button type="submit" class="button button-primary button-large">Kontaktformular-Einstellungen speichern</button>
            </div>
        </div>
    </form>
</div>
