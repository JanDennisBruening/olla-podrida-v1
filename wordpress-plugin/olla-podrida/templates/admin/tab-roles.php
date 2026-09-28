<?php
if (!defined('ABSPATH')) {
    exit;
}

if (!current_user_can('manage_options')) {
    echo '<div class="notice notice-error"><p>Nur Administratoren können Rollenberechtigungen verwalten.</p></div>';
    return;
}

$all_wp_roles = Olla_Podrida_Roles::get_all_wp_roles();
$all_sections = Olla_Podrida_Roles::get_all_sections();
// Exclude 'roles' from granular assignment (only admins can manage roles)
unset($all_sections['roles']);
?>

<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="olla-form-box">
    <input type="hidden" name="action" value="olla_podrida_save_settings" />
    <input type="hidden" name="section" value="roles" />
    <?php wp_nonce_field('olla_podrida_save_settings', 'olla_podrida_nonce'); ?>

    <div class="olla-card">
        <div class="olla-card-header">
            <h2>👥 Benutzerrollen &amp; Granulare Berechtigungen</h2>
            <p>Steuere flexibel und universell, welche WordPress-Benutzerrollen Zugriff auf die einzelnen Bereiche des Plugins haben. Nicht freigeschaltete Menüpunkte werden für die jeweilige Rolle vollständig ausgeblendet.</p>
        </div>

        <div class="olla-card-body">
            <div style="background: #251d18; border: 1px solid #DAA520; padding: 14px 18px; border-radius: 8px; margin-bottom: 25px; color: #F5F5DC;">
                <p style="margin: 0; font-size: 14px;">
                    🛡️ <strong>Administratoren</strong> haben grundsätzlich immer uneingeschränkten Vollzugriff auf alle Bereiche und Systemeinstellungen.<br/>
                    Für alle anderen Rollen (z. B. <em>Redakteur</em>, <em>Autor</em> oder benutzerdefinierte Rollen) können Sie hier einzelne Menüpunkte freischalten oder komplett verbergen. Benutzer ohne Freigabe für einen Bereich können diesen weder im Menü noch über direkte Links aufrufen.
                </p>
            </div>

            <div style="overflow-x: auto;">
                <table class="wp-list-table widefat fixed striped" style="min-width: 700px;">
                    <thead>
                        <tr>
                            <th style="width: 240px; font-weight: 700;">Bereich / Menüpunkt</th>
                            <th style="width: 140px; text-align: center;">Administrator</th>
                            <?php foreach ($all_wp_roles as $role_slug => $role_name): ?>
                                <?php if ($role_slug === 'administrator') continue; ?>
                                <th style="text-align: center; font-weight: 600;">
                                    <?php echo esc_html(translate_user_role($role_name)); ?><br/>
                                    <span style="font-weight: normal; font-size: 11px; opacity: 0.7;">(<?php echo esc_html($role_slug); ?>)</span>
                                </th>
                            <?php endforeach; ?>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($all_sections as $sec_key => $sec_info): ?>
                            <tr>
                                <td>
                                    <span class="dashicons <?php echo esc_attr($sec_info['icon']); ?>" style="margin-right: 6px; color: #DAA520; vertical-align: middle;"></span>
                                    <strong><?php echo esc_html($sec_info['label']); ?></strong>
                                </td>
                                <td style="text-align: center;">
                                    <span class="dashicons dashicons-yes" style="color: #46b450; font-size: 22px;"></span>
                                    <span style="font-size: 11px; display: block; color: #777;">Immer aktiv</span>
                                </td>
                                <?php foreach ($all_wp_roles as $role_slug => $role_name): ?>
                                    <?php
                                    if ($role_slug === 'administrator') continue;
                                    $allowed_for_role = Olla_Podrida_Roles::get_sections_for_role($role_slug);
                                    $is_checked = in_array($sec_key, $allowed_for_role, true);
                                    ?>
                                    <td style="text-align: center;">
                                        <label style="cursor: pointer; display: inline-block; padding: 4px 8px;">
                                            <input type="checkbox" 
                                                   name="roles_permissions[<?php echo esc_attr($role_slug); ?>][]" 
                                                   value="<?php echo esc_attr($sec_key); ?>" 
                                                   class="role-cb-<?php echo esc_attr($role_slug); ?>"
                                                   <?php checked($is_checked); ?> />
                                        </label>
                                    </td>
                                <?php endforeach; ?>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><em>Schnellwahl:</em></td>
                            <td style="text-align: center;">—</td>
                            <?php foreach ($all_wp_roles as $role_slug => $role_name): ?>
                                <?php if ($role_slug === 'administrator') continue; ?>
                                <td style="text-align: center; font-size: 11px;">
                                    <button type="button" class="button button-small" onclick="document.querySelectorAll('.role-cb-<?php echo esc_attr($role_slug); ?>').forEach(c => c.checked = true);">Alle</button>
                                    <button type="button" class="button button-small" onclick="document.querySelectorAll('.role-cb-<?php echo esc_attr($role_slug); ?>').forEach(c => c.checked = false);">Keine</button>
                                </td>
                            <?php endforeach; ?>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <div class="olla-card-footer">
            <button type="submit" class="button button-primary button-large">Rollenberechtigungen speichern</button>
        </div>
    </div>
</form>
