/**
 * Ensemble Olla Podrida - Admin JavaScript
 */
(function($) {
    'use strict';

    $(document).ready(function() {
        initMediaUploaders();
        initEventManagement();
        initMessageManagement();
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

})(jQuery);
