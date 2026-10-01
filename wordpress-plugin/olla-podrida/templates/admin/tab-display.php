<?php
if (!defined('ABSPATH')) {
    exit;
}

$display = Olla_Podrida_Settings::get_section('display');
$all_pages = get_pages(['sort_column' => 'post_title', 'sort_order' => 'ASC']);

$canvas_id = intval($display['canvas_page_id'] ?? 0);
$canvas_page = $canvas_id ? get_post($canvas_id) : null;
$front_page_id = intval(get_option('page_on_front'));
$show_on_front = get_option('show_on_front');
$is_front_active = ($show_on_front === 'page' && $front_page_id === $canvas_id && $canvas_id > 0);
$permalink_structure = get_option('permalink_structure');
?>

<div class="olla-card" style="margin-bottom: 25px; border-left: 4px solid #DAA520;">
    <div class="olla-card-header">
        <h2>✨ Vollautomatische 1-Klick Einrichtung &amp; Systemstatus</h2>
        <p>Das Plugin konfiguriert bei der Aktivierung auf einer neuen WordPress-Installation alle nötigen Seiten, Vorlagen und Weiterleitungen selbstständig.</p>
    </div>
    <div class="olla-card-body">
        <ul style="margin: 0 0 16px 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px;">
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px;">
                <span class="dashicons <?php echo $canvas_page ? 'dashicons-yes-alt' : 'dashicons-warning'; ?>" style="color: <?php echo $canvas_page ? '#46b450' : '#dba617'; ?>; font-size: 20px;"></span>
                <span><strong>Canvas-Seite:</strong>
                <?php if ($canvas_page): ?>
                    Gefunden &amp; Verknüpft: <em><?php echo esc_html($canvas_page->post_title); ?></em> (ID: <?php echo esc_html($canvas_id); ?>)
                <?php else: ?>
                    <span style="color: #d63638;">Noch keine Zielseite verknüpft</span>
                <?php endif; ?>
                </span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px;">
                <span class="dashicons <?php echo $is_front_active ? 'dashicons-yes-alt' : 'dashicons-warning'; ?>" style="color: <?php echo $is_front_active ? '#46b450' : '#dba617'; ?>; font-size: 20px;"></span>
                <span><strong>Startseiten-Modus:</strong>
                <?php if ($is_front_active): ?>
                    Statische Startseite ist aktiv auf <em><?php echo esc_html($canvas_page->post_title); ?></em>
                <?php else: ?>
                    WordPress-Standard (Beitragsübersicht oder abweichende Startseite)
                <?php endif; ?>
                </span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px;">
                <span class="dashicons <?php echo !empty($permalink_structure) ? 'dashicons-yes-alt' : 'dashicons-warning'; ?>" style="color: <?php echo !empty($permalink_structure) ? '#46b450' : '#dba617'; ?>; font-size: 20px;"></span>
                <span><strong>Permalinks &amp; URLs:</strong>
                <?php if (!empty($permalink_structure)): ?>
                    Aktiv (<code><?php echo esc_html($permalink_structure); ?></code>) – Schöne URLs &amp; <code>/login</code>-Weiterleitung aktiv
                <?php else: ?>
                    <span style="color: #dba617;">Einfache Permalinks (Wird durch 1-Klick Setup auf Beitragsname umgestellt)</span>
                <?php endif; ?>
                </span>
            </li>
        </ul>

        <div>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display: inline-block;">
                <input type="hidden" name="action" value="olla_podrida_run_auto_setup" />
                <?php wp_nonce_field('olla_podrida_run_auto_setup', 'olla_setup_nonce'); ?>
                <button type="submit" class="button button-secondary button-large" onclick="return confirm('Möchtest du die automatische Einrichtung jetzt ausführen? Dadurch wird die Canvas-Seite geprüft/erstellt, als Startseite verknüpft und die Permalinks synchronisiert.');">
                    <span class="dashicons dashicons-update" style="vertical-align: text-top; margin-top: -1px;"></span> Vollautomatische Einrichtung jetzt erneut ausführen
                </button>
            </form>
        </div>
    </div>
</div>

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
