import React, { useState, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger sequential entrance animations on mount
    const timer = setTimeout(() => setIsMounted(true), 30);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    // 1. Immediately start audio playback synchronously inside the user's direct click gesture!
    audioManager.play();

    // 2. Play reverse stagger animation before triggering the Preloader & parent transition
    setIsExiting(true);
    setTimeout(() => {
      onAccept();
    }, 520);
  };

  const handleEssential = () => {
    setIsExiting(true);
    setTimeout(() => {
      onAccept();
    }, 520);
  };

  // Helper styles for stagger entrance & reverse stagger exit
  const getHeaderStyle = () => {
    if (isExiting) {
      return 'opacity-0 -translate-y-4 transition-all duration-300 ease-in delay-[300ms]';
    }
    return isMounted
      ? 'opacity-100 translate-y-0 transition-all duration-500 ease-out delay-[100ms]'
      : 'opacity-0 -translate-y-4';
  };

  const getItem1Style = () => {
    if (isExiting) {
      return 'opacity-0 translate-y-3 transition-all duration-300 ease-in delay-[240ms]';
    }
    return isMounted
      ? 'opacity-100 translate-y-0 transition-all duration-400 ease-out delay-[220ms]'
      : 'opacity-0 translate-y-3';
  };

  const getItem2Style = () => {
    if (isExiting) {
      return 'opacity-0 translate-y-3 transition-all duration-300 ease-in delay-[180ms]';
    }
    return isMounted
      ? 'opacity-100 translate-y-0 transition-all duration-400 ease-out delay-[320ms]'
      : 'opacity-0 translate-y-3';
  };

  const getItem3Style = () => {
    if (isExiting) {
      return 'opacity-0 translate-y-3 transition-all duration-300 ease-in delay-[120ms]';
    }
    return isMounted
      ? 'opacity-100 translate-y-0 transition-all duration-400 ease-out delay-[420ms]'
      : 'opacity-0 translate-y-3';
  };

  const getLegalNoteStyle = () => {
    if (isExiting) {
      return 'opacity-0 translate-y-3 transition-all duration-300 ease-in delay-[60ms]';
    }
    return isMounted
      ? 'opacity-100 translate-y-0 transition-all duration-400 ease-out delay-[520ms]'
      : 'opacity-0 translate-y-3';
  };

  const getButtonsStyle = () => {
    if (isExiting) {
      return 'opacity-0 translate-y-4 scale-95 transition-all duration-300 ease-in delay-[0ms]';
    }
    return isMounted
      ? 'opacity-100 translate-y-0 scale-100 transition-all duration-400 ease-out delay-[620ms]'
      : 'opacity-0 translate-y-4 scale-95';
  };

  return (
    <div
      className={`fixed inset-0 z-[100001] flex items-center justify-center p-3 sm:p-6 select-none transition-all duration-500 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : isMounted ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundColor: 'rgba(7, 2, 2, 0.90)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <div
        className={`relative w-full max-w-xl bg-[#140D09] border-2 border-[#DAA520] rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(218,165,32,0.25)] flex flex-col text-[#F5F5DC] overflow-hidden p-7 sm:p-10 md:p-12 transition-all duration-500 ease-out ${
          isExiting ? 'scale-95' : isMounted ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Corner Accents */}
        <div className="absolute top-2.5 left-2.5 text-[#DAA520]/60 text-sm pointer-events-none">✦</div>
        <div className="absolute top-2.5 right-2.5 text-[#DAA520]/60 text-sm pointer-events-none">✦</div>
        <div className="absolute bottom-2.5 left-2.5 text-[#DAA520]/60 text-sm pointer-events-none">✦</div>
        <div className="absolute bottom-2.5 right-2.5 text-[#DAA520]/60 text-sm pointer-events-none">✦</div>

        {/* Ornate Header with Enlarged Logo Emblem */}
        <div className={`flex flex-col items-center text-center mb-6 ${getHeaderStyle()}`}>
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

          <h2 className="font-macondo text-2xl sm:text-3xl md:text-[2rem] text-[#DAA520] font-normal tracking-wide drop-shadow-sm mb-1.5 leading-snug">
            Willkommen, schön,<br />dass du da bist!
          </h2>
          <p className="font-serif text-xs sm:text-sm text-[#F5F5DC]/80 italic">
            Bevor du die Website betrittst, ein kurzer Hinweis zum Schutz deiner Privatsphäre:
          </p>
        </div>

        {/* Core Transparency Points with Stagger Entrance & Exit */}
        <div className="space-y-3 mb-6 bg-[#0a0503]/80 border border-[#DAA520]/25 rounded-xl p-4 sm:p-5 text-xs sm:text-[0.825rem] text-[#D1C7AC] leading-relaxed">
          <div className={`flex items-start gap-2.5 ${getItem1Style()}`}>
            <Lock size={18} className="text-[#DAA520] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F5F5DC]">Lokal &amp; sicher:</strong> Alle Schriftarten, Klänge und Bilder werden direkt und datenschutzkonform vom eigenen Webserver bereitgestellt.
            </div>
          </div>

          <div className={`flex items-start gap-2.5 ${getItem2Style()}`}>
            <Music2 size={18} className="text-[#DAA520] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F5F5DC]">Rein funktionale Speicherung:</strong> Lediglich technisch notwendige Einstellungen (z.&nbsp;B. Lautstärke des Audioplayers und deine Zustimmung) werden in deinem Browser (Local Storage) gespeichert.
            </div>
          </div>

          <div className={`flex items-start gap-2.5 ${getItem3Style()}`}>
            <ShieldCheck size={18} className="text-[#DAA520] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F5F5DC]">100% Tracking- und werbefrei:</strong> Wir setzen weder Marketing-Cookies noch Google Analytics oder werbliche Tracking-Dienste ein.
            </div>
          </div>
        </div>

        {/* Privacy & Impressum Note */}
        <p className={`text-[0.76rem] sm:text-[0.8rem] text-center text-[#D1C7AC]/85 mb-6 ${getLegalNoteStyle()}`}>
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

        {/* Action Buttons: Rich medieval color tones, identical height, single line text */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 w-full ${getButtonsStyle()}`}>
          <button
            type="button"
            onClick={handleAccept}
            className="w-full sm:flex-1 h-12 sm:h-14 flex items-center justify-center px-4 sm:px-6 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#CD853F] hover:from-[#DAA520] hover:via-[#FFD700] hover:to-[#DAA520] text-[#070202] font-macondo font-bold text-base sm:text-lg border-2 border-[#FFD700] shadow-[0_4px_20px_rgba(218,165,32,0.45)] hover:shadow-[0_6px_25px_rgba(255,215,0,0.6)] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap text-center tracking-wide"
          >
            Alles klar, verstanden!
          </button>
          <button
            type="button"
            onClick={handleEssential}
            className="w-full sm:flex-1 h-12 sm:h-14 flex items-center justify-center px-4 sm:px-6 rounded-xl bg-gradient-to-b from-[#251710] to-[#140b07] hover:from-[#352117] hover:to-[#1e110b] text-[#F5F5DC] hover:text-[#FFD700] font-macondo font-bold text-base sm:text-lg border-2 border-[#DAA520]/80 hover:border-[#FFD700] shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:shadow-[0_4px_20px_rgba(218,165,32,0.35)] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap text-center tracking-wide"
          >
            Nur essenzielle Cookies
          </button>
        </div>
      </div>
    </div>
  );
};
