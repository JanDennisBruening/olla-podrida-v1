<?php
if (!defined('ABSPATH')) {
    exit;
}

$pot_logo = OLLA_PODRIDA_URL . 'assets/dist/images/logo-pot.png';
$home_url = home_url('/?olla_canvas=1');
$font_macondo = OLLA_PODRIDA_URL . 'assets/dist/fonts/macondo-swash-caps-400.woff2';
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 – Verirrt im Nebel der Jahrhunderte | Ensemble Olla Podrida</title>
    <link rel="icon" type="image/png" href="<?php echo esc_url(OLLA_PODRIDA_URL . 'assets/dist/images/Favicon-transparent.png'); ?>" />
    <style>
        @font-face {
            font-family: 'Macondo';
            src: url('<?php echo esc_url($font_macondo); ?>') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: #070202;
            background-image: radial-gradient(circle at center, #18110b 0%, #070202 85%);
            color: #F5F5DC;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }

        .olla-404-card {
            max-width: 580px;
            width: 100%;
            background: #17100b;
            border: 2px solid #DAA520;
            border-radius: 12px;
            padding: 42px 32px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(218, 165, 32, 0.15), inset 0 1px 0 rgba(218, 165, 32, 0.3);
            position: relative;
        }

        .olla-404-pot {
            width: 110px;
            height: 110px;
            margin: 0 auto 20px auto;
            display: block;
            object-fit: contain;
            filter: drop-shadow(0 4px 16px rgba(218, 165, 32, 0.45));
            animation: potFloat 4s ease-in-out infinite;
        }

        @keyframes potFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }

        .olla-404-code {
            display: inline-block;
            background: rgba(218, 165, 32, 0.12);
            border: 1px solid #DAA520;
            color: #FFD700;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.15em;
            padding: 3px 12px;
            border-radius: 20px;
            margin-bottom: 16px;
            text-transform: uppercase;
        }

        .olla-404-title {
            font-family: 'Macondo', Georgia, serif;
            font-size: clamp(26px, 5vw, 36px);
            color: #DAA520;
            margin-bottom: 16px;
            line-height: 1.25;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        }

        .olla-404-text {
            font-size: 15px;
            line-height: 1.65;
            color: #d8ceb8;
            margin-bottom: 30px;
        }

        .olla-404-btn {
            display: inline-block;
            background: linear-gradient(135deg, #DAA520 0%, #b8860b 100%);
            color: #0c0806 !important;
            font-weight: 700;
            font-size: 16px;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 8px;
            border: 1px solid #FFD700;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5), 0 0 15px rgba(218, 165, 32, 0.3);
            transition: all 0.25s ease;
        }

        .olla-404-btn:hover {
            background: linear-gradient(135deg, #FFD700 0%, #DAA520 100%);
            box-shadow: 0 0 24px rgba(218, 165, 32, 0.6);
            transform: scale(1.04);
        }

        .olla-404-footer {
            margin-top: 24px;
            font-size: 12px;
            color: #7d7265;
        }
    </style>
</head>
<body>
    <div class="olla-404-card">
        <img src="<?php echo esc_url($pot_logo); ?>" alt="Ensemble Olla Podrida" class="olla-404-pot" />
        <span class="olla-404-code">Fehler 404 · Weg nicht gefunden</span>
        <h1 class="olla-404-title">Verirrt im Nebel der Jahrhunderte</h1>
        <p class="olla-404-text">
            Der gesuchte Pfad existiert nicht oder ward von den Spielleuten an einen anderen Ort getragen.<br/>
            Kehret um zur großen Bühne und lauschet den Klängen aus Renaissance und Mittelalter.
        </p>
        <a href="<?php echo esc_url($home_url); ?>" class="olla-404-btn">
            🏰 Zurück zur Bühne &rarr;
        </a>
        <div class="olla-404-footer">
            Ensemble Olla Podrida · Klangvielfalt aus Mittelalter &amp; Renaissance
        </div>
    </div>
</body>
</html>
