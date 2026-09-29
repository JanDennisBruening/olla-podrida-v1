<?php
if (!defined('ABSPATH')) {
    exit;
}

class Olla_Podrida_Settings {

    public static function get_defaults() {
        $assets_url = OLLA_PODRIDA_URL . 'assets/dist/images/';

        return [
            'settings' => [
                'site_title' => 'Ensemble Olla Podrida',
                'site_tagline' => 'Klangvielfalt aus Mittelalter und Renaissance',
                'favicon_enabled' => true,
                'favicon_url' => $assets_url . 'Favicon-transparent.png',
                'universal_dominance' => true,
                'auto_expire_events' => true,
                'bot_protection_enabled' => true,
                'min_submit_seconds' => 2,
                'rate_limit_submissions' => 5,
            ],
            'hero' => [
                'slogan' => 'Ensemble Olla Podrida',
                'subtitle' => 'Klangvielfalt aus Mittelalter und Renaissance',
                'bg_desktop' => $assets_url . 'Hintergrund-Header-2-2-scaled.webp',
                'bg_mobile' => $assets_url . 'Hintergrund-Header_mobile.webp',
                'smoke_enabled' => true,
                'smoke_opacity' => 20,
            ],
            'ensemble' => [
                'title' => 'Ensemble Olla Podrida',
                'paragraph1' => 'Eigentlich bezeichnet es ein typisches Gericht der kastilischen Küche und war ursprünglich ein Eintopf. Der Name des Gerichts stammt in Wirklichkeit von dem mittelalterlichen spanischen Ausdruck „olla poderida“ („mächtiger Topf“). Die Franzosen haben den Begriff wörtlich übersetzt mit Potpourri, was in dem Sinne einem musikalischen Cocktail nahekommt. Zum einen symbolisiert der Name unsere musikalische Vielfalt, zum anderen genießen wir den schmackhaften Eintopf bei unseren alljährlichen gemeinsamen Festessen.',
                'paragraph2' => 'Die Klangvielfalt aus Mittelalter und Renaissance – so sehen wir uns und genauso lebendig wie damals, so erleben wir uns! Voller Kraft mit Krummhörnern, Sackpfeifen und Trommeln, aber auch verspielt und anrührend mit Harfe, Laute und Psalter. Rein instrumental oder mit mehrstimmigem Gesang vorgetragen – wir erwecken diese Musik mit Freude und Hingabe zu neuem Leben.',
                'paragraph3' => 'In seiner jetzigen Besetzung besteht das Ensemble seit 2017 und ist aus der Musikgruppe „Mercks wol!“ hervorgegangen. Wir konzertieren an historischen Stätten, in Kirchen und Museen, manchmal auch auf Märkten, und verleihen Lesungen und Vorträgen den musikalischen Rahmen. Die Berufsmusik ist uns eine Fremde, und so ist es jedes einzelne Mal ein besonderes Ereignis, wenn wir alle zusammenkommen, aus allen Himmelsrichtungen, und die alten Klänge der Vergangenheit in der Gegenwart erklingen lassen.',
                'logo' => $assets_url . 'logo-pot.png',
            ],
            'musicians' => [
                [
                    'id' => 'susanne',
                    'name' => 'Susanne',
                    'role' => 'Ensembleleitung, Flöten & Gesang',
                    'instruments' => 'Blockflöten (Sopran bis Bass), Gemshorn, Renaissanceflöten, Gesang',
                    'bio' => 'Susanne leitet das Ensemble mit unverwechselbarem Gespür für mittelalterliche Klangwelten und historische Phrasierung.',
                    'tooltip' => 'Susanne spielt vergnügt auf der Flöte',
                    'stage_image' => $assets_url . 'Susanne-1.webp',
                    'portrait_image' => $assets_url . 'Susanne_klein.webp',
                ],
                [
                    'id' => 'ruth',
                    'name' => 'Ruth',
                    'role' => 'Harfe, Psalter & Gesang',
                    'instruments' => 'Keltische Harfe, Psalter, Perkussion, Gesang',
                    'bio' => 'Ruth verzaubert mit filigranen Saitenklängen und warmen Melodiebögen, die den Stücken eine traumhafte Tiefe verleihen.',
                    'tooltip' => 'Ruth',
                    'stage_image' => $assets_url . 'Ruth_web_5.webp',
                    'portrait_image' => $assets_url . 'Ruth_2_klein.webp',
                ],
                [
                    'id' => 'lutz',
                    'name' => 'Lutz',
                    'role' => 'Historische Trommeln, Sackpfeifen & Gesang',
                    'instruments' => 'Landsknechtstrommel, Davul, Darabuka, Sackpfeifen, Gesang',
                    'bio' => 'Lutz sorgt für das rhythmische Fundament und die pulsierende Energie historischer Tänze und Marschweisen.',
                    'tooltip' => 'Lutz',
                    'stage_image' => $assets_url . 'Lutz.webp',
                    'portrait_image' => $assets_url . 'Lutz_klein.png',
                ],
                [
                    'id' => 'sandra',
                    'name' => 'Sandra',
                    'role' => 'Gesang, Perkussion & Flöte',
                    'instruments' => 'Gesang, Perkussion, Schellenkranz, Flöten',
                    'bio' => 'Sandra bereichert das Ensemble mit ausdrucksstarkem Gesang und dynamischen rhythmischen Akzenten.',
                    'tooltip' => 'Sandra',
                    'stage_image' => $assets_url . '2024_Sandra_Olla-Podrida_web_2.webp',
                    'portrait_image' => $assets_url . '2024_Sandra_2-Ebene-2-1-712x1024.webp',
                ],
                [
                    'id' => 'silke',
                    'name' => 'Silke',
                    'role' => 'Laute, Cister & Gesang',
                    'instruments' => 'Renaissancelaute, Cister, Saiteninstrumente, Gesang',
                    'bio' => 'Silkes feines Lautenspiel verbindet Melodie und Begleitung zu einem kunstvoll gewebten harmonischen Teppich.',
                    'tooltip' => 'Silke',
                    'stage_image' => $assets_url . 'Silke_stage.webp',
                    'portrait_image' => $assets_url . 'Silke_2_klein.webp',
                ],
                [
                    'id' => 'klemens',
                    'name' => 'Klemens',
                    'role' => 'Krummhörner, Sackpfeifen & Gesang',
                    'instruments' => 'Krummhörner, Renaissance-Sackpfeife, Blasinstrumente, Gesang',
                    'bio' => 'Klemens lässt die charakteristischen schneidigen und kräftigen Holzblasinstrumente der Renaissance lautstark erklingen.',
                    'tooltip' => 'Klemens',
                    'stage_image' => $assets_url . 'Klemens_stage.webp',
                    'portrait_image' => $assets_url . 'Klemens_3_klein.webp',
                ],
                [
                    'id' => 'simone',
                    'name' => 'Simone',
                    'role' => 'Flöten, Glockenspiel & Gesang',
                    'instruments' => 'Blockflöten, Schellen, Glockenspiel, Gesang',
                    'bio' => 'Simone steuert mit hellen Flötenstimmen und glockenreinem Gesang heitere und festliche Klangfarben bei.',
                    'tooltip' => 'Simone',
                    'stage_image' => $assets_url . 'Simone_stage.webp',
                    'portrait_image' => $assets_url . 'Simone_klein.webp',
                ],
            ],
            'events' => [
                [
                    'id' => 'stift-boerstel-2026',
                    'title' => 'Konzert beim Bio-Regio-Markt im Stift Börstel',
                    'category' => 'Konzert',
                    'date' => '11.10.2026',
                    'time' => '14.00 Uhr',
                    'location' => 'Stiftskirche Börstel, Börstel 1, 49626 Berge',
                    'city' => 'Berge',
                    'description' => 'Eintritt frei, um eine Spende wird gebeten. Das historische Stift Börstel bietet den perfekten Rahmen für mittelalterliche und frühe neuzeitliche Klänge im Rahmen des Bio-Regio-Marktes.',
                    'link' => 'https://www.oekomodellregion-hasetal.de/#c269',
                    'image_url' => $assets_url . 'Biomarkt-vorne-mit-Musik.jpg',
                    'is_upcoming' => true,
                    'ticket_info' => 'Eintritt frei, Spende erbeten',
                ],
                [
                    'id' => 'atter-advent-2026',
                    'title' => 'Lebendiger Adventskalender in Atter',
                    'category' => 'Konzert',
                    'date' => '29.11.2026',
                    'time' => '18.00 Uhr',
                    'location' => 'Stadtteiltreff Atter, Karl-Barth-Straße 10, 49076 Osnabrück',
                    'city' => 'Osnabrück',
                    'description' => 'Winterlich-weihnachtliches Konzert zum 17. Lebendigen Adventskalender im Stadtteiltreff Atter. Beginn 18.00 Uhr. Freie Platzwahl. Wir freuen uns über Deine Spende am Ausgang.',
                    'link' => 'https://www.wir-in-atter.de/',
                    'image_url' => $assets_url . 'Screenshot_20240929_154952_Samsung-Internet-1536x956.jpg',
                    'is_upcoming' => true,
                    'ticket_info' => 'Freie Platzwahl, Spende am Ausgang',
                ],
                [
                    'id' => 'quakenbrueck-weihnachten-2026',
                    'title' => '3. Weihnachts- und Mitsingkonzert zusammen mit dem Chorforum Quakenbrück',
                    'category' => 'Konzert',
                    'date' => '30.12.2026',
                    'time' => '16.00 Uhr',
                    'location' => 'St. Marienkirche Quakenbrück, Markt 4, 49610 Quakenbrück',
                    'city' => 'Quakenbrück',
                    'description' => 'Gemeinsam Weihnachten singen und Gemeinsam Weihnachten lauschen. Zusammen mit dem Chorforum Quakenbrück laden wir herzlich zu einem kleinen Mitsing-Konzert ein.',
                    'link' => 'https://www.chorforum-quakenbrueck.de/',
                    'image_url' => $assets_url . 'st-marienkirche-quakenbr-ck-1536x1152.jpg',
                    'is_upcoming' => true,
                    'ticket_info' => 'Herzliche Einladung zum Mitsingen',
                ],
                [
                    'id' => 'fuerstenau-schlosskonzert-2025',
                    'title' => 'Fürstenau – Schlosskonzert',
                    'category' => 'Schlosskonzert',
                    'date' => '2025',
                    'time' => 'Beginn: 17 Uhr · Einlass: 16.30 Uhr',
                    'location' => 'Schloss Fürstenau, Schlossplatz 1, 49584 Fürstenau',
                    'city' => 'Fürstenau',
                    'description' => 'In der Reihe „Schlosskonzerte“ gastieren wir zum 2. Mal in Fürstenau mit einer historisch musikalischen Expedition ins Tierreich.',
                    'link' => '',
                    'image_url' => $assets_url . '2024_Vorschaubild_1zu1_sRGB.webp',
                    'is_upcoming' => false,
                    'ticket_info' => 'Vorverkauf 15,– € | Konzertkasse 18,– €',
                ],
                [
                    'id' => 'kulturverein-lift',
                    'title' => 'Olla Podrida beim Kulturverein LIFT',
                    'category' => 'Theater & Musik',
                    'date' => '15.08.2025',
                    'time' => 'Sommerabend',
                    'location' => 'Kulturverein LI.F.T. e.V., Restrup bei Bippen',
                    'city' => 'Bippen',
                    'description' => 'Der Kulturverein LI.F.T. im kleinen Restrup bei Bippen auf einem alten Bauernhof mit ganz besonderer Aura.',
                    'link' => '',
                    'image_url' => $assets_url . 'tumblr_meyqp0UGV01rqxd5ko1_1280.jpg',
                    'is_upcoming' => false,
                    'ticket_info' => 'Freie Platzwahl & Hutkasse',
                ],
                [
                    'id' => 'loeningen-neues-jahr',
                    'title' => 'Konzert im neuen Jahr aus alten Zeiten',
                    'category' => 'Konzert',
                    'date' => 'Januar',
                    'time' => '19.30 Uhr',
                    'location' => 'Gemeindehaus Trinitatiskirche Löningen',
                    'city' => 'Löningen',
                    'description' => 'Eine akustische Reise in eine vergangene Welt: Noch mit weihnachtlichen Klängen im jungen neuen Jahr.',
                    'link' => 'https://www.trinitatiskirche-loeningen.de',
                    'image_url' => $assets_url . 'Screenshot_20241126_203847_Samsung-Internet.jpg',
                    'is_upcoming' => false,
                    'ticket_info' => 'Eintritt: 10,– €',
                ],
                [
                    'id' => 'bad-rothenfelde',
                    'title' => 'Olla Podrida zu Gast in Bad Rothenfelde',
                    'category' => 'Konzert',
                    'date' => 'Archiv',
                    'time' => 'Festgottesdienst & Konzert',
                    'location' => 'Jesus Christus Kirche, Bad Rothenfelde',
                    'city' => 'Bad Rothenfelde',
                    'description' => 'Auf Einladung des Kirchenchores Bad Rothenfelde unter der Leitung von Holger Dolkemeyer.',
                    'link' => '',
                    'image_url' => $assets_url . 'Logo1.jpg',
                    'is_upcoming' => false,
                    'ticket_info' => 'Konzert im Kirchenraum',
                ]
            ],
            'contact' => [
                'recipient_email' => get_option('admin_email', 'info@olla-podrida.de'),
                'subject' => 'Neue Anfrage über das Ensemble Olla Podrida Kontaktformular',
                'portrait' => $assets_url . 'Susanne_klein.webp',
                'title' => 'Kontakt & Anfragen',
                'intro_paragraph1' => 'Wir freuen uns auf Ihre Nachrichten und Anfragen. Ob Lob, Kritik oder einfach nur ein Gruß – Ihre Worte sind uns wichtig.',
                'intro_paragraph2' => 'Kontaktieren Sie uns über unser Formular oder per E-Mail:',
                'email_display' => 'info(at)olla-podrida.de',
                'consent_text' => 'Ich habe die Datenschutzerklärung zur Kenntnis genommen. Ich stimme zu, dass meine Angaben und Daten zur Beantwortung meiner Anfrage elektronisch erhoben und gespeichert werden.',
                'success_message' => 'Vielen Dank für Ihre Nachricht. Sie wurde erfolgreich versendet.',
                'error_message' => 'Bitte füllen Sie alle erforderlichen Felder aus und stimmen Sie den Datenschutzrichtlinien zu.'
            ],
            'audio' => [
                'enabled' => true,
                'src' => $assets_url . 'Riu-riu-chiu-live-in-Atter.mp3',
                'title' => 'Riu Riu Chiu',
                'subtitle' => 'Live in Atter (Spanisches Renaissance-Villancico)',
                'autoplay' => true,
                'volume' => 50,
                'button_text' => '• Musik an / aus • Musik an / aus',
            ],
            'legal' => [
                'seal_image' => $assets_url . '3_Zeichenflaeche-1-Kopie-10-1024x1024.png',
                'copyright_text' => '© ' . date('Y') . ' Ensemble Olla Podrida',
                'impressum_html' => "<p><strong>Angaben gemäß § 5 DDG:</strong></p><p>Ensemble Olla Podrida<br/>Susanne Hoffmann (Ensembleleitung)<br/>Im Ort 4, 49356 Diepholz, Deutschland</p><p><strong>Kontakt:</strong><br/>Tel.: +49 174 186 3418<br/>E-Mail: info@olla-podrida.de</p><p><strong>Design, Konzept &amp; Webentwicklung:</strong><br/>Jan Brüning · <a href=\"https://www.janbruening.de\" target=\"_blank\" rel=\"noopener noreferrer\">www.janbruening.de</a></p><p><strong>Fotografie:</strong><br/>© Jan Dennis Brüning</p>",
                'datenschutz_html' => "<p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Website erhebt keine Tracking-Cookies und bindet alle Schriften sowie Medien lokal ein. Hosting durch die IONOS SE (Elgendorfer Str. 57, 56410 Montabaur) mit abgeschlossenem Vertrag zur Auftragsverarbeitung (AVV gem. Art. 28 DSGVO).</p>",
                'cookie_banner_text' => 'Wir nutzen lokale Speicherung ausschließlich für essenzielle Funktionen (wie das Merken von Audioeinstellungen). Es werden keine Werbe-Cookies verwendet.',
                'cookie_accept_text' => 'Einverstanden',
                'cookie_decline_text' => 'Nur Notwendige',
            ],
            'press' => [
                'title' => 'Presse & Medienmaterial',
                'subtitle' => 'Offizielle Pressematerialien, Logos und Bilddateien des Ensemble Olla Podrida',
                'intro_text' => "Das Ensemble Olla Podrida steht für lebendige Klangwelten aus Mittelalter und Renaissance. Mit historischen Instrumenten wie Krummhörnern, Renaissanceblockflöten, Sackpfeifen, Harfe, Laute und Landsknechtstrommeln erweckt die Musikgruppe historische Musik an Schlössern, Kirchen, Museen und Festen zu neuem Leben.",
                'contact_name' => 'Susanne Hoffmann (Ensembleleitung)',
                'contact_email' => 'info@olla-podrida.de',
                'contact_phone' => '',
                'press_note' => 'Die hier bereitgestellten Pressefotos und Grafiken dürfen im Rahmen redaktioneller Berichterstattung über das Ensemble Olla Podrida sowie zur Ankündigung von Veranstaltungen unter Nennung der Quelle honorarfrei verwendet werden.',
                'logo_pot' => $assets_url . 'logo-pot.png',
                'logo_banner' => $assets_url . '2024_07_15_Logo_Olla-Podrida_V1_1.png',
                'logo_seal' => $assets_url . '3_Zeichenflaeche-1-Kopie-10-1024x1024.png',
                'logo_print' => $assets_url . 'Logo1.jpg',
                'photo1_url' => $assets_url . '2024_Vorschaubild_1zu1_sRGB.webp',
                'photo1_title' => 'Ensemble Olla Podrida Gesamtansicht',
                'photo4_url' => $assets_url . 'Hintergrund-Header-2-2-scaled.webp',
                'photo4_title' => 'Bühnenkulisse & Instrumentarium',
            ],
            'seo' => [
                'meta_title' => 'Ensemble Olla Podrida | Musik aus Mittelalter & Renaissance',
                'meta_description' => 'Das Ensemble Olla Podrida erweckt mit Krummhörnern, Harfe, Sackpfeifen, Flöten und Gesang historische Musik aus Mittelalter und Renaissance zu neuem Leben.',
                'meta_keywords' => 'Ensemble Olla Podrida, Mittelaltermusik, Renaissancemusik, Alte Musik, Konzerte, Krummhorn, Harfe, Sackpfeife, Osnabrück, Susanne Hoffmann',
                'canonical_url' => '',
                'robots_index' => 'index, follow',
                'og_title' => 'Ensemble Olla Podrida – Klangvielfalt aus Mittelalter und Renaissance',
                'og_description' => 'Historische Musikinstrumente, Konzerte und lebendige Musikgeschichte. Tauchen Sie ein in die Klangwelt von Olla Podrida.',
                'og_image' => $assets_url . '2024_Vorschaubild_1zu1_sRGB.webp',
                'og_type' => 'website',
                'twitter_card' => 'summary_large_image',
                'schema_enabled' => true,
                'schema_type' => 'MusicGroup',
                'schema_genre' => 'Mittelaltermusik, Renaissancemusik, Alte Musik',
            ],
            'roles' => [
                'editor_sections' => ['hero', 'ensemble', 'events', 'contact', 'audio', 'press', 'seo', 'legal'],
                'author_sections' => ['events'],
            ],
            'display' => [
                'mode' => 'shortcode', // 'canvas_page' or 'shortcode'
                'canvas_page_id' => 0,
                'preloader_enabled' => true,
            ]
        ];
    }

    public static function get_section($section) {
        $defaults = self::get_defaults();
        $stored = get_option('olla_podrida_' . $section, null);

        if ($stored === null || (is_array($stored) && empty($stored))) {
            return $defaults[$section] ?? [];
        }

        if (!is_array($stored)) {
            return $defaults[$section] ?? [];
        }

        // Indexed list sections (musicians, events) must not use wp_parse_args / array_merge
        if (in_array($section, ['musicians', 'events'], true)) {
            // Deduplicate by id if present
            $unique = [];
            $seen = [];
            foreach ($stored as $item) {
                $id = $item['id'] ?? null;
                if ($id && !isset($seen[$id])) {
                    $seen[$id] = true;
                    $unique[] = $item;
                } elseif (!$id) {
                    $unique[] = $item;
                }
            }
            return !empty($unique) ? $unique : ($defaults[$section] ?? []);
        }

        if (isset($defaults[$section]) && is_array($defaults[$section])) {
            return wp_parse_args($stored, $defaults[$section]);
        }

        return $stored;
    }

    public static function update_section($section, $data) {
        if (in_array($section, ['musicians', 'events'], true) && is_array($data)) {
            $unique = [];
            $seen = [];
            foreach ($data as $item) {
                $id = $item['id'] ?? null;
                if ($id && !isset($seen[$id])) {
                    $seen[$id] = true;
                    $unique[] = $item;
                } elseif (!$id) {
                    $unique[] = $item;
                }
            }
            $data = $unique;
        }
        return update_option('olla_podrida_' . $section, $data);
    }
}
