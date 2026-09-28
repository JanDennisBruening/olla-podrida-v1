<?php
if (!defined('ABSPATH')) {
    exit;
}

$display = Olla_Podrida_Settings::get_section('display');
$all_pages = get_pages(['sort_column' => 'post_title', 'sort_order' => 'ASC']);
?>

<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="olla-form-box">
    <input type="hidden" name="action" value="olla_podrida_save_settings" />
    <input type="hidden" name="section" value="display" />
    <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>

    <div class="olla-card">
        <div class="olla-card-header">
            <h2>⚙️ Ausspielung &amp; Frontend-Einbindung</h2>
            <p>Lege fest, wie die One-Page Website in deiner WordPress-Installation angezeigt werden soll.</p>
        </div>

        <div class="olla-card-body">
            <div class="olla-field-group">
                <label><strong>1. Canvas-Modus (Empfohlen für pure One-Page Experience):</strong></label>
                <p class="description" style="margin-bottom: 8px;">
                    Im Canvas-Modus wird die gewählte Seite randlos und ohne die Kopf- und Fußzeilen des aktiven Themes dargestellt. Die Seite wird 1:1 originalgetreu geladen.
                </p>
                <label for="canvas_page_id"><strong>Zielseite für den Canvas-Modus auswählen:</strong></label>
                <select name="canvas_page_id" id="canvas_page_id" style="min-width: 300px;">
                    <option value="0">— Keine Seite (nur Shortcode verwenden) —</option>
                    <?php foreach ($all_pages as $page): ?>
                        <option value="<?php echo esc_attr($page->ID); ?>" <?php selected(intval($display['canvas_page_id'] ?? 0), $page->ID); ?>>
                            <?php echo esc_html($page->post_title); ?> (ID: <?php echo esc_html($page->ID); ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />

            <div class="olla-field-group">
                <label><strong>2. Shortcode-Einbindung:</strong></label>
                <p class="description" style="margin-bottom: 8px;">
                    Alternativ können Sie diesen Shortcode in jede beliebige WordPress-Seite oder einen Beitrag einfügen:
                </p>
                <code style="font-size: 15px; padding: 6px 12px; background: #221812; color: #DAA520; border-radius: 4px; display: inline-block;">
                    [olla_podrida]
                </code>
            </div>

            <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;" />

            <div class="olla-field-group">
                <label>
                    <input type="checkbox" name="preloader_enabled" value="1" <?php checked(!empty($display['preloader_enabled'])); ?> />
                    <strong>Intro-Preloader beim Seitenstart anzeigen</strong>
                </label>
                <p class="description">Zeigt die atmosphärische Prozent-Ladeanimation mit Logo beim ersten Laden der Seite.</p>
            </div>
        </div>

        <div class="olla-card-footer">
            <button type="submit" class="button button-primary button-large">Einbindungs-Einstellungen speichern</button>
        </div>
    </div>
</form>
