/**
 * Olla Podrida – Admin Backend Management JS
 */

(function ($) {
  'use strict';

  $(document).ready(function () {
    const config = window.OP_Gallery_Admin || {};
    const i18n = config.i18n || {};

    // Initialize Color Picker
    $('.op-color-field').wpColorPicker({
      change: function (event, ui) {
        // Can react on color change if needed
      }
    });

    // Range slider live indicators
    $('#op-m-lighting-intensity').on('input', function () {
      $('#op-intensity-val').text($(this).val());
    });
    $('#op-m-lighting-blur').on('input', function () {
      $('#op-blur-val').text($(this).val());
    });
    $('#op-m-lighting-ambient').on('input', function () {
      $('#op-ambient-val').text($(this).val());
    });

    // Sound Type Toggle
    $('#op-m-sound-type').on('change', function () {
      const type = $(this).val();
      if (type === 'custom') {
        $('#op-custom-audio-group').show();
        $('#op-freq-group').hide();
      } else {
        $('#op-custom-audio-group').hide();
        $('#op-freq-group').show();
      }
    });

    // Modal Controls
    const $modal = $('#op-musician-modal');
    const $form = $('#op-musician-form');

    function openModal(title) {
      $('#op-modal-title').text(title);
      $modal.fadeIn(150);
    }

    function closeModal() {
      $modal.fadeOut(150);
      $form[0].reset();
      $('#op-m-id').val('');
      $('#op-m-image-id').val('0');
      $('#op-m-image-url').val('');
      $('#op-m-default-asset').val('');
      $('#op-m-custom-audio-id').val('0');
      $('#op-m-custom-audio-url').val('');
      $('#op-image-preview').hide().attr('src', '');
      $('#op-image-placeholder').show();
      $('#op-btn-remove-image').hide();
      $('#op-audio-filename').text('');
      $('#op-btn-remove-audio').hide();
      $('#op-m-lighting-color').val('#d4af37').trigger('change');
      $('#op-intensity-val').text('45');
      $('#op-blur-val').text('32');
      $('#op-ambient-val').text('35');
      $('#op-m-sound-type').val('drum').trigger('change');
    }

    $('#op-modal-close, #op-modal-cancel').on('click', closeModal);
    $modal.on('click', function (e) {
      if ($(e.target).is('#op-musician-modal')) closeModal();
    });

    // Add Musician Button
    $('#op-btn-add-musician').on('click', function () {
      openModal('Neuen Musiker hinzufügen');
    });

    // Edit Musician Button
    $(document).on('click', '.op-btn-edit', function () {
      const m = $(this).data('musician');
      if (!m) return;

      $('#op-m-id').val(m.id || '');
      $('#op-m-name').val(m.name || '');
      $('#op-m-subtitle').val(m.subtitle || '');
      $('#op-m-instrument').val(m.instrument || '');
      $('#op-m-role').val(m.role || '');
      $('#op-m-quote').val(m.quote || '');

      // Media
      $('#op-m-image-id').val(m.image_id || 0);
      $('#op-m-image-url').val(m.image_url || '');
      $('#op-m-default-asset').val(m.default_asset || '');

      if (m.image_url) {
        $('#op-image-preview').attr('src', m.image_url).show();
        $('#op-image-placeholder').hide();
        $('#op-btn-remove-image').show();
      } else {
        $('#op-image-preview').hide().attr('src', '');
        $('#op-image-placeholder').show();
        $('#op-btn-remove-image').hide();
      }

      // Lighting
      const color = m.lighting_color || '#d4af37';
      $('#op-m-lighting-color').val(color);
      if ($('#op-m-lighting-color').wpColorPicker) {
        $('#op-m-lighting-color').wpColorPicker('color', color);
      }
      $('#op-m-lighting-intensity').val(m.lighting_intensity || 45);
      $('#op-intensity-val').text(m.lighting_intensity || 45);
      $('#op-m-lighting-blur').val(m.lighting_blur || 32);
      $('#op-blur-val').text(m.lighting_blur || 32);
      $('#op-m-lighting-ambient').val(m.lighting_ambient || 35);
      $('#op-ambient-val').text(m.lighting_ambient || 35);
      $('#op-m-lighting-pulse').prop('checked', Boolean(m.lighting_pulse));

      // Audio
      $('#op-m-sound-type').val(m.sound_type || 'drum').trigger('change');
      $('#op-m-sound-freq').val(m.sound_freq || 440);
      $('#op-m-custom-audio-id').val(m.custom_audio_id || 0);
      $('#op-m-custom-audio-url').val(m.custom_audio_url || '');
      if (m.custom_audio_url) {
        $('#op-audio-filename').text(m.custom_audio_url.split('/').pop());
        $('#op-btn-remove-audio').show();
      } else {
        $('#op-audio-filename').text('');
        $('#op-btn-remove-audio').hide();
      }

      openModal('Musiker bearbeiten · ' + m.name);
    });

    // WordPress Media Uploader: Image
    let imageFrame;
    $('#op-btn-select-image').on('click', function (e) {
      e.preventDefault();
      if (imageFrame) {
        imageFrame.open();
        return;
      }
      imageFrame = wp.media({
        title: i18n.select_image || 'Porträt-Bild auswählen',
        button: { text: i18n.use_image || 'Als Porträt verwenden' },
        multiple: false,
        library: { type: 'image' },
      });

      imageFrame.on('select', function () {
        const attachment = imageFrame.state().get('selection').first().toJSON();
        $('#op-m-image-id').val(attachment.id);
        $('#op-m-image-url').val(attachment.url);
        $('#op-image-preview').attr('src', attachment.url).show();
        $('#op-image-placeholder').hide();
        $('#op-btn-remove-image').show();
      });

      imageFrame.open();
    });

    $('#op-btn-remove-image').on('click', function () {
      $('#op-m-image-id').val('0');
      $('#op-m-image-url').val('');
      $('#op-image-preview').hide().attr('src', '');
      $('#op-image-placeholder').show();
      $(this).hide();
    });

    // WordPress Media Uploader: Audio
    let audioFrame;
    $('#op-btn-select-audio').on('click', function (e) {
      e.preventDefault();
      if (audioFrame) {
        audioFrame.open();
        return;
      }
      audioFrame = wp.media({
        title: i18n.select_audio || 'Audiodatei auswählen',
        button: { text: i18n.use_audio || 'Verwenden' },
        multiple: false,
        library: { type: 'audio' },
      });

      audioFrame.on('select', function () {
        const attachment = audioFrame.state().get('selection').first().toJSON();
        $('#op-m-custom-audio-id').val(attachment.id);
        $('#op-m-custom-audio-url').val(attachment.url);
        $('#op-audio-filename').text(attachment.filename || attachment.title);
        $('#op-btn-remove-audio').show();
      });

      audioFrame.open();
    });

    $('#op-btn-remove-audio').on('click', function () {
      $('#op-m-custom-audio-id').val('0');
      $('#op-m-custom-audio-url').val('');
      $('#op-audio-filename').text('');
      $(this).hide();
    });

    // Save Musician Form via AJAX
    $form.on('submit', function (e) {
      e.preventDefault();
      const $btn = $('#op-modal-submit');
      const $spinner = $form.find('.op-save-spinner');

      $btn.prop('disabled', true);
      $spinner.addClass('is-active');

      const formData = $form.serializeArray();
      formData.push({ name: 'action', value: 'op_gallery_save_musician' });
      formData.push({ name: 'nonce', value: config.nonce });

      $.post(config.ajax_url, formData, function (res) {
        $btn.prop('disabled', false);
        $spinner.removeClass('is-active');

        if (res && res.success) {
          closeModal();
          location.reload();
        } else {
          alert((res && res.data && res.data.message) || i18n.error);
        }
      }).fail(function () {
        $btn.prop('disabled', false);
        $spinner.removeClass('is-active');
        alert(i18n.error);
      });
    });

    // Delete Musician
    $(document).on('click', '.op-btn-delete', function () {
      const id = $(this).data('id');
      if (!confirm(i18n.confirm_delete || 'Wirklich löschen?')) return;

      const $card = $(this).closest('.op-musician-card');
      $.post(config.ajax_url, {
        action: 'op_gallery_delete_musician',
        id: id,
        nonce: config.nonce,
      }, function (res) {
        if (res && res.success) {
          $card.fadeOut(200, function () {
            $(this).remove();
          });
        }
      });
    });

    // Reorder Musicians (Drag & Drop)
    if ($('#op-musicians-grid').length) {
      $('#op-musicians-grid').sortable({
        handle: '.op-card-handle',
        update: function () {
          const ids = [];
          $('#op-musicians-grid .op-musician-card').each(function () {
            ids.push($(this).data('id'));
          });

          $.post(config.ajax_url, {
            action: 'op_gallery_reorder_musicians',
            ids: ids,
            nonce: config.nonce,
          });
        }
      });
    }

    // Reset Defaults
    $('#op-btn-reset-musicians').on('click', function () {
      if (!confirm(i18n.confirm_reset || 'Auf Standard zurücksetzen?')) return;

      $.post(config.ajax_url, {
        action: 'op_gallery_reset_musicians',
        nonce: config.nonce,
      }, function (res) {
        if (res && res.success) {
          location.reload();
        }
      });
    });

    // Settings Form Submit
    $('#op-settings-form').on('submit', function (e) {
      e.preventDefault();
      const $btn = $('#op-settings-submit');
      const $spinner = $(this).find('.op-save-spinner');

      $btn.prop('disabled', true);
      $spinner.addClass('is-active');

      const formData = $(this).serializeArray();
      formData.push({ name: 'action', value: 'op_gallery_save_settings' });
      formData.push({ name: 'nonce', value: config.nonce });

      $.post(config.ajax_url, formData, function (res) {
        $btn.prop('disabled', false);
        $spinner.removeClass('is-active');

        if (res && res.success) {
          alert(i18n.saved || 'Erfolgreich gespeichert!');
        } else {
          alert((res && res.data && res.data.message) || i18n.error);
        }
      }).fail(function () {
        $btn.prop('disabled', false);
        $spinner.removeClass('is-active');
        alert(i18n.error);
      });
    });

    // Radio Card selection visual update
    $('.op-radio-card input[type="radio"]').on('change', function () {
      $('.op-radio-card').removeClass('selected');
      $(this).closest('.op-radio-card').addClass('selected');
    });

    // Recreate / Repair Page Button
    $('#op-btn-recreate-page').on('click', function () {
      const $btn = $(this);
      $btn.prop('disabled', true);

      $.post(config.ajax_url, {
        action: 'op_gallery_create_page',
        nonce: config.nonce,
      }, function (res) {
        $btn.prop('disabled', false);
        if (res && res.success) {
          alert('Unterseite erfolgreich angelegt/repariert!');
          location.reload();
        }
      });
    });

  });
})(jQuery);
