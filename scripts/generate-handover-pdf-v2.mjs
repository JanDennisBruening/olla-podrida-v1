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
      font-size: 8.9pt;
      line-height: 1.42;
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
      padding-bottom: 8px;
      margin-bottom: 10px;
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
      letter-spacing: 1px;
      padding: 2.5px 8px;
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
      font-size: 9.0pt;
      color: #6B4E36;
      margin: 0;
      font-weight: 600;
    }
    .header-logo {
      height: 52px;
      width: auto;
      max-width: 140px;
      object-fit: contain;
      image-rendering: -webkit-optimize-contrast;
      margin-left: 15px;
    }

    /* META BAR (Two lines per field, exact specifications) */
    .meta-bar {
      display: grid;
      grid-template-columns: 1.25fr 1.35fr 1fr 1fr;
      gap: 10px;
      background: #F9F6F0;
      border: 1px solid #E2D7C3;
      border-radius: 6px;
      padding: 7px 12px;
      margin-bottom: 12px;
      font-size: 8.2pt;
      line-height: 1.35;
    }
    .meta-col {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-weight: 700;
      color: #7A5328;
      font-size: 7.4pt;
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
      font-size: 10.8pt;
      color: #382414;
      border-left: 3.5px solid #8B6508;
      padding-left: 8px;
      margin: 10px 0 7px 0;
      letter-spacing: 0.1px;
    }
    .lead-text {
      font-size: 8.8pt;
      line-height: 1.45;
      color: #2B1D13;
      margin-bottom: 10px;
    }

    /* GRIDS & CARDS */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 9px;
      margin-bottom: 10px;
    }
    .card {
      background: #FAF8F4;
      border: 1px solid #E2D7C3;
      border-radius: 6px;
      padding: 8px 11px;
    }
    .card-title {
      font-size: 8.8pt;
      font-weight: 700;
      color: #8B6508;
      margin: 0 0 3px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .card p {
      margin: 0;
      font-size: 8.1pt;
      color: #38271B;
      line-height: 1.35;
    }

    /* STEP BOXES */
    .step-box {
      display: flex;
      gap: 10px;
      background: #FAF8F4;
      border: 1px solid #E2D7C3;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 8px;
      align-items: flex-start;
    }
    .step-badge {
      background: #8B6508;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 8.5pt;
      padding: 3px 9px;
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
      margin-bottom: 2px;
    }
    .step-content p {
      margin: 0;
      font-size: 8.1pt;
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
      padding: 8px 12px;
      margin: 8px 0;
      border-radius: 0 6px 6px 0;
      font-size: 8.2pt;
      line-height: 1.4;
      color: #402C1B;
    }
    .disclaimer-box {
      background: #F7F5F0;
      border: 1px solid #D9CEBD;
      border-radius: 6px;
      padding: 8px 12px;
      margin: 8px 0;
      font-size: 7.7pt;
      line-height: 1.38;
      color: #4A3A2C;
    }

    /* FOOTER BAR */
    .footer-bar {
      border-top: 1.5px solid #D8C9B2;
      padding-top: 6px;
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      font-size: 7.4pt;
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
          <span class="doc-badge">SYSTEM-DOKUMENTATION &amp; HANDBUCH · RELAUNCH VERSION V2</span>
          <h1 class="doc-title">Ensemble Olla Podrida</h1>
          <p class="doc-sub">Klangvielfalt aus Mittelalter und Renaissance · Webauftritt &amp; Content Management System</p>
        </div>
        ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" alt="Ensemble Olla Podrida" />` : ''}
      </div>

      <!-- METADATEN-LEISTE (exakt 2 Zeilen pro Feld, wie angefordert) -->
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
          <span class="meta-val">Version V2</span>
          <span class="meta-sub">WordPress Plugin</span>
        </div>
        <div class="meta-col">
          <span class="meta-label">Web-Adresse</span>
          <span class="meta-val">www.olla-podrida.de</span>
          <span class="meta-sub">Live-System (Relaunch)</span>
        </div>
      </div>

      <p class="lead-text">
        Mit dem Release der <strong>Version V2</strong> wurde die Webpräsenz des <strong>Ensemble Olla Podrida</strong> umfassend modernisiert. Ziel des Relaunches war es, die unverwechselbare, theatralische Renaissance- und Mittelalter-Atmosphäre des Ensembles mit zeitgemäßen Webstandards, optimaler mobiler Nutzbarkeit und komfortabler redaktioneller Selbstverwaltung zu verbinden.
      </p>

      <h2>✨ Die Neuerungen auf der sichtbaren Website im Überblick</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">🛡️ Willkommensbox &amp; Cookie-Consent</div>
          <p>
            Historisch gestaltetes Begrüßungsfenster mit drehendem Gold-Siegel (+20% vergrößert). Besucher entscheiden transparent zwischen <em>&bdquo;Alle akzeptieren&ldquo;</em> und <em>&bdquo;Nur notwendige&ldquo;</em>. Vergabe einer anonymen Session-ID; Einwilligungen können jederzeit im Website-Footer eingesehen oder zurückgesetzt werden.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🏰 Preloader &amp; Siegel-Inszenierung</div>
          <p>
            Stilvoller Ladebildschirm mit dem Siegel-Emblem und einzeilig harmonisiertem Renaissance-Untertitel. Garantiert einen fließenden, ruckelfreien Übergang in die atmosphärische Hero-Bühne mit Bodennebel auf Smartphones, Tablets und Desktops.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🎵 Neuer Musik- &amp; Audioplayer</div>
          <p>
            Dezenter, responsiver Audioplayer für historische Klangbeispiele (z. B. <em>&bdquo;Riu Riu Chiu&ldquo;</em>). Bietet Mute-Stummschaltung, Lautstärkeregler, Titelanzeige und nahtlose Wiedergabe – besucherfreundlich und datensparsam eingebunden.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📅 Erweiterte Konzertkarten &amp; PDF-Export</div>
          <p>
            Konzertkarten (#termine) informieren detailliert über Vorverkauf, Eintrittspreise, Einlass und Bestuhlung. Besucher können Termine direkt mit einem Klick als druckfähiges DIN-A4 PDF herunterladen oder ausdrucken.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📜 Historische Konzertchronik im Footer</div>
          <p>
            Vergangene Auftritte müssen nicht gelöscht werden: Nach Ablauf von Datum und Uhrzeit wandern Termine automatisch in die Konzertchronik. Über den dezenten Link im Footer öffnet sich ein elegantes Archiv-Modal.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📱 Volle Responsivität &amp; Scroll-to-Top</div>
          <p>
            Perfekt abgestimmte Viewports für Smartphone, Tablet und Widescreen-Desktop ohne Seiten-Overflow. Ergonomischer <em>&bdquo;Nach oben&ldquo;</em>-Button mit sanfter Lichtanimation für höchsten Bedienkomfort.
          </p>
        </div>
      </div>

      <div class="highlight-box">
        <strong>🔐 Diskreter Administrations-Zugang im Website-Footer:</strong><br/>
        Ganz unten in der letzten Zeile des Fußbereichs befindet sich ein unauffälliges Schlosssymbol. Ein Klick darauf führt direkt zum Redaktions-Login des WordPress-Backends. Die bisherigen persönlichen Zugangsdaten der Ensembleleitung bleiben zu 100% unverändert gültig.
      </div>
    </div>

    <!-- FOOTER SEITE 1 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch Version V2</div>
      <div>Seite 1 von 3 · Frontend-Neuerungen &amp; Relaunch-Übersicht</div>
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
          <span class="doc-badge">ADMINISTRATION &amp; VERWALTUNG · VERSION V2</span>
          <h1 class="doc-title">Das WordPress Redaktions-Cockpit</h1>
          <p class="doc-sub">Übersicht aller 9 Kernbereiche zur eigenständigen Pflege der Website-Inhalte</p>
        </div>
        ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" alt="Ensemble Olla Podrida" />` : ''}
      </div>

      <p class="lead-text">
        Im WordPress-Backend steht der Ensembleleitung ein übersichtliches, zentrisch gestaltetes Verwaltungs-Cockpit zur Verfügung. Über die linke WordPress-Seitenleiste lassen sich alle neun Kernbereiche der Website selbsterklärend und ohne Programmierkenntnisse pflegen:
      </p>

      <h2>🧭 Die 9 Kernbereiche des Redaktionssystems im Detail</h2>
      <div class="grid-3">
        <div class="card">
          <div class="card-title">📅 Termine &amp; Konzerte</div>
          <p>
            Erfasse neue Konzerte mit Datum, Zeit, Spielort, Eintritt und Flyer. Automatische Trennung aktiver Termine von archivierten Auftritten in der Chronik.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📜 Musiker-Profile &amp; Ensemble</div>
          <p>
            Pflege die 7 Ensemblemitglieder (#ensemble): Porträtfotos, Instrumentenlisten, biografische Texte und individuelle Bühnenpositionierung für alle Geräte.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🎵 Musik-Player &amp; Sound</div>
          <p>
            Tausche das Hintergrundmusikstück bequem über die Mediathek aus. Steuere Lautstärkepegel, Titelanzeige, Autoplay und Endlos-Loop.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📰 Presse &amp; Medienmaterial</div>
          <p>
            Stelle hochauflösende Pressefotos, helle &amp; dunkle Ensemble-Logos sowie fertige Pressetexte für Zeitungen und Veranstalter zum Sofort-Download bereit.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📬 Posteingang &amp; Anfragen</div>
          <p>
            Zentraler Posteingang für alle Kontakt- und Buchungsanfragen über das Website-Formular. Mit Zähler für ungelesene Nachrichten und CSV-Export.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🛡️ Cookie-Consents &amp; Audit</div>
          <p>
            DSGVO-konforme Protokollierung aller Cookie-Einwilligungen. Statistik der letzten 30 Tage sowie CSV- und druckfähiger Audit-Export für Nachweise.
          </p>
        </div>
        <div class="card">
          <div class="card-title">📁 Google Drive Cloud-Ablage</div>
          <p>
            Direkte Verlinkung der gemeinsamen Ensemble-Cloud im Dashboard. Schneller Absprung zu Noten, Verträgen, Programmheften und Ablaufplänen.
          </p>
        </div>
        <div class="card">
          <div class="card-title">⚖️ Rechtliches &amp; Footer-Texte</div>
          <p>
            Eigenständige Pflege von Impressum, Datenschutzerklärung, Footer-Siegel und Credits – flexibel anpassbar bei personellen Änderungen.
          </p>
        </div>
        <div class="card">
          <div class="card-title">🔍 SEO &amp; Metadaten</div>
          <p>
            Passe Seitentitel und Meta-Beschreibungen an. Inklusive Live Google-Suchergebnis-Vorschau (SERP) und Social-Media Vorschaubildern (Open Graph).
          </p>
        </div>
      </div>

      <div class="highlight-box">
        <strong>💡 Einheitliche zentrische Cockpit-Orientierung:</strong><br/>
        Alle Menüpunkte und Unterseiten im WordPress-Backend sind nun einheitlich zentrisch angelegt und orientieren sich harmonisch am Dashboard-Cockpit. Die Aktionsbuttons und Badges wurden auf ein helles, klares Gold-Orange abgestimmt, sodass alle Beschriftungen auch bei dunkler Schrift exzellent lesbar sind.
      </div>

      <div class="card" style="margin-top: 6px; background: #FDFBF7;">
        <div class="card-title" style="color: #6B4E36;">👥 Rollenkonzept: Schutz vor versehentlichen Fehlkonfigurationen</div>
        <p>
          Für die Ensembleleitung wurde eine maßgeschneiderte Redaktionsrolle eingerichtet. Technische WordPress-Systemmenüs (wie Standard-Beiträge, Plugins oder Core-Einstellungen) werden ausgeblendet, sodass Sie sich voll und ganz auf die Pflege von Konzerten, Musikern und Medien konzentrieren können.
        </p>
      </div>
    </div>

    <!-- FOOTER SEITE 2 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch Version V2</div>
      <div>Seite 2 von 3 · WordPress Backend &amp; Redaktionsbereiche</div>
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
          <span class="doc-badge">PRAXISANLEITUNG &amp; RECHTLICHE HINWEISE · VERSION V2</span>
          <h1 class="doc-title">Praxisleitfaden &amp; Hinweise</h1>
          <p class="doc-sub">Schritt-für-Schritt-Anleitung zur Terminpflege, Datenschutz-Architektur &amp; Disclaimer</p>
        </div>
        ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" alt="Ensemble Olla Podrida" />` : ''}
      </div>

      <h2>🚀 Praxisleitfaden: Neues Konzert in 3 einfachen Schritten anlegen</h2>
      <div class="step-box">
        <div class="step-badge">1</div>
        <div class="step-content">
          <strong>Bereich aufrufen &amp; Formular öffnen</strong>
          <p>Klicke im linken WordPress-Menü auf <em>&bdquo;Termine &amp; Konzerte&ldquo;</em> und anschließend oben auf den goldenen Button <em>&bdquo;+ Neue Veranstaltung hinzufügen&ldquo;</em>. Ein aufgeräumtes Dialogfenster öffnet sich.</p>
        </div>
      </div>
      <div class="step-box">
        <div class="step-badge">2</div>
        <div class="step-content">
          <strong>Konzertdaten, Vorverkauf &amp; Flyer eintragen</strong>
          <p>Titel, Datum, Uhrzeit, Spielort und Eintritt/Vorverkauf eintragen. Optional ein Beitragsbild aus der WordPress-Mediathek zuweisen sowie Hinweise zu Bestuhlung, Barrierefreiheit oder Voranmeldung ergänzen.</p>
        </div>
      </div>
      <div class="step-box">
        <div class="step-badge">3</div>
        <div class="step-content">
          <strong>Speichern &amp; automatische Live-Schaltung</strong>
          <p>Auf <em>&bdquo;Veranstaltung speichern&ldquo;</em> klicken. Der Termin ist sofort für Besucher im Bereich #termine sichtbar, ordnet sich chronologisch ein und generiert automatisch das druckbare DIN-A4 PDF.</p>
        </div>
      </div>

      <h2>🛡️ Technische Datenschutz-Architektur (100% DSGVO-konform)</h2>
      <div class="grid-2">
        <div class="card">
          <div class="card-title">🔒 Keine US-Cloud-Abhängigkeiten</div>
          <p>
            Sämtliche Schriftarten (Fonts), Skripte, Icons und Audios werden lokal vom eigenen Server geladen. Es fließen zu keinem Zeitpunkt Daten an Google Fonts oder externe US-Dienstleister.
          </p>
        </div>
        <div class="card">
          <div class="card-title">⚖️ Aktuelles Digitale-Dienste-Gesetz (DDG)</div>
          <p>
            Das Impressum wurde vom veralteten Telemediengesetz (TMG) auf das aktuelle Digitale-Dienste-Gesetz (DDG) umgestellt. Pflichtangaben lassen sich jederzeit im Backend pflegen.
          </p>
        </div>
      </div>

      <h2>⚖️ Wichtiger rechtlicher Haftungsausschluss (Disclaimer)</h2>
      <div class="disclaimer-box">
        <strong>Rechtlicher Hinweis &amp; Haftungsausschluss:</strong><br/>
        Die auf der Website bereitgestellten Texte, Vorlagen (z. B. Impressum, Datenschutzerklärung, Cookie-Consent) und technischen Mechanismen wurden im Rahmen der Webentwicklung mit größter Sorgfalt nach bestem Wissen und aktuellem Stand der Technik (DSGVO, DDG) implementiert. Diese Dokumentation und die technischen Umsetzungen stellen jedoch ausdrücklich <strong>keine Rechtsberatung</strong> dar.<br/>
        Für die inhaltliche Richtigkeit, Aktualität, Vollständigkeit und rechtssichere Gültigkeit der rechtlichen Pflichtangaben, Bildrechte oder behördlichen Vorgaben wird keine Haftung oder Gewährleistung übernommen. Die letztliche Prüfung und rechtliche Verantwortung liegt bei den Betreibern und Vertretungsberechtigten des Ensemble Olla Podrida.
      </div>

      <div class="card" style="margin-top: 6px; background: #FDFBF7;">
        <div class="card-title" style="color: #6B4E36;">📞 Technische Betreuung &amp; Ansprechpartner</div>
        <p>
          <strong>Jan Dennis Brüning</strong> · Konzept, Design &amp; Webentwicklung<br/>
          E-Mail: <a href="mailto:office@janbruening.de" style="color: #8B6508; text-decoration: none; font-weight: 600;">office@janbruening.de</a> · Web: <a href="https://www.janbruening.de" target="_blank" style="color: #8B6508; text-decoration: none; font-weight: 600;">www.janbruening.de</a><br/>
          Bei Fragen zur Website-Pflege, Datensicherung oder Funktionserweiterungen stehe ich Ihnen gerne zur Seite.
        </p>
      </div>
    </div>

    <!-- FOOTER SEITE 3 -->
    <div class="footer-bar">
      <div>Ensemble Olla Podrida · Handbuch Version V2</div>
      <div>Seite 3 von 3 · Praxisanleitung, Datenschutz &amp; Support</div>
    </div>
  </div>

</body>
</html>`;

const tempHtmlPath = path.join(rootDir, 'scripts/handover-temp-v2.html');
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

const outputPdfRoot = path.join(rootDir, 'Handover_Ensemble_Olla_Podrida_V2.pdf');
const outputPdfPlugin = path.join(rootDir, 'wordpress-plugin/Handover_Ensemble_Olla_Podrida_V2.pdf');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

console.log('Generating Handover V2 PDF via Headless Chrome...');
try {
  execSync(`"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdfRoot}" "${tempHtmlPath}"`, {
    stdio: 'inherit'
  });
  
  // Copy to plugin directory as well
  fs.copyFileSync(outputPdfRoot, outputPdfPlugin);
  
  const stats = fs.statSync(outputPdfRoot);
  console.log(`✅ Handover V2 PDF successfully generated: ${outputPdfRoot} (${stats.size} bytes)`);
  console.log(`✅ Handover V2 PDF copied to: ${outputPdfPlugin}`);
  
  // Clean up temp html
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
} catch (err) {
  console.error('Error generating PDF:', err);
  process.exit(1);
}
