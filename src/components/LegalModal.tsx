import React, { useEffect } from 'react';
import { X, Shield, BookOpen, Cookie, ExternalLink } from 'lucide-react';

interface LegalModalProps {
  type: 'impressum' | 'datenschutz' | 'cookies' | null;
  onClose: () => void;
  onSwitchType: (type: 'impressum' | 'datenschutz' | 'cookies') => void;
  onRevokeConsent?: () => void;
  sessionId?: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, onSwitchType, onRevokeConsent, sessionId }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div 
      className="fixed inset-0 z-[100050] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-3xl max-h-[75vh] md:max-h-[70vh] bg-[#120B08] border-2 border-[#DAA520]/70 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.92),0_0_30px_rgba(218,165,32,0.2)] flex flex-col text-[#F5F5DC] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          touchAction: 'pan-y'
        }}
      >
        {/* Modal Header */}
        <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-[#DAA520]/30 bg-[#1C120D]">
          <div className="flex items-center space-x-3">
            {type === 'impressum' && <BookOpen className="text-[#DAA520]" size={24} />}
            {type === 'datenschutz' && <Shield className="text-[#DAA520]" size={24} />}
            {type === 'cookies' && <Cookie className="text-[#DAA520]" size={24} />}
            <h2 className="font-macondo text-2xl sm:text-3xl text-[#DAA520]">
              {type === 'impressum' && 'Impressum'}
              {type === 'datenschutz' && 'Datenschutzerklärung'}
              {type === 'cookies' && 'Cookies und Consent'}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#D1C7AC] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Schließen"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tab switch inside modal */}
        <div className="flex-none flex px-6 pt-3 border-b border-[#DAA520]/20 bg-[#0E0704] text-xs font-macondo text-lg gap-4">
          <button
            onClick={() => onSwitchType('impressum')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              type === 'impressum' ? 'border-[#DAA520] text-[#DAA520]' : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            Impressum
          </button>
          <button
            onClick={() => onSwitchType('datenschutz')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              type === 'datenschutz' ? 'border-[#DAA520] text-[#DAA520]' : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            Datenschutz
          </button>
          <button
            onClick={() => onSwitchType('cookies')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              type === 'cookies' ? 'border-[#DAA520] text-[#DAA520]' : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            Cookies und Consent
          </button>
        </div>

        {/* Scrollable Content – data-lenis-prevent and overscroll-contain ensure smooth, unblocked scrolling */}
        <div 
          data-lenis-prevent="true"
          className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 space-y-6 text-sm md:text-base text-[#D1C7AC] leading-relaxed font-sans overscroll-contain"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          
          {/* IMPRESSUM (Gemäß § 5 DDG) */}
          {type === 'impressum' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 text-xs text-[#DAA520]">
                Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
              </div>

                <div>
                  <h3 className="font-macondo text-2xl text-[#F5F5DC] mb-2">Verantwortlich für den Inhalt</h3>
                  <div className="p-4 rounded-xl bg-[#090503] border border-[#DAA520]/20 space-y-1">
                    <p className="font-semibold text-[#F5F5DC]">Ensemble Olla Podrida</p>
                    <p>Susanne Hoffmann (Ensembleleitung)</p>
                    <p>Im Ort 4, 49356 Diepholz</p>
                    <p>Tel.: +49 174 186 3418</p>
                    <p>
                      E-Mail:{' '}
                      <a href="mailto:info@olla-podrida.de" className="text-[#DAA520] hover:underline">
                        info(at)olla-podrida.de
                      </a>
                    </p>
                    <p>
                      Web:{' '}
                      <a href="https://www.olla-podrida.de" className="text-[#DAA520] hover:underline">
                        www.olla-podrida.de
                      </a>
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 space-y-2">
                  <h3 className="font-macondo text-2xl text-[#DAA520]">Design, Konzept &amp; Webentwicklung</h3>
                  <p className="text-xs sm:text-sm text-[#F5F5DC]">
                    Gestaltung und Realisierung:
                  </p>
                  <p className="font-medium text-[#F5F5DC]">
                    Jan Dennis Brüning
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1">
                    <a
                      href="https://www.janbruening.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#DAA520] hover:underline text-xs"
                    >
                      <span>www.janbruening.de</span>
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                  <p className="text-xs text-[#D1C7AC]/70">© Jan Dennis Brüning</p>
                </div>

                <div>
                  <h3 className="font-macondo text-2xl text-[#F5F5DC] mb-2">Bildnachweise &amp; Schriften</h3>
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm">
                    <li><strong className="text-[#F5F5DC]">Fotografie:</strong> © Jan Dennis Brüning</li>
                    <li><strong className="text-[#F5F5DC]">Schriften (Webfonts):</strong> Macondo Swash Caps, Dosis, Roboto Slab – 100% lokal gehostet ohne Verbindung zu externen Servern (Google Fonts datenschutzkonform lokal eingebunden).</li>
                    <li><strong className="text-[#F5F5DC]">Stockmedia &amp; Grafik:</strong> Licensed by Jan Dennis Brüning 2024 @ freepik.com (Premium Lizenz)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">Haftung für Inhalte</h3>
                  <p className="text-xs sm:text-sm text-justify">
                    Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </div>

                <div>
                  <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">Haftung für Links</h3>
                  <p className="text-xs sm:text-sm text-justify">
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </div>

                <div>
                  <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">Urheberrecht</h3>
                  <p className="text-xs sm:text-sm text-justify">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                </div>
              </div>
          )}

          {/* DATENSCHUTZERKLÄRUNG (DSGVO / DDG) */}
          {type === 'datenschutz' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 text-xs text-[#DAA520]">
                Datenschutzerklärung nach der EU-Datenschutz-Grundverordnung (DSGVO) und dem Digitale-Dienste-Gesetz (DDG)
              </div>

              <div>
                <h3 className="font-macondo text-2xl text-[#F5F5DC] mb-2">1. Verantwortliche Stelle</h3>
                <div className="p-4 rounded-xl bg-[#090503] border border-[#DAA520]/20 space-y-1">
                  <p className="font-semibold text-[#F5F5DC]">Ensemble Olla Podrida</p>
                  <p>Susanne Hoffmann (Ensembleleitung)</p>
                  <p>Im Ort 4, 49356 Diepholz</p>
                  <p>Tel.: +49 174 186 3418</p>
                  <p>
                    E-Mail:{' '}
                    <a href="mailto:info@olla-podrida.de" className="text-[#DAA520] hover:underline">
                      info(at)olla-podrida.de
                    </a>
                  </p>
                  <p>Web: www.olla-podrida.de</p>
                </div>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">
                  2. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck von deren Verwendung
                </h3>
                <h4 className="font-semibold text-[#DAA520] text-sm mt-3 mb-1">a) Beim Aufruf der Website (Server-Logfiles)</h4>
                <p className="text-xs sm:text-sm text-justify">
                  Beim Aufrufen unserer Website www.olla-podrida.de werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in den Server-Logfiles gespeichert:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm my-2 text-[#D1C7AC]/90">
                  <li>IP-Adresse des anfragenden Rechners</li>
                  <li>Datum und Uhrzeit des Zugriffs</li>
                  <li>Name und URL der abgerufenen Datei</li>
                  <li>Übertragene Datenmenge und Zugriffsstatus (HTTP-Statuscode)</li>
                  <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                  <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
                </ul>
                <p className="text-xs sm:text-sm text-justify">
                  Die genannten Daten werden zur Gewährleistung eines reibungslosen Verbindungsaufbaus der Website, einer komfortablen Nutzung unserer Website sowie zur Auswertung der Systemsicherheit und -stabilität verarbeitet. Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Unser berechtigtes Interesse folgt aus den oben aufgelisteten Zwecken zur Datenerhebung.
                </p>

                <h4 className="font-semibold text-[#DAA520] text-sm mt-3 mb-1">b) Bei Nutzung unseres Kontaktformulars</h4>
                <p className="text-xs sm:text-sm text-justify">
                  Bei Fragen jeglicher Art bieten wir Ihnen die Möglichkeit, mit uns über ein auf der Website bereitgestelltes Formular Kontakt aufzunehmen. Dabei ist die Angabe einer gültigen E-Mail-Adresse und Ihres Namens erforderlich, damit wir wissen, von wem die Anfrage stammt und um diese beantworten zu können. Die Datenverarbeitung zum Zwecke der Kontaktaufnahme mit uns erfolgt nach Art. 6 Abs. 1 S. 1 lit. a DSGVO auf Grundlage Ihrer freiwillig erteilten Einwilligung bzw. nach Art. 6 Abs. 1 lit. b DSGVO bei vorvertraglichen Anfragen (z. B. Konzertbuchungen).
                </p>

                <h4 className="font-semibold text-[#DAA520] text-sm mt-3 mb-1">c) Kontaktaufnahme per E-Mail oder Telefon</h4>
                <p className="text-xs sm:text-sm text-justify">
                  Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Kontaktdaten, Inhalt) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">3. Weitergabe von Daten</h3>
                <p className="text-xs sm:text-sm text-justify">
                  Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm my-2 text-[#D1C7AC]/90">
                  <li>Sie Ihre nach Art. 6 Abs. 1 S. 1 lit. a DSGVO ausdrückliche Einwilligung dazu erteilt haben,</li>
                  <li>die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist,</li>
                  <li>für den Fall, dass für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">4. Hosting durch die IONOS SE &amp; Auftragsverarbeitung (AVV)</h3>
                <p className="text-xs sm:text-sm text-justify mb-2">
                  Wir hosten unsere Website bei der <strong>IONOS SE</strong>. Anbieter ist:
                </p>
                <div className="p-4 rounded-xl bg-[#090503] border border-[#DAA520]/20 text-xs sm:text-sm space-y-1 mb-3">
                  <p className="font-semibold text-[#F5F5DC]">IONOS SE</p>
                  <p>Elgendorfer Str. 57</p>
                  <p>56410 Montabaur</p>
                  <p>Deutschland</p>
                  <p className="pt-1">
                    Datenschutzerklärung von IONOS:{' '}
                    <a
                      href="https://www.ionos.de/terms-gtc/terms-privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#DAA520] hover:underline inline-flex items-center gap-1"
                    >
                      <span>https://www.ionos.de/terms-gtc/terms-privacy/</span>
                      <ExternalLink size={12} />
                    </a>
                  </p>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-justify">
                  <p>
                    <strong className="text-[#F5F5DC]">Vertrag über Auftragsverarbeitung (AVV):</strong> Wir haben mit der IONOS SE einen Vertrag zur Auftragsverarbeitung (AVV) gemäß Art. 28 DSGVO abgeschlossen. Hierbei handelt es sich um einen gesetzlich vorgeschriebenen Vertrag, der sicherstellt, dass IONOS die personenbezogenen Daten unserer Webseitenbesucher ausschließlich nach unseren Weisungen, zweckgebunden und unter strenger Einhaltung der Datenschutz-Grundverordnung verarbeitet.
                  </p>
                  <p>
                    <strong className="text-[#F5F5DC]">Rechtsgrundlage:</strong> Der Einsatz von IONOS erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen, schnellen und sicheren Bereitstellung unseres Internetauftritts.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">5. Lokale Einbindung von Schriftarten und Medien (Keine Drittanbieter-CDNs)</h3>
                <p className="text-xs sm:text-sm text-justify">
                  Diese Website bindet alle Schriftarten (Fonts wie Macondo Swash Caps, Dosis, Roboto Slab) sowie sämtliche Medien (Bilder, Audiodateien, Grafiken) zu 100% lokal über den eigenen Webserver ein. Es findet zu keinem Zeitpunkt eine Übertragung Ihrer IP-Adresse oder sonstiger Daten an externe Server oder Content Delivery Networks (CDNs) von Drittanbietern (wie beispielsweise Google Fonts oder Google-Server) statt.
                </p>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">6. Cookies und lokale Speicherung</h3>
                <p className="text-xs sm:text-sm text-justify">
                  Unsere Website verzichtet vollständig auf Tracking-, Marketing- und Werbe-Cookies. Wir setzen ausschließlich technisch erforderliche Speicherfunktionen (z. B. den lokalen Browserspeicher „LocalStorage“) ein, um Ihre persönlichen Komfort-Einstellungen wie die Stummschaltung oder Lautstärke unseres Musikplayers zu speichern. Diese Daten verbleiben auf Ihrem Gerät und werden nicht an uns oder Dritte übertragen. Nähere Details finden Sie im Reiter „Cookies und Consent“.
                </p>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">7. Ihre Rechte als betroffene Person</h3>
                <p className="text-xs sm:text-sm text-justify mb-2">
                  Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen der DSGVO jederzeit folgende Rechte:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#D1C7AC]/90">
                  <li><strong className="text-[#F5F5DC]">Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.</li>
                  <li><strong className="text-[#F5F5DC]">Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten Daten verlangen.</li>
                  <li><strong className="text-[#F5F5DC]">Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer bei uns gespeicherten Daten verlangen („Recht auf Vergessenwerden“).</li>
                  <li><strong className="text-[#F5F5DC]">Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung Ihrer Daten verlangen.</li>
                  <li><strong className="text-[#F5F5DC]">Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können verlangen, Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</li>
                  <li><strong className="text-[#F5F5DC]">Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können jederzeit Widerspruch gegen die künftige Verarbeitung Ihrer Daten einlegen.</li>
                  <li><strong className="text-[#F5F5DC]">Beschwerderecht (Art. 77 DSGVO):</strong> Sie haben das Recht, sich bei einer zuständigen Aufsichtsbehörde für den Datenschutz zu beschweren.</li>
                </ul>
              </div>
            </div>
          )}

          {/* COOKIES INFO & ERKLÄRUNG */}
          {/* COOKIES & CONSENT */}
          {type === 'cookies' && (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-3">
                <div className="inline-flex p-4 rounded-full bg-[#DAA520]/20 text-[#DAA520]">
                  <Cookie size={44} />
                </div>
                <h3 className="font-macondo text-2xl sm:text-3xl text-[#DAA520]">
                  Cookies und Consent
                </h3>
                <p className="max-w-2xl mx-auto text-[#D1C7AC] text-sm sm:text-base leading-relaxed">
                  Wir schätzen Ihre Privatsphäre genauso sehr wie die Musik aus Mittelalter und Renaissance. Erfahren Sie hier verständlich und transparent, welche Cookies und lokalen Speichertechniken eingesetzt werden, wie Ihre Einwilligung dokumentiert wird und wie Sie diese jederzeit widerrufen können.
                </p>
              </div>

              {/* Box 0: Ihre persönliche Consent-Session-ID (DSGVO-Nachweis) */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#1A100B] border-2 border-[#DAA520]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left space-y-1">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#DAA520] font-bold block">
                    Ihre persönliche Consent-Session-ID
                  </span>
                  <div className="font-mono text-base sm:text-lg font-bold text-[#F5F5DC] bg-[#090503] px-3 py-1.5 rounded-lg border border-[#DAA520]/40 inline-block select-all tracking-wider">
                    {sessionId || 'OP-C87F42A1D0'}
                  </div>
                  <p className="text-[11px] text-[#D1C7AC]/75 leading-tight">
                    Nachweis Ihrer erteilten Einwilligung gemäß Art. 7 Abs. 1 DSGVO · Vollständig anonymisiert ohne Nutzerprofil.
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-center sm:items-end gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Gültigkeit: 30 Tage aktiv
                  </span>
                </div>
              </div>

              {/* Box 1: Übersicht der verwendeten Cookies & Speicherungen */}
              <div className="p-5 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 space-y-3">
                <h4 className="font-macondo text-xl text-[#F5F5DC]">1. Übersicht aller genutzten Speicherungen &amp; Cookies</h4>
                <p className="text-xs sm:text-sm text-[#D1C7AC] leading-relaxed">
                  Nachfolgend finden Sie eine vollständige Auflistung sämtlicher lokaler Speicherfunktionen, die von dieser Website gesetzt werden:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#D1C7AC] border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-[#DAA520]/40 text-[#DAA520] font-macondo text-sm">
                        <th className="py-2 pr-3">Name / Variable</th>
                        <th className="py-2 px-3">Speicherort</th>
                        <th className="py-2 px-3">Zweck</th>
                        <th className="py-2 px-3">Gültigkeit</th>
                        <th className="py-2 pl-3">Typ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DAA520]/15">
                      <tr>
                        <td className="py-2.5 pr-3 font-mono text-[#F5F5DC] font-semibold">olla_cookie_consent</td>
                        <td className="py-2.5 px-3">Cookie &amp; LocalStorage</td>
                        <td className="py-2.5 px-3">Speichert, dass der Willkommens- und Cookie-Banner bestätigt wurde.</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">30 Tage</td>
                        <td className="py-2.5 pl-3"><span className="text-emerald-400 font-semibold">Essenziell</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-3 font-mono text-[#F5F5DC] font-semibold">olla_consent_session_id</td>
                        <td className="py-2.5 px-3">LocalStorage</td>
                        <td className="py-2.5 px-3">Eindeutige Nachweis-ID zur datenschutzkonformen Protokollierung (Art. 7 DSGVO).</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">30 Tage</td>
                        <td className="py-2.5 pl-3"><span className="text-emerald-400 font-semibold">Dokumentation</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-3 font-mono text-[#F5F5DC] font-semibold">olla_audio_muted</td>
                        <td className="py-2.5 px-3">LocalStorage</td>
                        <td className="py-2.5 px-3">Merkt sich Ihre Lautstärke- bzw. Stummschaltungs-Präferenz des Musik-Players.</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">Permanent</td>
                        <td className="py-2.5 pl-3"><span className="text-[#DAA520] font-semibold">Komfort</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Box 2: Manuelle Löschung & Widerruf der Einwilligung */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-red-950/40 via-[#1A100B] to-red-950/40 border border-red-700/50 space-y-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <h4 className="font-macondo text-xl text-red-300 flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xl">🗑️</span>
                    <span>Cookies &amp; Einwilligung zurücksetzen</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#D1C7AC] max-w-md">
                    Entfernt sofort alle gesetzten Cookies und lokalen Einstellungen von Ihrem Gerät. Beim nächsten Laden der Website erscheint der Cookie-Banner wieder.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onRevokeConsent) {
                      onRevokeConsent();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-900/90 hover:bg-red-800 border border-red-500 text-white font-macondo text-sm font-semibold tracking-wide shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <span>🗑️</span>
                  <span>Einwilligung jetzt löschen</span>
                </button>
              </div>

              {/* Box 3: Essenzielle vs. Optionale Cookies */}
              <div className="p-5 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 space-y-3">
                <h4 className="font-macondo text-xl text-[#F5F5DC]">2. Welche Unterschiede gibt es bei Cookies?</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-lg bg-[#090503] border border-[#DAA520]/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-[#F5F5DC]">Technisch essenzielle Speicherungen</span>
                      <span className="text-[0.65rem] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono">Aktiv</span>
                    </div>
                    <p className="text-xs text-[#D1C7AC]/80 leading-relaxed">
                      Zwingend erforderlich, damit eine Website reibungslos bedient werden kann (z. B. Ton an/aus, Sicherheitsprüfungen, Formularverarbeitung). Gemäß § 25 Abs. 2 TDDDG bedürfen diese keiner gesonderten Einwilligung.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#090503] border border-red-900/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-[#F5F5DC]">Tracking- &amp; Werbe-Cookies</span>
                      <span className="text-[0.65rem] px-2 py-0.5 rounded bg-red-950/80 text-red-400 font-mono">Nicht verwendet</span>
                    </div>
                    <p className="text-xs text-[#D1C7AC]/80 leading-relaxed">
                      Dateien, die das Surfverhalten aufzeichnen, um Nutzungsprofile zu erstellen und personalisierte Werbung auszuspielen (z. B. Google Analytics, Facebook Pixel). <strong>Auf dieser Website vollständig deaktiviert!</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 4: Unser Versprechen: 100% Tracking-frei */}
              <div className="p-5 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 space-y-2">
                <h4 className="font-macondo text-xl text-[#DAA520]">3. Unser Versprechen: 100% Tracking-frei</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#D1C7AC]">
                  <li><strong className="text-[#F5F5DC]">Keine Drittanbieter-Tracker:</strong> Wir setzen kein Google Analytics, kein Matomo und keinerlei Werbenetzwerke ein.</li>
                  <li><strong className="text-[#F5F5DC]">Keine Profilbildung:</strong> Ihr Besuch auf unserer Website bleibt vollständig anonym.</li>
                  <li><strong className="text-[#F5F5DC]">Lokaler Speicher (LocalStorage):</strong> Wir nutzen einzig den lokalen Speicher Ihres Browsers, um Ihre Audioeinstellung (ob die Renaissance-Musik abgespielt oder stummgeschaltet sein soll) auf Ihrem eigenen Rechner zu sichern. Diese Information verlässt Ihr Gerät zu keinem Zeitpunkt.</li>
                </ul>
              </div>

              {/* Box 5: Wie Sie Cookies im Browser kontrollieren können */}
              <div className="p-5 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 space-y-2">
                <h4 className="font-macondo text-xl text-[#F5F5DC]">4. Wie können Sie Cookies in Ihrem Browser verwalten?</h4>
                <p className="text-xs sm:text-sm text-[#D1C7AC] leading-relaxed text-justify">
                  Sie können Ihren Internet-Browser jederzeit nach Ihren Wünschen einstellen:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#D1C7AC]">
                  <li>Sie können festlegen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben.</li>
                  <li>Sie können die Annahme von Cookies für bestimmte Fälle oder generell ausschließen.</li>
                  <li>Sie können das automatische Löschen der Cookies und Websitedaten beim Schließen des Browsers aktivieren.</li>
                  <li>Bereits gespeicherte Cookies und Websitedaten können Sie jederzeit über die Sicherheitseinstellungen Ihres Browsers (z. B. Chrome, Safari, Firefox, Edge) löschen.</li>
                </ul>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-xl bg-[#DAA520] text-[#070202] font-macondo text-lg font-bold hover:bg-[#e4b232] cursor-pointer shadow-lg"
                >
                  Alles klar, verstanden!
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#DAA520]/30 bg-[#1C120D] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-[#2A1B14] hover:bg-[#DAA520] hover:text-[#070202] text-[#DAA520] font-macondo text-base transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
