import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read high-resolution logo image and convert to base64
const logoPath = path.join(rootDir, 'public/images/2024_07_15_Logo_Olla-Podrida_V1_1.png');
let logoBase64 = '';
if (fs.existsSync(logoPath)) {
  logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
}

const htmlContent = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>System-Dokumentation &amp; Handbuch (Version V4) · Ensemble Olla Podrida</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #241810;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 8.8pt;
      line-height: 1.45;
    }
    
    .page-container {
      height: 270mm;
      max-height: 270mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
      position: relative;
      overflow: hidden;
    }
    .page-container:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    /* HEADER BANNER */
    .header-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #8B6508;
      padding-bottom: 8px;
      margin-bottom: 11px;
    }
    .header-title-box {
      flex: 1;
    }
    .doc-badge {
      display: inline-block;
      background: #8B6508;
      color: #FFFFFF;
      font-size: 7.2pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 2px 7px;
      border-radius: 4px;
      margin-bottom: 3px;
    }
    .doc-title {
      font-size: 17pt;
      font-weight: 800;
      color: #1A1009;
      margin: 0 0 2px 0;
      letter-spacing: -0.3px;
      line-height: 1.15;
    }
    .doc-sub {
      font-size: 8.9pt;
      color: #6B4E36;
      margin: 0;
      font-weight: 600;
    }
    .header-logo {
      height: 48px;
      width: auto;
      max-width: 140px;
      object-fit: contain;
      image-rendering: -webkit-optimize-contrast;
      margin-left: 16px;
    }

    /* META BAR */
    .meta-bar {
      display: grid;
      grid-template-columns: 1.25fr 1.35fr 1fr 1fr;
      gap: 12px;
      background: #FAF7F2;
      border: 1px solid #E4D8C5;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 8.3pt;
      line-height: 1.35;
    }
    .meta-col {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-weight: 700;
      color: #7A5328;
      font-size: 7.2pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .meta-val {
      color: #1A1009;
      font-weight: 700;
    }
    .meta-sub {
      color: #4A3320;
      font-weight: 500;
      font-size: 8.0pt;
    }

    /* HEADINGS */
    h2 {
      font-size: 10.4pt;
      color: #382414;
      border-left: 3.5px solid #8B6508;
      padding-left: 9px;
      margin: 12px 0 8px 0;
      letter-spacing: 0.1px;
    }
    .lead-text {
      font-size: 8.8pt;
      line-height: 1.48;
      color: #2B1D13;
      margin: 0 0 11px 0;
    }

    /* GRIDS & CARDS */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .card {
      background: #FAF8F4;
      border: 1px solid #E2D7C3;
      border-radius: 6px;
      padding: 9px 12px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .card-title {
      font-size: 8.75pt;
      font-weight: 700;
      color: #8B6508;
      margin: 0 0 3px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .card p {
      margin: 0;
      font-size: 8.05pt;
      color: #38271B;
      line-height: 1.42;
    }
    .card p strong {
      color: #20140A;
    }

    /* STEP BOXES */
    .step-box {
      display: flex;
      gap: 12px;
      background: #FAF8F4;
      border: 1px solid #E2D7C3;
      border-radius: 6px;
      padding: 9px 13px;
      margin-bottom: 9px;
      align-items: flex-start;
    }
    .step-badge {
      background: #8B6508;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 9.0pt;
      padding: 3px 10px;
      border-radius: 5px;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .step-content {
      flex: 1;
    }
    .step-content strong {
      color: #1A1009;
      font-size: 8.85pt;
      display: block;
      margin-bottom: 3px;
    }
    .step-content p {
      margin: 0;
      font-size: 8.05pt;
      color: #38271B;
      line-height: 1.42;
    }

    /* HIGHLIGHT & DISCLAIMER BOXES */
    .highlight-box {
      background: #FDF9F0;
      border-left: 3.5px solid #DAA520;
      border-top: 1px solid #EBE0C9;
      border-right: 1px solid #EBE0C9;
      border-bottom: 1px solid #EBE0C9;
      padding: 9px 13px;
      margin: 9px 0 0 0;
      border-radius: 0 6px 6px 0;
      font-size: 8.15pt;
      line-height: 1.44;
      color: #402C1B;
    }
    .disclaimer-box {
      background: #F8F5EE;
      border: 1px solid #D8CCB8;
      border-left: 3.5px solid #9C7238;
      border-radius: 6px;
      padding: 9px 13px;
      margin: 8px 0;
      font-size: 7.95pt;
      line-height: 1.44;
      color: #4A3A2C;
    }

    /* FOOTER BAR */
    .footer-bar {
      border-top: 1.5px solid #D8C9B2;
      padding-top: 6px;
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #7A6652;
    }
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- SEITE 1: NEUERUNGEN DER SICHTBAREN WEBSITE -->
  <!-- ========================================== -->
  <div class="page-container">
    <div>
      <!-- HEADER BANNER -->
      <div class="header-banner">
        <div class="header-title-box">
          <span class="doc-badge">SYSTEM-DOKUMENTATION &amp; HANDBUCH · VERSION V4</span>
          <h1 class="doc-title">Ensemble Olla Podrida</h1>
          <p class="doc-sub">Klangvielfalt aus Mittelalter und Renaissance · Webauftritt &amp; Content Management System</p>
        </div>
        ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" alt="Ensemble Olla Podrida" />` : ''}
      </div>

      <!-- METADATEN-LEISTE -->
      <div class="meta-bar">
        <div class="meta-col">
          <span class="meta-label">Auftraggeberin</span>
          <span class="meta-val">Ensemble Olla Podrida</span>
          <span class="meta-sub">Susanne Hoffmann</span>
        </div>
        <div class="meta-col">
          <span class="meta-label">Konzept &amp; Entwicklung</span>
          <span class="meta-val">Jan Dennis Brüning</span>
          <span class="meta-sub">office@janbruening.de</span>
        </div>
        <div class="meta-col">
          <span class="meta-label">Systemversion</span>
          <span class="meta-val">Version V4</span>
          <span class="meta-sub">WordPress Plugin &amp; Canvas</span>
        </div>
        <div class="meta-col">
          <span class="meta-label">Web-Adresse</span>
          <span class="meta-val">www.olla-podrida.de</span>
          <span class="meta-sub">Live-System (Relaunch)</span>
        </div>
      </div>

      <p class="lead-text">
        Mit der Bereitstellung der <strong>Version V4</strong> wurde der Webauftritt des <strong>Ensemble Olla Podrida</strong> technisch und gestalterisch auf ein modernes Fundament gestellt. Ziel des Relaunches war es, die authentische, theatralische Atmosphäre von Renaissance und Mittelalter mit hervorragender Mobilnutzung, barrierearmer Bedienbarkeit und einer komfortablen redaktionellen Selbstverwaltung für die Ensembleleitung zu verbinden.
      </p>

      <h2>✨ Die 6 zentralen Highlights der sichtbaren Website</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">🛡️ Willkommensbox &amp; Cookie-Consent</div>
          <p>
            Stilvolles Begrüßungsfenster mit dem um 20% vergrößerten historischen Siegel. Besucher wählen transparent zwischen <em>&bdquo;Alle akzeptieren&ldquo;</em> und <em>&bdquo;Nur essenzielle Cookies&ldquo;</em>. Jeder Nutzer erhält eine anonyme Cookie-Session-ID; Einwilligungen können im Website-Footer jederzeit eingesehen oder mit einem Klick widerrufen werden.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🏰 Theatralische Bühneninszenierung &amp; Parallax</div>
          <p>
            Ein eleganter Preloader leitet sanft auf die historische Ritterhalle über. Die Musiker-Figuren erheben sich vor der stimmungsvollen Kulisse. Ein leichter, synchronisierter Parallax-Effekt beim Scrollen verleiht dem Bühnenbild lebendige Tiefe, ohne die Ladezeit oder Flüssigkeit zu beeinträchtigen.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🎵 Neuer Musik- &amp; Audioplayer</div>
          <p>
            Dezenter, schwebender Musikplayer für historische Hörbeispiele (wie <em>&bdquo;Riu Riu Chiu&ldquo;</em>). Bietet Mute-Stummschaltung, stufenlose Lautstärkeregelung und Titelanzeige – besucherfreundlich minimierbar, extrem datensparsam und direkt vom eigenen Server geladen.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📅 Konzert-Highlights mit Gold-Aura &amp; PDF-Export</div>
          <p>
            Die Termine sind die optischen Glanzpunkte der Website: Ein warmer, dezenter Gold-Aura-Effekt hebt anstehende Konzerte als Highlights hervor. Besucher finden Details zu Vorverkauf, Einlass und Bestuhlung und laden Termine mit einem Klick als druckfähiges DIN-A4 PDF herunter.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📜 Historische Konzertchronik im Footer</div>
          <p>
            Vergangene Auftritte gehen nicht verloren: Nach Ablauf von Datum und Uhrzeit wandern Termine vollautomatisch in die Konzertchronik. Über den dezenten Link im Footer öffnet sich ein übersichtliches, paginiertes Archiv-Modal mit allen gespielten Programmen.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📱 Optimierte Responsivität &amp; Nach-oben-Button</div>
          <p>
            Präzise abgestimmte Ansichten für Smartphones, Tablets und Desktop ohne horizontales Scrollen. Ein ergonomischer <em>&bdquo;Nach oben&ldquo;</em>-Button mit feiner Lichtanimation begleitet das flüssige Lenis-Scrollen und sorgt für höchsten Lesekomfort auf allen Endgeräten.
          </p>
        </div>
      </div>

      <div class="highlight-box">
        <strong>🔐 Diskreter Administrations-Zugang, Farbwelten &amp; Barrierearmut:</strong><br/>
        Ganz unten in der Fußzeile der Website befindet sich ein unauffälliges Schlosssymbol. Ein Klick darauf führt direkt zum WordPress-Login für Susanne Hoffmann. Für normale Besucher bleibt der Zugang unsichtbar. Warme Farbtöne mit hohem Textkontrast, ein helles Gold-Orange und großzügige Touch-Zonen garantieren eine ermüdungsfreie, barrierearme Bedienung auf allen Endgeräten.
      </div>
    </div>

    <!-- FOOTER SEITE 1 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch Version V4</div>
      <div>Seite 1 von 3 · Frontend-Highlights &amp; Relaunch-Übersicht</div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SEITE 2: WORDPRESS BACKEND & KERNBEREICHE  -->
  <!-- ========================================== -->
  <div class="page-container">
    <div>
      <!-- HEADER BANNER -->
      <div class="header-banner">
        <div class="header-title-box">
          <span class="doc-badge">ADMINISTRATION &amp; VERWALTUNG · VERSION V4</span>
          <h1 class="doc-title">Das WordPress Redaktions-Cockpit</h1>
          <p class="doc-sub">Übersicht aller Kernbereiche zur eigenständigen redaktionellen Pflege der Inhalte</p>
        </div>
        ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" alt="Ensemble Olla Podrida" />` : ''}
      </div>

      <p class="lead-text">
        Im WordPress-Backend steht der Ensembleleitung ein aufgeräumtes, zentrisch orientiertes Dashboard zur Verfügung. Über die linke Seitenleiste lassen sich alle wesentlichen Kernbereiche intuitiv und ohne Programmierkenntnisse pflegen:
      </p>

      <h2>🧭 Die 8 zentralen Redaktionsmodule im Detail</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">📅 Termine &amp; Konzerte verwalten</div>
          <p>
            Erfasse neue Konzerte mit Datum, Uhrzeit, Spielort, Eintritt und Vorverkaufslink. Eine optische Trennlinie trennt aktive Konzerte sauber von vergangenen Auftritten in der Chronik. Inklusive automatischer DIN-A4 PDF-Generierung für Besucher.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📜 Musiker-Profile &amp; Ensemble</div>
          <p>
            Pflege die 7 Ensemblemitglieder (#ensemble): Aktualisiere Porträts, Instrumentenlisten und biografische Notizen. Die Reihenfolge und Bühnenpositionierung auf Smartphones kann jederzeit flexibel angepasst werden.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🎵 Musik-Player &amp; Hörproben</div>
          <p>
            Lade neue Stücke bequem über die WordPress-Mediathek hoch. Du steuerst, welches Musikstück auf der Website ertönt, und konfigurierst Titelanzeige, Grundlautstärke und optionalen Endlos-Loop.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📰 Presse- &amp; Medienmaterial</div>
          <p>
            Hinterlege hochauflösende Pressefotos in 300-DPI-Druckqualität, Ensemble-Logos (helle &amp; dunkle Variante) sowie fertige Pressetexte für Zeitungsredaktionen und Veranstalter zum direkten Download.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📬 Posteingang &amp; Kontaktanfragen</div>
          <p>
            Alle über das Kontaktformular (#kontakt) versendeten Nachrichten laufen im internen Posteingang zusammen. Inklusive Zähler für ungelesene Anfragen, Spam-Schutz per Zeitschranke und CSV-Export für das Archiv.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🛡️ Cookie-Consents &amp; Nachweisführung</div>
          <p>
            DSGVO-konforme Protokollierung aller Cookie-Einwilligungen. Übersichtliche Aktivitätsstatistik der letzten 30 Tage sowie bequemer CSV- und druckfähiger Audit-Export zur lückenlosen Erfüllung gesetzlicher Pflichten.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📁 Google Drive Cloud-Ablage</div>
          <p>
            Direkte Verlinkung der gemeinsamen Ensemble-Cloud im Dashboard. Schneller Absprung zu gemeinsamen Notensätzen, Verträgen, Konzertprogrammen, Probenorganisation und internen Ablaufplänen.
          </p>
        </div>
        <div class="card">
          <div class="card-title">⚖️ Rechtstexte &amp; Footer-Pflege</div>
          <p>
            Geringfügige gestalterische und inhaltliche Anpassungen an Impressum, Datenschutzerklärung oder Fußzeilentexten können im Backend jederzeit selbstständig vorgenommen und sofort aktualisiert werden.
          </p>
        </div>
      </div>

      <div class="highlight-box">
        <strong>👥 Maßgeschneidertes Rollenkonzept, Zentrierung &amp; Hohe Betriebssicherheit:</strong><br/>
        Für Susanne Hoffmann wurde eine exklusive Rolle eingerichtet: Irrelevante technische Menüs (wie Standard-Beiträge, Themes, Plugin-Code oder Core-Updates) sind ausgeblendet. Alle Untermenüs sind wie das Dashboard zentrisch aufgebaut. Der aktuell gewählte Menüpunkt wird dezent in hellem Gold-Orange hinterlegt – ohne versetzte Linien beim Hovern. Alle Daten können zudem jederzeit per Mausklick als CSV-Tabelle exportiert werden.
      </div>
    </div>

    <!-- FOOTER SEITE 2 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch Version V4</div>
      <div>Seite 2 von 3 · WordPress Backend &amp; Redaktionsmodule</div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SEITE 3: PRAXISLEITFADEN & RECHTLICHES     -->
  <!-- ========================================== -->
  <div class="page-container">
    <div>
      <!-- HEADER BANNER -->
      <div class="header-banner">
        <div class="header-title-box">
          <span class="doc-badge">PRAXISANLEITUNG &amp; RECHTLICHE HINWEISE · VERSION V4</span>
          <h1 class="doc-title">Praxisleitfaden &amp; Hinweise</h1>
          <p class="doc-sub">Schritt-für-Schritt-Anleitung zur Terminpflege, rechtliche Klarstellung &amp; technischer Support</p>
        </div>
        ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" alt="Ensemble Olla Podrida" />` : ''}
      </div>

      <h2>🚀 Praxisleitfaden: Neues Konzert in 3 einfachen Schritten anlegen</h2>
      <div class="step-box">
        <div class="step-badge">1</div>
        <div class="step-content">
          <strong>Bereich aufrufen &amp; Eingabeformular öffnen</strong>
          <p>Klicke im linken WordPress-Menü auf <em>&bdquo;Termine &amp; Konzerte&ldquo;</em> und anschließend oben auf den goldenen Button <em>&bdquo;+ Neue Veranstaltung hinzufügen&ldquo;</em>. Ein aufgeräumtes Dialogfenster öffnet sich direkt im zentrierten Redaktionsbereich.</p>
        </div>
      </div>
      <div class="step-box">
        <div class="step-badge">2</div>
        <div class="step-content">
          <strong>Konzertdaten, Vorverkauf &amp; Beitragsbild erfassen</strong>
          <p>Titel, Datum, Uhrzeit, Spielort und Eintritt/Vorverkauf eintragen. Optional kann ein Bild aus der WordPress-Mediathek zugewiesen werden. Bei Bedarf praktische Hinweise zu Bestuhlung, Barrierefreiheit oder Reservierungspflicht hinterlegen.</p>
        </div>
      </div>
      <div class="step-box">
        <div class="step-badge">3</div>
        <div class="step-content">
          <strong>Speichern &amp; sofortige Live-Schaltung</strong>
          <p>Auf <em>&bdquo;Veranstaltung speichern&ldquo;</em> klicken. Der Termin ist sofort auf der Website im Bereich #termine sichtbar, reiht sich chronologisch ein, erhält die warme Gold-Aura und generiert automatisch das druckfähige DIN-A4 PDF-Blatt für Besucher.</p>
        </div>
      </div>

      <h2>🔍 Lokale Datenschutz-Architektur &amp; Suchmaschinen</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">🔍 Google-Vorschau (SERP) &amp; Social Sharing</div>
          <p>
            Passe Seitentitel und Meta-Beschreibungen flexibel an. Eine Live-Vorschau zeigt exakt, wie das Ensemble bei Google-Suchtreffern sowie beim Teilen von Links auf WhatsApp oder Facebook visuell dargestellt wird.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🔒 Autarke Server-Infrastruktur ohne US-Clouds</div>
          <p>
            Sämtliche Schriften (Google Fonts lokal eingebunden), Icons und Audio-Dateien werden direkt vom eigenen Webserver ausgeliefert. Es erfolgt kein unkontrollierter Datentransfer an externe Werbenetzwerke oder Drittanbieter.
          </p>
        </div>
      </div>

      <h2>⚖️ Rechtliche Klarstellung &amp; Haftungsausschluss (Disclaimer)</h2>
      <div class="disclaimer-box">
        <strong>Wichtiger rechtlicher Hinweis und Klarstellung:</strong><br/>
        Die im Rahmen der Webentwicklung implementierten technischen Funktionen (wie das Cookie-Consent-Banner, die Protokollierung von anonymen Session-IDs, die Lösch- und Widerrufsoption für Besucher sowie die Textvorlagen für Impressum und Datenschutz nach DDG und DSGVO) wurden mit größter handwerklicher Sorgfalt nach aktuellem Stand der Technik umgesetzt. Als Entwickler und technischer Dienstleister führe ich <strong>keine Rechtsberatung</strong> durch und kann keine formale rechtliche Prüfung oder Haftungsübernahme im Sinne einer anwaltlichen Freigabe gewährleisten.<br/>
        Die inhaltliche Richtigkeit, Vollständigkeit und die letztliche rechtliche Gültigkeit (insbesondere bezüglich Bildrechten, Textinhalten, GEMA-Musikrechten und behördlichen Pflichtangaben) liegen in der Verantwortung der Betreiber und Vertretungsberechtigten des Ensemble Olla Podrida. Eine juristische Überprüfung durch einen Fachanwalt für IT-Recht wird vor Veröffentlichung formal empfohlen.
      </div>

      <div class="card" style="margin-top: 6px; background: #FAF7F2; border-color: #D8CCB8; padding: 10px 14px;">
        <div class="card-title" style="color: #6B4E36;">📞 Technische Betreuung, Datensicherung &amp; Ansprechpartner</div>
        <p>
          <strong>Jan Dennis Brüning</strong> · Konzept, Design &amp; Webentwicklung<br/>
          E-Mail: <a href="mailto:office@janbruening.de" style="color: #8B6508; text-decoration: none; font-weight: 600;">office@janbruening.de</a> · Web: <a href="https://www.janbruening.de" target="_blank" style="color: #8B6508; text-decoration: none; font-weight: 600;">www.janbruening.de</a><br/>
          Bei Fragen zur redaktionellen Bedienung, regelmäßigen Datensicherungen oder zukünftigen Erweiterungen stehe ich Ihnen jederzeit gerne unterstützend zur Seite.
        </p>
      </div>
    </div>

    <!-- FOOTER SEITE 3 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch Version V4</div>
      <div>Seite 3 von 3 · Praxisanleitung, Haftungsausschluss &amp; Support</div>
    </div>
  </div>

</body>
</html>`;

const tempHtmlPath = path.join(rootDir, 'scripts/handover-temp-v4.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

const outputPdfRoot = path.join(rootDir, 'Handover_Ensemble_Olla_Podrida_V4.pdf');
const outputPdfPlugin = path.join(rootDir, 'wordpress-plugin/Handover_Ensemble_Olla_Podrida_V4.pdf');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

console.log('Generating Handover V4 PDF via Headless Chrome...');
try {
  execSync(`"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdfRoot}" "${tempHtmlPath}"`, {
    stdio: 'inherit'
  });
  
  // Copy to plugin directory as well
  fs.copyFileSync(outputPdfRoot, outputPdfPlugin);
  
  const stats = fs.statSync(outputPdfRoot);
  console.log(`✅ Handover V4 PDF successfully generated: ${outputPdfRoot} (${stats.size} bytes)`);
  console.log(`✅ Handover V4 PDF copied to: ${outputPdfPlugin}`);

  // Automated Verification via JXA
  console.log('\n🔍 Verifying generated PDF with JXA...');
  const verifyScript = `
    ObjC.import("PDFKit");
    ObjC.import("AppKit");
    var doc = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath("${outputPdfRoot}"));
    var count = doc.pageCount;
    console.log("ACTUAL_PAGE_COUNT:" + count);
    for (var i = 0; i < count; i++) {
      var page = doc.pageAtIndex(i);
      var rect = page.boundsForBox($.kPDFDisplayBoxMediaBox);
      var image = page.thumbnailOfSizeForBox($.CGSizeMake(rect.size.width * 2, rect.size.height * 2), $.kPDFDisplayBoxMediaBox);
      var tiffData = image.TIFFRepresentation;
      var bitmap = $.NSBitmapImageRep.imageRepsWithData(tiffData).objectAtIndex(0);
      var pngData = bitmap.representationUsingTypeProperties($.NSPNGFileType, $.NSDictionary.dictionary);
      var outPath = "/tmp/v4-page-" + (i + 1) + ".png";
      pngData.writeToFileAtomically(outPath, true);
    }
  `;
  const jxaOutput = execSync(`osascript -l JavaScript -e '${verifyScript}'`, { encoding: 'utf8' });
  console.log(jxaOutput);
  
  if (jxaOutput.includes('ACTUAL_PAGE_COUNT:3')) {
    console.log('🎉 PERFECT! Exactly 3 pages generated with zero spillover.');
  } else {
    console.warn('⚠️ WARNING: Page count is NOT 3! Output: ' + jxaOutput);
  }
} catch (err) {
  console.error('Error generating PDF:', err);
  process.exit(1);
}
