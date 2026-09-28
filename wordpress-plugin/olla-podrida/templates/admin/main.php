<?php
if (!defined('ABSPATH')) {
    exit;
}

$tab = $active_tab;
$tabs = [
    'hero' => ['label' => '🏰 Start & Hero', 'icon' => 'dashicons-format-image'],
    'ensemble' => ['label' => '📜 Ensemble & Musiker', 'icon' => 'dashicons-groups'],
    'events' => ['label' => '📅 Termine & Konzerte', 'icon' => 'dashicons-calendar-alt'],
    'contact' => ['label' => '✉️ Kontakt & Postfach', 'icon' => 'dashicons-email-alt'],
    'audio' => ['label' => '🎵 Musik & Player', 'icon' => 'dashicons-format-audio'],
    'legal' => ['label' => '⚖️ Rechtliches & Footer', 'icon' => 'dashicons-shield'],
    'press' => ['label' => '📰 Presse & Medien', 'icon' => 'dashicons-format-gallery'],
    'display' => ['label' => '⚙️ Einbindung', 'icon' => 'dashicons-admin-generic'],
    'roles' => ['label' => '👥 Rollen & Rechte', 'icon' => 'dashicons-admin-users'],
];

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
            <span class="olla-logo-badge">📯</span>
            <div>
                <h1>Ensemble Olla Podrida <span style="font-size: 13px; font-weight: 500; background: #251d18; border: 1px solid #DAA520; color: #DAA520; padding: 3px 9px; border-radius: 12px; margin-left: 8px; vertical-align: middle;">v<?php echo esc_html(OLLA_PODRIDA_VERSION); ?></span></h1>
                <p class="olla-header-subtitle">Klangvielfalt aus Mittelalter und Renaissance · Content Management System</p>
            </div>
        </div>
        <div class="olla-header-actions">
            <a href="<?php echo esc_url(home_url('?olla_canvas=1')); ?>" target="_blank" class="button button-secondary">
                <span class="dashicons dashicons-external" style="margin-top:4px;"></span> Live-Vorschau ansehen
            </a>
        </div>
    </div>

    <?php if (isset($_GET['updated']) && $_GET['updated'] === 'true'): ?>
        <div class="notice notice-success is-dismissible" style="margin: 15px 0;">
            <p><strong>Die Einstellungen wurden erfolgreich gespeichert!</strong></p>
        </div>
    <?php endif; ?>

    <!-- Navigation Tabs -->
    <nav class="nav-tab-wrapper olla-nav-tab-wrapper">
        <?php foreach ($filtered_tabs as $key => $info): 
            $target_page = ($key === 'hero') ? 'olla-podrida' : 'olla-podrida-' . $key;
        ?>
            <a href="<?php echo esc_url(admin_url('admin.php?page=' . $target_page . '&tab=' . $key)); ?>" 
               class="nav-tab <?php echo $tab === $key ? 'nav-tab-active' : ''; ?>">
                <?php echo esc_html($info['label']); ?>
            </a>
        <?php endforeach; ?>
    </nav>

    <!-- Tab Content Container -->
    <div class="olla-tab-container">
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
