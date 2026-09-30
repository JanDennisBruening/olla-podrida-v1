<?php
if (!defined('ABSPATH')) {
    exit;
}

$stats = Olla_Podrida_Consent::get_stats();
$logs  = Olla_Podrida_Consent::get_logs(100);
$total = count($logs);
?>

<div class="olla-consent-container">

    <!-- KPI Summary Row -->
    <div class="olla-grid-4" style="margin-bottom: 25px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div class="olla-card" style="padding: 16px 20px; background: #fff; border-left: 4px solid #DAA520;">
            <span style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: 600;">Gesamt protokolliert</span>
            <div style="font-size: 26px; font-weight: bold; color: #141210; margin-top: 4px;">
                <?php echo intval($stats['total']); ?>
            </div>
            <span style="font-size: 11px; color: #888;">gemäß Art. 7 Abs. 1 DSGVO</span>
        </div>

        <div class="olla-card" style="padding: 16px 20px; background: #fff; border-left: 4px solid #10b981;">
            <span style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: 600;">Letzte 30 Tage</span>
            <div style="font-size: 26px; font-weight: bold; color: #065f46; margin-top: 4px;">
                <?php echo intval($stats['last_30_days']); ?>
            </div>
            <span style="font-size: 11px; color: #888;">Gültige Cookie-Laufzeit</span>
        </div>

        <div class="olla-card" style="padding: 16px 20px; background: #fff; border-left: 4px solid #3b82f6;">
            <span style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: 600;">Aktive Einwilligungen</span>
            <div style="font-size: 26px; font-weight: bold; color: #1e3a8a; margin-top: 4px;">
                <?php echo intval($stats['active']); ?>
            </div>
            <span style="font-size: 11px; color: #888;">Unwiderrufen</span>
        </div>

        <div class="olla-card" style="padding: 16px 20px; background: #fff; border-left: 4px solid #ef4444;">
            <span style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: 600;">Widerrufe</span>
            <div style="font-size: 26px; font-weight: bold; color: #991b1b; margin-top: 4px;">
                <?php echo intval($stats['revoked']); ?>
            </div>
            <span style="font-size: 11px; color: #888;">Durch Nutzer gelöscht</span>
        </div>
    </div>

    <!-- Main Consent Card -->
    <div class="olla-card">
        <div class="olla-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
            <div>
                <h2>🛡️ Cookie- &amp; Consent-Dokumentation</h2>
                <p>Dokumentation aller Website-Einwilligungen mit anonymer Consent-Session-ID gemäß Art. 7 Abs. 1 DSGVO.</p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <!-- CSV Export -->
                <a href="<?php echo esc_url(wp_nonce_url(admin_url('admin-post.php?action=olla_podrida_export_consent_csv'), 'olla_podrida_export_consent')); ?>" 
                   class="button button-primary" style="font-weight: 600;">
                    📥 Als CSV exportieren
                </a>
                <!-- Print / PDF Report -->
                <a href="<?php echo esc_url(wp_nonce_url(admin_url('admin-post.php?action=olla_podrida_print_consent_report'), 'olla_podrida_print_consent')); ?>" 
                   target="_blank" class="button button-secondary" style="font-weight: 600;">
                    🖨️ Bericht drucken / PDF
                </a>
            </div>
        </div>

        <div class="olla-card-body">
            <div style="background: #fdfbf7; border: 1px solid #e9dfcf; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; color: #493a2e;">
                💡 <strong>DSGVO-Nachweispflicht:</strong> Jeder Website-Besucher erhält beim Akzeptieren des Cookie-Banners eine eindeutige <em>Consent-Session-ID</em> (z.&nbsp;B. <code>OP-XXXXXXXX</code>). Diese ID wird dem Besucher auch in den Cookie-Einstellungen angezeigt. So kann eine Einwilligung jederzeit eindeutig zugeordnet werden, ohne dass personenbezogene Profile gespeichert werden müssen.
            </div>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th style="width: 140px;">Datum &amp; Zeit</th>
                        <th style="width: 170px;">Consent-Session-ID</th>
                        <th style="width: 140px;">Status</th>
                        <th style="width: 150px;">IP (anonymisiert)</th>
                        <th>Browser &amp; Endgerät</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($logs)): ?>
                        <tr>
                            <td colspan="5" style="text-align: center; padding: 30px; color: #777; font-style: italic;">
                                Noch keine Einwilligungen protokolliert. Sobald Besucher im Cookie-Banner auf „Alles klar, verstanden!“ klicken, erscheinen die Einträge hier.
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($logs as $log): ?>
                            <tr>
                                <td>
                                    <strong><?php echo esc_html(date_i18n('d.m.Y', strtotime($log['created_at']))); ?></strong><br/>
                                    <span style="font-size: 11px; color: #888;"><?php echo esc_html(date_i18n('H:i:s', strtotime($log['created_at']))); ?> Uhr</span>
                                </td>
                                <td>
                                    <code style="background: #f1ebd8; color: #2c1810; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                                        <?php echo esc_html($log['session_id']); ?>
                                    </code>
                                </td>
                                <td>
                                    <?php if ($log['action'] === 'grant'): ?>
                                        <span style="display: inline-block; background: #ecfdf5; color: #065f46; font-weight: 600; padding: 3px 8px; border-radius: 10px; font-size: 12px; border: 1px solid #a7f3d0;">
                                            ✓ Erteilt (30 Tage)
                                        </span>
                                    <?php else: ?>
                                        <span style="display: inline-block; background: #fef2f2; color: #991b1b; font-weight: 600; padding: 3px 8px; border-radius: 10px; font-size: 12px; border: 1px solid #fecaca;">
                                            ✗ Widerrufen
                                        </span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <span style="font-family: monospace; font-size: 12px; color: #444;">
                                        <?php echo esc_html($log['ip_anonymized']); ?>
                                    </span>
                                </td>
                                <td>
                                    <div style="max-height: 48px; overflow-y: auto; font-size: 12px; color: #555; word-break: break-all;">
                                        <?php echo esc_html($log['user_agent']); ?>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
