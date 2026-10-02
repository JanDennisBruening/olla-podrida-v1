<?php
if (!defined('ABSPATH')) {
    exit;
}

$assets_url = OLLA_PODRIDA_URL . 'assets/dist/';
$settings = Olla_Podrida_Settings::get_section('settings');
$seo = Olla_Podrida_Settings::get_section('seo');
$hero = Olla_Podrida_Settings::get_section('hero');
$meta_title = !empty($seo['meta_title']) ? $seo['meta_title'] : (get_bloginfo('name') . ' - ' . ($hero['subtitle'] ?? 'Klangvielfalt aus Mittelalter und Renaissance'));
$meta_description = !empty($seo['meta_description']) ? $seo['meta_description'] : 'Das Ensemble Olla Podrida erweckt mit Krummhörnern, Harfe, Sackpfeifen, Flöten und Gesang historische Musik aus Mittelalter und Renaissance zu lebendigem neuem Leben.';
$meta_keywords = !empty($seo['meta_keywords']) ? $seo['meta_keywords'] : '';
$robots_index = !empty($seo['robots_index']) ? $seo['robots_index'] : 'index, follow';
$canonical_url = !empty($seo['canonical_url']) ? $seo['canonical_url'] : home_url('/');
$google_site_verification = !empty($seo['google_site_verification']) ? trim($seo['google_site_verification']) : '';

// OpenGraph & Social Cards
$og_title = !empty($seo['og_title']) ? $seo['og_title'] : $meta_title;
$og_description = !empty($seo['og_description']) ? $seo['og_description'] : $meta_description;
$og_image = !empty($seo['og_image']) ? $seo['og_image'] : ($assets_url . 'images/2024_Vorschaubild_1zu1_sRGB.webp');
$og_type = !empty($seo['og_type']) ? $seo['og_type'] : 'website';
$twitter_card = !empty($seo['twitter_card']) ? $seo['twitter_card'] : 'summary_large_image';

// Favicon configuration
$favicon_enabled = !isset($settings['favicon_enabled']) || !empty($settings['favicon_enabled']);
$favicon_url = !empty($settings['favicon_url']) 
    ? $settings['favicon_url'] 
    : ($assets_url . 'images/Favicon-transparent.png?v=' . OLLA_PODRIDA_VERSION);
$favicon_ico = $assets_url . 'images/favicon.ico?v=' . OLLA_PODRIDA_VERSION;

// Schema.org JSON-LD
$schema_json = null;
if (!empty($seo['schema_enabled'])) {
    $schema_data = [
        '@context' => 'https://schema.org',
        '@type' => !empty($seo['schema_type']) ? $seo['schema_type'] : 'MusicGroup',
        'name' => 'Ensemble Olla Podrida',
        'description' => $meta_description,
        'url' => home_url('/'),
        'image' => $og_image,
        'genre' => !empty($seo['schema_genre']) ? $seo['schema_genre'] : 'Mittelaltermusik, Renaissancemusik, Alte Musik',
        'locationCreated' => [
            '@type' => 'Place',
            'name' => 'Landkreis Osnabrück / Diepholz, Deutschland'
        ]
    ];
    $schema_json = wp_json_encode($schema_data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

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

$localized_data = Olla_Podrida_Frontend::get_localized_data();
?>
<!DOCTYPE html>
<html lang="de" class="scroll-smooth">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo esc_html($meta_title); ?></title>
    <meta name="description" content="<?php echo esc_attr($meta_description); ?>" />
    <?php if (!empty($meta_keywords)): ?>
        <meta name="keywords" content="<?php echo esc_attr($meta_keywords); ?>" />
    <?php endif; ?>
    <meta name="robots" content="<?php echo esc_attr($robots_index); ?>" />
    <link rel="canonical" href="<?php echo esc_url($canonical_url); ?>" />
    <?php if (!empty($google_site_verification)): ?>
    <meta name="google-site-verification" content="<?php echo esc_attr($google_site_verification); ?>" />
    <?php endif; ?>

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="<?php echo esc_attr($og_type); ?>" />
    <meta property="og:url" content="<?php echo esc_url($canonical_url); ?>" />
    <meta property="og:title" content="<?php echo esc_attr($og_title); ?>" />
    <meta property="og:description" content="<?php echo esc_attr($og_description); ?>" />
    <meta property="og:image" content="<?php echo esc_url($og_image); ?>" />
    <meta property="og:site_name" content="Ensemble Olla Podrida" />
    <meta property="og:locale" content="de_DE" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="<?php echo esc_attr($twitter_card); ?>" />
    <meta name="twitter:url" content="<?php echo esc_url($canonical_url); ?>" />
    <meta name="twitter:title" content="<?php echo esc_attr($og_title); ?>" />
    <meta name="twitter:description" content="<?php echo esc_attr($og_description); ?>" />
    <meta name="twitter:image" content="<?php echo esc_url($og_image); ?>" />

    <?php if ($schema_json): ?>
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    <?php echo $schema_json; ?>
    </script>
    <?php endif; ?>
    <meta name="theme-color" content="#070202" />
    
    <?php if ($favicon_enabled): ?>
    <link rel="icon" type="image/x-icon" href="<?php echo esc_url($favicon_ico); ?>" />
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url($favicon_url); ?>" />
    <link rel="icon" type="image/png" sizes="192x192" href="<?php echo esc_url($favicon_url); ?>" />
    <link rel="icon" type="image/png" sizes="512x512" href="<?php echo esc_url($favicon_url); ?>" />
    <link rel="shortcut icon" type="image/png" href="<?php echo esc_url($favicon_url); ?>" />
    <link rel="apple-touch-icon" href="<?php echo esc_url($favicon_url); ?>" />
    <meta name="msapplication-TileImage" content="<?php echo esc_url($favicon_url); ?>" />
    <?php endif; ?>
    
    <?php if ($css_file): ?>
        <link rel="stylesheet" href="<?php echo esc_url($dist_url . $css_file); ?>" />
    <?php endif; ?>
    
    <script>
        window.OLLA_PODRIDA_DATA = <?php echo wp_json_encode($localized_data); ?>;
        window.OLLA_DATA = window.OLLA_PODRIDA_DATA;
    </script>
</head>
<body class="bg-[#070202] text-[#F5F5DC] antialiased selection:bg-[#DAA520] selection:text-[#070202]">
    <div id="root"></div>

    <?php if ($js_file): ?>
        <script type="module" src="<?php echo esc_url($dist_url . $js_file); ?>"></script>
    <?php endif; ?>

    <!-- Jan Dennis Brüning · Footer-Profil (JDB Footer – Lokales Profil) -->
    <button type="button" id="jdb-footer-trigger" data-jdb-footer aria-hidden="true" tabindex="-1" style="position:fixed;bottom:0;right:0;width:0;height:0;opacity:0;pointer-events:none;overflow:hidden;border:none;padding:0;margin:0;"></button>
    <script>
      window.jdbFooterLocalURL = '<?php echo esc_url(home_url('/?jdb_footer_popup=1')); ?>';
      (function() {
        var obs = new MutationObserver(function(muts) {
          muts.forEach(function(m) {
            m.addedNodes.forEach(function(n) {
              if (n.nodeType === 1 && n.shadowRoot) {
                var s = document.createElement('style');
                s.textContent = '.status { opacity: 0 !important; animation: jdbStatusDelayedFade 0.25s ease 0.6s forwards !important; } @keyframes jdbStatusDelayedFade { to { opacity: 1 !important; } }';
                n.shadowRoot.appendChild(s);
              }
            });
          });
        });
        if (document.body) { obs.observe(document.body, { childList: true }); }
        else { document.addEventListener('DOMContentLoaded', function() { obs.observe(document.body, { childList: true }); }); }
      })();
    </script>
    <script defer src="<?php echo esc_url(content_url('/plugins/jdb-footer-local/assets/embed.js')); ?>"></script>
</body>
</html>
