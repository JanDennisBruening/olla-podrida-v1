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
     * Musician Management: Viewport Tabs, Nudge Buttons & Add Musician
     */
    function initMusicianManagement() {
        // Viewport tab switcher
        $(document).on('click', '.olla-vp-tab-btn', function(e) {
            e.preventDefault();
            var $btn = $(this);
            var targetVp = $btn.data('vp');
            var $stageBox = $btn.closest('.olla-musician-stage-box');
            $stageBox.find('.olla-vp-tab-btn').removeClass('active').css({'background':'#f4efe6', 'border-color':'#d5c9b6', 'font-weight':'normal'});
            $btn.addClass('active').css({'background':'#e2d7c5', 'border-color':'#bdae97', 'font-weight':'600'});
            $stageBox.find('.olla-vp-panel').hide();
            $stageBox.find('.olla-vp-' + targetVp).show();
        });

        // Nudge offset buttons for active viewport panel
        $(document).on('click', '.olla-nudge-btn', function(e) {
            e.preventDefault();
            var $btn = $(this);
            var axis = $btn.data('axis');
            var dir = parseInt($btn.data('dir'), 10) || 0;
            var $panel = $btn.closest('.olla-vp-panel');
            var $input = axis === 'x' ? $panel.find('.olla-offset-x') : $panel.find('.olla-offset-y');
            var curVal = parseInt($input.val(), 10) || 0;
            $input.val(curVal + dir).trigger('change');
        });

        // Nudge reset for active viewport panel
        $(document).on('click', '.olla-nudge-reset', function(e) {
            e.preventDefault();
            var $panel = $(this).closest('.olla-vp-panel');
            $panel.find('.olla-offset-x').val(0).trigger('change');
            $panel.find('.olla-offset-y').val(0).trigger('change');
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
                    '<!-- SEKTION 1: Bühnenbild & Hero-Bühne -->' +
                    '<div class="olla-musician-stage-box" style="background:#f9f7f2; border:1px solid #dcd3c1; border-radius:8px; padding:16px; margin-top:16px;">' +
                        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #e5dccb; padding-bottom:8px;">' +
                            '<h4 style="margin:0; font-size:15px; color:#2c1810; display:flex; align-items:center; gap:6px;">' +
                                '<span class="dashicons dashicons-format-image" style="color:#b45309;"></span>' +
                                '<strong>1. Bühnenbild &amp; Hero-Bühne (Startbereich oben)</strong>' +
                            '</h4>' +
                            '<label style="cursor:pointer; font-weight:600; font-size:13px; color:#2c1810;">' +
                                '<input type="checkbox" name="musicians[' + idx + '][show_hero]" value="1" checked /> Auf der Hero-Bühne anzeigen' +
                            '</label>' +
                        '</div>' +
                        '<div class="olla-field-group olla-media-field" style="margin-bottom:14px;">' +
                            '<label><strong>Freisteller-Bühnenbild (HeroStage):</strong></label>' +
                            '<div class="olla-media-row">' +
                                '<input type="text" name="musicians[' + idx + '][stage_image]" id="stage_img_' + idx + '" value="" class="regular-text olla-media-input" placeholder="https://.../figur.webp" />' +
                                '<button type="button" class="button olla-media-upload-btn" data-target="#stage_img_' + idx + '" data-preview="#stage_preview_' + idx + '">Aus Mediathek wählen</button>' +
                            '</div>' +
                            '<div class="olla-media-preview" id="stage_preview_' + idx + '"></div>' +
                        '</div>' +
                        '<div class="olla-positioning-wrap" style="background:#fff; border:1px solid #d4c8b2; border-radius:6px; padding:12px 14px;">' +
                            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">' +
                                '<div><strong style="font-size:13px; color:#2c1810;">🎯 Positionierung &amp; Feinjustierung (Versatz in Pixeln):</strong></div>' +
                                '<div class="olla-vp-tabs" style="display:flex; gap:4px;">' +
                                    '<button type="button" class="button olla-vp-tab-btn active" data-vp="desktop" style="display:inline-flex; align-items:center; gap:4px; font-weight:600; background:#e2d7c5; border-color:#bdae97;"><span class="dashicons dashicons-desktop" style="font-size:14px; width:14px; height:14px;"></span> Desktop</button>' +
                                    '<button type="button" class="button olla-vp-tab-btn" data-vp="tablet" style="display:inline-flex; align-items:center; gap:4px; background:#f4efe6; border-color:#d5c9b6;"><span class="dashicons dashicons-tablet" style="font-size:14px; width:14px; height:14px;"></span> Tablet</button>' +
                                    '<button type="button" class="button olla-vp-tab-btn" data-vp="mobile" style="display:inline-flex; align-items:center; gap:4px; background:#f4efe6; border-color:#d5c9b6;"><span class="dashicons dashicons-smartphone" style="font-size:14px; width:14px; height:14px;"></span> Smartphone</button>' +
                                '</div>' +
                            '</div>' +
                            '<div class="olla-vp-panel olla-vp-desktop" style="display:block;">' +
                                '<div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">' +
                                    '<div style="display:flex; align-items:center; gap:6px;">' +
                                        '<span style="font-size:12px; font-weight:600; min-width:85px;">X (Horizontal):</span>' +
                                        '<input type="number" name="musicians[' + idx + '][offset_x_desktop]" value="0" class="small-text olla-offset-x" style="width:65px;" />' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="-5" title="5px nach links"><span class="dashicons dashicons-arrow-left-alt2"></span></button>' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="5" title="5px nach rechts"><span class="dashicons dashicons-arrow-right-alt2"></span></button>' +
                                    '</div>' +
                                    '<div style="display:flex; align-items:center; gap:6px;">' +
                                        '<span style="font-size:12px; font-weight:600; min-width:70px;">Y (Vertikal):</span>' +
                                        '<input type="number" name="musicians[' + idx + '][offset_y_desktop]" value="0" class="small-text olla-offset-y" style="width:65px;" />' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="-5" title="5px nach oben"><span class="dashicons dashicons-arrow-up-alt2"></span></button>' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="5" title="5px nach unten"><span class="dashicons dashicons-arrow-down-alt2"></span></button>' +
                                    '</div>' +
                                    '<button type="button" class="button button-small olla-nudge-reset" title="Auf 0 zurücksetzen"><span class="dashicons dashicons-image-rotate"></span> Reset</button>' +
                                '</div>' +
                            '</div>' +
                            '<div class="olla-vp-panel olla-vp-tablet" style="display:none;">' +
                                '<div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">' +
                                    '<div style="display:flex; align-items:center; gap:6px;">' +
                                        '<span style="font-size:12px; font-weight:600; min-width:85px;">X (Horizontal):</span>' +
                                        '<input type="number" name="musicians[' + idx + '][offset_x_tablet]" value="0" class="small-text olla-offset-x" style="width:65px;" />' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="-5" title="5px nach links"><span class="dashicons dashicons-arrow-left-alt2"></span></button>' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="5" title="5px nach rechts"><span class="dashicons dashicons-arrow-right-alt2"></span></button>' +
                                    '</div>' +
                                    '<div style="display:flex; align-items:center; gap:6px;">' +
                                        '<span style="font-size:12px; font-weight:600; min-width:70px;">Y (Vertikal):</span>' +
                                        '<input type="number" name="musicians[' + idx + '][offset_y_tablet]" value="0" class="small-text olla-offset-y" style="width:65px;" />' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="-5" title="5px nach oben"><span class="dashicons dashicons-arrow-up-alt2"></span></button>' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="5" title="5px nach unten"><span class="dashicons dashicons-arrow-down-alt2"></span></button>' +
                                    '</div>' +
                                    '<button type="button" class="button button-small olla-nudge-reset" title="Auf 0 zurücksetzen"><span class="dashicons dashicons-image-rotate"></span> Reset</button>' +
                                '</div>' +
                            '</div>' +
                            '<div class="olla-vp-panel olla-vp-mobile" style="display:none;">' +
                                '<div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">' +
                                    '<div style="display:flex; align-items:center; gap:6px;">' +
                                        '<span style="font-size:12px; font-weight:600; min-width:85px;">X (Horizontal):</span>' +
                                        '<input type="number" name="musicians[' + idx + '][offset_x_mobile]" value="0" class="small-text olla-offset-x" style="width:65px;" />' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="-5" title="5px nach links"><span class="dashicons dashicons-arrow-left-alt2"></span></button>' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="x" data-dir="5" title="5px nach rechts"><span class="dashicons dashicons-arrow-right-alt2"></span></button>' +
                                    '</div>' +
                                    '<div style="display:flex; align-items:center; gap:6px;">' +
                                        '<span style="font-size:12px; font-weight:600; min-width:70px;">Y (Vertikal):</span>' +
                                        '<input type="number" name="musicians[' + idx + '][offset_y_mobile]" value="0" class="small-text olla-offset-y" style="width:65px;" />' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="-5" title="5px nach oben"><span class="dashicons dashicons-arrow-up-alt2"></span></button>' +
                                        '<button type="button" class="button button-small olla-nudge-btn" data-axis="y" data-dir="5" title="5px nach unten"><span class="dashicons dashicons-arrow-down-alt2"></span></button>' +
                                    '</div>' +
                                    '<button type="button" class="button button-small olla-nudge-reset" title="Auf 0 zurücksetzen"><span class="dashicons dashicons-image-rotate"></span> Reset</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<!-- SEKTION 2: Porträtbild & Pergament-Galerie -->' +
                    '<div class="olla-musician-portrait-box" style="background:#faf8f5; border:1px solid #e2d7c5; border-radius:8px; padding:16px; margin-top:16px;">' +
                        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eae1d2; padding-bottom:8px;">' +
                            '<h4 style="margin:0; font-size:15px; color:#2c1810; display:flex; align-items:center; gap:6px;">' +
                                '<span class="dashicons dashicons-id-alt" style="color:#b45309;"></span>' +
                                '<strong>2. Porträtbild (Pergament-Galerie &amp; Presse)</strong>' +
                            '</h4>' +
                            '<div style="display:flex; gap:16px; flex-wrap:wrap;">' +
                                '<label style="cursor:pointer; font-weight:600; font-size:13px; color:#2c1810;"><input type="checkbox" name="musicians[' + idx + '][show_ensemble]" value="1" checked /> In Ensemble-Galerie (#ensemble)</label>' +
                                '<label style="cursor:pointer; font-weight:600; font-size:13px; color:#2c1810;"><input type="checkbox" name="musicians[' + idx + '][show_press]" value="1" checked /> Im Pressematerial (Download)</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="olla-field-group olla-media-field">' +
                            '<label><strong>Porträtfoto:</strong></label>' +
                            '<div class="olla-media-row">' +
                                '<input type="text" name="musicians[' + idx + '][portrait_image]" id="portrait_img_' + idx + '" value="" class="regular-text olla-media-input" placeholder="https://.../portrait.webp" />' +
                                '<button type="button" class="button olla-media-upload-btn" data-target="#portrait_img_' + idx + '" data-preview="#portrait_preview_' + idx + '">Aus Mediathek wählen</button>' +
                            '</div>' +
                            '<p class="description" style="font-size:12px; color:#666; margin-top:4px;">Wird auf den Pergamentkarten im Ensemblebereich automatisch zentriert (keine Feinjustierung erforderlich).</p>' +
                            '<div class="olla-media-preview" id="portrait_preview_' + idx + '"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
            $('#olla-musicians-list').append(html);
        });
    }


})(jQuery);
