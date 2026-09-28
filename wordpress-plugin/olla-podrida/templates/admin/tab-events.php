<?php
if (!defined('ABSPATH')) {
    exit;
}

$events = Olla_Podrida_Events::get_all_events();
?>

<div class="olla-events-manager">
    <div class="olla-card">
        <div class="olla-card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2>📅 Veranstaltungen & Konzerttermine (#termine)</h2>
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
                        <th style="width: 110px;">Datum & Zeit</th>
                        <th>Titel & Ort</th>
                        <th style="width: 120px;">Kategorie</th>
                        <th style="width: 130px;">Status</th>
                        <th style="width: 160px; text-align: right;">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($events)): ?>
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 25px;">Keine Veranstaltungen eingetragen.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($events as $event): ?>
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
                                </td>
                                <td>
                                    <span class="olla-badge-category"><?php echo esc_html($event['category'] ?: 'Konzert'); ?></span>
                                </td>
                                <td>
                                    <?php if (!empty($event['is_upcoming'])): ?>
                                        <span class="olla-status-pill is-upcoming" onclick="OllaAdminEvents.toggleStatus('<?php echo esc_js($event['id']); ?>')">
                                            ● Kommend
                                        </span>
                                    <?php else: ?>
                                        <span class="olla-status-pill is-past" onclick="OllaAdminEvents.toggleStatus('<?php echo esc_js($event['id']); ?>')">
                                            ● Archiv
                                        </span>
                                    <?php endif; ?>
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
                        <label for="event_link"><strong>Weblink / Infoseite (optional):</strong></label>
                        <input type="url" id="event_link" name="link" placeholder="https://..." class="large-text" />
                    </div>

                    <div class="olla-field-group olla-media-field">
                        <label><strong>Veranstaltungsfoto / Flyer:</strong></label>
                        <div class="olla-media-row">
                            <input type="text" name="image_url" id="event_image_url" class="regular-text olla-media-input" />
                            <button type="button" class="button olla-media-upload-btn" data-target="#event_image_url" data-preview="#event_image_preview">Aus Mediathek wählen</button>
                        </div>
                        <div class="olla-media-preview" id="event_image_preview"></div>
                    </div>

                    <div class="olla-field-group">
                        <label for="event_description"><strong>Ausführliche Beschreibung:</strong></label>
                        <textarea id="event_description" name="description" rows="4" class="large-text"></textarea>
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
