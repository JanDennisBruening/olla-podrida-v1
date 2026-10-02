<?php
/**
 * Template Name: Theatralischer Vollbild-Canvas (Olla Podrida Galerie)
 * Description: Eigenständiges, bildschirmfüllendes Template ohne störende Theme-Elemente.
 */

if (!defined('ABSPATH')) {
    exit;
}

$musicians = OP_Gallery_Musicians::get_all(true);
$settings = OP_Gallery_Settings::get_settings();
?><!doctype html>
<html lang="de" class="dark">
<head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php wp_title('·', true, 'right'); bloginfo('name'); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <?php wp_head(); ?>
</head>
<body class="bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-[#d4af37]/30 selection:text-[#fef3c7] overflow-x-hidden min-h-screen">
<?php wp_body_open(); ?>

<script>
window.__OP_INITIAL_MEMBERS__ = <?php echo wp_json_encode($musicians); ?>;
window.__OP_SETTINGS__ = <?php echo wp_json_encode($settings); ?>;
</script>

<div id="root"></div>

<?php wp_footer(); ?>
</body>
</html>
