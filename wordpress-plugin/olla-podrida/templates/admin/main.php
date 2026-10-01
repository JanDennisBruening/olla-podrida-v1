<?php
if (!defined('ABSPATH')) {
    exit;
}

$tab = $active_tab;
$tabs = [
    'settings' => ['label' => '👑 Allgemein & System', 'icon' => 'dashicons-admin-settings'],
    'hero' => ['label' => '🏰 Start & Hero', 'icon' => 'dashicons-format-image'],
    'ensemble' => ['label' => '📜 Ensemble & Musiker', 'icon' => 'dashicons-groups'],
    'events' => ['label' => '📅 Termine & Konzerte', 'icon' => 'dashicons-calendar-alt'],
    'contact' => ['label' => '✉️ Kontakt & Postfach', 'icon' => 'dashicons-email-alt'],
    'consent' => ['label' => '🛡️ Cookie & Consent', 'icon' => 'dashicons-privacy'],
    'audio' => ['label' => '🎵 Musik & Player', 'icon' => 'dashicons-format-audio'],
    'press' => ['label' => '📰 Presse & Medien', 'icon' => 'dashicons-format-gallery'],
    'seo' => ['label' => '🔍 SEO & Metadaten', 'icon' => 'dashicons-search'],
    'legal' => ['label' => '⚖️ Rechtliches & Footer', 'icon' => 'dashicons-shield'],
    'display' => ['label' => '⚙️ Einbindung', 'icon' => 'dashicons-admin-generic'],
    'roles' => ['label' => '👥 Rollen & Rechte', 'icon' => 'dashicons-admin-users'],
];

// Quick metrics for admin header
$all_events = Olla_Podrida_Events::get_all_events();
$upcoming_events = array_filter($all_events, function($e) { return !empty($e['is_upcoming']); });
$audio_config = Olla_Podrida_Settings::get_section('audio');
$is_audio_active = !empty($audio_config['enabled']);

// Filter tabs by allowed permissions
$filtered_tabs = [];
foreach ($tabs as $key => $info) {
    if (in_array($key, $allowed_sections, true)) {
        $filtered_tabs[$key] = $info;
    }
}
?>

<div class="wrap olla-podrida-admin-wrap">
    <div class="olla-admin-header">
        <div class="olla-header-brand">
            <div class="olla-header-brand-logo">
                <img src="<?php echo esc_url(OLLA_PODRIDA_URL . 'assets/dist/images/logo-pot.png'); ?>" alt="Ensemble Olla Podrida" class="olla-header-logo-img" />
            </div>
            <div>
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <h1 style="margin: 0; line-height: 1.2;">Ensemble Olla Podrida</h1>
                    <span class="olla-version-tag">v<?php echo esc_html(OLLA_PODRIDA_VERSION); ?></span>
                </div>
                <p class="olla-header-subtitle">Klangvielfalt aus Mittelalter und Renaissance · Content Management System</p>
                <div class="olla-header-status-bar">
                    <span class="olla-mini-badge"><span class="dashicons dashicons-calendar-alt"></span> <?php echo count($upcoming_events); ?> anstehende Termine</span>
                    <span class="olla-mini-badge"><span class="dashicons dashicons-format-audio"></span> Musik: <?php echo $is_audio_active ? 'Aktiv' : 'Stumm'; ?></span>
                    <span class="olla-mini-badge"><span class="dashicons dashicons-admin-users"></span> 7 Ensemble-Mitglieder</span>
                </div>
            </div>
        </div>
        <div class="olla-header-actions">
            <a href="<?php echo esc_url(home_url('?olla_canvas=1')); ?>" target="_blank" class="button button-secondary olla-preview-btn">
                <span class="dashicons dashicons-external"></span> Live-Vorschau ansehen
            </a>
        </div>
    </div>

    <!-- Navigation Tabs (ausgeblendet für Ensemble-Leitung, da alle Menüpunkte bereits in der linken Seitenleiste liegen) -->
    <?php
    $current_user = wp_get_current_user();
    $is_ensemble_leitung = in_array('olla_ensemble_leitung', (array) $current_user->roles, true);
    if (!$is_ensemble_leitung):
    ?>
    <nav class="nav-tab-wrapper olla-nav-tab-wrapper">
        <?php foreach ($filtered_tabs as $key => $info): ?>
            <a href="<?php echo esc_url(admin_url('admin.php?page=olla-podrida&tab=' . $key)); ?>" 
               class="nav-tab <?php echo $tab === $key ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html($info['label']); ?>
            </a>
        <?php endforeach; ?>
    </nav>
    <?php endif; ?>

    <!-- Tab Content Container -->
    <div class="olla-tab-container">
        <?php if ((isset($_GET['updated']) && $_GET['updated'] === 'true') || isset($_GET['event_saved'])): ?>
            <div class="olla-save-notice" role="alert">
                <div class="olla-save-notice-icon">
                    <span class="dashicons dashicons-yes-alt"></span>
                </div>
                <div class="olla-save-notice-content">
                    <?php if (isset($_GET['event_saved']) && $_GET['event_saved'] === 'created'): ?>
                        <strong>Neue Veranstaltung erfolgreich erstellt!</strong>
                        <span>Der Konzerttermin wurde sicher in der Datenbank gespeichert und ist sofort live auf der Website aktiv.</span>
                    <?php elseif (isset($_GET['event_saved']) && $_GET['event_saved'] === 'updated'): ?>
                        <strong>Veranstaltung erfolgreich aktualisiert!</strong>
                        <span>Alle Änderungen am Konzerttermin wurden erfolgreich gespeichert und sind sofort live auf der Website aktiv.</span>
                    <?php else: ?>
                        <strong>Einstellungen erfolgreich gespeichert!</strong>
                        <span>Alle Änderungen wurden sicher übernommen und sind sofort auf der Website aktiv.</span>
                    <?php endif; ?>
                </div>
                <button type="button" class="olla-save-notice-close" onclick="this.closest('.olla-save-notice').style.display='none';" aria-label="Hinweis schließen">&times;</button>
            </div>
        <?php endif; ?>

        <?php
        $tab_file = OLLA_PODRIDA_PATH . 'templates/admin/tab-' . $tab . '.php';
        if (file_exists($tab_file)) {
            include $tab_file;
        } else {
            echo '<div class="notice notice-warning"><p>Bereich nicht gefunden oder keine Berechtigung vorhanden.</p></div>';
        }
        ?>
    </div>
</div>
