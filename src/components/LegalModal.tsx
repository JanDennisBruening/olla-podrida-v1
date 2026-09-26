import React, { useEffect } from 'react';
import { X, Shield, BookOpen, Cookie, ExternalLink } from 'lucide-react';

interface LegalModalProps {
  type: 'impressum' | 'datenschutz' | 'cookies' | null;
  onClose: () => void;
  onSwitchType: (type: 'impressum' | 'datenschutz' | 'cookies') => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, onSwitchType }) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#120B08] border border-[#DAA520] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F5F5DC]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DAA520]/30 bg-[#1C120D]">
          <div className="flex items-center space-x-3">
            {type === 'impressum' && <BookOpen className="text-[#DAA520]" size={24} />}
            {type === 'datenschutz' && <Shield className="text-[#DAA520]" size={24} />}
            {type === 'cookies' && <Cookie className="text-[#DAA520]" size={24} />}
            <h2 className="font-macondo text-2xl sm:text-3xl text-[#DAA520]">
              {type === 'impressum' && 'Impressum'}
              {type === 'datenschutz' && 'Datenschutzerklärung'}
              {type === 'cookies' && 'Cookie-Informationen'}
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
        <div className="flex px-6 pt-3 border-b border-[#DAA520]/20 bg-[#0E0704] text-xs font-macondo text-lg gap-4">
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
            Cookies
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-sm md:text-base text-[#D1C7AC] leading-relaxed font-sans">
          
          {/* IMPRESSUM (1:1 from live site) */}
          {type === 'impressum' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 text-xs text-[#DAA520]">
                Letzte Aktualisierung: Juli 2024
              </div>

              <div>
                <h3 className="font-macondo text-2xl text-[#F5F5DC] mb-2">Verantwortlich für den Inhalt</h3>
                <div className="p-4 rounded-xl bg-[#090503] border border-[#DAA520]/20 space-y-1">
                  <p className="font-semibold text-[#F5F5DC]">Ensemble Olla Podrida</p>
                  <p>Susanne Hoffmann</p>
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
                  Mit freundlicher Unterstützung gesponsert von:
                </p>
                <p className="font-medium text-[#F5F5DC]">
                  Jan Dennis Brüning / Jean Moineau
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
                  <a
                    href="https://www.jean-moineau.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#DAA520] hover:underline text-xs"
                  >
                    <span>www.jean-moineau.com</span>
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
                <p className="text-xs text-[#D1C7AC]/70">© Jan Dennis Brüning / Jean Moineau</p>
              </div>

              <div>
                <h3 className="font-macondo text-2xl text-[#F5F5DC] mb-2">Bildnachweise &amp; Schriften</h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                  <li><strong className="text-[#F5F5DC]">Fotografie:</strong> © Jean Moineau / Jan Brüning</li>
                  <li><strong className="text-[#F5F5DC]">Typeface:</strong> Macondo Swash Caps Regular © John Vargas Beltrán (Google Fonts)</li>
                  <li><strong className="text-[#F5F5DC]">Stockmedia:</strong> Licensed by Jean Moineau / Jan Brüning 2024 @ freepik.com (Premium)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">Haftung für Inhalte</h3>
                <p className="text-xs sm:text-sm text-justify">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
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

          {/* DATENSCHUTZ (1:1 from live site) */}
          {type === 'datenschutz' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#1A100B] border border-[#DAA520]/30 text-xs text-[#DAA520]">
                Letzte Aktualisierung: Juli 2024
              </div>

              <div>
                <h3 className="font-macondo text-2xl text-[#F5F5DC] mb-2">1. Verantwortlich für die Datenverarbeitung</h3>
                <div className="p-4 rounded-xl bg-[#090503] border border-[#DAA520]/20 space-y-1">
                  <p className="font-semibold text-[#F5F5DC]">Ensemble Olla Podrida</p>
                  <p>Susanne Hoffmann</p>
                  <p>Im Ort 4, 49356 Diepholz</p>
                  <p>Tel.: +49 174 186 3418</p>
                  <p>E-Mail: info(at)olla-podrida.de</p>
                  <p>Web: www.olla-podrida.de</p>
                </div>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">
                  2. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck von deren Verwendung
                </h3>
                <h4 className="font-semibold text-[#DAA520] text-sm mt-3 mb-1">a) Beim Besuch der Website</h4>
                <p className="text-xs sm:text-sm text-justify">
                  Beim Aufrufen unserer Website www.olla-podrida.de werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem sogenannten Logfile gespeichert: IP-Adresse, Datum und Uhrzeit des Zugriffs, Name und URL der abgerufenen Datei, Referrer-URL, Browsertyp. Die genannten Daten werden zur Gewährleistung eines reibungslosen Verbindungsaufbaus und zur Systemsicherheit verarbeitet (Art. 6 Abs. 1 S. 1 lit. f DSGVO).
                </p>

                <h4 className="font-semibold text-[#DAA520] text-sm mt-3 mb-1">b) Bei Nutzung unseres Kontaktformulars</h4>
                <p className="text-xs sm:text-sm text-justify">
                  Bei Fragen jeglicher Art bieten wir Ihnen die Möglichkeit, mit uns über ein auf der Website bereitgestelltes Formular Kontakt aufzunehmen. Dabei ist die Angabe einer gültigen E-Mail-Adresse und Ihres Namens erforderlich, damit wir wissen, von wem die Anfrage stammt und um diese beantworten zu können. Die Datenverarbeitung erfolgt nach Art. 6 Abs. 1 S. 1 lit. a DSGVO auf Grundlage Ihrer freiwillig erteilten Einwilligung.
                </p>

                <h4 className="font-semibold text-[#DAA520] text-sm mt-3 mb-1">c) E-Mail und Telefonkontakt</h4>
                <p className="text-xs sm:text-sm text-justify">
                  Wenn Sie uns per E-Mail oder Telefon kontaktieren, werden Ihre Daten zur Bearbeitung der Kontaktanfrage und deren Abwicklung verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">3. Weitergabe von Daten</h3>
                <p className="text-xs sm:text-sm text-justify">
                  Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn Sie Ihre ausdrückliche Einwilligung dazu erteilt haben oder eine gesetzliche Verpflichtung besteht.
                </p>
              </div>

              <div id="cookies">
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">4. Cookies</h3>
                <p className="text-xs sm:text-sm text-justify">
                  Unsere Website verwendet ausschließlich essenzielle Cookies, die für den Betrieb der Website technisch zwingend erforderlich sind. Diese Cookies dienen dazu, die Website technisch fehlerfrei und optimiert bereitstellen zu können.
                </p>
              </div>

              <div>
                <h3 className="font-macondo text-xl text-[#F5F5DC] mb-1">5. Hosting durch IONOS</h3>
                <p className="text-xs sm:text-sm text-justify">
                  Unsere Website wird bei IONOS gehostet. IONOS erhebt und speichert automatisch Informationen in Server-Log-Dateien, die Ihr Browser automatisch übermittelt.
                </p>
              </div>
            </div>
          )}

          {/* COOKIES INFO (1:1 from live site tooltip) */}
          {type === 'cookies' && (
            <div className="space-y-6 text-center py-6">
              <div className="inline-flex p-4 rounded-full bg-[#DAA520]/20 text-[#DAA520] mb-2">
                <Cookie size={48} />
              </div>
              <h3 className="font-macondo text-3xl text-[#DAA520]">
                Nur essenzielle Cookies und Musik aus alten Zeiten!
              </h3>
              <p className="max-w-xl mx-auto text-[#D1C7AC] text-sm sm:text-base leading-relaxed">
                Unsere Website verzichtet bewusst auf Tracking, Werbebanner und Drittanbieter-Spione. Wir nutzen einzig technisch notwendige Funktionen, damit Sie unsere Musik und Inhalte unbeschwert genießen können.
              </p>
              <div className="p-4 rounded-xl bg-[#090503] border border-[#DAA520]/30 max-w-lg mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between items-center text-[#F5F5DC]">
                  <span className="font-semibold">Essenzielle Funktionen</span>
                  <span className="text-[#DAA520] font-mono">Aktiv</span>
                </div>
                <p className="text-[#D1C7AC]/70">
                  Speichert Ihre Audio-Präferenzen und Kontaktformular-Zustände. Keine personenbezogene Profilbildung.
                </p>
              </div>
              <div>
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-xl bg-[#DAA520] text-[#070202] font-macondo text-lg font-bold hover:bg-[#e4b232] cursor-pointer"
                >
                  Einverstanden
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
