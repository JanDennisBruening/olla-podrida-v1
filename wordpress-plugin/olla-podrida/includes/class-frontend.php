<?php
if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Frontend {

    public static function init() {
        add_shortcode('olla_podrida', [__CLASS__, 'render_shortcode']);
        add_action('init', [__CLASS__, 'register_rewrite_rules']);
        add_filter('query_vars', [__CLASS__, 'register_query_vars']);
        add_action('template_redirect', [__CLASS__, 'maybe_render_canvas']);
        add_action('wp_enqueue_scripts', [__CLASS__, 'register_assets']);
    }

    public static function register_rewrite_rules() {
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
                ]
            ];
        }

        // Format events for React
        $formatted_events = [];
        foreach ($events as $ev) {
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
                'isUpcoming' => !empty($ev['is_upcoming']),
                'ticketInfo' => $ev['ticket_info'] ?? '',
            ];
        }

        return [
            'pluginUrl' => OLLA_PODRIDA_URL,
            'assetsUrl' => OLLA_PODRIDA_URL . 'assets/dist/',
            'imagesUrl' => OLLA_PODRIDA_URL . 'assets/dist/images/',
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
                'contactEmail' => $press['contact_email'] ?? 'info@olla-podrida.de',
                'contactPhone' => $press['contact_phone'] ?? '',
                'pressNote' => $press['press_note'] ?? '',
                'logos' => [
                    [
                        'id' => 'logo-emblem',
                        'title' => 'Ensemble-Wappen (Topf-Emblem)',
                        'subtitle' => 'Freigestellt mit transparentem Hintergrund',
                        'category' => 'logo',
                        'imageUrl' => $press['logo_pot'] ?? '',
                        'downloadUrl' => $press['logo_pot'] ?? '',
                        'format' => 'PNG (Freigestellt)',
                        'fileSize' => '381 KB',
                    ],
                    [
                        'id' => 'logo-banner',
                        'title' => 'Offizieller Schriftzug & Banner',
                        'subtitle' => 'Logo mit historischen Zierelementen',
                        'category' => 'logo',
                        'imageUrl' => $press['logo_banner'] ?? '',
                        'downloadUrl' => $press['logo_banner'] ?? '',
                        'format' => 'PNG (Transparenz)',
                        'fileSize' => '128 KB',
                    ],
                    [
                        'id' => 'logo-seal',
                        'title' => 'Historisches Rundsiegel',
                        'subtitle' => 'Ziersiegel für Programmhefte & Plakate',
                        'category' => 'logo',
                        'imageUrl' => $press['logo_seal'] ?? '',
                        'downloadUrl' => $press['logo_seal'] ?? '',
                        'format' => 'PNG (1024x1024)',
                        'fileSize' => '193 KB',
                    ],
                    [
                        'id' => 'logo-print',
                        'title' => 'Druckfähiges Ensemble-Logo',
                        'subtitle' => 'RGB / High-Resolution Grafik',
                        'category' => 'logo',
                        'imageUrl' => $press['logo_print'] ?? '',
                        'downloadUrl' => $press['logo_print'] ?? '',
                        'format' => 'JPG (Druckqualität)',
                        'fileSize' => '891 KB',
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
                        'title' => $press['photo4_title'] ?? 'Bühnenkulisse & Instrumentarium',
                        'subtitle' => 'Historische Atmosphäre',
                        'category' => 'photo',
                        'imageUrl' => $press['photo4_url'] ?? '',
                        'downloadUrl' => $press['photo4_url'] ?? '',
                        'format' => 'WEBP (Großformat)',
                        'credit' => '© Jan Dennis Brüning / Ensemble Olla Podrida',
                    ],
                ]
            ],
            'restUrl' => rest_url('olla-podrida/v1/contact'),
            'nonce' => wp_create_nonce('wp_rest')
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

        // Direct URL slug check for /olla-podrida regardless of permalink cache status
        $raw_uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
        $trimmed_uri = trim($raw_uri, '/');
        $is_direct_slug = ($trimmed_uri === 'olla-podrida' || preg_match('/(^|\/)olla-podrida$/i', $trimmed_uri));

        if ($is_direct_slug || $is_query_var || $is_target_page || $is_explicit_param) {
            status_header(200);
            $template = OLLA_PODRIDA_PATH . 'templates/canvas-page.php';
            if (file_exists($template)) {
                include $template;
                exit;
            }
        }
    }
}
