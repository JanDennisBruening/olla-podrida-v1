import React, { useState, useEffect } from 'react';
import { X, Shield, BookOpen, Cookie, ExternalLink } from 'lucide-react';
import { getLegalConfig } from '../data/siteContent';

interface LegalModalProps {
  type: 'impressum' | 'datenschutz' | 'cookies' | null;
  onClose: () => void;
  onSwitchType: (type: 'impressum' | 'datenschutz' | 'cookies') => void;
  onRevokeConsent?: () => void;
  sessionId?: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, onSwitchType, onRevokeConsent, sessionId }) => {
  const legalConfig = getLegalConfig();
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [displayedType, setDisplayedType] = useState<'impressum' | 'datenschutz' | 'cookies' | null>(type);

  useEffect(() => {
    if (type) {
      setDisplayedType(type);
      setIsClosing(false);
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setIsMounted(true);
        });
      });
      return () => cancelAnimationFrame(raf1);
    } else {
      setIsMounted(false);
      setIsClosing(false);
    }
  }, [type]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsMounted(false);
      setIsClosing(false);
    }, 320);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (type) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [type, isClosing]);

  const activeType = type || (isClosing ? displayedType : null);
  if (!activeType) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100050] flex items-center justify-center p-3 sm:p-6 transition-all duration-320 ease-out select-none ${
        isMounted && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        backgroundColor: 'rgba(7, 2, 2, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      onClick={handleClose}
    >
      <div
        data-lenis-prevent="true"
        className={`relative w-full max-w-3xl max-h-[78vh] md:max-h-[72vh] bg-[#120B08] border-2 border-[#DAA520]/70 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(218,165,32,0.25)] flex flex-col text-[#F5F5DC] overflow-hidden my-auto transition-all duration-350 cubic-bezier(0.16, 1, 0.3, 1) ${
          isMounted && !isClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.93] translate-y-5'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          touchAction: 'pan-y'
        }}
      >
        {/* Top Gold Corner Accents */}
        <div className="absolute top-2.5 left-2.5 text-[#DAA520]/50 text-xs pointer-events-none">✦</div>
        <div className="absolute top-2.5 right-2.5 text-[#DAA520]/50 text-xs pointer-events-none">✦</div>
        <div className="absolute bottom-2.5 left-2.5 text-[#DAA520]/50 text-xs pointer-events-none">✦</div>
        <div className="absolute bottom-2.5 right-2.5 text-[#DAA520]/50 text-xs pointer-events-none">✦</div>

        {/* Modal Header */}
        <div className={`flex-none flex items-center justify-between px-6 py-4 border-b border-[#DAA520]/30 bg-[#1C120D] transition-all duration-400 ease-out ${
          isMounted && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <div className="flex items-center space-x-3">
            {activeType === 'impressum' && <BookOpen className="text-[#DAA520]" size={24} />}
            {activeType === 'datenschutz' && <Shield className="text-[#DAA520]" size={24} />}
            {activeType === 'cookies' && <Cookie className="text-[#DAA520]" size={24} />}
            <h2 className="font-macondo text-2xl sm:text-3xl text-[#DAA520]">
              {activeType === 'impressum' && 'Impressum'}
              {activeType === 'datenschutz' && 'Datenschutzerklärung'}
              {activeType === 'cookies' && 'Cookie & Consent'}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-[#D1C7AC] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Schließen"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tab switch inside modal */}
        <div className={`flex-none flex px-6 pt-3 border-b border-[#DAA520]/20 bg-[#0E0704] text-xs font-macondo text-lg gap-4 transition-all duration-400 delay-75 ease-out ${
          isMounted && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <button
            onClick={() => onSwitchType('impressum')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeType === 'impressum' ? 'border-[#DAA520] text-[#DAA520]' : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            Impressum
          </button>
          <button
            onClick={() => onSwitchType('datenschutz')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeType === 'datenschutz' ? 'border-[#DAA520] text-[#DAA520]' : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            Datenschutz
          </button>
          <button
            onClick={() => onSwitchType('cookies')}
            className={`pb-2 border-b-2 transition-colors cursor-pointer ${
              activeType === 'cookies' ? 'border-[#DAA520] text-[#DAA520]' : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            Cookie &amp; Consent
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
          {activeType === 'impressum' && (
            <div 
              className="space-y-6 olla-legal-html transition-opacity duration-300"
              dangerouslySetInnerHTML={{ __html: legalConfig.impressumHtml }}
            />
          )}

          {/* DATENSCHUTZERKLÄRUNG (DSGVO / DDG) */}
          {activeType === 'datenschutz' && (
            <div 
              className="space-y-6 olla-legal-html transition-opacity duration-300"
              dangerouslySetInnerHTML={{ __html: legalConfig.datenschutzHtml }}
            />
          )}

          {/* COOKIES INFO & ERKLÄRUNG */}
          {/* COOKIE & CONSENT */}
          {activeType === 'cookies' && (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-3">
                <div className="inline-flex p-4 rounded-full bg-[#DAA520]/20 text-[#DAA520]">
                  <Cookie size={44} />
                </div>
                <h3 className="font-macondo text-2xl sm:text-3xl text-[#DAA520]">
                  Cookie &amp; Consent
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
                <h4 className="font-macondo text-xl text-[#F5F5DC]">1. Übersicht aller genutzten Speicherungen &amp; Cookies (Cookie &amp; Consent)</h4>
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
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-2.5 rounded-xl bg-[#DAA520] text-[#070202] font-macondo text-lg font-bold hover:bg-[#e4b232] cursor-pointer shadow-lg active:scale-95 transition-all"
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
            type="button"
            onClick={handleClose}
            className="px-6 py-2 rounded-lg bg-[#2A1B14] hover:bg-[#DAA520] hover:text-[#070202] text-[#DAA520] font-macondo text-base transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
