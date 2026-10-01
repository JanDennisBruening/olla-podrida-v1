<?php
if (!defined('ABSPATH')) {
    exit;
}

$events = Olla_Podrida_Events::get_all_events();
$upcoming_events = array_values(array_filter($events, function($e) { return !empty($e['is_upcoming']); }));
$archived_events = array_values(array_filter($events, function($e) { return empty($e['is_upcoming']); }));
?>

<div class="olla-events-manager">
    <div class="olla-card">
        <div class="olla-card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2>📅 Veranstaltungen &amp; Konzerttermine (#termine)</h2>
                <p>Verwalte aktuelle Konzerte und die historische Konzertchronik.</p>
            </div>
            <button type="button" class="button button-primary button-large" id="olla-open-add-event-btn">
                <span class="dashicons dashicons-plus-alt" style="margin-top: 3px;"></span> Neue Veranstaltung hinzufügen
            </button>
        </div>

        <div class="olla-card-body">
            <table class="wp-list-table widefat fixed striped olla-events-table">
                <thead>
                    <tr>
                        <th style="width: 70px;">Bild</th>
                        <th style="width: 110px;">Datum &amp; Zeit</th>
                        <th>Titel &amp; Ort</th>
                        <th style="width: 120px;">Kategorie</th>
                        <th style="width: 130px;">Status</th>
                        <th style="width: 160px; text-align: right;">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 1. ABSCHNITT: AKTIVE & ANSTEHENDE KONZERTE -->
                    <tr class="olla-events-section-header upcoming-header" style="background: #fdfbf7;">
                        <td colspan="6" style="border-top: 2px solid #DAA520; border-bottom: 1.5px solid #d4c8b8; padding: 12px 16px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span class="dashicons dashicons-calendar-alt" style="color: #DAA520; font-size: 20px; width: 20px; height: 20px;"></span>
                                    <strong style="color: #141210; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.04em;">
                                        Aktuelle &amp; anstehende Konzerttermine
                                    </strong>
                                    <span class="olla-status-pill is-upcoming" style="font-size: 11px; margin-left: 6px;">
                                        ● <?php echo count($upcoming_events); ?> aktiv auf Website
                                    </span>
                                </div>
                                <span style="color: #666; font-size: 11.5px; font-style: italic;">
                                    Diese Termine werden Besuchern direkt auf der Website im Bereich #termine angezeigt.
                                </span>
                            </div>
                        </td>
                    </tr>

                    <?php if (empty($upcoming_events)): ?>
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 22px; color: #777; font-style: italic; background: #faf8f5;">
                                Aktuell sind keine anstehenden Konzerttermine eingetragen. Klicke oben auf &bdquo;Neue Veranstaltung hinzufügen&ldquo;.
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($upcoming_events as $event): ?>
                            <tr id="event-row-<?php echo esc_attr($event['id']); ?>" data-event="<?php echo esc_attr(wp_json_encode($event)); ?>">
                                <td>
                                    <?php if (!empty($event['image_url'])): ?>
                                        <img src="<?php echo esc_url($event['image_url']); ?>" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
                                    <?php else: ?>
                                        <div style="width: 50px; height: 50px; background: #eee; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #888;">kein Bild</div>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <strong><?php echo esc_html($event['date']); ?></strong>
                                    <?php if (!empty($event['time'])): ?>
                                        <br/><small style="color: #666;"><?php echo esc_html($event['time']); ?></small>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <strong><?php echo esc_html($event['title']); ?></strong>
                                    <br/>
                                    <small style="color: #666;">
                                        📍 <?php echo esc_html($event['location']); ?> (<?php echo esc_html($event['city']); ?>)
                                    </small>
                                    <?php if (!empty($event['contact_registration'])): ?>
                                        <br/><small style="color: #8c6d1f;">✉️ <?php echo esc_html($event['contact_registration']); ?></small>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <span class="olla-badge-category"><?php echo esc_html($event['category'] ?: 'Konzert'); ?></span>
                                </td>
                                <td>
                                    <span class="olla-status-pill is-upcoming" onclick="OllaAdminEvents.toggleStatus('<?php echo esc_js($event['id']); ?>')" title="Klicken, um in das Archiv zu verschieben">
                                        ● Kommend
                                    </span>
                                </td>
                                <td style="text-align: right;">
                                    <button type="button" class="button button-small olla-edit-event-btn" data-id="<?php echo esc_attr($event['id']); ?>">Bearbeiten</button>
                                    <button type="button" class="button button-small button-link-delete olla-delete-event-btn" data-id="<?php echo esc_attr($event['id']); ?>">Löschen</button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>

                    <!-- TRENNLINIE ZWISCHEN AKTIVEN UND ARCHIVIERTEN VERANSTALTUNGEN -->
                    <tr class="olla-events-section-divider">
                        <td colspan="6" style="padding: 0; height: 22px; background: #f0f0f1; border-top: 1.5px solid #dcdcde; border-bottom: 1.5px solid #dcdcde;"></td>
                    </tr>

                    <!-- 2. ABSCHNITT: KONZERTCHRONIK / ARCHIVIERTE VERANSTALTUNGEN -->
                    <tr class="olla-events-section-header archived-header" style="background: #f7f6f4;">
                        <td colspan="6" style="border-top: 2px solid #8c8273; border-bottom: 1.5px solid #d4c8b8; padding: 12px 16px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span class="dashicons dashicons-archive" style="color: #786d5e; font-size: 20px; width: 20px; height: 20px;"></span>
                                    <strong style="color: #3d362d; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.04em;">
                                        Konzertchronik · Archivierte vergangene Veranstaltungen
                                    </strong>
                                    <span class="olla-status-pill is-past" style="font-size: 11px; margin-left: 6px;">
                                        ● <?php echo count($archived_events); ?> im Archiv
                                    </span>
                                </div>
                                <span style="color: #666; font-size: 11.5px; font-style: italic;">
                                    Vergangene Konzerte sind für Besucher über das Chronik-Modal im Website-Footer einsehbar.
                                </span>
                            </div>
                        </td>
                    </tr>

                    <?php if (empty($archived_events)): ?>
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 22px; color: #777; font-style: italic; background: #faf8f5;">
                                Es befinden sich derzeit keine vergangenen Veranstaltungen in der Konzertchronik.
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($archived_events as $event): ?>
                            <tr id="event-row-<?php echo esc_attr($event['id']); ?>" data-event="<?php echo esc_attr(wp_json_encode($event)); ?>" style="opacity: 0.92; background: #faf9f6;">
                                <td>
                                    <?php if (!empty($event['image_url'])): ?>
                                        <img src="<?php echo esc_url($event['image_url']); ?>" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; filter: grayscale(20%);" />
                                    <?php else: ?>
                                        <div style="width: 50px; height: 50px; background: #eee; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #888;">kein Bild</div>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <strong><?php echo esc_html($event['date']); ?></strong>
                                    <?php if (!empty($event['time'])): ?>
                                        <br/><small style="color: #777;"><?php echo esc_html($event['time']); ?></small>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <strong><?php echo esc_html($event['title']); ?></strong>
                                    <br/>
                                    <small style="color: #777;">
                                        📍 <?php echo esc_html($event['location']); ?> (<?php echo esc_html($event['city']); ?>)
                                    </small>
                                    <?php if (!empty($event['contact_registration'])): ?>
                                        <br/><small style="color: #8c6d1f;">✉️ <?php echo esc_html($event['contact_registration']); ?></small>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <span class="olla-badge-category" style="background: #e5dfd3; color: #4a3e2c;"><?php echo esc_html($event['category'] ?: 'Konzert'); ?></span>
                                </td>
                                <td>
                                    <span class="olla-status-pill is-past" onclick="OllaAdminEvents.toggleStatus('<?php echo esc_js($event['id']); ?>')" title="Klicken, um wieder zu aktivieren">
                                        ● Archiv
                                    </span>
                                </td>
                                <td style="text-align: right;">
                                    <button type="button" class="button button-small olla-edit-event-btn" data-id="<?php echo esc_attr($event['id']); ?>">Bearbeiten</button>
                                    <button type="button" class="button button-small button-link-delete olla-delete-event-btn" data-id="<?php echo esc_attr($event['id']); ?>">Löschen</button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal für Veranstaltung hinzufügen/bearbeiten -->
<div id="olla-event-modal" class="olla-modal" style="display: none;">
    <div class="olla-modal-dialog">
        <div class="olla-modal-content">
            <div class="olla-modal-header">
                <h3 id="olla-modal-title">Veranstaltung bearbeiten</h3>
                <button type="button" class="olla-modal-close" onclick="OllaAdminEvents.closeModal()">&times;</button>
            </div>
            <form id="olla-event-form">
                <input type="hidden" name="id" id="event_id" value="" />

                <div class="olla-modal-body">
                    <div class="olla-field-group">
                        <label for="event_title"><strong>Titel der Veranstaltung *:</strong></label>
                        <input type="text" id="event_title" name="title" required class="large-text" placeholder="z. B. Konzert im Stift Börstel" />
                    </div>

                    <div class="olla-grid-2">
                        <div class="olla-field-group">
                            <label for="event_category"><strong>Kategorie:</strong></label>
                            <input type="text" id="event_category" name="category" placeholder="z. B. Konzert, Schlosskonzert, Mitsingkonzert" class="regular-text" />
                        </div>
                        <div class="olla-field-group">
                            <label for="event_is_upcoming"><strong>Status:</strong></label>
                            <select id="event_is_upcoming" name="is_upcoming" class="regular-text">
                                <option value="1">Kommend (Startseite)</option>
                                <option value="0">Vergangen (Konzertchronik / Archiv)</option>
                            </select>
                        </div>
                    </div>

                    <div class="olla-grid-2">
                        <div class="olla-field-group">
                            <label for="event_date"><strong>Datum:</strong></label>
                            <input type="text" id="event_date" name="date" placeholder="z. B. 11.10.2026" class="regular-text" />
                        </div>
                        <div class="olla-field-group">
                            <label for="event_time"><strong>Uhrzeit:</strong></label>
                            <input type="text" id="event_time" name="time" placeholder="z. B. 14.00 Uhr" class="regular-text" />
                        </div>
                    </div>

                    <div class="olla-grid-2">
                        <div class="olla-field-group">
                            <label for="event_location"><strong>Veranstaltungsort / Adresse:</strong></label>
                            <input type="text" id="event_location" name="location" placeholder="z. B. Stiftskirche Börstel, Börstel 1" class="regular-text" />
                        </div>
                        <div class="olla-field-group">
                            <label for="event_city"><strong>Stadt / Ort:</strong></label>
                            <input type="text" id="event_city" name="city" placeholder="z. B. Berge" class="regular-text" />
                        </div>
                    </div>

                    <div class="olla-field-group">
                        <label for="event_ticket_info"><strong>Eintritt &amp; Ticket-Information:</strong></label>
                        <input type="text" id="event_ticket_info" name="ticket_info" placeholder="z. B. Eintritt frei, Spende erbeten" class="large-text" />
                    </div>

                    <div class="olla-field-group">
                        <label for="event_contact_registration"><strong>✉️ Kontakt &amp; Anmeldung (optional):</strong></label>
                        <input type="text" id="event_contact_registration" name="contact_registration" placeholder="z. B. Voranmeldung unter info@stiftung.de oder Tel. 0541/12345" class="large-text" />
                        <span class="description" style="font-size: 11px; color: #666;">Wird nur auf der Veranstaltungskarte und im PDF-Druck angezeigt, wenn ausgefüllt.</span>
                    </div>

                    <div class="olla-field-group">
                        <label for="event_link"><strong>Weblink / Infoseite (optional):</strong></label>
                        <input type="url" id="event_link" name="link" placeholder="https://..." class="large-text" />
                    </div>

                    <div class="olla-field-group olla-media-field">
                        <label><strong>Veranstaltungsfoto / Flyer:</strong></label>
                        <div class="olla-media-row" style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
                            <button type="button" class="button button-secondary olla-media-upload-btn" data-target="#event_image_url" data-preview="#event_image_preview" style="white-space: nowrap; height: 36px; display: inline-flex; align-items: center; gap: 6px; padding: 0 14px;">
                                <span class="dashicons dashicons-admin-media" style="margin-top: 1px;"></span> Aus Mediathek wählen
                            </button>
                            <input type="text" name="image_url" id="event_image_url" class="regular-text olla-media-input" placeholder="https://... (oder Bild aus Mediathek wählen)" style="flex: 1; height: 36px;" />
                            <button type="button" class="button button-link-delete" id="event_image_clear_btn" style="height: 36px; display: inline-flex; align-items: center; color: #b32d2e; text-decoration: none;">Entfernen</button>
                        </div>
                        <div class="olla-media-preview" id="event_image_preview" style="margin-top: 8px;"></div>
                    </div>

                    <div class="olla-field-group">
                        <label for="event_description"><strong>Ausführliche Beschreibung:</strong></label>
                        <textarea id="event_description" name="description" rows="4" class="large-text" placeholder="Detailinformationen zum Programm, Stücken oder Mitwirkenden..."></textarea>
                    </div>

                    <!-- Zusatzpunkte / Highlights im Ausklappbereich -->
                    <div class="olla-field-group" style="background: #faf7f0; border: 1px solid #d4c29d; border-radius: 6px; padding: 14px 16px; margin: 15px 0;">
                        <h4 style="margin: 0 0 6px 0; color: #8c6d1f; display: flex; align-items: center; gap: 6px; font-size: 14px;">
                            <span class="dashicons dashicons-tag"></span> Zusatzpunkte &amp; Hinweise (im Ausklappbereich &bdquo;Ausführliche Konzertinformationen&ldquo;)
                        </h4>
                        <p style="font-size: 11.5px; color: #666; margin: 0 0 12px 0;">
                            Diese drei Punkte erscheinen auf der Website im Ausklapp-Bereich jedes Termins unter der Beschreibung. Du kannst jeden Punkt individuell anpassen oder über das Häkchen aktivieren/deaktivieren:
                        </p>

                        <!-- Zusatzpunkt 1: Musikstil -->
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <label style="display: inline-flex; align-items: center; gap: 6px; min-width: 140px; font-weight: 600; cursor: pointer; font-size: 13px;">
                                <input type="checkbox" name="badge_music_show" id="event_badge_music_show" value="1" checked />
                                <span>🎵 Punkt 1 anzeigen:</span>
                            </label>
                            <input type="text" name="badge_music" id="event_badge_music" class="large-text" value="🎵 Historische Musik der Renaissance &amp; des Mittelalters" placeholder="z. B. 🎵 Historische Musik der Renaissance & des Mittelalters" style="flex: 1; height: 32px;" />
                        </div>

                        <!-- Zusatzpunkt 2: Platzwahl -->
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <label style="display: inline-flex; align-items: center; gap: 6px; min-width: 140px; font-weight: 600; cursor: pointer; font-size: 13px;">
                                <input type="checkbox" name="badge_seating_show" id="event_badge_seating_show" value="1" checked />
                                <span>🏛️ Punkt 2 anzeigen:</span>
                            </label>
                            <input type="text" name="badge_seating" id="event_badge_seating" class="large-text" value="🏛️ Freie Platzwahl vor Ort" placeholder="z. B. 🏛️ Freie Platzwahl vor Ort" style="flex: 1; height: 32px;" />
                        </div>

                        <!-- Zusatzpunkt 3: Eintritt / Spende -->
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <label style="display: inline-flex; align-items: center; gap: 6px; min-width: 140px; font-weight: 600; cursor: pointer; font-size: 13px;">
                                <input type="checkbox" name="badge_admission_show" id="event_badge_admission_show" value="1" checked />
                                <span>📜 Punkt 3 anzeigen:</span>
                            </label>
                            <input type="text" name="badge_admission" id="event_badge_admission" class="large-text" value="📜 Eintritt frei / Spende erbeten" placeholder="z. B. 📜 Eintritt frei / Spende erbeten" style="flex: 1; height: 32px;" />
                        </div>
                    </div>
                </div>

                <div class="olla-modal-footer">
                    <button type="button" class="button button-secondary" onclick="OllaAdminEvents.closeModal()">Abbrechen</button>
                    <button type="submit" class="button button-primary">Veranstaltung speichern</button>
                </div>
            </form>
        </div>
    </div>
</div>
