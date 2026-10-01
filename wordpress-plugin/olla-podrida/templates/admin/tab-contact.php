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
        <div class="olla-card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2>📥 Posteingang: Eingegangene Anfragen</h2>
                <p>Hier werden alle Kontaktanfragen aus dem Frontend dauerhaft archiviert.</p>
            </div>
            <span style="background: #e8a825; color: #070202; font-weight: 700; padding: 4px 12px; border-radius: 12px; font-size: 13px;">
                <?php echo intval($total_messages); ?> <?php echo $total_messages === 1 ? 'Anfrage' : 'Anfragen'; ?>
            </span>
        </div>

        <div class="olla-card-body">
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th style="width: 140px;">Datum &amp; Zeit</th>
                        <th style="width: 180px;">Absender / E-Mail</th>
                        <th>Nachricht</th>
                        <th style="width: 90px; text-align: right;">Aktion</th>
                    </tr>
                </thead>
                <tbody id="olla-inbox-table-body">
                    <?php if (empty($messages)): ?>
                        <tr>
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
                                    <a href="mailto:<?php echo esc_attr($msg['email']); ?>" style="color: #2271b1; text-decoration: none;">
                                        <?php echo esc_html($msg['email']); ?>
                                    </a>
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
            <p>Importiere vorhandene Kontaktformular-Einträge aus anderen WordPress-Plugins (Elementor Forms, WPForms, Contact Form 7 / Flamingo, Gravity Forms, Fluent Forms, Ninja Forms) in den Olla Podrida Posteingang.</p>
        </div>

        <div class="olla-card-body" id="olla-import-section">

            <!-- Step 1: Detect Sources -->
            <div id="olla-import-step-detect" style="padding: 16px 0;">
                <button type="button" id="olla-import-detect-btn" class="button button-secondary" style="font-weight: 600;">
                    🔍 Installierte Formular-Plugins suchen
                </button>
                <span id="olla-import-detect-spinner" class="spinner" style="float: none; margin-left: 8px;"></span>
                <div id="olla-import-no-sources" style="display: none; margin-top: 12px; padding: 14px 18px; background: #fef9e7; border-left: 4px solid #daa520; border-radius: 4px; font-size: 13px; color: #555;">
                    ⚠️ Keine unterstützten Formular-Plugins gefunden. Unterstützt werden: Elementor Pro Forms, WPForms, Contact Form 7 (Flamingo), Gravity Forms, Fluent Forms und Ninja Forms.
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
                <div id="olla-import-preview-table" style="margin-bottom: 14px;">
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
