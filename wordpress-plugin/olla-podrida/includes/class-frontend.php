<?php
if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Frontend {

    public static function init() {
        add_shortcode('olla_podrida', [__CLASS__, 'render_shortcode']);
        add_action('init', [__CLASS__, 'handle_login_redirect'], 1);
        add_action('init', [__CLASS__, 'register_rewrite_rules']);
        add_filter('query_vars', [__CLASS__, 'register_query_vars']);
        add_action('template_redirect', [__CLASS__, 'maybe_render_canvas']);
        add_action('wp_enqueue_scripts', [__CLASS__, 'register_assets']);

        // Authenticated & Nonce-protected AJAX login modal
        add_action('wp_ajax_nopriv_olla_podrida_ajax_login', [__CLASS__, 'handle_ajax_login']);
        add_action('wp_ajax_olla_podrida_ajax_login', [__CLASS__, 'handle_ajax_login']);
    }

    public static function handle_ajax_login() {
        check_ajax_referer('olla_podrida_login_nonce', 'nonce', false);

        $username = sanitize_user($_POST['log'] ?? '');
        if (empty($username)) {
            $username = sanitize_text_field($_POST['log'] ?? '');
        }
        $password = $_POST['pwd'] ?? '';
        $remember = !empty($_POST['rememberme']);

        if (empty($username) || empty($password)) {
            wp_send_json_error([
                'message' => 'Bitte gib sowohl Benutzername als auch Passwort ein.'
            ]);
        }

        $creds = [
            'user_login'    => $username,
            'user_password' => $password,
            'remember'      => $remember,
        ];

        $user = wp_signon($creds, is_ssl());

        if (is_wp_error($user)) {
            wp_send_json_error([
                'message' => 'Ungültige Zugangsdaten. Bitte überprüfe Benutzername und Passwort.'
            ]);
        }

        wp_set_current_user($user->ID);

        // Always land directly on the central Dashboard (index.php) where the cockpit widget is located
        $redirect = admin_url('index.php');

        wp_send_json_success([
            'redirect' => $redirect
        ]);
    }

    public static function handle_login_redirect() {
        $raw_uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
        $trimmed_uri = trim($raw_uri, '/');
        if ($trimmed_uri === 'login') {
            $redirect_to = !empty($_REQUEST['redirect_to']) ? $_REQUEST['redirect_to'] : admin_url();
            wp_safe_redirect(wp_login_url($redirect_to));
            exit;
        }
    }

    public static function register_rewrite_rules() {
        add_rewrite_rule('^login/?$', 'wp-login.php', 'top');
        add_rewrite_rule('^olla-podrida/?$', 'index.php?olla_podrida_route=1', 'top');
    }

    public static function register_query_vars($vars) {
        $vars[] = 'olla_podrida_route';
        return $vars;
    }

    public static function register_assets() {
        $dist_dir = OLLA_PODRIDA_PATH . 'assets/dist/assets/';
        $dist_url = OLLA_PODRIDA_URL . 'assets/dist/assets/';

        $js_file = null;
        $css_file = null;

        if (is_dir($dist_dir)) {
            $files = scandir($dist_dir);
            foreach ($files as $file) {
                if (preg_match('/^index-.*\.js$/', $file)) {
                    $js_file = $file;
                }
                if (preg_match('/^index-.*\.css$/', $file)) {
                    $css_file = $file;
                }
            }
        }

        if ($css_file) {
            wp_register_style(
                'olla-podrida-frontend',
                $dist_url . $css_file,
                [],
                OLLA_PODRIDA_VERSION
            );
        }

        if ($js_file) {
            wp_register_script(
                'olla-podrida-frontend',
                $dist_url . $js_file,
                [],
                OLLA_PODRIDA_VERSION,
                true
            );

            // Prepare dynamic data object for React
            $data = self::get_localized_data();
            wp_localize_script('olla-podrida-frontend', 'OLLA_PODRIDA_DATA', $data);
        }
    }

    public static function get_localized_data() {
        $hero = Olla_Podrida_Settings::get_section('hero');
        $ensemble = Olla_Podrida_Settings::get_section('ensemble');
        $musicians = Olla_Podrida_Settings::get_section('musicians');
        $events = Olla_Podrida_Events::get_all_events();
        $contact = Olla_Podrida_Settings::get_section('contact');
        $audio = Olla_Podrida_Settings::get_section('audio');
        $legal = Olla_Podrida_Settings::get_section('legal');
        $press = Olla_Podrida_Settings::get_section('press');
        $settings = Olla_Podrida_Settings::get_section('settings');

        // Transform musicians instruments from comma string to array if needed
        $formatted_musicians = [];
        $seen_musicians = [];
        foreach ($musicians as $m) {
            $id = $m['id'] ?? '';
            if ($id && isset($seen_musicians[$id])) {
                continue;
            }
            if ($id) {
                $seen_musicians[$id] = true;
            }

            $instr_array = is_array($m['instruments'] ?? null)
                ? $m['instruments']
                : array_map('trim', explode(',', $m['instruments'] ?? ''));

            $stage_image = $m['stage_image'] ?? '';
            $portrait_image = $m['portrait_image'] ?? '';

            // Normalize case-sensitivity for Linux web servers
            $stage_image = str_replace(
                ['Silke.webp', 'Klemens.webp', 'Simone.webp'],
                ['silke.webp', 'klemens.webp', 'simone.webp'],
                $stage_image
            );
            $portrait_image = str_replace(
                ['Silke.webp', 'Klemens.webp', 'Simone.webp'],
                ['silke.webp', 'klemens.webp', 'simone.webp'],
                $portrait_image
            );

            $formatted_musicians[] = [
                'id' => $m['id'],
                'name' => $m['name'],
                'role' => $m['role'],
                'instruments' => $instr_array,
                'bio' => $m['bio'],
                'tooltip' => $m['tooltip'],
                'stageImage' => $stage_image,
                'portraitImage' => $portrait_image,
                'stagePosition' => $m['stage_position'] ?? [
                    'desktop' => ['left' => '30%', 'top' => '30%', 'width' => '25rem', 'zIndex' => 5],
                    'mobile' => ['left' => '20%', 'top' => '25%', 'width' => '45vw', 'zIndex' => 5],
                ],
                'showHero' => !isset($m['show_hero']) || !empty($m['show_hero']),
                'showEnsemble' => !isset($m['show_ensemble']) || !empty($m['show_ensemble']),
                'showPress' => !isset($m['show_press']) || !empty($m['show_press']),
                'offsetX' => intval($m['offset_x_desktop'] ?? $m['offset_x'] ?? 0),
                'offsetY' => intval($m['offset_y_desktop'] ?? $m['offset_y'] ?? 0),
                'offsetXDesktop' => intval($m['offset_x_desktop'] ?? $m['offset_x'] ?? 0),
                'offsetYDesktop' => intval($m['offset_y_desktop'] ?? $m['offset_y'] ?? 0),
                'offsetXTablet' => intval($m['offset_x_tablet'] ?? 0),
                'offsetYTablet' => intval($m['offset_y_tablet'] ?? 0),
                'offsetXMobile' => intval($m['offset_x_mobile'] ?? 0),
                'offsetYMobile' => intval($m['offset_y_mobile'] ?? 0),
            ];
        }

        // Format events for React
        $formatted_events = [];
        foreach ($events as $ev) {
            $is_expired = Olla_Podrida_Events::is_event_expired($ev);
            $formatted_events[] = [
                'id' => $ev['id'],
                'title' => $ev['title'],
                'category' => $ev['category'],
                'date' => $ev['date'],
                'time' => $ev['time'],
                'location' => $ev['location'],
                'city' => $ev['city'],
                'description' => $ev['description'],
                'link' => $ev['link'] ?? '',
                'imageUrl' => $ev['image_url'] ?? '',
                'isUpcoming' => !empty($ev['is_upcoming']) && !$is_expired,
                'ticketInfo' => $ev['ticket_info'] ?? '',
                'contactRegistration' => $ev['contact_registration'] ?? '',
                'badgeMusic' => $ev['badge_music'] ?? '🎵 Historische Musik der Renaissance & des Mittelalters',
                'badgeMusicShow' => !isset($ev['badge_music_show']) || !empty($ev['badge_music_show']),
                'badgeSeating' => $ev['badge_seating'] ?? '🏛️ Freie Platzwahl vor Ort',
                'badgeSeatingShow' => !isset($ev['badge_seating_show']) || !empty($ev['badge_seating_show']),
                'badgeAdmission' => $ev['badge_admission'] ?? '📜 Eintritt frei / Spende erbeten',
                'badgeAdmissionShow' => !isset($ev['badge_admission_show']) || !empty($ev['badge_admission_show']),
            ];
        }

        return [
            'pluginUrl' => OLLA_PODRIDA_URL,
            'assetsUrl' => OLLA_PODRIDA_URL . 'assets/dist/',
            'imagesUrl' => OLLA_PODRIDA_URL . 'assets/dist/images/',
            'restUrl'   => esc_url_raw(rest_url()),
            'hero' => [
                'slogan' => $hero['slogan'] ?? '',
                'subtitle' => $hero['subtitle'] ?? '',
                'bgDesktop' => $hero['bg_desktop'] ?? '',
                'bgMobile' => $hero['bg_mobile'] ?? '',
                'smokeEnabled' => !empty($hero['smoke_enabled']),
                'smokeOpacity' => (floatval($hero['smoke_opacity'] ?? 20)) / 100,
            ],
            'ensemble' => [
                'title' => $ensemble['title'] ?? 'Ensemble Olla Podrida',
                'paragraph1' => $ensemble['paragraph1'] ?? '',
                'paragraph2' => $ensemble['paragraph2'] ?? '',
                'paragraph3' => $ensemble['paragraph3'] ?? '',
                'logo' => $ensemble['logo'] ?? '',
            ],
            'musicians' => $formatted_musicians,
            'events' => $formatted_events,
            'contact' => [
                'recipientEmail' => $contact['recipient_email'] ?? '',
                'subject' => $contact['subject'] ?? '',
                'portrait' => $contact['portrait'] ?? '',
                'title' => $contact['title'] ?? 'Kontakt & Anfragen',
                'introParagraph1' => $contact['intro_paragraph1'] ?? '',
                'introParagraph2' => $contact['intro_paragraph2'] ?? '',
                'emailDisplay' => $contact['email_display'] ?? '',
                'consentText' => $contact['consent_text'] ?? '',
                'successMessage' => $contact['success_message'] ?? '',
                'errorMessage' => $contact['error_message'] ?? '',
                'restUrl' => rest_url('olla-podrida/v1/contact'),
                'nonce' => wp_create_nonce('wp_rest')
            ],
            'audio' => [
                'enabled' => !empty($audio['enabled']),
                'src' => trim($audio['src'] ?? ''),
                'title' => $audio['title'] ?? '',
                'subtitle' => $audio['subtitle'] ?? '',
                'autoplay' => !empty($audio['autoplay']),
                'loop' => !empty($audio['loop']),
                'volume' => (floatval($audio['volume'] ?? 50)) / 100,
                'buttonText' => $audio['button_text'] ?? '• Musik an / aus • Musik an / aus',
            ],
            'legal' => [
                'sealImage' => $legal['seal_image'] ?? '',
                'copyrightText' => $legal['copyright_text'] ?? '',
                'impressumHtml' => $legal['impressum_html'] ?? '',
                'datenschutzHtml' => $legal['datenschutz_html'] ?? '',
                'cookieBannerText' => $legal['cookie_banner_text'] ?? '',
                'cookieAcceptText' => $legal['cookie_accept_text'] ?? '',
                'cookieDeclineText' => $legal['cookie_decline_text'] ?? '',
            ],
            'press' => [
                'title' => $press['title'] ?? 'Presse & Medienmaterial',
                'subtitle' => $press['subtitle'] ?? 'Offizielle Pressematerialien, Logos und Bilddateien des Ensemble Olla Podrida',
                'introText' => $press['intro_text'] ?? '',
                'contactName' => $press['contact_name'] ?? 'Susanne Hoffmann (Ensembleleitung)',
                'contactEmail' => $press['contact_email'] ?? get_option('admin_email', ''),
                'contactPhone' => $press['contact_phone'] ?? '',
                'pressNote' => $press['press_note'] ?? '',
                'logos' => [
                    [
                        'id' => 'logo-light',
                        'title' => 'Ensemble Logo Olla Podrida',
                        'subtitle' => 'Offizielles Emblem für helle Hintergründe',
                        'category' => 'logo',
                        'imageUrl' => $press['logo_banner'] ?: (OLLA_PODRIDA_URL . 'assets/dist/images/2024_07_15_Logo_Olla-Podrida_V1_1.png'),
                        'downloadUrl' => $press['logo_banner'] ?: (OLLA_PODRIDA_URL . 'assets/dist/images/2024_07_15_Logo_Olla-Podrida_V1_1.png'),
                        'format' => 'PNG (Freigestellt)',
                        'fileSize' => '128 KB',
                    ],
                    [
                        'id' => 'logo-dark',
                        'title' => 'Ensemble Logo Olla Podrida',
                        'subtitle' => 'Offizielles Emblem für dunkle Hintergründe',
                        'category' => 'logo',
                        'imageUrl' => $press['logo_seal'] ?: (OLLA_PODRIDA_URL . 'assets/dist/images/3_Zeichenflaeche-1-Kopie-10-1024x1024.png'),
                        'downloadUrl' => $press['logo_seal'] ?: (OLLA_PODRIDA_URL . 'assets/dist/images/3_Zeichenflaeche-1-Kopie-10-1024x1024.png'),
                        'format' => 'PNG (1024x1024)',
                        'fileSize' => '193 KB',
                    ],
                ],
                'photos' => [
                    [
                        'id' => 'photo1',
                        'title' => $press['photo1_title'] ?? 'Ensemble Olla Podrida Gesamtansicht',
                        'subtitle' => 'Bühnenporträt im historischen Gewand',
                        'category' => 'photo',
                        'imageUrl' => $press['photo1_url'] ?? '',
                        'downloadUrl' => $press['photo1_url'] ?? '',
                        'format' => 'WEBP (Hochauflösend)',
                        'credit' => '© Jan Dennis Brüning / Ensemble Olla Podrida',
                    ],
                    [
                        'id' => 'photo4',
                        'title' => $press['photo4_title'] ?? 'Bühnenkulisse im Instrumentarium',
                        'subtitle' => 'Historische Atmosphäre',
                        'category' => 'photo',
                        'imageUrl' => $press['photo4_url'] ?? '',
                        'downloadUrl' => $press['photo4_url'] ?? '',
                        'format' => 'WEBP (Großformat)',
                        'credit' => '© Jan Dennis Brüning · Freepik',
                    ],
                ]
            ],
            'texts' => [
                'navStart' => $settings['text_nav_start'] ?? 'Start',
                'navEnsemble' => $settings['text_nav_ensemble'] ?? 'Ensemble',
                'navTermine' => $settings['text_nav_termine'] ?? 'Termine',
                'navKontakt' => $settings['text_nav_kontakt'] ?? 'Kontakt',
                'navPresse' => $settings['text_nav_presse'] ?? 'Presse',
                'termineTitle' => $settings['text_termine_title'] ?? 'Aktuelle Termine',
                'termineEmpty' => $settings['text_termine_empty'] ?? 'Zurzeit sind keine weiteren Konzerttermine in Planung.',
                'termineEmptySub' => $settings['text_termine_empty_sub'] ?? 'Schauen Sie bald wieder vorbei oder stöbern Sie in unserer Konzertchronik!',
                'scrollTop' => $settings['text_scroll_top'] ?? 'Nach oben',
                'footerDev' => $settings['text_footer_dev'] ?? 'Design, Konzept und Webentwicklung · Jan Dennis Brüning',
            ],
            'version' => OLLA_PODRIDA_VERSION,
            'restUrl' => rest_url('olla-podrida/v1/contact'),
            'nonce' => wp_create_nonce('wp_rest'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'loginNonce' => wp_create_nonce('olla_podrida_login_nonce'),
            'adminUrl' => admin_url(),
            'loginUrl' => wp_login_url(),
        ];
    }

    public static function render_shortcode($atts) {
        wp_enqueue_style('olla-podrida-frontend');
        wp_enqueue_script('olla-podrida-frontend');

        return '<div id="root" class="olla-podrida-app-container"></div>';
    }

    public static function maybe_render_canvas() {
        if (is_admin()) {
            return;
        }

        $display = Olla_Podrida_Settings::get_section('display');
        $canvas_page_id = intval($display['canvas_page_id'] ?? 0);

        $is_target_page = ($canvas_page_id > 0 && is_page($canvas_page_id));
        $is_explicit_param = (isset($_GET['olla_canvas']) && $_GET['olla_canvas'] === '1');
        $is_query_var = (get_query_var('olla_podrida_route') == '1');

        $settings = Olla_Podrida_Settings::get_section('settings');
        $universal_dominance = !empty($settings['universal_dominance']);

        // Direct URL slug check for /olla-podrida regardless of permalink cache status
        $raw_uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
        $trimmed_uri = trim($raw_uri, '/');
        $is_direct_slug = ($trimmed_uri === 'olla-podrida' || preg_match('/(^|\/)olla-podrida$/i', $trimmed_uri));
        $is_front_page_domination = ($universal_dominance && (is_front_page() || is_home()));

        if ($is_front_page_domination || $is_direct_slug || $is_query_var || $is_target_page || $is_explicit_param) {
            status_header(200);
            $template = OLLA_PODRIDA_PATH . 'templates/canvas-page.php';
            if (file_exists($template)) {
                include $template;
                exit;
            }
        }

        if (is_404()) {
            status_header(404);
            $template_404 = OLLA_PODRIDA_PATH . 'templates/404-page.php';
            if (file_exists($template_404)) {
                include $template_404;
                exit;
            }
        }
    }
}
