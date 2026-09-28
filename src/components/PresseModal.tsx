import React, { useState, useEffect } from 'react';
import { getPressConfig } from '../data/siteContent';
import { X, Newspaper, Download, Copy, Check, ExternalLink, Image as ImageIcon, Camera, Mail, ShieldCheck } from 'lucide-react';

interface PresseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresseModal: React.FC<PresseModalProps> = ({ isOpen, onClose }) => {
  const pressConfig = getPressConfig();
  const [activeTab, setActiveTab] = useState<'text' | 'logos' | 'photos' | 'contact'>('text');
  const [copied, setCopied] = useState(false);
  const [logoBgs, setLogoBgs] = useState<Record<string, 'light' | 'dark'>>({
    'logo-banner': 'light',
    'logo-emblem': 'dark',
    'logo-seal': 'dark',
    'logo-print': 'dark',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      setActiveTab('text');
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(pressConfig.introText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is not available
      const textarea = document.createElement('textarea');
      textarea.value = pressConfig.introText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#120B08] border-2 border-[#DAA520]/70 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(218,165,32,0.25)] overflow-hidden flex flex-col text-[#F5F5DC]"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#DAA520]/30 bg-[#1C120D] shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <Newspaper className="text-[#DAA520] shrink-0" size={26} />
            <div>
              <h2 className="font-macondo text-xl sm:text-3xl text-[#DAA520] leading-tight">
                {pressConfig.title || 'Presse & Medienmaterial'}
              </h2>
              <p className="text-xs text-[#D1C7AC] line-clamp-1">
                {pressConfig.subtitle || 'Materialien für Redaktionen, Veranstalter & Presseberichte'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#070202] border border-[#DAA520]/50 text-[#F5F5DC] hover:text-[#DAA520] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Schließen"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap px-4 sm:px-6 border-b border-[#DAA520]/20 bg-[#170E0A] gap-2 sm:gap-6 text-sm font-macondo">
          <button
            onClick={() => setActiveTab('text')}
            className={`py-2.5 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'text'
                ? 'border-[#DAA520] text-[#DAA520] font-bold'
                : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            <span>📜 Pressetext &amp; Profil</span>
          </button>
          <button
            onClick={() => setActiveTab('logos')}
            className={`py-2.5 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'logos'
                ? 'border-[#DAA520] text-[#DAA520] font-bold'
                : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            <ImageIcon size={16} />
            <span>Logos &amp; Grafiken</span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-2.5 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'photos'
                ? 'border-[#DAA520] text-[#DAA520] font-bold'
                : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            <Camera size={16} />
            <span>Pressefotos &amp; Ansichten</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-2.5 border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'border-[#DAA520] text-[#DAA520] font-bold'
                : 'border-transparent text-[#D1C7AC] hover:text-[#DAA520]'
            }`}
          >
            <Mail size={16} />
            <span>Pressekontakt</span>
          </button>
        </div>

        {/* Modal Body */}
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          {/* TAB 1: Pressetext & Profil */}
          {activeTab === 'text' && (
            <div className="space-y-6">
              <div className="bg-[#1A100B] border border-[#DAA520]/40 rounded-xl p-5 sm:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h3 className="font-macondo text-xl sm:text-2xl text-[#DAA520]">
                    Pressetext (Kurzfassung für Ankündigungen &amp; Berichte)
                  </h3>
                  <button
                    onClick={handleCopyText}
                    className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#2A1B14] hover:bg-[#DAA520] hover:text-[#070202] text-[#DAA520] text-xs font-macondo transition-all self-start sm:self-auto cursor-pointer border border-[#DAA520]/40"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400 font-bold">In die Zwischenablage kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Text kopieren</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-sm sm:text-base leading-relaxed text-[#F5F5DC]/90 font-dosis bg-[#120B08]/70 p-4 rounded-lg border border-[#DAA520]/20 whitespace-pre-line">
                  {pressConfig.introText}
                </div>
              </div>

              {/* Factsheet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1A100B] border border-[#DAA520]/30 rounded-xl p-4 sm:p-5">
                  <h4 className="font-macondo text-lg text-[#DAA520] mb-2">Kurzsteckbrief</h4>
                  <ul className="text-xs sm:text-sm text-[#D1C7AC] space-y-1.5 font-dosis">
                    <li><strong className="text-[#F5F5DC]">Ensemble:</strong> Olla Podrida</li>
                    <li><strong className="text-[#F5F5DC]">Genre:</strong> Musik des Mittelalters, Renaissance &amp; frühe Neuzeit</li>
                    <li><strong className="text-[#F5F5DC]">Besetzung:</strong> 6–7 Musiker/innen</li>
                    <li><strong className="text-[#F5F5DC]">Leitung:</strong> Susanne Hoffmann</li>
                    <li><strong className="text-[#F5F5DC]">Herkunft:</strong> Landkreis Osnabrück</li>
                  </ul>
                </div>

                <div className="bg-[#1A100B] border border-[#DAA520]/30 rounded-xl p-4 sm:p-5">
                  <h4 className="font-macondo text-lg text-[#DAA520] mb-2">Instrumentarium</h4>
                  <p className="text-xs sm:text-sm text-[#D1C7AC] leading-relaxed font-dosis">
                    Krummhörner, historische Blockflöten (Sopran bis Bass), Gemshorn, Renaissance-Sackpfeifen,
                    Keltische Harfe, Psalter, Renaissancelaute, Cister, Landsknechtstrommel, Davul, Darabuka,
                    Glockenspiel, Schellen und mehrstimmiger Gesang.
                  </p>
                </div>
              </div>

              {/* Usage note */}
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-[#1C120D] border border-[#DAA520]/25 text-xs text-[#D1C7AC]">
                <ShieldCheck size={20} className="text-[#DAA520] shrink-0 mt-0.5" />
                <p>{pressConfig.pressNote}</p>
              </div>
            </div>
          )}

          {/* TAB 2: Logos & Grafiken */}
          {activeTab === 'logos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {pressConfig.logos.map((logo) => {
                  const currentBg = logoBgs[logo.id] || (logo.id === 'logo-banner' ? 'light' : 'dark');
                  const isLight = currentBg === 'light';

                  return (
                    <div
                      key={logo.id}
                      className="bg-[#1A100B] border border-[#DAA520]/30 rounded-xl p-4 flex flex-col justify-between hover:border-[#DAA520] transition-colors"
                    >
                      <div>
                        {/* Logo Display Container with interactive dark/light background preview */}
                        <div
                          className={`h-44 sm:h-48 rounded-lg flex items-center justify-center p-4 mb-3 border overflow-hidden relative transition-colors duration-200 ${
                            isLight
                              ? 'bg-[#FAF6EE] border-[#DAA520]/40 shadow-inner'
                              : 'bg-[#070202] border-[#DAA520]/25'
                          }`}
                        >
                          <img
                            src={logo.imageUrl}
                            alt={logo.title}
                            className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                          />

                          {/* Background contrast toggle button */}
                          <button
                            type="button"
                            onClick={() =>
                              setLogoBgs((prev) => ({
                                ...prev,
                                [logo.id]: isLight ? 'dark' : 'light',
                              }))
                            }
                            className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[0.65rem] font-macondo transition-all flex items-center space-x-1 cursor-pointer border ${
                              isLight
                                ? 'bg-[#1C120D] text-[#DAA520] border-[#DAA520]/50 hover:bg-[#2A1B14]'
                                : 'bg-[#FAF6EE] text-[#1C120D] border-stone-300 hover:bg-white font-bold'
                            }`}
                            title="Hintergrund Hell/Dunkel umschalten"
                          >
                            <span>{isLight ? '🌙 Dunkel' : '☀️ Hell'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-macondo text-lg text-[#F5F5DC] line-clamp-1">{logo.title}</h4>
                          {logo.format && (
                            <span className="text-[0.65rem] font-macondo uppercase px-2 py-0.5 rounded bg-[#DAA520] text-[#070202] font-bold shrink-0">
                              {logo.format}
                            </span>
                          )}
                        </div>

                        {logo.subtitle && (
                          <p className="text-xs text-[#D1C7AC] mb-2">{logo.subtitle}</p>
                        )}

                        {logo.fileSize && (
                          <p className="text-[0.7rem] text-[#D1C7AC]/70">Dateigröße: {logo.fileSize}</p>
                        )}
                      </div>

                    <div className="flex items-center space-x-2 pt-3 mt-3 border-t border-[#DAA520]/20">
                      <a
                        href={logo.downloadUrl || logo.imageUrl}
                        download
                        className="flex-1 inline-flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-[#DAA520] text-[#070202] font-macondo text-xs font-bold hover:bg-[#E5B533] transition-colors"
                      >
                        <Download size={14} />
                        <span>Herunterladen</span>
                      </a>
                      <a
                        href={logo.downloadUrl || logo.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#2A1B14] text-[#DAA520] hover:text-white border border-[#DAA520]/30 transition-colors"
                        title="In voller Auflösung öffnen"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                );
              })}
              </div>

              <div className="p-4 rounded-xl bg-[#1C120D] border border-[#DAA520]/25 text-xs text-[#D1C7AC] flex items-center justify-between">
                <span>Transparente PNGs eignen sich ideal für Plakate, Flyer und dunkle wie helle Hintergründe.</span>
                <span className="text-[#DAA520] font-macondo">Ensemble Olla Podrida</span>
              </div>
            </div>
          )}

          {/* TAB 3: Pressefotos & Ansichten */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {pressConfig.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-[#1A100B] border border-[#DAA520]/30 rounded-xl p-4 flex flex-col justify-between hover:border-[#DAA520] transition-colors"
                  >
                    <div>
                      <div className="h-48 sm:h-56 rounded-lg bg-[#070202] flex items-center justify-center mb-3 border border-[#DAA520]/20 overflow-hidden relative group">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-xs text-white/90">Klicken zum Öffnen</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-macondo text-lg text-[#F5F5DC] line-clamp-1">{photo.title}</h4>
                        {photo.format && (
                          <span className="text-[0.65rem] font-macondo uppercase px-2 py-0.5 rounded bg-[#2A1B14] text-[#DAA520] border border-[#DAA520]/40 font-bold shrink-0">
                            {photo.format}
                          </span>
                        )}
                      </div>

                      {photo.subtitle && (
                        <p className="text-xs text-[#D1C7AC] mb-2">{photo.subtitle}</p>
                      )}

                      {photo.credit && (
                        <p className="text-[0.7rem] text-[#DAA520]/80">Foto: {photo.credit}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-3 mt-3 border-t border-[#DAA520]/20">
                      <a
                        href={photo.downloadUrl || photo.imageUrl}
                        download
                        className="flex-1 inline-flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-[#DAA520] text-[#070202] font-macondo text-xs font-bold hover:bg-[#E5B533] transition-colors"
                      >
                        <Download size={14} />
                        <span>Foto herunterladen</span>
                      </a>
                      <a
                        href={photo.downloadUrl || photo.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#2A1B14] text-[#DAA520] hover:text-white border border-[#DAA520]/30 transition-colors"
                        title="Vollbild öffnen"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-xl bg-[#1C120D] border border-[#DAA520]/25 text-xs text-[#D1C7AC]">
                <ShieldCheck size={20} className="text-[#DAA520] shrink-0 mt-0.5" />
                <p>
                  Alle Fotos stehen Redaktionen, Printmedien und Online-Magazinen für die Berichterstattung über Olla Podrida frei zur Verfügung. Bildnachweis: © Jan Dennis Brüning / Ensemble Olla Podrida.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Pressekontakt */}
          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-[#1A100B] border border-[#DAA520]/40 rounded-xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-[#2A1B14] border-2 border-[#DAA520] flex items-center justify-center mx-auto text-[#DAA520]">
                  <Mail size={30} />
                </div>

                <h3 className="font-macondo text-2xl text-[#DAA520]">Presseanfragen &amp; Redaktionskontakt</h3>
                <p className="text-sm text-[#D1C7AC] leading-relaxed">
                  Sie planen einen Bericht, benötigen Bildmaterial in speziellen Formaten oder möchten ein Interview mit dem Ensemble vereinbaren? Wir helfen Ihnen gerne kurzfristig weiter.
                </p>

                <div className="bg-[#120B08] border border-[#DAA520]/30 rounded-xl p-5 text-left space-y-2.5 font-dosis">
                  <div>
                    <span className="text-xs text-[#D1C7AC] uppercase tracking-wider block">Ansprechpartnerin:</span>
                    <span className="text-base text-[#F5F5DC] font-bold">{pressConfig.contactName || 'Susanne Hoffmann (Ensembleleitung)'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#D1C7AC] uppercase tracking-wider block">E-Mail für Presseanfragen:</span>
                    <a
                      href={`mailto:${pressConfig.contactEmail || 'info@olla-podrida.de'}?subject=Presseanfrage%20Olla%20Podrida`}
                      className="text-base text-[#DAA520] hover:underline font-bold"
                    >
                      {pressConfig.contactEmail || 'info@olla-podrida.de'}
                    </a>
                  </div>
                  {pressConfig.contactPhone && (
                    <div>
                      <span className="text-xs text-[#D1C7AC] uppercase tracking-wider block">Telefon:</span>
                      <a href={`tel:${pressConfig.contactPhone}`} className="text-base text-[#F5F5DC]">
                        {pressConfig.contactPhone}
                      </a>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#D1C7AC]/70">
                  Antworten auf Presse- und Redaktionsanfragen erfolgen in der Regel innerhalb von 24–48 Stunden.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#DAA520]/30 bg-[#1C120D] flex items-center justify-between shrink-0">
          <p className="text-xs text-[#D1C7AC]/70 hidden sm:block">
            Ensemble Olla Podrida · Presse- &amp; Mediendienst
          </p>
          <button
            onClick={onClose}
            className="px-6 py-1.5 rounded-lg bg-[#2A1B14] hover:bg-[#DAA520] hover:text-[#070202] text-[#DAA520] font-macondo text-base transition-colors cursor-pointer ml-auto"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
