<?php
if (!defined('ABSPATH')) {
    exit;
}

$hero = Olla_Podrida_Settings::get_section('hero');
$site_title = get_bloginfo('name') . ' - ' . ($hero['subtitle'] ?? 'Klangvielfalt aus Mittelalter und Renaissance');
$assets_url = OLLA_PODRIDA_URL . 'assets/dist/';

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
    <title><?php echo esc_html($site_title); ?></title>
    <meta name="description" content="So lebendig wie damals - voller Kraft mit Krummhörner, Sackpfeifen und Trommeln, aber auch verspielt und anrührend mit Harfe, Psalter und Laute." />
    <meta name="theme-color" content="#070202" />
    
    <link rel="icon" type="image/x-icon" href="<?php echo esc_url($assets_url . 'images/favicon.ico?v=' . OLLA_PODRIDA_VERSION); ?>" />
    <link rel="icon" type="image/png" sizes="512x512" href="<?php echo esc_url($assets_url . 'images/Favicon-transparent.png?v=' . OLLA_PODRIDA_VERSION); ?>" />
    <link rel="shortcut icon" type="image/png" href="<?php echo esc_url($assets_url . 'images/Favicon-transparent.png?v=' . OLLA_PODRIDA_VERSION); ?>" />
    <link rel="apple-touch-icon" href="<?php echo esc_url($assets_url . 'images/Favicon-transparent.png?v=' . OLLA_PODRIDA_VERSION); ?>" />
    
    <?php if ($css_file): ?>
        <link rel="stylesheet" href="<?php echo esc_url($dist_url . $css_file); ?>" />
    <?php endif; ?>
    
    <script>
        window.OLLA_PODRIDA_DATA = <?php echo wp_json_encode($localized_data); ?>;
    </script>
</head>
<body class="bg-[#070202] text-[#F5F5DC] antialiased selection:bg-[#DAA520] selection:text-[#070202]">
    <div id="root"></div>

    <?php if ($js_file): ?>
        <script type="module" src="<?php echo esc_url($dist_url . $js_file); ?>"></script>
    <?php endif; ?>
</body>
</html>
