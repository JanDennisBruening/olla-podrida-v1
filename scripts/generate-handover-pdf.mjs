import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read logo image and convert to base64
const logoPath = path.join(rootDir, 'public/images/2024_07_15_Logo_Olla-Podrida_V1_1.png');
let logoBase64 = '';
if (fs.existsSync(logoPath)) {
  logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
}

const htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Handbuch &amp; Dokumentation · Ensemble Olla Podrida</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 12mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #261911;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 9.3pt;
      line-height: 1.45;
    }
    
    .page-container {
      height: 270mm;
      max-height: 270mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      position: relative;
    }
    .page-container:last-child {
      page-break-after: avoid;
    }

    /* HEADER BANNER */
    .header-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #8B6508;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .header-title-box {
      flex: 1;
    }
    .doc-badge {
      display: inline-block;
      background: #8B6508;
      color: #FFFFFF;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      padding: 3px 9px;
      border-radius: 4px;
      margin-bottom: 5px;
    }
    .doc-title {
      font-size: 19pt;
      font-weight: 800;
      color: #1A1009;
      margin: 0 0 3px 0;
      letter-spacing: -0.3px;
    }
    .doc-sub {
      font-size: 9.8pt;
      color: #6B4E36;
      margin: 0;
      font-weight: 600;
    }
    .header-logo {
      max-height: 64px;
      max-width: 140px;
      object-fit: contain;
      margin-left: 20px;
    }

    /* META BAR */
    .meta-bar {
      display: flex;
      justify-content: space-between;
      background: #F8F4EC;
      border: 1px solid #E2D5BE;
      border-radius: 6px;
      padding: 8px 14px;
      margin-bottom: 14px;
      font-size: 8.6pt;
    }
    .meta-item strong {
      color: #4A3320;
    }

    /* TYPOGRAPHY */
    h2 {
      font-size: 11.5pt;
      color: #382414;
      border-left: 3.5px solid #8B6508;
      padding-left: 9px;
      margin: 12px 0 8px 0;
      letter-spacing: 0.1px;
    }
    p {
      margin: 0 0 7px 0;
      color: #2F2116;
    }
    .lead-text {
      font-size: 9.7pt;
      line-height: 1.5;
      color: #261911;
      margin-bottom: 12px;
    }

    /* CARDS & GRIDS */
    .grid-2 {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }
    .grid-3 {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }
    .card {
      flex: 1;
      background: #FAF8F4;
      border: 1px solid #E2D5BE;
      border-radius: 6px;
      padding: 10px 13px;
    }
    .card-title {
      font-size: 9.6pt;
      font-weight: 700;
      color: #8B6508;
      margin: 0 0 5px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .card p, .card ul {
      margin: 0;
      font-size: 8.8pt;
      color: #3B2B1E;
      line-height: 1.4;
    }
    ul {
      margin: 4px 0 4px 16px;
      padding: 0;
    }
    li {
      margin-bottom: 3px;
    }

    /* STEP CARDS */
    .step-box {
      display: flex;
      gap: 12px;
      background: #FAF8F4;
      border: 1px solid #E2D5BE;
      border-radius: 6px;
      padding: 9px 12px;
      margin-bottom: 8px;
      align-items: flex-start;
    }
    .step-badge {
      background: #8B6508;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 9pt;
      padding: 4px 9px;
      border-radius: 5px;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .step-content {
      flex: 1;
    }
    .step-content strong {
      color: #1A1009;
      font-size: 9.3pt;
      display: block;
      margin-bottom: 2px;
    }
    .step-content p {
      margin: 0;
      font-size: 8.7pt;
      color: #3B2B1E;
      line-height: 1.4;
    }

    /* HIGHLIGHT BOX */
    .highlight-box {
      background: #FDF9F0;
      border-left: 4px solid #DAA520;
      border-top: 1px solid #EBE0C9;
      border-right: 1px solid #EBE0C9;
      border-bottom: 1px solid #EBE0C9;
      padding: 9px 13px;
      margin: 10px 0;
      border-radius: 0 6px 6px 0;
      font-size: 8.8pt;
      line-height: 1.45;
      color: #432F1D;
    }

    /* FOOTER BAR */
    .footer-bar {
      border-top: 1.5px solid #D8C9B2;
      padding-top: 6px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 7.8pt;
      color: #7A6755;
    }
  </style>
</head>
<body>

  <!-- ======================================================== -->
  <!-- SEITE 1: ÜBERSICHT, AUFBAU & DIE ZENTRALEN FUNKTIONEN    -->
  <!-- ======================================================== -->
  <div class="page-container">
    <div>
      <!-- HEADER -->
      <div class="header-banner">
        <div class="header-title-box">
          <div class="doc-badge">Handbuch &amp; Dokumentation</div>
          <h1 class="doc-title">Ensemble Olla Podrida</h1>
          <p class="doc-sub">Klangvielfalt aus Mittelalter &amp; Renaissance · Leitfaden für die Ensemble-Leitung</p>
        </div>
        ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" alt="Olla Podrida" />` : ''}
      </div>

      <!-- META BAR -->
      <div class="meta-bar">
        <div class="meta-item"><strong>Auftraggeberin:</strong> Susanne Hoffmann (Ensemble-Leitung)</div>
        <div class="meta-item"><strong>Konzept &amp; Entwicklung:</strong> Jan Dennis Brüning</div>
        <div class="meta-item"><strong>Version:</strong> v1.4.2 (Oktober 2026)</div>
        <div class="meta-item"><strong>Web:</strong> www.olla-podrida.de</div>
      </div>

      <!-- 1. WILLKOMMEN & PROJEKTZIEL -->
      <h2>1. Herzlich Willkommen zum neuen Webauftritt</h2>
      <p class="lead-text">
        Für das <strong>Ensemble Olla Podrida</strong> wurde eine maßgeschneiderte, theatralische Internetpräsenz geschaffen, die historische Musik mit zeitgemäßer Benutzerfreundlichkeit verbindet. Das gesamte Projekt läuft als eigenständiges, leichtgewichtiges WordPress-Plugin (<strong>„Ensemble Olla Podrida“</strong>) – komplett unabhängig von fehleranfälligen Drittanbieter-Pagebuildern.
      </p>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">🎭 Theatralisches Flair</div>
          <p>Historische Steinbogen-Halle, sanfter Fackelschein, Pergament-Schleifen und harmonisch aufsteigende Bühnenfiguren schaffen sofort eine authentische Atmosphäre.</p>
        </div>
        <div class="card">
          <div class="card-title">📱 100% Mobil &amp; Tablet</div>
          <p>Auf jedem Smartphone, iPad und PC-Bildschirm passgenau dargestellt. Navigation, Schriftgrößen und Grafiken skalieren stets harmonisch und übersichtlich.</p>
        </div>
        <div class="card">
          <div class="card-title">🛡️ Rechtssicher &amp; DSGVO</div>
          <p>Alle Schriften und Mediendateien liegen auf dem eigenen Webserver (keine US-Google-Server). Ohne Werbetracker und mit transparentem Datenschutz-Banner.</p>
        </div>
      </div>

      <!-- 2. DIE HAUPTBEREICHE DER WEBSITE -->
      <h2>2. Die Kernbereiche der Website im Überblick</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">📅 Konzertkalender &amp; Detailansichten</div>
          <p>
            Übersichtliche Konzertkarten mit Ort, Datum, Uhrzeit und Ticket-Hinweisen. Besucher können jeden Termin mit einem Klick ausklappen und druckfertig als <strong>DIN-A4-Veranstaltungsblatt mit Emblem</strong> ausdrucken oder als PDF herunterladen.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📜 Historische Konzertchronik</div>
          <p>
            Vergangene Auftritte geraten nicht in Vergessenheit, sondern wandern in das stilvolle Archiv. Besucher und Veranstalter können nach Jahren filtern und die Historie des Ensembles nacherleben.
          </p>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">👥 Musikerinnen &amp; Musiker</div>
          <p>
            Interaktive Pergament-Schleife mit den 7 Musiker-Porträts (Susanne, Simone, Klemens, Silke, Sandra, Lutz, Ruth). Beim Anklicken öffnen sich Namensplaketten und gespielte Instrumente.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📰 Pressebereich (EPK) &amp; Musik</div>
          <p>
            Downloadbereich für Journalisten und Veranstalter mit Pressetexten, hochauflösenden Pressefotos und Web-Logos. Dazu der dezente Musikplayer mit dem Villancico <em>„Riu, Riu, Chiu“</em>.
          </p>
        </div>
      </div>

      <!-- 3. ZUGANG FÜR DIE ENSEMBLELEITUNG -->
      <h2>3. Sicherer Zugang für die Ensemble-Leitung</h2>
      <div class="highlight-box">
        <strong>Ihr exklusives Dashboard in WordPress:</strong><br>
        Für Sie wurde eine eigene, geschützte Rolle <strong>„Ensemble-Leitung“</strong> eingerichtet. In der linken Menüleiste finden Sie direkt den golden hervorgehobenen Bereich <strong>„Olla Podrida“</strong>. Alle unnötigen WordPress-Menüs (wie Standard-Blogbeiträge oder Kommentare) wurden ausgeblendet, damit Sie sich voll auf Ihre Konzerte, Musikerprofile und Anfragen konzentrieren können.
      </div>
    </div>

    <!-- FOOTER SEITE 1 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch v1.4.2</div>
      <div>Seite 1 von 2 · Allgemeine Übersicht &amp; Architektur</div>
    </div>
  </div>


  <!-- ======================================================== -->
  <!-- SEITE 2: PRAXISANLEITUNG, DATENSCHUTZ & SUPPORT          -->
  <!-- ======================================================== -->
  <div class="page-container">
    <div>
      <!-- 4. PRAXISANLEITUNG: TERMINE PFLEGEN -->
      <h2>4. Praxisanleitung: Neuen Termin in 3 einfachen Schritten anlegen</h2>
      <p style="margin-bottom: 9px; font-size: 9pt;">
        Sie benötigen keinerlei Programmierkenntnisse. Das Anlegen eines neuen Konzerts dauert nur eine Minute:
      </p>

      <div class="step-box">
        <div class="step-badge">Schritt 1</div>
        <div class="step-content">
          <strong>Im WordPress-Menü auf „Olla Podrida &rarr; Termine“ klicken</strong>
          <p>Hier sehen Sie Ihre aktuelle Terminliste mit Statusanzeige (anstehend oder archiviert) sowie den Button <em>„Neuen Termin anlegen“</em>.</p>
        </div>
      </div>

      <div class="step-box">
        <div class="step-badge">Schritt 2</div>
        <div class="step-content">
          <strong>Veranstaltungsdaten ausfüllen &amp; optionales Foto wählen</strong>
          <p>Titel, Datum, Uhrzeit, Spielort und eine kurze Beschreibung eingeben. Bei Bedarf Angaben zu Eintritt, Vorverkauf oder Bestuhlung hinzufügen. Sie können auch ein Foto der Spielstätte oder Kirche hochladen.</p>
        </div>
      </div>

      <div class="step-box">
        <div class="step-badge">Schritt 3</div>
        <div class="step-content">
          <strong>Auf „Veranstaltung speichern“ klicken</strong>
          <p>Eine grüne Erfolgsbestätigung erscheint. Der Termin ist im selben Moment auf der Website sichtbar, interaktiv ausklappbar und als PDF druckbar!</p>
        </div>
      </div>

      <!-- 5. WEITERE PFLEGE-FUNKTIONEN -->
      <h2>5. Weitere nützliche Funktionen im Überblick</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">👥 Musikerprofile anpassen</div>
          <p>
            Möchten Sie einen neuen Text, geänderte Instrumente oder ein neues Porträtbild hinterlegen? Unter <strong>Olla Podrida &rarr; Ensemble</strong> lassen sich alle Musiker unkompliziert aktualisieren.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📬 Kontaktanfragen einsehen</div>
          <p>
            Anfragen aus dem Kontaktformular werden nicht nur per E-Mail zugestellt, sondern sicher im Dashboard unter <strong>Kontakt &amp; Postfach</strong> archiviert. So geht garantiert keine Buchung verloren.
          </p>
        </div>
      </div>

      <!-- 6. DATENSCHUTZ & SICHERHEIT -->
      <h2>6. Rechtssicherheit, Datenschutz &amp; Wartung</h2>
      <div class="highlight-box">
        • <strong>DSGVO &amp; DDG:</strong> Erfüllt alle Anforderungen des Digitale-Dienste-Gesetzes und der Datenschutz-Grundverordnung.<br>
        • <strong>Keine externen Schriften:</strong> Alle Fonts (Macondo, Dosis, Roboto) sind DSGVO-konform direkt im Plugin integriert.<br>
        • <strong>Wartungsarm:</strong> Keine Drittanbieter-Lizenzen, die jährlich kostenpflichtig verlängert werden müssen.
      </div>

      <!-- 7. ANSPRECHPARTNER & SUPPORT -->
      <h2>7. Ihre Ansprechpartner für Fragen &amp; Betreuung</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">🎵 Ensemble-Leitung</div>
          <p>
            <strong>Susanne Hoffmann</strong><br>
            Ensemble Olla Podrida<br>
            Im Ort 4 · 49356 Diepholz<br>
            Telefon: +49 174 186 3418<br>
            E-Mail: info@olla-podrida.de
          </p>
        </div>
        <div class="card">
          <div class="card-title">💻 Konzeption, Design &amp; Webentwicklung</div>
          <p>
            <strong>Jan Dennis Brüning</strong><br>
            Web- &amp; Systementwicklung<br>
            E-Mail: office.janbruening@gmail.com<br>
            Web: www.janbruening.de<br>
            Projekt-Code: github.com/JanDennisBruening/olla-podrida-v1
          </p>
        </div>
      </div>
    </div>

    <!-- FOOTER SEITE 2 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch v1.4.2</div>
      <div>Seite 2 von 2 · Praxisleitfaden &amp; Support</div>
    </div>
  </div>

</body>
</html>`;

const tempHtmlPath = path.join(rootDir, 'scripts/handover-temp.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

const outputPdfRoot = path.join(rootDir, 'Handover_Ensemble_Olla_Podrida.pdf');
const outputPdfPlugin = path.join(rootDir, 'wordpress-plugin/Handover_Ensemble_Olla_Podrida.pdf');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

console.log('Generating PDF via Headless Chrome...');
try {
  execSync(`"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdfRoot}" "${tempHtmlPath}"`, {
    stdio: 'inherit'
  });
  
  // Copy to plugin directory as well
  fs.copyFileSync(outputPdfRoot, outputPdfPlugin);
  
  const stats = fs.statSync(outputPdfRoot);
  console.log(`✅ Handover PDF successfully generated: ${outputPdfRoot} (${stats.size} bytes)`);
  console.log(`✅ Handover PDF copied to: ${outputPdfPlugin}`);
  
  // Clean up temp html
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
} catch (err) {
  console.error('Error generating PDF:', err);
  process.exit(1);
}
