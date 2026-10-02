<?php
/**
 * Template Name: Theatralischer Vollbild-Canvas (Olla Podrida Galerie)
 * Description: Eigenständiges, bildschirmfüllendes Template ohne störende Theme-Elemente.
 */

if (!defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?> class="op-canvas-html">
<head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title><?php wp_title('·', true, 'right'); bloginfo('name'); ?></title>
    <?php wp_head(); ?>
</head>
<body <?php body_class('op-canvas-body'); ?>>
<?php wp_body_open(); ?>

<div class="op-canvas-wrapper">
    <?php echo OP_Gallery_Frontend::render_shortcode(); ?>
</div>

<?php wp_footer(); ?>
</body>
</html>
