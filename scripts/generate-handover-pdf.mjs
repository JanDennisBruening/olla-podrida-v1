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
  <title>Handbuch &amp; Dokumentation (Version V2) · Ensemble Olla Podrida</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 13mm 10mm 13mm;
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
      line-height: 1.4;
    }
    
    .page-container {
      height: 274mm;
      max-height: 274mm;
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
      padding-bottom: 7px;
      margin-bottom: 9px;
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
      letter-spacing: 1.1px;
      padding: 2.5px 8px;
      border-radius: 4px;
      margin-bottom: 3px;
    }
    .doc-title {
      font-size: 18pt;
      font-weight: 800;
      color: #1A1009;
      margin: 0 0 2px 0;
      letter-spacing: -0.3px;
      line-height: 1.15;
    }
    .doc-sub {
      font-size: 9.2pt;
      color: #6B4E36;
      margin: 0;
      font-weight: 600;
    }
    .header-logo {
      max-height: 56px;
      max-width: 130px;
      object-fit: contain;
      margin-left: 15px;
    }

    /* META BAR */
    .meta-bar {
      display: grid;
      grid-template-columns: 1.3fr 1.3fr 1fr 1fr;
      gap: 10px;
      background: #F8F4EC;
      border: 1px solid #E2D5BE;
      border-radius: 6px;
      padding: 7px 12px;
      margin-bottom: 10px;
      font-size: 8.2pt;
      line-height: 1.35;
    }
    .meta-col {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-weight: 700;
      color: #6B4E36;
      font-size: 7.6pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .meta-val {
      color: #241810;
      font-weight: 600;
    }
    .meta-sub {
      color: #4A3320;
      font-weight: 400;
      font-size: 7.9pt;
    }

    /* HEADINGS */
    h2 {
      font-size: 10.6pt;
      color: #382414;
      border-left: 3.5px solid #8B6508;
      padding-left: 8px;
      margin: 10px 0 6px 0;
      letter-spacing: 0.1px;
    }
    .lead-text {
      font-size: 8.9pt;
      line-height: 1.45;
      color: #2B1D13;
      margin-bottom: 8px;
    }

    /* GRIDS & CARDS */
    .grid-2 {
      display: flex;
      gap: 9px;
      margin-bottom: 8px;
    }
    .grid-3 {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .card {
      flex: 1;
      background: #FAF8F4;
      border: 1px solid #E2D5BE;
      border-radius: 5px;
      padding: 7px 10px;
    }
    .card-title {
      font-size: 8.9pt;
      font-weight: 700;
      color: #8B6508;
      margin: 0 0 3px 0;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .card p {
      margin: 0;
      font-size: 8.2pt;
      color: #38271B;
      line-height: 1.35;
    }

    /* STEP BOXES */
    .step-box {
      display: flex;
      gap: 10px;
      background: #FAF8F4;
      border: 1px solid #E2D5BE;
      border-radius: 5px;
      padding: 7px 10px;
      margin-bottom: 6px;
      align-items: flex-start;
    }
    .step-badge {
      background: #8B6508;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 8.4pt;
      padding: 3px 8px;
      border-radius: 4px;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .step-content {
      flex: 1;
    }
    .step-content strong {
      color: #1A1009;
      font-size: 8.9pt;
      display: block;
      margin-bottom: 1px;
    }
    .step-content p {
      margin: 0;
      font-size: 8.2pt;
      color: #38271B;
      line-height: 1.35;
    }

    /* HIGHLIGHT & LEGAL BOXES */
    .highlight-box {
      background: #FDF9F0;
      border-left: 3.5px solid #DAA520;
      border-top: 1px solid #EBE0C9;
      border-right: 1px solid #EBE0C9;
      border-bottom: 1px solid #EBE0C9;
      padding: 7px 11px;
      margin: 7px 0;
      border-radius: 0 5px 5px 0;
      font-size: 8.2pt;
      line-height: 1.4;
      color: #402C1B;
    }
    .disclaimer-box {
      background: #F6F4F0;
      border: 1px solid #D9CEBD;
      border-radius: 5px;
      padding: 6px 10px;
      margin: 7px 0;
      font-size: 7.4pt;
      line-height: 1.35;
      color: #554130;
      font-style: italic;
    }

    /* FOOTER BAR */
    .footer-bar {
      border-top: 1.5px solid #D8C9B2;
      padding-top: 5px;
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 7.6pt;
      color: #7A6755;
    }
  </style>
</head>
<body>

  <!-- ======================================================== -->
  <!-- SEITE 1: RELAUNCH V2, NEUERUNGEN & KERNBEREICHE DER SITE  -->
  <!-- ======================================================== -->
  <div class="page-container">
    <div>
      <!-- HEADER -->
      <div class="header-banner">
        <div class="header-title-box">
          <div class="doc-badge">Handbuch &amp; Dokumentation · Relaunch V2</div>
          <h1 class="doc-title">Ensemble Olla Podrida</h1>
          <p class="doc-sub">Klangvielfalt aus Mittelalter &amp; Renaissance · Leitfaden für die Ensemble-Leitung</p>
        </div>
        ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" alt="Olla Podrida" />` : ''}
      </div>

      <!-- META BAR (Zweizeilig nach Kundenwunsch) -->
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
          <span class="meta-label">System-Version</span>
          <span class="meta-val">Version V2</span>
          <span class="meta-sub">Autarkes WordPress-Plugin</span>
        </div>
        <div class="meta-col">
          <span class="meta-label">Web-Adresse</span>
          <span class="meta-val">www.olla-podrida.de</span>
          <span class="meta-sub">Live &amp; Produktiv</span>
        </div>
      </div>

      <!-- 1. DAS GROSSE WEBSITE-UPDATE V2 -->
      <h2>1. Das große Website-Update (Version V2) – Was ist neu?</h2>
      <p class="lead-text">
        Die Internetpräsenz des <strong>Ensemble Olla Podrida</strong> wurde im Rahmen des Updates auf <strong>Version V2</strong> technisch und gestalterisch umfassend modernisiert. Das gesamte System arbeitet jetzt als autarkes WordPress-Plugin – performant, ohne Abhängigkeit von fehleranfälligen Drittanbieter-Pagebuildern und mit zahlreichen neuen Komfort-Funktionen für Besucher und Ensemble-Leitung:
      </p>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">✨ Neuer Willkommensbereich</div>
          <p>Transparenter Cookie-Consent vor Betreten der Website. Besucher erhalten eine Session-ID; Einwilligungen werden gespeichert und lassen sich jederzeit im Footer löschen oder widerrufen.</p>
        </div>
        <div class="card">
          <div class="card-title">🎭 Neuer Preloader &amp; Einlass</div>
          <p>Nach Zustimmung öffnet sich ein stimmungsvoller Ladebildschirm mit dem historischen Siegel und sanftem Übergang in die illuminierte mittelalterliche Steinbogenhalle.</p>
        </div>
        <div class="card">
          <div class="card-title">🎵 Neuer Musik-Player &amp; Steuerung</div>
          <p>Edler Player im neuen Gewand mit dem Villancico <em>„Riu, Riu, Chiu“</em>. Musik lässt sich von Besuchern stummschalten und im WordPress-Backend komplett konfigurieren.</p>
        </div>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">📅 Umfangreichere Termine</div>
          <p>Konzertkarten bieten jetzt mehr Platz für Vorverkauf, Eintritt, Bestuhlung und Ansprechpartner. Neu: Druckfertiger <strong>DIN-A4-PDF-Export</strong> für jedes einzelne Konzert!</p>
        </div>
        <div class="card">
          <div class="card-title">📜 Neue Konzertchronik</div>
          <p>Vergangene Konzerte geraten nicht verloren, sondern wandern automatisch in das stilvolle Archiv im Footer – inklusive praktischer Such- und Jahressortierung.</p>
        </div>
        <div class="card">
          <div class="card-title">📱 Mobiles Menü &amp; Nach-oben-Button</div>
          <p>Feinabstimmung für mobile Endgeräte und Tablets, ein runderneuertes Mobilmenü, ein dezenter „Nach oben“-Button sowie neue, aufeinander abgestimmte Animationen.</p>
        </div>
      </div>

      <!-- 2. DIE KERNBEREICHE DER WEBSITE -->
      <h2>2. Die Kernbereiche der Website im Überblick</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">🏰 Startbühne &amp; Pergament-Ensemble</div>
          <p>
            Im Header steigen die 7 Musiker-Silhouetten harmonisch empor. Darunter präsentiert das Pergamentband die Porträts von <strong>Susanne, Simone, Klemens, Silke, Sandra, Lutz und Ruth</strong> – beim Antippen erscheinen Instrumente und Rollen.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📰 Pressebereich (EPK) &amp; Medienablage</div>
          <p>
            Veranstalter und Journalisten finden im Pressebereich vorbereitete Pressetexte, hochauflösende Druckfotos und Logos zum Download. Zudem besteht im Backend eine Verlinkung zum Google Drive Ordner.
          </p>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">⚖️ Rechtliches nach neuem DDG</div>
          <p>
            Impressum und Datenschutz wurden im Hinblick auf das neue Digitale-Dienste-Gesetz (DDG, Nachfolger des TMG) aktualisiert. Alle Texte im Footer und Impressum können im Dashboard eigenständig editiert werden.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🔒 Geheimer Redaktionszugang im Footer</div>
          <p>
            Ganz unten im Footer befindet sich als allerletzter Punkt ein kleines Schloss-Symbol 🔒. Ein Klick führt direkt zum WordPress-Login. <strong>Wichtig: An den bisherigen Logindaten hat sich nichts geändert!</strong>
          </p>
        </div>
      </div>

      <!-- 3. ZUGANG FÜR DIE ENSEMBLE-LEITUNG -->
      <div class="highlight-box">
        <strong>Ihr aufgeräumtes WordPress-Backend (Rolle: Ensemble-Leitung):</strong><br>
        Um Ihnen die redaktionelle Arbeit so einfach wie möglich zu machen, wurde für Susanne Hoffmann die Rolle <strong>„Ensemble-Leitung“</strong> eingerichtet. Unnötige Standard-Menüs (wie WordPress-Blogbeiträge oder Kommentare) sind ausgeblendet. Der golden hervorgehobene Menüpunkt <strong>„Olla Podrida“</strong> führt Sie direkt zu allen Funktionen.
      </div>
    </div>

    <!-- FOOTER SEITE 1 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch Version V2</div>
      <div>Seite 1 von 2 · Relaunch-Übersicht &amp; Website-Kernbereiche</div>
    </div>
  </div>


  <!-- ======================================================== -->
  <!-- SEITE 2: PRAXISANLEITUNG, REDAKTION, DATENSCHUTZ & SUPPORT -->
  <!-- ======================================================== -->
  <div class="page-container">
    <div>
      <!-- 4. PRAXISANLEITUNG: TERMINE PFLEGEN -->
      <h2>3. Praxisanleitung: Neuen Termin in 3 einfachen Schritten erstellen</h2>
      <p style="margin-bottom: 6px; font-size: 8.6pt;">
        Sie benötigen keinerlei Programmierkenntnisse. Ein neues Konzert ist in weniger als einer Minute angelegt:
      </p>

      <div class="step-box">
        <div class="step-badge">Schritt 1</div>
        <div class="step-content">
          <strong>Im WordPress-Menü auf „Olla Podrida &rarr; Termine“ klicken</strong>
          <p>Die Terminübersicht öffnet sich. Hier sehen Sie alle bestehenden Konzerte (inkl. der mitgelieferten Vorlagen). Klicken Sie oben auf den Button <em>„Neuen Termin anlegen“</em>.</p>
        </div>
      </div>

      <div class="step-box">
        <div class="step-badge">Schritt 2</div>
        <div class="step-content">
          <strong>Konzertdaten ausfüllen &amp; optionales Bild auswählen</strong>
          <p>Titel, Datum, Uhrzeit, Spielort und Beschreibung eingeben. Bei Bedarf Zusatzangaben zu Vorverkauf, Eintritt oder Bestuhlung aktivieren. Optional kann ein Kirchen- oder Veranstaltungsfoto zugewiesen werden.</p>
        </div>
      </div>

      <div class="step-box">
        <div class="step-badge">Schritt 3</div>
        <div class="step-content">
          <strong>Auf „Veranstaltung speichern“ klicken</strong>
          <p>Eine grüne Infobox bestätigt den Erfolg. Der Termin ist sofort live auf der Website sichtbar, interaktiv ausklappbar und kann von Besuchern direkt als DIN-A4-Veranstaltungsblatt ausgedruckt werden!</p>
        </div>
      </div>

      <!-- 5. WEITERE REDAKTIONELLE MÖGLICHKEITEN -->
      <h2>4. Was Sie im Olla Podrida Dashboard eigenständig verwalten können</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">👥 Musiker-Profile &amp; Texte</div>
          <p>
            Unter <strong>Ensemble</strong> können Sie Beschreibungen, gespielte Instrumente und Gesangsstimmen anpassen oder Porträtfotos austauschen.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📬 Kontakt-Postfach (Kein Datenverlust)</div>
          <p>
            Anfragen aus dem Formular werden nicht nur per Mail verschickt, sondern sicher in der Datenbank archiviert. Jederzeit im Dashboard einsehbar.
          </p>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">🍪 Cookie-Consents einsehen &amp; Export</div>
          <p>
            Unter <strong>Cookie &amp; Consent</strong> können erteilte Einwilligungen eingesehen und bei Bedarf als CSV-Datei für die Unterlagen exportiert werden.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📁 Google Drive &amp; Materialablage</div>
          <p>
            Direkte Verlinkung zum zentralen Google Drive Ordner für gemeinsame Ensemble-Materialien, Notenblätter, Pressetexte und Fotos.
          </p>
        </div>
      </div>

      <!-- 6. DATENSCHUTZ, COOKIES & DDG -->
      <h2>5. Technische Datenschutz-Lösung &amp; Hinweise zur Wartung</h2>
      <div class="highlight-box">
        • <strong>Transparenter Cookie-Consent:</strong> Website-Besucher erhalten eine anonymisierte Session-ID. Zustimmungen werden protokolliert. Im Footer kann die Cookie-Einstellung jederzeit neu aufgerufen oder gelöscht werden.<br>
        • <strong>Lokale Schriften &amp; Medien:</strong> Keine Datenübertragung an US-Server (Google Fonts sind 100% lokal im Plugin eingebettet).<br>
        • <strong>Wartungsarm &amp; Updatesicher:</strong> Keine Drittanbieter-Lizenzen, die jährlich kostenpflichtig ablaufen. Alle Einstellungen bleiben bei System-Updates sicher in der WordPress-Datenbank erhalten.
      </div>

      <!-- 7. ANSPRECHPARTNER -->
      <h2>6. Ansprechpartner für Fragen &amp; Betreuung</h2>
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
          <div class="card-title">💻 Konzept, Design &amp; Webentwicklung</div>
          <p>
            <strong>Jan Dennis Brüning</strong><br>
            Web- &amp; Systementwicklung<br>
            E-Mail: office@janbruening.de<br>
            Web: www.janbruening.de<br>
            Projekt-Code: github.com/JanDennisBruening/olla-podrida-v1
          </p>
        </div>
      </div>

      <!-- 8. RECHTLICHER DISCLAIMER -->
      <div class="disclaimer-box">
        <strong>Wichtiger Hinweis zur rechtlichen Verbindlichkeit:</strong> Die technische Umsetzung der Website, des Cookie-Consents sowie die Bereitstellung der Textfelder für Impressum und Datenschutz erfolgten im Rahmen der Webentwicklung nach bestem Wissen und aktuellem Stand der Technik (u. a. DDG &amp; DSGVO). Als Webentwickler übernehme ich jedoch keine Rechtsberatung und keine rechtliche Gewähr oder Haftung für die Vollständigkeit, Gültigkeit oder Abmahnsicherheit der Texte und Regelungen. Die abschließende inhaltliche Prüfung und rechtliche Verantwortung liegt bei den Betreibern und Verantwortlichen der Website.
      </div>
    </div>

    <!-- FOOTER SEITE 2 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch Version V2</div>
      <div>Seite 2 von 2 · Praxisleitfaden, Redaktion &amp; Betreuung</div>
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
