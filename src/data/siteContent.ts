/**
 * Site content data structure with local asset paths and
 * dynamic WordPress data bridge (window.OLLA_PODRIDA_DATA).
 */

export interface EnsembleMember {
  id: string;
  name: string;
  role: string;
  instruments: string[];
  bio: string;
  tooltip: string;
  stageImage: string;
  portraitImage: string;
  stagePosition: {
    desktop: { left: string; top: string; width: string; zIndex: number };
    mobile: { left: string; top: string; width: string; zIndex: number };
  };
  showHero?: boolean;
  showEnsemble?: boolean;
  showPress?: boolean;
  offsetX?: number;
  offsetY?: number;
  offsetXDesktop?: number;
  offsetYDesktop?: number;
  offsetXTablet?: number;
  offsetYTablet?: number;
  offsetXMobile?: number;
  offsetYMobile?: number;
}

export interface ConcertEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  city: string;
  description: string;
  link?: string;
  imageUrl: string;
  isUpcoming: boolean;
  ticketInfo?: string;
  contactRegistration?: string;
  badgeMusic?: string;
  badgeMusicShow?: boolean;
  badgeSeating?: string;
  badgeSeatingShow?: boolean;
  badgeAdmission?: string;
  badgeAdmissionShow?: boolean;
}

export interface AudioConfig {
  enabled: boolean;
  src: string;
  title: string;
  subtitle: string;
  autoplay: boolean;
  loop?: boolean;
  volume: number;
  buttonText: string;
}

export interface HeroConfig {
  slogan: string;
  subtitle: string;
  bgDesktop: string;
  bgMobile: string;
  smokeEnabled: boolean;
  smokeOpacity: number;
}

export interface EnsembleConfig {
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  logo: string;
}

export interface ContactConfig {
  recipientEmail: string;
  subject: string;
  portrait: string;
  title: string;
  introParagraph1: string;
  introParagraph2: string;
  emailDisplay: string;
  consentText: string;
  successMessage: string;
  errorMessage: string;
  restUrl?: string;
  nonce?: string;
}

export interface LegalConfig {
  sealImage: string;
  copyrightText: string;
  impressumHtml: string;
  datenschutzHtml: string;
  cookieBannerText: string;
  cookieAcceptText: string;
  cookieDeclineText: string;
}

export interface PressItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'logo' | 'photo' | 'document';
  imageUrl: string;
  downloadUrl?: string;
  format?: string;
  fileSize?: string;
  credit?: string;
}

export interface PressConfig {
  title: string;
  subtitle: string;
  introText: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  pressNote: string;
  logos: PressItem[];
  photos: PressItem[];
}

export interface SiteTextsConfig {
  navStart?: string;
  navEnsemble?: string;
  navTermine?: string;
  navKontakt?: string;
  navPresse?: string;
  termineTitle?: string;
  termineEmpty?: string;
  termineEmptySub?: string;
  scrollTop?: string;
  footerDev?: string;
}

export const DEFAULT_SITE_TEXTS: SiteTextsConfig = {
  navStart: 'Start',
  navEnsemble: 'Ensemble',
  navTermine: 'Termine',
  navKontakt: 'Kontakt',
  navPresse: 'Presse',
  termineTitle: 'Aktuelle Termine',
  termineEmpty: 'Zurzeit sind keine weiteren Konzerttermine in Planung.',
  termineEmptySub: 'Schauen Sie bald wieder vorbei oder stöbern Sie in unserer Konzertchronik!',
  scrollTop: 'Nach oben',
  footerDev: 'Design, Konzept und Webentwicklung · www.janbruening.de',
};

// Global WordPress bridge data
declare global {
  interface Window {
    OLLA_PODRIDA_DATA?: {
      pluginUrl?: string;
      assetsUrl?: string;
      imagesUrl?: string;
      hero?: Partial<HeroConfig>;
      ensemble?: Partial<EnsembleConfig>;
      musicians?: EnsembleMember[];
      events?: ConcertEvent[];
      contact?: Partial<ContactConfig>;
      audio?: Partial<AudioConfig>;
      legal?: Partial<LegalConfig>;
      press?: Partial<PressConfig>;
      texts?: Partial<SiteTextsConfig>;
      restUrl?: string;
      nonce?: string;
    };
  }
}

// Helper to access WordPress injected settings safely
const getWPData = () => {
  if (typeof window !== 'undefined' && window.OLLA_PODRIDA_DATA) {
    return window.OLLA_PODRIDA_DATA;
  }
  return null;
};

/**
 * Robust asset resolver that ensures local bundled plugin assets
 * are correctly prefixed with WordPress plugin URL when running in WP.
 */
export const resolveAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const wp = getWPData();
  const baseUrl = wp?.assetsUrl || '/';
  const imagesUrl = wp?.imagesUrl || (baseUrl.endsWith('/') ? baseUrl + 'images/' : baseUrl + '/images/');

  if (path.startsWith('/images/')) {
    return imagesUrl + path.substring(8);
  }
  if (path.startsWith('images/')) {
    return imagesUrl + path.substring(7);
  }
  if (path.startsWith('/')) {
    return (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') + path.substring(1);
  }
  return (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') + path;
};

// 100% Local Default Assets (Zero external Google or CDN requests)
export const DEFAULT_ASSETS = {
  logo: '/images/logo-pot.png',
  navLogo: '/images/2024_07_15_Logo_Olla-Podrida_V1_1.png',
  logoBackground: '/images/Logo-Background.png',
  menuBackgroundDesktop: '/images/Menu-Background-2048x238.png',
  menuBackgroundMobile: '/images/Menu-Background-768x89.png',
  heroBackgroundDesktop: '/images/Hintergrund-Header-2-2-scaled.webp',
  heroBackgroundMobile: '/images/Hintergrund-Header_mobile.webp',
  smokeBottom: '/images/Rauch5-1.png',
  smokeAlt: '/images/Rauch-neu.webp',
  footerSeal: '/images/3_Zeichenflaeche-1-Kopie-10-1024x1024.png',
  ornamentBanner: '/images/2024_07_22_Elemente_Olla-Podrida_Zeichenflaeche-1-1024x611.png',
  ribbonPaper: '/SchleifePapier.webp',
  favicon: '/images/Favicon2-2.png'
};

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  slogan: 'Ensemble Olla Podrida',
  subtitle: 'Klangvielfalt aus Mittelalter und Renaissance',
  bgDesktop: '/images/Hintergrund-Header-2-2-scaled.webp',
  bgMobile: '/images/Hintergrund-Header_mobile.webp',
  smokeEnabled: true,
  smokeOpacity: 0.20
};

export const DEFAULT_ENSEMBLE_CONFIG: EnsembleConfig = {
  title: 'Ensemble Olla Podrida',
  paragraph1: 'Eigentlich bezeichnet es ein typisches Gericht der kastilischen Küche und war ursprünglich ein Eintopf. Der Name des Gerichts stammt in Wirklichkeit von dem mittelalterlichen spanischen Ausdruck „olla poderida“ („mächtiger Topf“). Die Franzosen haben den Begriff wörtlich übersetzt mit Potpourri, was in dem Sinne einem musikalischen Cocktail nahekommt. Zum einen symbolisiert der Name unsere musikalische Vielfalt, zum anderen genießen wir den schmackhaften Eintopf bei unseren alljährlichen gemeinsamen Festessen.',
  paragraph2: 'Die Klangvielfalt aus Mittelalter und Renaissance – so sehen wir uns und genauso lebendig wie damals, so erleben wir uns! Voller Kraft mit Krummhörnern, Sackpfeifen und Trommeln, aber auch verspielt und anrührend mit Harfe, Laute und Psalter. Rein instrumental oder mit mehrstimmigem Gesang vorgetragen – wir erwecken diese Musik mit Freude und Hingabe zu neuem Leben.',
  paragraph3: 'In seiner jetzigen Besetzung besteht das Ensemble seit 2017 und ist aus der Musikgruppe „Mercks wol!“ hervorgegangen. Wir konzertieren an historischen Stätten, in Kirchen und Museen, manchmal auch auf Märkten, und verleihen Lesungen und Vorträgen den musikalischen Rahmen. Die Berufsmusik ist uns eine Fremde, und so ist es jedes einzelne Mal ein besonderes Ereignis, wenn wir alle zusammenkommen, aus allen Himmelsrichtungen, und die alten Klänge der Vergangenheit in der Gegenwart erklingen lassen.',
  logo: '/images/logo-pot.png'
};

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  enabled: true,
  src: '/Riu-riu-chiu-live-in-Atter.mp3',
  title: 'Riu Riu Chiu',
  subtitle: 'Live in Atter (Spanisches Renaissance-Villancico)',
  autoplay: true,
  loop: false,
  volume: 0.5,
  buttonText: '• Musik an / aus • Musik an / aus'
};

export const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  recipientEmail: 'info@olla-podrida.de',
  subject: 'Neue Kontaktanfrage über Olla-Podrida.de',
  portrait: '/images/susanne.webp',
  title: 'Kontakt & Anfragen',
  introParagraph1: 'Wir freuen uns auf Ihre Nachrichten und Anfragen. Ob Lob, Kritik oder einfach nur ein Gruß – Ihre Worte sind uns wichtig.',
  introParagraph2: 'Kontaktieren Sie uns über unser Formular oder per E-Mail:',
  emailDisplay: 'info(at)olla-podrida.de',
  consentText: 'Ich habe die Datenschutzerklärung zur Kenntnis genommen. Ich stimme zu, dass meine Angaben und Daten zur Beantwortung meiner Anfrage elektronisch erhoben und gespeichert werden.',
  successMessage: 'Vielen Dank für Ihre Nachricht. Sie wurde erfolgreich versendet.',
  errorMessage: 'Bitte füllen Sie alle erforderlichen Felder aus und stimmen Sie den Datenschutzrichtlinien zu.'
};

export const DEFAULT_LEGAL_CONFIG: LegalConfig = {
  sealImage: '/images/3_Zeichenflaeche-1-Kopie-10-1024x1024.png',
  copyrightText: '© ' + new Date().getFullYear() + ' Ensemble Olla Podrida',
  impressumHtml: `<div class="olla-legal-badge">
  Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
</div>

<div>
  <h3 class="font-macondo text-2xl text-[#F5F5DC] mb-2">Verantwortlich für den Inhalt</h3>
  <div class="p-4 rounded-xl bg-[#090503] border border-[#DAA520]/20 space-y-1">
    <p class="font-semibold text-[#F5F5DC]">Ensemble Olla Podrida</p>
    <p>Susanne Hoffmann (Ensembleleitung)</p>
    <p>Im Ort 4, 49356 Diepholz</p>
    <p>Tel.: +49 174 186 3418</p>
    <p>E-Mail: <a href="mailto:info@olla-podrida.de" class="text-[#DAA520] hover:underline">info(at)olla-podrida.de</a></p>
    <p>Web: <a href="https://www.olla-podrida.de" target="_blank" rel="noopener noreferrer" class="text-[#DAA520] hover:underline">www.olla-podrida.de</a></p>
  </div>
</div>

<div class="p-5 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 space-y-2">
  <h3 class="font-macondo text-2xl text-[#DAA520]">Design, Konzept &amp; Webentwicklung</h3>
  <p class="text-xs sm:text-sm text-[#F5F5DC]">Gestaltung und Realisierung:</p>
  <p class="font-medium text-[#F5F5DC]">Jan Dennis Brüning</p>
  <div class="flex flex-wrap gap-4 pt-1">
    <a href="https://www.janbruening.de" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-[#DAA520] hover:underline text-xs">
      <span>www.janbruening.de</span>
    </a>
  </div>
  <p class="text-xs text-[#D1C7AC]/70">© Jan Dennis Brüning</p>
</div>

<div>
  <h3 class="font-macondo text-2xl text-[#F5F5DC] mb-2">Bildnachweise &amp; Schriften</h3>
  <ul class="list-disc list-inside space-y-1.5 text-xs sm:text-sm">
    <li><strong class="text-[#F5F5DC]">Fotografie:</strong> © Jan Dennis Brüning</li>
    <li><strong class="text-[#F5F5DC]">Schriften (Webfonts):</strong> Macondo Swash Caps, Dosis, Roboto Slab – 100% lokal gehostet ohne Verbindung zu externen Servern (Google Fonts datenschutzkonform lokal eingebunden).</li>
    <li><strong class="text-[#F5F5DC]">Stockmedia &amp; Grafik:</strong> Licensed by Jan Dennis Brüning 2024 @ freepik.com (Premium Lizenz)</li>
  </ul>
</div>

<div>
  <h3 class="font-macondo text-xl text-[#F5F5DC] mb-1">Haftung für Inhalte</h3>
  <p class="text-xs sm:text-sm text-justify">Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
</div>

<div>
  <h3 class="font-macondo text-xl text-[#F5F5DC] mb-1">Haftung für Links</h3>
  <p class="text-xs sm:text-sm text-justify">Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
</div>

<div>
  <h3 class="font-macondo text-xl text-[#F5F5DC] mb-1">Urheberrecht</h3>
  <p class="text-xs sm:text-sm text-justify">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
</div>`,
  datenschutzHtml: `<div class="olla-legal-badge">
  Datenschutzerklärung nach der EU-Datenschutz-Grundverordnung (DSGVO) und dem Digitale-Dienste-Gesetz (DDG)
</div>

<div>
  <h3 class="font-macondo text-2xl text-[#F5F5DC] mb-2">1. Verantwortliche Stelle</h3>
  <div class="p-4 rounded-xl bg-[#090503] border border-[#DAA520]/20 space-y-1">
    <p class="font-semibold text-[#F5F5DC]">Ensemble Olla Podrida</p>
    <p>Susanne Hoffmann (Ensembleleitung)</p>
    <p>Im Ort 4, 49356 Diepholz</p>
    <p>Tel.: +49 174 186 3418</p>
    <p>E-Mail: <a href="mailto:info@olla-podrida.de" class="text-[#DAA520] hover:underline">info(at)olla-podrida.de</a></p>
    <p>Web: <a href="https://www.olla-podrida.de" target="_blank" rel="noopener noreferrer" class="text-[#DAA520] hover:underline">www.olla-podrida.de</a></p>
  </div>
</div>

<div>
  <h3 class="font-macondo text-xl text-[#F5F5DC] mb-1">2. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck von deren Verwendung</h3>
  <h4 class="font-semibold text-[#DAA520] text-sm mt-3 mb-1">a) Beim Aufruf der Website (Server-Logfiles)</h4>
  <p class="text-xs sm:text-sm text-justify">Beim Aufrufen unserer Website www.olla-podrida.de werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in den Server-Logfiles gespeichert:</p>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm my-2 text-[#D1C7AC]/90">
    <li>IP-Adresse des anfragenden Rechners</li>
    <li>Datum und Uhrzeit des Zugriffs</li>
    <li>Name und URL der abgerufenen Datei</li>
    <li>Übertragene Datenmenge und Zugriffsstatus (HTTP-Statuscode)</li>
    <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
    <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
  </ul>
  <p class="text-xs sm:text-sm text-justify">Die genannten Daten werden zur Gewährleistung eines reibungslosen Verbindungsaufbaus der Website, einer komfortablen Nutzung unserer Website sowie zur Auswertung der Systemsicherheit und -stabilität verarbeitet. Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Unser berechtigtes Interesse folgt aus den oben aufgelisteten Zwecken zur Datenerhebung.</p>

  <h4 class="font-semibold text-[#DAA520] text-sm mt-3 mb-1">b) Bei Nutzung unseres Kontaktformulars</h4>
  <p class="text-xs sm:text-sm text-justify">Bei Fragen jeglicher Art bieten wir Ihnen die Möglichkeit, mit uns über ein auf der Website bereitgestelltes Formular Kontakt aufzunehmen. Dabei ist die Angabe einer gültigen E-Mail-Adresse und Ihres Namens erforderlich, damit wir wissen, von wem die Anfrage stammt und um diese beantworten zu können. Die Datenverarbeitung zum Zwecke der Kontaktaufnahme mit uns erfolgt nach Art. 6 Abs. 1 S. 1 lit. a DSGVO auf Grundlage Ihrer freiwillig erteilten Einwilligung bzw. nach Art. 6 Abs. 1 lit. b DSGVO bei vorvertraglichen Anfragen (z. B. Konzertbuchungen).</p>

  <h4 class="font-semibold text-[#DAA520] text-sm mt-3 mb-1">c) Kontaktaufnahme per E-Mail oder Telefon</h4>
  <p class="text-xs sm:text-sm text-justify">Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Kontaktdaten, Inhalt) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
</div>

<div>
  <h3 class="font-macondo text-xl text-[#F5F5DC] mb-1">3. Weitergabe von Daten</h3>
  <p class="text-xs sm:text-sm text-justify">Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:</p>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-sm my-2 text-[#D1C7AC]/90">
    <li>Sie Ihre nach Art. 6 Abs. 1 S. 1 lit. a DSGVO ausdrückliche Einwilligung dazu erteilt haben,</li>
    <li>die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist,</li>
    <li>für den Fall, dass für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht.</li>
  </ul>
</div>

<div>
  <h3 class="font-macondo text-xl text-[#F5F5DC] mb-1">4. Hosting durch die IONOS SE &amp; Auftragsverarbeitung (AVV)</h3>
  <p class="text-xs sm:text-sm text-justify mb-2">Wir hosten unsere Website bei der <strong>IONOS SE</strong>. Anbieter ist:</p>
  <div class="p-4 rounded-xl bg-[#090503] border border-[#DAA520]/20 text-xs sm:text-sm space-y-1 mb-3">
    <p class="font-semibold text-[#F5F5DC]">IONOS SE</p>
    <p>Elgendorfer Str. 57, 56410 Montabaur, Deutschland</p>
    <p class="pt-1">Datenschutzerklärung von IONOS: <a href="https://www.ionos.de/terms-gtc/terms-privacy/" target="_blank" rel="noopener noreferrer" class="text-[#DAA520] hover:underline">https://www.ionos.de/terms-gtc/terms-privacy/</a></p>
  </div>
  <div class="space-y-2 text-xs sm:text-sm text-justify">
    <p><strong class="text-[#F5F5DC]">Vertrag über Auftragsverarbeitung (AVV):</strong> Wir haben mit der IONOS SE einen Vertrag zur Auftragsverarbeitung (AVV) gemäß Art. 28 DSGVO abgeschlossen. Hierbei handelt es sich um einen gesetzlich vorgeschriebenen Vertrag, der sicherstellt, dass IONOS die personenbezogenen Daten unserer Webseitenbesucher ausschließlich nach unseren Weisungen, zweckgebunden und unter strenger Einhaltung der Datenschutz-Grundverordnung verarbeitet.</p>
    <p><strong class="text-[#F5F5DC]">Rechtsgrundlage:</strong> Der Einsatz von IONOS erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen, schnellen und sicheren Bereitstellung unseres Internetauftritts.</p>
  </div>
</div>

<div>
  <h3 class="font-macondo text-xl text-[#F5F5DC] mb-1">5. Lokale Einbindung von Schriftarten und Medien (Keine Drittanbieter-CDNs)</h3>
  <p class="text-xs sm:text-sm text-justify">Diese Website bindet alle Schriftarten (Fonts wie Macondo Swash Caps, Dosis, Roboto Slab) sowie sämtliche Medien (Bilder, Audiodateien, Grafiken) zu 100% lokal über den eigenen Webserver ein. Es findet zu keinem Zeitpunkt eine Übertragung Ihrer IP-Adresse oder sonstiger Daten an externe Server oder Content Delivery Networks (CDNs) von Drittanbietern (wie beispielsweise Google Fonts oder Google-Server) statt.</p>
</div>

<div>
  <h3 class="font-macondo text-xl text-[#F5F5DC] mb-1">6. Cookies und lokale Speicherung</h3>
  <p class="text-xs sm:text-sm text-justify">Unsere Website verzichtet vollständig auf Tracking-, Marketing- und Werbe-Cookies. Wir setzen ausschließlich technisch erforderliche Speicherfunktionen (z. B. den lokalen Browserspeicher „LocalStorage“) ein, um Ihre persönlichen Komfort-Einstellungen wie die Stummschaltung oder Lautstärke unseres Musikplayers zu speichern. Diese Daten verbleiben auf Ihrem Gerät und werden nicht an uns oder Dritte übertragen. Nähere Details finden Sie im Reiter „Cookie &amp; Consent“.</p>
</div>

<div>
  <h3 class="font-macondo text-xl text-[#F5F5DC] mb-1">7. Ihre Rechte als betroffene Person</h3>
  <p class="text-xs sm:text-sm text-justify mb-2">Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen der DSGVO jederzeit folgende Rechte:</p>
  <ul class="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#D1C7AC]/90">
    <li><strong class="text-[#F5F5DC]">Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.</li>
    <li><strong class="text-[#F5F5DC]">Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten Daten verlangen.</li>
    <li><strong class="text-[#F5F5DC]">Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer bei uns gespeicherten Daten verlangen („Recht auf Vergessenwerden“).</li>
    <li><strong class="text-[#F5F5DC]">Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung Ihrer Daten verlangen.</li>
    <li><strong class="text-[#F5F5DC]">Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können verlangen, Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</li>
    <li><strong class="text-[#F5F5DC]">Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können jederzeit Widerspruch gegen die künftige Verarbeitung Ihrer Daten einlegen.</li>
    <li><strong class="text-[#F5F5DC]">Beschwerderecht (Art. 77 DSGVO):</strong> Sie haben das Recht, sich bei einer zuständigen Aufsichtsbehörde für den Datenschutz zu beschweren.</li>
  </ul>
</div>`,
  cookieBannerText: 'Wir nutzen Cookies und lokale Speicherung ausschließlich für essenzielle Funktionen (wie das Merken von Audioeinstellungen). Es werden keine Tracking- oder Werbe-Cookies verwendet.',
  cookieAcceptText: 'Einverstanden',
  cookieDeclineText: 'Nur Notwendige'
};

export const DEFAULT_PRESS_CONFIG: PressConfig = {
  title: 'Presse & Medienmaterial',
  subtitle: 'Offizielle Pressematerialien, Logos und Bilddateien des Ensemble Olla Podrida',
  introText: 'Das Ensemble Olla Podrida steht für lebendige Klangwelten aus Mittelalter und Renaissance. Mit historischen Instrumenten wie Krummhörnern, Renaissanceblockflöten, Sackpfeifen, Harfe, Laute und Landsknechtstrommeln erweckt die Musikgruppe historische Musik an Schlössern, Kirchen, Museen und Festen zu neuem Leben.',
  contactName: 'Susanne Hoffmann (Ensembleleitung)',
  contactEmail: 'info@olla-podrida.de',
  contactPhone: '',
  pressNote: 'Die hier bereitgestellten Pressefotos und Grafiken dürfen im Rahmen redaktioneller Berichterstattung über das Ensemble Olla Podrida sowie zur Ankündigung von Veranstaltungen unter Nennung der Quelle honorarfrei verwendet werden.',
  logos: [
    {
      id: 'logo-light',
      title: 'Ensemble Logo Olla Podrida',
      subtitle: 'Offizielles Emblem für helle Hintergründe',
      category: 'logo',
      imageUrl: '/images/2024_07_15_Logo_Olla-Podrida_V1_1.png',
      downloadUrl: '/images/2024_07_15_Logo_Olla-Podrida_V1_1.png',
      format: 'PNG (Freigestellt)',
      fileSize: '128 KB'
    },
    {
      id: 'logo-dark',
      title: 'Ensemble Logo Olla Podrida',
      subtitle: 'Offizielles Emblem für dunkle Hintergründe',
      category: 'logo',
      imageUrl: '/images/3_Zeichenflaeche-1-Kopie-10-1024x1024.png',
      downloadUrl: '/images/3_Zeichenflaeche-1-Kopie-10-1024x1024.png',
      format: 'PNG (1024x1024)',
      fileSize: '193 KB'
    }
  ],
  photos: [
    {
      id: 'photo-ensemble',
      title: 'Ensemble Olla Podrida Gesamtansicht',
      subtitle: 'Bühnenporträt im historischen Gewand',
      category: 'photo',
      imageUrl: '/images/2024_Vorschaubild_1zu1_sRGB.webp',
      downloadUrl: '/images/2024_Vorschaubild_1zu1_sRGB.webp',
      format: 'WEBP (Hochauflösend)',
      credit: '© Jan Dennis Brüning / Ensemble Olla Podrida'
    },
    {
      id: 'photo-stage-header',
      title: 'Bühnenkulisse im Instrumentarium',
      subtitle: 'Historische Atmosphäre',
      category: 'photo',
      imageUrl: '/images/Hintergrund-Header-2-2-scaled.webp',
      downloadUrl: '/images/Hintergrund-Header-2-2-scaled.webp',
      format: 'WEBP (Großformat)',
      credit: '© Jan Dennis Brüning · Freepik'
    }
  ]
};

export const DEFAULT_ENSEMBLE_MEMBERS: EnsembleMember[] = [
  {
    id: 'susanne',
    name: 'Susanne',
    role: 'Ensembleleitung, Flöten & Gesang',
    instruments: ['Blockflöten (Sopran bis Bass)', 'Gemshorn', 'Renaissanceflöten', 'Gesang'],
    bio: 'Susanne leitet das Ensemble mit unverwechselbarem Gespür für mittelalterliche Klangwelten und historische Phrasierung.',
    tooltip: 'Susanne spielt vergnügt auf der Flöte',
    stageImage: '/images/Susanne-1.webp',
    portraitImage: '/images/Susanne_klein.webp',
    stagePosition: {
      desktop: { left: '19%', top: '24%', width: '33rem', zIndex: 10 },
      mobile: { left: '12%', top: '22%', width: '56vw', zIndex: 14 }
    }
  },
  {
    id: 'ruth',
    name: 'Ruth',
    role: 'Harfe, Psalter & Gesang',
    instruments: ['Keltische Harfe', 'Psalter', 'Perkussion', 'Gesang'],
    bio: 'Ruth verzaubert mit filigranen Saitenklängen und warmen Melodiebögen, die den Stücken eine traumhafte Tiefe verleihen.',
    tooltip: 'Ruth',
    stageImage: '/images/Ruth_web_5.webp',
    portraitImage: '/images/Ruth_2_klein.webp',
    stagePosition: {
      desktop: { left: '44%', top: '34%', width: '23rem', zIndex: 9 },
      mobile: { left: '44%', top: '26%', width: '38vw', zIndex: 12 }
    }
  },
  {
    id: 'lutz',
    name: 'Lutz',
    role: 'Historische Trommeln, Sackpfeifen & Gesang',
    instruments: ['Landsknechtstrommel', 'Davul', 'Darabuka', 'Sackpfeifen', 'Gesang'],
    bio: 'Lutz sorgt für das rhythmische Fundament und die pulsierende Energie historischer Tänze und Marschweisen.',
    tooltip: 'Lutz',
    stageImage: '/images/Lutz.webp',
    portraitImage: '/images/Lutz_klein.png',
    stagePosition: {
      desktop: { left: '35%', top: '15%', width: '25rem', zIndex: 8 },
      mobile: { left: '26%', top: '10%', width: '46vw', zIndex: 8 }
    }
  },
  {
    id: 'sandra',
    name: 'Sandra',
    role: 'Gesang, Perkussion & Flöte',
    instruments: ['Gesang', 'Perkussion', 'Schellenkranz', 'Flöten'],
    bio: 'Sandra bereichert das Ensemble mit ausdrucksstarkem Gesang und dynamischen rhythmischen Akzenten.',
    tooltip: 'Sandra',
    stageImage: '/images/2024_Sandra_Olla-Podrida_web_2.webp',
    portraitImage: '/images/2024_Sandra_2-Ebene-2-1-712x1024.webp',
    stagePosition: {
      desktop: { left: '57%', top: '15%', width: '23rem', zIndex: 9 },
      mobile: { left: '52%', top: '12%', width: '44vw', zIndex: 10 }
    }
  },
  {
    id: 'silke',
    name: 'Silke',
    role: 'Laute, Cister & Gesang',
    instruments: ['Renaissancelaute', 'Cister', 'Saiteninstrumente', 'Gesang'],
    bio: 'Silkes feines Lautenspiel verbindet Melodie und Begleitung zu einem kunstvoll gewebten harmonischen Teppich.',
    tooltip: 'Silke',
    stageImage: '/images/Silke_stage.webp',
    portraitImage: '/images/Silke_2_klein.webp',
    stagePosition: {
      desktop: { left: '9%', top: '16%', width: '22rem', zIndex: 7 },
      mobile: { left: '-1%', top: '14%', width: '42vw', zIndex: 7 }
    }
  },
  {
    id: 'klemens',
    name: 'Klemens',
    role: 'Krummhörner, Sackpfeifen & Gesang',
    instruments: ['Krummhörner', 'Renaissance-Sackpfeife', 'Blasinstrumente', 'Gesang'],
    bio: 'Klemens lässt die charakteristischen schneidigen und kräftigen Holzblasinstrumente der Renaissance lautstark erklingen.',
    tooltip: 'Klemens',
    stageImage: '/images/Klemens_stage.webp',
    portraitImage: '/images/Klemens_3_klein.webp',
    stagePosition: {
      desktop: { left: '44%', top: '7%', width: '19rem', zIndex: 5 },
      mobile: { left: '38%', top: '1%', width: '38vw', zIndex: 5 }
    }
  },
  {
    id: 'simone',
    name: 'Simone',
    role: 'Flöten, Glockenspiel & Gesang',
    instruments: ['Blockflöten', 'Schellen', 'Glockenspiel', 'Gesang'],
    bio: 'Simone steuert mit hellen Flötenstimmen und glockenreinem Gesang heitere und festliche Klangfarben bei.',
    tooltip: 'Simone',
    stageImage: '/images/Simone_stage.webp',
    portraitImage: '/images/Simone_klein.webp',
    stagePosition: {
      desktop: { left: '26%', top: '8%', width: '20rem', zIndex: 4 },
      mobile: { left: '10%', top: '3%', width: '40vw', zIndex: 4 }
    }
  }
];

export const DEFAULT_CONCERT_EVENTS: ConcertEvent[] = [
  {
    id: 'stift-boerstel-2026',
    title: 'Konzert beim Bio-Regio-Markt im Stift Börstel',
    category: 'Konzert',
    date: '11.10.2026',
    time: '14.00 Uhr',
    location: 'Stiftskirche Börstel, Börstel 1, 49626 Berge',
    city: 'Berge',
    description: 'Eintritt frei, um eine Spende wird gebeten. Das historische Stift Börstel bietet den perfekten Rahmen für mittelalterliche und frühe neuzeitliche Klänge im Rahmen des Bio-Regio-Marktes.',
    link: 'https://www.oekomodellregion-hasetal.de/#c269',
    imageUrl: '/images/Biomarkt-vorne-mit-Musik.jpg',
    isUpcoming: true,
    ticketInfo: 'Eintritt frei, Spende erbeten'
  },
  {
    id: 'atter-advent-2026',
    title: 'Lebendiger Adventskalender in Atter',
    category: 'Konzert',
    date: '29.11.2026',
    time: '18.00 Uhr',
    location: 'Stadtteiltreff Atter, Karl-Barth-Straße 10, 49076 Osnabrück',
    city: 'Osnabrück',
    description: 'Winterlich-weihnachtliches Konzert zum 17. Lebendigen Adventskalender im Stadtteiltreff Atter. Beginn 18.00 Uhr. Freie Platzwahl. Wir freuen uns über Deine Spende am Ausgang. Zwischen den Musikstücken werden bei Keksen und Punsch kurze Geschichten erzählt.',
    link: 'https://www.wir-in-atter.de/',
    imageUrl: '/images/Screenshot_20240929_154952_Samsung-Internet-1536x956.jpg',
    isUpcoming: true,
    ticketInfo: 'Freie Platzwahl, Spende am Ausgang'
  },
  {
    id: 'quakenbrueck-weihnachten-2026',
    title: '3. Weihnachts- und Mitsingkonzert zusammen mit dem Chorforum Quakenbrück',
    category: 'Konzert',
    date: '30.12.2026',
    time: '16.00 Uhr',
    location: 'St. Marienkirche Quakenbrück, Markt 4, 49610 Quakenbrück',
    city: 'Quakenbrück',
    description: 'Gemeinsam Weihnachten singen und Gemeinsam Weihnachten lauschen. Zusammen mit dem Chorforum Quakenbrück laden wir herzlich zu einem kleinen Mitsing-Konzert in die St. Marienkirche nach Quakenbrück ein.',
    link: 'https://www.chorforum-quakenbrueck.de/',
    imageUrl: '/images/st-marienkirche-quakenbr-ck-1536x1152.jpg',
    isUpcoming: true,
    ticketInfo: 'Herzliche Einladung zum Mitsingen'
  },
  {
    id: 'fuerstenau-schlosskonzert-2025',
    title: 'Fürstenau – Schlosskonzert',
    category: 'Schlosskonzert',
    date: '2025',
    time: 'Beginn: 17 Uhr · Einlass: 16.30 Uhr',
    location: 'Schloss Fürstenau, Schlossplatz 1, 49584 Fürstenau',
    city: 'Fürstenau',
    description: 'In der Reihe „Schlosskonzerte“ gastieren wir zum 2. Mal in Fürstenau. Dieses Mal haben wir eine historisch musikalische Expedition ins Tierreich mitgebracht und spielen und singen von Fröschen und Mäusen, von Bären und Pferden und von allerlei Vögeln und anderem Getier.',
    imageUrl: '/images/2024_Vorschaubild_1zu1_sRGB.webp',
    isUpcoming: false,
    ticketInfo: 'Vorverkauf 15,– € | Konzertkasse 18,– €'
  },
  {
    id: 'kulturverein-lift',
    title: 'Olla Podrida beim Kulturverein LIFT',
    category: 'Theater & Musik',
    date: '15.08.2025',
    time: 'Sommerabend',
    location: 'Kulturverein LI.F.T. e.V., Restrup bei Bippen',
    city: 'Bippen',
    description: 'Der Kulturverein LI.F.T. (Literatur, Film und Theater auf dem Land) im kleinen Restrup bei Bippen ist die Heimat von Willi Lieverscheidt und der Compagnia Buffo. Auf einem alten Bauernhof mit ganz besonderer Aura lassen wir noch einmal unsere historisch musikalische Expedition ins Tierreich erklingen. Freie Platzwahl und Hutkasse am Ende.',
    imageUrl: '/images/tumblr_meyqp0UGV01rqxd5ko1_1280.jpg',
    isUpcoming: false,
    ticketInfo: 'Freie Platzwahl & Hutkasse'
  },
  {
    id: 'loeningen-neues-jahr',
    title: 'Konzert im neuen Jahr aus alten Zeiten',
    category: 'Konzert',
    date: 'Januar',
    time: '19.30 Uhr',
    location: 'Gemeindehaus Trinitatiskirche Löningen',
    city: 'Löningen',
    description: 'Eine akustische Reise in eine vergangene Welt: Noch mit weihnachtlichen Klängen im jungen neuen Jahr verzaubern wir das Gemeindehaus der Trinitatiskirche Löningen.',
    link: 'https://www.trinitatiskirche-loeningen.de',
    imageUrl: '/images/Screenshot_20241126_203847_Samsung-Internet.jpg',
    isUpcoming: false,
    ticketInfo: 'Eintritt: 10,– €'
  },
  {
    id: 'bad-rothenfelde',
    title: 'Olla Podrida zu Gast in Bad Rothenfelde',
    category: 'Konzert',
    date: 'Archiv',
    time: 'Festgottesdienst & Konzert',
    location: 'Jesus Christus Kirche, Bad Rothenfelde',
    city: 'Bad Rothenfelde',
    description: 'Auf Einladung des Kirchenchores Bad Rothenfelde unter der Leitung von Holger Dolkemeyer erklingen unsere Töne im facettenreichen musikalischen Dialog mit dem Chor in der Jesus Christus Kirche.',
    imageUrl: '/images/Logo1.jpg',
    isUpcoming: false,
    ticketInfo: 'Konzert im Kirchenraum'
  }
];

// Dynamic Accessors (Fallback gracefully to defaults)
export const getAssets = () => {
  const wp = getWPData();
  const raw = {
    ...DEFAULT_ASSETS,
    heroBackgroundDesktop: wp?.hero?.bgDesktop || DEFAULT_ASSETS.heroBackgroundDesktop,
    heroBackgroundMobile: wp?.hero?.bgMobile || DEFAULT_ASSETS.heroBackgroundMobile,
    logo: wp?.ensemble?.logo || DEFAULT_ASSETS.logo,
    footerSeal: wp?.legal?.sealImage || DEFAULT_ASSETS.footerSeal
  };

  const resolved: Record<string, string> = {};
  for (const [key, val] of Object.entries(raw)) {
    resolved[key] = typeof val === 'string' ? resolveAssetUrl(val) : val;
  }
  return resolved as typeof DEFAULT_ASSETS;
};

export const getHeroConfig = (): HeroConfig => {
  const wp = getWPData();
  const raw = {
    ...DEFAULT_HERO_CONFIG,
    ...(wp?.hero || {})
  };
  return {
    ...raw,
    bgDesktop: resolveAssetUrl(raw.bgDesktop),
    bgMobile: resolveAssetUrl(raw.bgMobile)
  };
};

export const getEnsembleConfig = (): EnsembleConfig => {
  const wp = getWPData();
  const raw = {
    ...DEFAULT_ENSEMBLE_CONFIG,
    ...(wp?.ensemble || {})
  };
  return {
    ...raw,
    logo: resolveAssetUrl(raw.logo)
  };
};

export const getAudioConfig = (): AudioConfig => {
  const wp = getWPData();
  const raw = {
    ...DEFAULT_AUDIO_CONFIG,
    ...(wp?.audio || {})
  };
  let src = raw.src || '';
  if (src.includes('olla-podrida.de') && src.includes('Riu-riu-chiu-live-in-Atter.mp3')) {
    src = resolveAssetUrl('/Riu-riu-chiu-live-in-Atter.mp3');
  } else {
    src = resolveAssetUrl(src);
  }
  return {
    ...raw,
    src
  };
};

export const getContactConfig = (): ContactConfig => {
  const wp = getWPData();
  const raw = {
    ...DEFAULT_CONTACT_CONFIG,
    ...(wp?.contact || {}),
    restUrl: wp?.restUrl,
    nonce: wp?.nonce
  };
  return {
    ...raw,
    portrait: resolveAssetUrl(raw.portrait)
  };
};

export const getLegalConfig = (): LegalConfig => {
  const wp = getWPData();
  const raw = {
    ...DEFAULT_LEGAL_CONFIG,
    ...(wp?.legal || {})
  };
  return {
    ...raw,
    sealImage: resolveAssetUrl(raw.sealImage)
  };
};

export const getPressConfig = (): PressConfig => {
  const wp = getWPData();
  const raw = {
    ...DEFAULT_PRESS_CONFIG,
    ...(wp?.press || {})
  };
  const logos = (raw.logos || DEFAULT_PRESS_CONFIG.logos).map((item) => ({
    ...item,
    imageUrl: resolveAssetUrl(item.imageUrl),
    downloadUrl: resolveAssetUrl(item.downloadUrl || item.imageUrl)
  }));
  const photos = (raw.photos || DEFAULT_PRESS_CONFIG.photos).map((item) => ({
    ...item,
    imageUrl: resolveAssetUrl(item.imageUrl),
    downloadUrl: resolveAssetUrl(item.downloadUrl || item.imageUrl)
  }));
  return {
    ...raw,
    logos,
    photos
  };
};

export const getEnsembleMembers = (): EnsembleMember[] => {
  const wp = getWPData();
  const list = (wp?.musicians && Array.isArray(wp.musicians) && wp.musicians.length > 0)
    ? wp.musicians
    : DEFAULT_ENSEMBLE_MEMBERS;

  return list.map((m) => ({
    ...m,
    stageImage: resolveAssetUrl(m.stageImage),
    portraitImage: resolveAssetUrl(m.portraitImage)
  }));
};

export const getConcertEvents = (): ConcertEvent[] => {
  const wp = getWPData();
  const list = (wp?.events && Array.isArray(wp.events) && wp.events.length > 0)
    ? wp.events
    : DEFAULT_CONCERT_EVENTS;

  return list.map((ev) => ({
    ...ev,
    imageUrl: resolveAssetUrl(ev.imageUrl)
  }));
};

export const getSiteTexts = (): SiteTextsConfig => {
  const wp = getWPData();
  return {
    ...DEFAULT_SITE_TEXTS,
    ...(wp?.texts || {})
  };
};

/**
 * Checks whether an event's date and time have passed.
 * Supports DD.MM.YYYY and YYYY-MM-DD formats with optional time (e.g. "14.00 Uhr" or "18:00").
 */
export function isEventExpired(dateStr?: string, timeStr?: string): boolean {
  if (!dateStr) return false;
  let day = 0, month = 0, year = 0;
  const dotParts = dateStr.trim().split('.');
  if (dotParts.length === 3) {
    day = parseInt(dotParts[0], 10);
    month = parseInt(dotParts[1], 10) - 1;
    year = parseInt(dotParts[2], 10);
  } else {
    const dashParts = dateStr.trim().split('-');
    if (dashParts.length === 3) {
      year = parseInt(dashParts[0], 10);
      month = parseInt(dashParts[1], 10) - 1;
      day = parseInt(dashParts[2], 10);
    }
  }

  if (!year || isNaN(month) || !day) return false;

  let hours = 23, minutes = 59;
  if (timeStr) {
    const timeMatch = timeStr.match(/(\d{1,2})[:.](\d{2})/);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
    }
  }

  const eventDate = new Date(year, month, day, hours, minutes, 0);
  return eventDate.getTime() < Date.now();
}

/**
 * Returns all upcoming events that have not expired yet.
 */
export const getUpcomingEvents = (): ConcertEvent[] => {
  const all = getConcertEvents();
  return all.filter((ev) => ev.isUpcoming && !isEventExpired(ev.date, ev.time));
};

/**
 * Returns all past/archive events (explicitly marked or automatically expired).
 */
export const getPastEvents = (): ConcertEvent[] => {
  const all = getConcertEvents();
  return all.filter((ev) => !ev.isUpcoming || isEventExpired(ev.date, ev.time));
};

// Backwards-compatible constants for components that import them directly
export const ASSETS = getAssets();
export const ENSEMBLE_MEMBERS = getEnsembleMembers();
export const CONCERT_EVENTS = getConcertEvents();
export const AUDIO_TRACKS = [
  {
    id: 'configured-track',
    title: DEFAULT_AUDIO_CONFIG.title,
    subtitle: DEFAULT_AUDIO_CONFIG.subtitle,
    src: DEFAULT_AUDIO_CONFIG.src
  }
];
