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
  <title>Kunden-Handover · Ensemble Olla Podrida</title>
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #241A12;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      font-size: 8.5pt;
      line-height: 1.35;
    }
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
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 2px 7px;
      border-radius: 3px;
      margin-bottom: 4px;
    }
    .doc-title {
      font-size: 17pt;
      font-weight: 800;
      color: #1A1009;
      margin: 0 0 2px 0;
      letter-spacing: -0.3px;
    }
    .doc-sub {
      font-size: 9pt;
      color: #6B4E36;
      margin: 0;
      font-weight: 500;
    }
    .header-logo {
      max-height: 58px;
      max-width: 120px;
      object-contain: contain;
      margin-left: 15px;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      background: #F8F4EC;
      border: 1px solid #E5D9C3;
      border-radius: 5px;
      padding: 6px 12px;
      margin-bottom: 10px;
      font-size: 8pt;
    }
    .meta-item strong {
      color: #4A3320;
    }
    h2 {
      font-size: 10.5pt;
      color: #382414;
      border-left: 3px solid #8B6508;
      padding-left: 7px;
      margin: 10px 0 6px 0;
      letter-spacing: 0.1px;
      page-break-after: avoid;
    }
    p {
      margin: 0 0 5px 0;
      color: #33271D;
    }
    .grid-2 {
      display: flex;
      gap: 10px;
      margin-bottom: 8px;
    }
    .grid-3 {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .card {
      flex: 1;
      background: #FAFAF7;
      border: 1px solid #E3D9C8;
      border-radius: 5px;
      padding: 7px 10px;
      page-break-inside: avoid;
    }
    .card-title {
      font-size: 8.5pt;
      font-weight: 700;
      color: #8B6508;
      margin: 0 0 3px 0;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .card p, .card ul {
      margin: 0;
      font-size: 8pt;
      color: #3D2D20;
      line-height: 1.3;
    }
    ul {
      margin: 3px 0 4px 14px;
      padding: 0;
    }
    li {
      margin-bottom: 2px;
    }
    .feature-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      margin-bottom: 8px;
      font-size: 7.8pt;
      page-break-inside: avoid;
    }
    .feature-table th {
      background: #8B6508;
      color: #FFFFFF;
      text-align: left;
      padding: 4px 6px;
      font-weight: 600;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .feature-table td {
      border-bottom: 1px solid #E8DFCF;
      padding: 3.5px 6px;
      vertical-align: top;
      color: #2D2016;
      line-height: 1.25;
    }
    .feature-table tr:nth-child(even) td {
      background: #FBF9F5;
    }
    .badge {
      display: inline-block;
      background: #EDE4D3;
      color: #5C4124;
      font-size: 7pt;
      font-weight: 600;
      padding: 1px 5px;
      border-radius: 3px;
      border: 1px solid #DACAB0;
    }
    .highlight-box {
      background: #FDF9F0;
      border-left: 3px solid #DAA520;
      padding: 6px 10px;
      margin: 6px 0;
      border-radius: 0 4px 4px 0;
      font-size: 7.8pt;
      line-height: 1.35;
      color: #4A3522;
      page-break-inside: avoid;
    }
    .page-break {
      page-break-before: always;
      padding-top: 4px;
    }
    .footer-bar {
      border-top: 1px solid #D9CBBA;
      margin-top: 10px;
      padding-top: 5px;
      display: flex;
      justify-content: space-between;
      font-size: 7.2pt;
      color: #7D6B5A;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header-banner">
    <div class="header-title-box">
      <div class="doc-badge">Kunden-Dokumentation &amp; Handover</div>
      <h1 class="doc-title">Ensemble Olla Podrida</h1>
      <p class="doc-sub">Klangvielfalt aus Mittelalter &amp; Renaissance · Neue Website &amp; Redaktionssystem (v1.4.1)</p>
    </div>
    ${logoBase64 ? `<img src="${logoBase64}" class="header-logo" alt="Olla Podrida" />` : ''}
  </div>

  <!-- META BAR -->
  <div class="meta-bar">
    <div class="meta-item"><strong>Auftraggeber:</strong> Ensemble Olla Podrida · Susanne Hoffmann</div>
    <div class="meta-item"><strong>Konzept &amp; Entwicklung:</strong> Jan Dennis Brüning</div>
    <div class="meta-item"><strong>Version:</strong> v1.4.1 (Oktober 2026)</div>
    <div class="meta-item"><strong>Web:</strong> www.olla-podrida.de</div>
  </div>

  <!-- 1. PROJEKTÜBERBLICK -->
  <h2>1. Projektübersicht &amp; Architektur</h2>
  <p>
    Für das <strong>Ensemble Olla Podrida</strong> wurde ein maßgeschneiderter, theatralischer Webauftritt realisiert, der das historische Flair von Mittelalter und Renaissance mit moderner Webtechnologie vereint. Die Lösung ist als eigenständiges, autarkes WordPress-Plugin (<strong>„Ensemble Olla Podrida“</strong>) aufgebaut – ohne Abhängigkeit von schweren, fehleranfälligen Drittanbieter-Pagebuildern.
  </p>
  <div class="grid-3">
    <div class="card">
      <div class="card-title">🎭 Theatralisches Design</div>
      <p>Historische Steinbogen-Halle, Fackelschein, Pergament-Schleifen und animierte Bühnensilhouetten mit lebendigem Charakter.</p>
    </div>
    <div class="card">
      <div class="card-title">📱 100% Responsive</div>
      <p>Perfekt optimiert für Smartphone, Tablet und Desktop mit touch-optimierter Bedienung und flüssigen Animationen.</p>
    </div>
    <div class="card">
      <div class="card-title">⚡ High Performance &amp; DSGVO</div>
      <p>Lokal gehostete Schriften, WebP-Kompression, ohne Third-Party-Tracker und mit transparentem Cookie-Manager.</p>
    </div>
  </div>

  <!-- 2. FRONTEND UMFANG -->
  <h2>2. Übersicht der Funktionen im Frontend (Besucheransicht)</h2>
  <table class="feature-table">
    <thead>
      <tr>
        <th style="width: 28%;">Bereich / Funktion</th>
        <th style="width: 54%;">Beschreibung &amp; Mehrwert</th>
        <th style="width: 18%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Theatralische Hero-Bühne</strong></td>
        <td>Atmosphärische Begrüßung mit 7 Ensemble-Figuren, die in harmonischem Schwung aufsteigen. Dynamische Fackel-Glows und Bodennebel.</td>
        <td><span class="badge">Vollständig</span></td>
      </tr>
      <tr>
        <td><strong>Pergament-Präsentation</strong></td>
        <td>Schleifenbanner <em>Klangvielfalt</em> mit 7 Porträts (Simone, Klemens, Silke, Sandra, Lutz, Susanne, Ruth) inkl. Namens-Tooltips auf Klick/Touch.</td>
        <td><span class="badge">Vollständig</span></td>
      </tr>
      <tr>
        <td><strong>Aktuelle Termine (Kalender)</strong></td>
        <td>Konzertkarten mit Datums-, Uhrzeit- und Ortsangaben, Kategorie-Badges, Detail-Akkordeon und direkter Kontakt/Anmelde-Integration.</td>
        <td><span class="badge">Vollständig</span></td>
      </tr>
      <tr>
        <td><strong>PDF-Export &amp; Druckfunktion</strong></td>
        <td>Jeder Termin kann per Knopfdruck als druckfertige DIN-A4-Veranstaltungsseite mit Ensemble-Emblem ausgedruckt oder als PDF gespeichert werden.</td>
        <td><span class="badge">Vollständig</span></td>
      </tr>
      <tr>
        <td><strong>Konzertchronik (Archiv)</strong></td>
        <td>Vollständige Historie vergangener Konzerte in einem edlen Pergament-Modal mit Such- und Jahressortierung.</td>
        <td><span class="badge">Vollständig</span></td>
      </tr>
      <tr>
        <td><strong>Pressebereich (EPK)</strong></td>
        <td>Download-Center für Medien &amp; Veranstalter: Pressemitteilung, Pressetext, Web- &amp; Print-Logos sowie hochauflösende Pressefotos.</td>
        <td><span class="badge">Vollständig</span></td>
      </tr>
      <tr>
        <td><strong>DSGVO-Kontaktformular</strong></td>
        <td>Rechtssicheres Anfrageformular mit Pflichtangaben-Prüfung, Datenschutzeinwilligung, Erfolgsbenachrichtigung und E-Mail-Weiterleitung.</td>
        <td><span class="badge">Vollständig</span></td>
      </tr>
      <tr>
        <td><strong>Musik-Player (*Riu, Riu, Chiu*)</strong></td>
        <td>Authentisches spanisches Renaissance-Villancico als dezente musikalische Untermalung mit bequemer Stummschalt-Funktion.</td>
        <td><span class="badge">Vollständig</span></td>
      </tr>
      <tr>
        <td><strong>Rechtliches (Impressum &amp; DSGVO)</strong></td>
        <td>Vollständiges Impressum (§ 5 DDG), Datenschutzerklärung (DSGVO) und Cookie-Banner ohne manipulatives Dark Pattern.</td>
        <td><span class="badge">Vollständig</span></td>
      </tr>
    </tbody>
  </table>

  <!-- PAGE BREAK -->
  <div class="page-break"></div>

  <!-- 3. BACKEND & VERWALTUNG FÜR DIE ENSEMBLE-LEITUNG -->
  <h2>3. Was steht der Ensemble-Leitung zur Verfügung? (WordPress-Backend)</h2>
  <p>
    Im WordPress-Administrationsbereich steht der Ensembleleitung unter dem Menüpunkt <strong>„Olla Podrida“</strong> ein klares, intuitives Dashboard zur Verfügung. Alle Inhalte können eigenständig ohne HTML- oder Programmierkenntnisse gepflegt werden:
  </p>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">📅 Konzert- &amp; Terminverwaltung</div>
      <ul>
        <li><strong>Termin anlegen:</strong> Titel, Datum, Uhrzeit, Spielort, Kategorie und Beschreibung eintragen.</li>
        <li><strong>Zusatzangaben:</strong> Eintritt, Vorverkauf, Bestuhlung und optionale Anmeldekontaktdaten festlegen.</li>
        <li><strong>Automatisches Archiv:</strong> Vergangene Termine wandern auf Wunsch automatisch in die Konzertchronik.</li>
        <li><strong>Sofort-Rückmeldung:</strong> Bestätigungs-Infobox bei jedem Speichern.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title">👥 Musiker-Profile</div>
      <ul>
        <li><strong>7 Musiker verwalten:</strong> Susanne, Simone, Klemens, Silke, Sandra, Lutz und Ruth.</li>
        <li><strong>Instrumente &amp; Rollen:</strong> Gespielte Instrumente und Gesangsstimmen flexibel anpassen.</li>
        <li><strong>Porträts &amp; Fotos:</strong> Fotos für die Pergamentansicht und die Hero-Bühne austauschen.</li>
        <li><strong>Bühnensichtbarkeit:</strong> Musiker nach Bedarf auf der Startbühne ein- oder ausblenden.</li>
      </ul>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">📬 Posteingang (Kontaktanfragen)</div>
      <ul>
        <li><strong>Zentraler Nachrichtenspeicher:</strong> Sämtliche Website-Anfragen werden sicher in der WordPress-Datenbank archiviert.</li>
        <li><strong>Kein Datenverlust:</strong> Selbst falls eine Benachrichtigungs-Mail im Spamfilter landen sollte, ist jede Nachricht im Dashboard abrufbar.</li>
        <li><strong>Veranstalter-Anfragen:</strong> Schnelle Einsicht in Datum, Absender, Telefon und Nachrichteninhalt.</li>
      </ul>
    </div>
    <div class="card">
      <div class="card-title">⚙️ Texte, Presse &amp; Musik</div>
      <ul>
        <li><strong>Slogans &amp; Texte:</strong> Begrüßungstexte und Ensemble-Vorstellung jederzeit editierbar.</li>
        <li><strong>Pressematerialien:</strong> Neue Pressefotos und Infodateien für Journalisten per Upload hinterlegen.</li>
        <li><strong>Musiksteuerung:</strong> Hintergrundmusik aktivieren/deaktivieren, Audiodatei austauschen oder Lautstärke justieren.</li>
      </ul>
    </div>
  </div>

  <!-- 4. SICHERHEIT & DATENSCHUTZ -->
  <h2>4. Technische Sicherheit &amp; Datenschutz-Compliance</h2>
  <div class="highlight-box">
    <strong>Rechtssicherheit nach deutschem &amp; europäischem Standard:</strong><br>
    • <strong>Google Fonts 100% lokal gehostet:</strong> Keine Datenübertragung an Google-Server in den USA.<br>
    • <strong>Keine Cookies von Werbenetzwerken:</strong> Ausschließlich technisch essenzielle Speicherungen (Audio-Status, Cookie-Einwilligung).<br>
    • <strong>Transparenter Cookie-Banner:</strong> Gleiche Farbgebung für „Alles klar, verstanden“ und „Nur essentielle Cookies“ (keine Dark Patterns).<br>
    • <strong>DDG &amp; DSGVO konform:</strong> Erfüllt alle Vorgaben des neuen Digitale-Dienste-Gesetzes (DDG) und der Datenschutz-Grundverordnung.
  </div>

  <!-- 5. SCHRITT-FÜR-SCHRITT ANLEITUNG ZUR TERMINPFLEGE -->
  <h2>5. Schnellanleitung: Neuen Termin in 3 Schritten eintragen</h2>
  <table class="feature-table">
    <thead>
      <tr>
        <th style="width: 15%;">Schritt</th>
        <th style="width: 35%;">Aktion im WordPress-Menü</th>
        <th style="width: 50%;">Ergebnis</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Schritt 1</strong></td>
        <td>Im WordPress-Menü links auf <strong>Olla Podrida &rarr; Termine</strong> klicken.</td>
        <td>Die Terminübersicht mit allen aktuellen und vergangenen Konzerten öffnet sich.</td>
      </tr>
      <tr>
        <td><strong>Schritt 2</strong></td>
        <td>Auf <strong>„Neuen Termin anlegen“</strong> klicken und Datum, Ort, Uhrzeit sowie Text ausfüllen.</td>
        <td>Optional: Ein schönes Konzert- oder Kirchenfoto als Beitragsbild zuweisen.</td>
      </tr>
      <tr>
        <td><strong>Schritt 3</strong></td>
        <td>Auf <strong>„Veranstaltung speichern“</strong> klicken.</td>
        <td>Erfolgsmeldung erscheint. Der Termin ist sofort auf der Website sichtbar und druckbar!</td>
      </tr>
    </tbody>
  </table>

  <!-- 6. ANSPRECHPARTNER -->
  <h2>6. Ansprechpartner &amp; Support</h2>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">🎵 Ensemble-Leitung</div>
      <p>
        <strong>Susanne Hoffmann</strong><br>
        Ensemble Olla Podrida<br>
        Im Ort 4, 49356 Diepholz<br>
        Tel.: +49 174 186 3418<br>
        E-Mail: info@olla-podrida.de
      </p>
    </div>
    <div class="card">
      <div class="card-title">💻 Konzept, Design &amp; Webentwicklung</div>
      <p>
        <strong>Jan Dennis Brüning</strong><br>
        Web- &amp; Systementwicklung<br>
        E-Mail: office.janbruening@gmail.com<br>
        Web: www.janbruening.de<br>
        Repository: github.com/JanDennisBruening/olla-podrida-v1
      </p>
    </div>
  </div>

  <div class="footer-bar">
    <div>Ensemble Olla Podrida · Handover-Dokumentation v1.4.1</div>
    <div>Erstellt im Oktober 2026 · Jan Dennis Brüning</div>
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
