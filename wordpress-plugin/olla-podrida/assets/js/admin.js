/**
 * Ensemble Olla Podrida - Admin JavaScript
 */
(function($) {
    'use strict';

    $(document).ready(function() {
        initMediaUploaders();
        initEventManagement();
        initMessageManagement();
        initMusicianManagement();
    });

    /**
     * Native WordPress Media Library Integration
     */
    function initMediaUploaders() {
        // Image Uploaders
        $(document).on('click', '.olla-media-upload-btn', function(e) {
            e.preventDefault();
            var $btn = $(this);
            var targetInput = $btn.data('target');
            var targetPreview = $btn.data('preview');

            var frame = wp.media({
                title: OllaPodridaAdmin.choose_image || 'Bild aus Mediathek wählen',
                button: { text: OllaPodridaAdmin.use_image || 'Dieses Bild verwenden' },
                multiple: false,
                library: { type: 'image' }
            });

            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                $(targetInput).val(attachment.url).trigger('change');
                if (targetPreview) {
                    $(targetPreview).html('<img src="' + attachment.url + '" style="max-height: 80px; margin-top: 6px; border-radius: 4px;" />');
                }
            });

            frame.open();
        });

        // Audio Uploaders (filtered for audio/mp3)
        $(document).on('click', '.olla-audio-upload-btn', function(e) {
            e.preventDefault();
            var $btn = $(this);
            var targetInput = $btn.data('target');

            var frame = wp.media({
                title: OllaPodridaAdmin.choose_audio || 'Audiodatei aus Mediathek wählen',
                button: { text: OllaPodridaAdmin.use_audio || 'Diese Audiodatei verwenden' },
                multiple: false,
                library: { type: 'audio' }
            });

            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                $(targetInput).val(attachment.url).trigger('change');
            });

            frame.open();
        });
    }

    /**
     * Event Management (Add, Edit, Delete, Toggle Status)
     */
    window.OllaAdminEvents = {
        openAddModal: function() {
            $('#olla-modal-title').text('Neue Veranstaltung hinzufügen');
            $('#event_id').val('');
            $('#event_title').val('');
            $('#event_category').val('Konzert');
            $('#event_is_upcoming').val('1');
            $('#event_date').val('');
            $('#event_time').val('');
            $('#event_location').val('');
            $('#event_city').val('');
            $('#event_ticket_info').val('Eintritt frei, Spende erbeten');
            $('#event_contact_registration').val('');
            $('#event_link').val('');
            $('#event_image_url').val('');
            $('#event_image_preview').empty();
            $('#event_description').val('');

            $('#olla-event-modal').fadeIn(200);
        },

        openEditModal: function(eventData) {
            $('#olla-modal-title').text('Veranstaltung bearbeiten: ' + eventData.title);
            $('#event_id').val(eventData.id || '');
            $('#event_title').val(eventData.title || '');
            $('#event_category').val(eventData.category || 'Konzert');
            $('#event_is_upcoming').val(eventData.is_upcoming ? '1' : '0');
            $('#event_date').val(eventData.date || '');
            $('#event_time').val(eventData.time || '');
            $('#event_location').val(eventData.location || '');
            $('#event_city').val(eventData.city || '');
            $('#event_ticket_info').val(eventData.ticket_info || '');
            $('#event_contact_registration').val(eventData.contact_registration || '');
            $('#event_link').val(eventData.link || '');
            $('#event_image_url').val(eventData.image_url || '');
            if (eventData.image_url) {
                $('#event_image_preview').html('<img src="' + eventData.image_url + '" style="max-height: 80px; margin-top: 6px; border-radius: 4px;" />');
            } else {
                $('#event_image_preview').empty();
            }
            $('#event_description').val(eventData.description || '');

            $('#olla-event-modal').fadeIn(200);
        },

        closeModal: function() {
            $('#olla-event-modal').fadeOut(150);
        },

        toggleStatus: function(id) {
            $.post(OllaPodridaAdmin.ajax_url, {
                action: 'olla_podrida_toggle_event',
                nonce: OllaPodridaAdmin.nonce,
                id: id
            }, function(res) {
                if (res.success) {
                    location.reload();
                }
            });
        }
    };

    function initEventManagement() {
        $('#olla-open-add-event-btn').on('click', function(e) {
            e.preventDefault();
            OllaAdminEvents.openAddModal();
        });

        // Edit Button on Row
        $(document).on('click', '.olla-edit-event-btn', function(e) {
            e.preventDefault();
            var $row = $(this).closest('tr');
            var eventData = $row.data('event');
            if (eventData) {
                OllaAdminEvents.openEditModal(eventData);
            }
        });

        // Delete Button on Row
        $(document).on('click', '.olla-delete-event-btn', function(e) {
            e.preventDefault();
            if (!confirm('Möchten Sie diese Veranstaltung wirklich unwiderruflich löschen?')) {
                return;
            }
            var id = $(this).data('id');
            var $row = $('#event-row-' + id);

            $.post(OllaPodridaAdmin.ajax_url, {
                action: 'olla_podrida_delete_event',
                nonce: OllaPodridaAdmin.nonce,
                id: id
            }, function(res) {
                if (res.success) {
                    $row.fadeOut(300, function() { $row.remove(); });
                }
            });
        });

        // Save Event Form Submit
        $('#olla-event-form').on('submit', function(e) {
            e.preventDefault();
            var formData = {
                id: $('#event_id').val(),
                title: $('#event_title').val(),
                category: $('#event_category').val(),
                is_upcoming: $('#event_is_upcoming').val() === '1',
                date: $('#event_date').val(),
                time: $('#event_time').val(),
                location: $('#event_location').val(),
                city: $('#event_city').val(),
                ticket_info: $('#event_ticket_info').val(),
                contact_registration: $('#event_contact_registration').val(),
                link: $('#event_link').val(),
                image_url: $('#event_image_url').val(),
                description: $('#event_description').val()
            };

            $.post(OllaPodridaAdmin.ajax_url, {
                action: 'olla_podrida_save_event',
                nonce: OllaPodridaAdmin.nonce,
                event: formData
            }, function(res) {
                if (res.success) {
                    location.reload();
                } else {
                    alert('Fehler beim Speichern: ' + (res.data || 'Unbekannt'));
                }
            });
        });
    }

    /**
     * Contact Messages Inbox Management
     */
    function initMessageManagement() {
        $(document).on('click', '.olla-delete-message-btn', function(e) {
            e.preventDefault();
            if (!confirm('Möchten Sie diese Nachricht löschen?')) {
                return;
            }
            var id = $(this).data('id');
            var $row = $('#message-row-' + id);

            $.post(OllaPodridaAdmin.ajax_url, {
                action: 'olla_podrida_delete_message',
                nonce: OllaPodridaAdmin.nonce,
                id: id
            }, function(res) {
                if (res.success) {
                    $row.fadeOut(300, function() { $row.remove(); });
                }
            });
        });
    }

    /**
     * Musician Management: Nudge Buttons & Add Musician
     */
    function initMusicianManagement() {
        // Nudge offset buttons
        $(document).on('click', '.olla-nudge-btn', function(e) {
            e.preventDefault();
            var $btn = $(this);
            var axis = $btn.data('axis');
            var dir = parseInt($btn.data('dir'), 10) || 0;
            var $group = $btn.closest('.olla-field-group');
            var $input = axis === 'x' ? $group.find('.olla-offset-x') : $group.find('.olla-offset-y');
            var curVal = parseInt($input.val(), 10) || 0;
            $input.val(curVal + dir).trigger('change');
        });

        // Nudge reset
        $(document).on('click', '.olla-nudge-reset', function(e) {
            e.preventDefault();
            var $group = $(this).closest('.olla-field-group');
            $group.find('.olla-offset-x').val(0).trigger('change');
            $group.find('.olla-offset-y').val(0).trigger('change');
        });

        // Add Musician button
        $('#olla-add-musician-btn').on('click', function(e) {
            e.preventDefault();
            var idx = $('#olla-musicians-list .olla-musician-item').length;
            var newId = 'musician_' + Date.now();
            var html = '<div class="olla-musician-item is-open">' +
                '<div class="olla-musician-header" onclick="this.parentElement.classList.toggle(\'is-open\');">' +
                    '<span class="olla-musician-drag-icon">☰</span> ' +
                    '<strong>Neues Ensemblemitglied</strong> ' +
                    '<span class="olla-musician-subrole">— Musiker</span>' +
                    '<span class="dashicons dashicons-arrow-down-alt2 olla-accordion-arrow" style="float: right;"></span>' +
                    '<button type="button" class="button button-link-delete button-small" style="float: right; margin-right: 12px;" onclick="event.stopPropagation(); if (confirm(\'Diesen Musiker wirklich aus dem Ensemble entfernen?\')) { this.closest(\'.olla-musician-item\').remove(); }">Löschen</button>' +
                '</div>' +
                '<div class="olla-musician-content">' +
                    '<input type="hidden" name="musicians[' + idx + '][id]" value="' + newId + '" />' +
                    '<div class="olla-grid-2">' +
                        '<div class="olla-field-group">' +
                            '<label><strong>Name:</strong></label>' +
                            '<input type="text" name="musicians[' + idx + '][name]" value="Neues Mitglied" class="regular-text" />' +
                        '</div>' +
                        '<div class="olla-field-group">' +
                            '<label><strong>Rolle / Stimme:</strong></label>' +
                            '<input type="text" name="musicians[' + idx + '][role]" value="Instrument &amp; Gesang" class="regular-text" />' +
                        '</div>' +
                    '</div>' +
                    '<div class="olla-field-group">' +
                        '<label><strong>Gespielte Instrumente (Komma-getrennt):</strong></label>' +
                        '<input type="text" name="musicians[' + idx + '][instruments]" value="Historische Instrumente" class="large-text" />' +
                    '</div>' +
                    '<div class="olla-field-group">' +
                        '<label><strong>Kurzbiografie:</strong></label>' +
                        '<textarea name="musicians[' + idx + '][bio]" rows="2" class="large-text"></textarea>' +
                    '</div>' +
                    '<div class="olla-field-group">' +
                        '<label><strong>Tooltip-Text beim Hovern:</strong></label>' +
                        '<input type="text" name="musicians[' + idx + '][tooltip]" value="Musiker" class="regular-text" />' +
                    '</div>' +
                    '<div class="olla-field-group" style="background:#faf8f5; border:1px solid #e2d7c5; border-radius:6px; padding:10px 14px; margin-top:10px;">' +
                        '<label style="display:block; margin-bottom:6px;"><strong>Sichtbarkeit in den Sektionen:</strong></label>' +
                        '<div style="display:flex; gap:18px; flex-wrap:wrap;">' +
                            '<label><input type="checkbox" name="musicians[' + idx + '][show_hero]" value="1" checked /> 🏰 Hero-Bühne (Oben)</label>' +
                            '<label><input type="checkbox" name="musicians[' + idx + '][show_ensemble]" value="1" checked /> 📜 Ensemble-Galerie (Mitte)</label>' +
                            '<label><input type="checkbox" name="musicians[' + idx + '][show_press]" value="1" checked /> 📰 Pressematerial (Download)</label>' +
                        '</div>' +
                    '</div>' +
                    '<div class="olla-field-group" style="background:#f0ede6; border:1px solid #d4c8b2; border-radius:6px; padding:10px 14px; margin-top:10px;">' +
                        '<label style="display:block; margin-bottom:6px;"><strong>Positionierung &amp; Feinjustierung (Bühnen-Offset in Pixeln):</strong></label>' +
                        '<div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">' +
                            '<div style="display:flex; align-items:center; gap:6px;">' +
                                '<span style="font-size:12px; font-weight:600;">X (Horizontal):</span>' +
                                '<input type="number" name="musicians[' + idx + '][offset_x]" value="0" class="small-text olla-offset-x" style="width:60px;" />' +
                                '<button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="-5" title="5px nach links">◄</button>' +
                                '<button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="5" title="5px nach rechts">►</button>' +
                            '</div>' +
                            '<div style="display:flex; align-items:center; gap:6px;">' +
                                '<span style="font-size:12px; font-weight:600;">Y (Vertikal):</span>' +
                                '<input type="number" name="musicians[' + idx + '][offset_y]" value="0" class="small-text olla-offset-y" style="width:60px;" />' +
                                '<button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="-5" title="5px nach oben">▲</button>' +
                                '<button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="5" title="5px nach unten">▼</button>' +
                            '</div>' +
                            '<button type="button" class="button button-small olla-nudge-reset" title="Auf 0 zurücksetzen">↺ Reset</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="olla-grid-2" style="margin-top:10px;">' +
                        '<div class="olla-field-group olla-media-field">' +
                            '<label><strong>Bühnenbild / Freisteller (HeroStage):</strong></label>' +
                            '<div class="olla-media-row">' +
                                '<input type="text" name="musicians[' + idx + '][stage_image]" id="stage_img_' + idx + '" value="" class="regular-text olla-media-input" />' +
                                '<button type="button" class="button olla-media-upload-btn" data-target="#stage_img_' + idx + '" data-preview="#stage_preview_' + idx + '">Wählen</button>' +
                            '</div>' +
                            '<div class="olla-media-preview" id="stage_preview_' + idx + '"></div>' +
                        '</div>' +
                        '<div class="olla-field-group olla-media-field">' +
                            '<label><strong>Porträtbild (Pergament-Galerie):</strong></label>' +
                            '<div class="olla-media-row">' +
                                '<input type="text" name="musicians[' + idx + '][portrait_image]" id="portrait_img_' + idx + '" value="" class="regular-text olla-media-input" />' +
                                '<button type="button" class="button olla-media-upload-btn" data-target="#portrait_img_' + idx + '" data-preview="#portrait_preview_' + idx + '">Wählen</button>' +
                            '</div>' +
                            '<div class="olla-media-preview" id="portrait_preview_' + idx + '"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
            $('#olla-musicians-list').append(html);
        });
    }

})(jQuery);
