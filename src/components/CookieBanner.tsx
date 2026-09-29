import React, { useState } from 'react';
import { getAssets } from '../data/siteContent';
import { audioManager } from '../utils/audioManager';
import { ShieldCheck, Music2, Lock } from 'lucide-react';

interface CookieBannerProps {
  onAccept: () => void;
  onOpenPrivacy: () => void;
  onOpenImpressum: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onOpenPrivacy, onOpenImpressum }) => {
  const assets = getAssets();
  const [isClosing, setIsClosing] = useState(false);

  const handleAccept = () => {
    // 1. Immediately start audio playback synchronously inside the user's direct click gesture!
    audioManager.play();

    // 2. Smoothly animate closure and notify parent
    setIsClosing(true);
    setTimeout(() => {
      onAccept();
    }, 350);
  };

  const handleEssential = () => {
    setIsClosing(true);
    setTimeout(() => {
      onAccept();
    }, 350);
  };

  return (
    <div
      className={`fixed inset-0 z-[100001] flex items-center justify-center p-3 sm:p-5 select-none transition-all duration-400 ease-out ${
        isClosing ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: 'rgba(7, 2, 2, 0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="relative w-full max-w-lg bg-[#140D09] border-2 border-[#DAA520] rounded-2xl shadow-[0_16px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(218,165,32,0.25)] flex flex-col text-[#F5F5DC] overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Corner Accents */}
        <div className="absolute top-2 left-2 text-[#DAA520]/50 text-xs pointer-events-none">✦</div>
        <div className="absolute top-2 right-2 text-[#DAA520]/50 text-xs pointer-events-none">✦</div>
        <div className="absolute bottom-2 left-2 text-[#DAA520]/50 text-xs pointer-events-none">✦</div>
        <div className="absolute bottom-2 right-2 text-[#DAA520]/50 text-xs pointer-events-none">✦</div>

        {/* Ornate Header with Enlarged Logo Emblem (+20% for optimal recognition) */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 flex items-center justify-center">
            {/* Spinning antique dashed outer circle */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-[#DAA520]/60 animate-spin"
              style={{ animationDuration: '30s' }}
            />
            {/* Inner illuminated medallion container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1e130c] border-2 border-[#DAA520] p-1.5 shadow-[0_0_20px_rgba(218,165,32,0.5)] flex items-center justify-center">
              <img
                src={assets.footerSeal}
                alt="Ensemble Olla Podrida"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
          </div>

          <h2 className="font-macondo text-2xl sm:text-3xl text-[#DAA520] font-normal tracking-wide drop-shadow-sm mb-1 leading-snug">
            Willkommen, schön,<br />dass du da bist!
          </h2>
          <p className="font-serif text-xs sm:text-sm text-[#F5F5DC]/80 italic">
            Bevor du die Website betrittst, ein kurzer Hinweis zum Schutz deiner Privatsphäre:
          </p>
        </div>

        {/* Core Transparency Points */}
        <div className="space-y-3 mb-6 bg-[#0a0503]/80 border border-[#DAA520]/25 rounded-xl p-4 text-xs sm:text-[0.8125rem] text-[#D1C7AC] leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Lock size={18} className="text-[#DAA520] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F5F5DC]">Lokal &amp; sicher:</strong> Alle Schriftarten, Klänge und Bilder werden direkt und datenschutzkonform von unserem eigenen Server bereitgestellt.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Music2 size={18} className="text-[#DAA520] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F5F5DC]">Rein funktionale Speicherung:</strong> Lediglich technisch notwendige Einstellungen (z.&nbsp;B. Lautstärke des Audioplayers und deine Zustimmung) werden in deinem Browser (Local Storage) gespeichert.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-[#DAA520] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F5F5DC]">100% Tracking- und werbefrei:</strong> Wir setzen weder Marketing-Cookies noch Google Analytics oder werbliche Tracking-Dienste ein.
            </div>
          </div>
        </div>

        {/* Privacy & Impressum Note */}
        <p className="text-[0.76rem] text-center text-[#D1C7AC]/85 mb-6">
          Ausführliche Informationen findest du jederzeit in unserer{' '}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-[#DAA520] underline hover:text-[#FFD700] transition-colors cursor-pointer font-medium"
          >
            Datenschutzerklärung
          </button>{' '}
          sowie im{' '}
          <button
            type="button"
            onClick={onOpenImpressum}
            className="text-[#DAA520] underline hover:text-[#FFD700] transition-colors cursor-pointer font-medium"
          >
            Impressum
          </button>.
        </p>

        {/* Action Buttons: "Alles klar, verstanden!" plays music immediately */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="w-full sm:flex-1 py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-[#DAA520] via-[#f7d984] to-[#DAA520] text-[#070202] font-macondo text-lg sm:text-xl font-bold tracking-wide shadow-[0_4px_16px_rgba(218,165,32,0.4)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
          >
            Alles klar, verstanden!
          </button>
          <button
            type="button"
            onClick={handleEssential}
            className="w-full sm:w-auto py-2 sm:py-2.5 px-4 rounded-xl border border-[#DAA520]/40 text-[#D1C7AC] hover:text-[#F5F5DC] hover:border-[#DAA520] font-macondo text-sm transition-all cursor-pointer text-center"
          >
            Nur essenzielle Cookies
          </button>
        </div>
      </div>
    </div>
  );
};
