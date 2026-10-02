<?php
/**
 * Template Name: Theatralischer Vollbild-Canvas (Olla Podrida Galerie)
 * Description: Eigenständiges, bildschirmfüllendes Template ohne störende Theme-Elemente mit vollständiger CSS-Isolation.
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

    <style id="op-gallery-canvas-overrides">
    /* ==========================================================================
       OLLA PODRIDA GALLERY CANVAS - PIXEL-PERFECT VIEWPORT & THEME ISOLATION
       ========================================================================== */

    /* 1. Global Viewport Reset */
    html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
        background-color: #09090b !important;
        color: #f4f4f5 !important;
    }

    #root {
        width: 100% !important;
        height: 100% !important;
        position: relative !important;
    }

    #root > div {
        height: 100vh !important;
        max-height: 100vh !important;
        overflow: hidden !important;
    }

    /* 2. WordPress Admin Bar Integration (Desktop: 32px, Mobile: 46px) */
    body.admin-bar #wpadminbar {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 99999 !important;
    }

    /* Defensively constrain admin bar pot logo on frontend */
    #wpadminbar .olla-admin-bar-pot-img {
        width: 20px !important;
        height: 20px !important;
        max-width: 20px !important;
        max-height: 20px !important;
        object-fit: contain !important;
        vertical-align: middle !important;
        display: inline-block !important;
        margin-top: -3px !important;
    }

    body.admin-bar,
    body.admin-bar #root,
    body.admin-bar #root > div {
        height: calc(100vh - 32px) !important;
        min-height: calc(100vh - 32px) !important;
        max-height: calc(100vh - 32px) !important;
    }

    @media screen and (max-width: 782px) {
        body.admin-bar,
        body.admin-bar #root,
        body.admin-bar #root > div {
            height: calc(100vh - 46px) !important;
            min-height: calc(100vh - 46px) !important;
            max-height: calc(100vh - 46px) !important;
        }
    }

    /* 3. Theme Style Neutralization (Prevent any active theme styles from hijacking footer/header) */
    #root,
    #root *,
    #root *::before,
    #root *::after {
        box-sizing: border-box;
    }

    /* Header Isolation */
    #root header {
        all: unset !important;
        display: flex !important;
        position: relative !important;
        z-index: 40 !important;
        width: 100% !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 0.875rem 1.5rem !important;
        border-bottom: 1px solid rgba(39, 39, 42, 0.6) !important;
        background-color: rgba(9, 9, 11, 0.8) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border-radius: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
    }

    /* Footer Isolation */
    #root footer {
        all: unset !important;
        display: block !important;
        position: relative !important;
        z-index: 30 !important;
        width: 100% !important;
        padding: 0.5rem 1.5rem 1rem 1.5rem !important;
        border-top: 1px solid rgba(39, 39, 42, 0.4) !important;
        background-color: rgba(9, 9, 11, 0.8) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border-radius: 0 !important;
        margin: 0 !important;
        min-height: unset !important;
        box-shadow: none !important;
    }

    @media (min-width: 768px) {
        #root footer {
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
        }
    }

    /* Reset button constraints injected by themes (e.g. min-height: 2.75rem, text-transform: uppercase) */
    #root footer button,
    #root footer a,
    #root header button,
    #root header a {
        min-height: unset !important;
        border-bottom: unset !important;
        text-transform: none !important;
        letter-spacing: normal !important;
    }

    /* 4. Font Family Enforcement */
    .font-display,
    #root .font-display {
        font-family: "Cinzel", Georgia, serif !important;
    }

    .font-garamond,
    #root .font-garamond {
        font-family: "Cormorant Garamond", Georgia, serif !important;
    }

    .font-sans,
    #root .font-sans {
        font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    }

    /* 5. Utility rules */
    .no-scrollbar::-webkit-scrollbar {
        display: none !important;
    }
    .no-scrollbar {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
    }
    </style>
</head>
<body <?php body_class('bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-[#d4af37]/30 selection:text-[#fef3c7] overflow-hidden'); ?>>
<?php wp_body_open(); ?>

<script>
window.__OP_INITIAL_MEMBERS__ = <?php echo wp_json_encode($musicians); ?>;
window.__OP_SETTINGS__ = <?php echo wp_json_encode($settings); ?>;
</script>

<div id="root"></div>

<?php wp_footer(); ?>
</body>
</html>
