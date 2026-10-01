import React, { useState, useEffect } from 'react';
import { getAssets } from '../data/siteContent';

interface PreloaderProps {
  canStart?: boolean;
  customSubtitle?: string;
  keepVisibleOnFinish?: boolean;
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  canStart = true,
  customSubtitle,
  keepVisibleOnFinish = false,
  onComplete
}) => {
  const assets = getAssets();
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    if (!canStart) return;

    // Smooth progress simulation from 0 to 100%
    const startTime = performance.now();
    const duration = 1200; // 1.2s silky loading duration

    let animId: number;
    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Easing curve for realistic smooth deceleration
      const eased = Math.sin((rawProgress * Math.PI) / 2);
      const currentPct = Math.round(eased * 100);

      setProgress(currentPct);

      if (rawProgress < 1) {
        animId = requestAnimationFrame(updateProgress);
      } else {
        if (keepVisibleOnFinish) {
          // Keep preloader 100% solid and opaque (e.g. for login transition into dashboard)
          onComplete?.();
        } else {
          // Trigger elegant theatrical dissolve into the website
          setIsFinishing(true);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('preloader-finish'));
          }
          onComplete?.();
          setTimeout(() => {
            setIsRemoved(true);
            if (typeof window !== 'undefined') {
              (window as any).__OLLA_PAGE_READY__ = true;
              window.dispatchEvent(new CustomEvent('preloader-removed'));
            }
          }, 650);
        }
      }
    };

    animId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animId);
  }, [canStart, keepVisibleOnFinish, onComplete]);

  // If preloader has finished its dissolve and exited, remove from DOM
  if (isRemoved) return null;

  return (
    <div
      id="preloader"
      className={`fixed inset-0 z-[99999] flex flex-col justify-center items-center select-none overflow-hidden transition-all duration-700 ease-out ${
        isFinishing ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#070202',
        backgroundImage: 'radial-gradient(circle at center, rgba(142, 40, 0, 0.22) 0%, rgba(218, 165, 32, 0.12) 28%, rgba(7, 2, 2, 0.98) 72%, #070202 100%)'
      }}
    >
      {/* Ambient drifting & glowing smoke layer in background */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen overflow-hidden">
        <img
          src={assets.smokeAlt}
          alt=""
          className="w-full h-full object-cover object-center animate-fog-drift animate-mystic-glow"
        />
      </div>

      {/* Centerpiece Container */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-md w-full">
        {/* Ornate Concentric Rings & Seal */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-6">
          {/* Outer slow-spinning celestial dashed ring */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-[#DAA520]/40 animate-spin"
            style={{ animationDuration: '24s' }}
          />

          {/* Middle counter-rotating dotted ring */}
          <div
            className="absolute inset-3 sm:inset-4 rounded-full border border-dotted border-[#F5F5DC]/30 animate-spin"
            style={{
              animationDuration: '16s',
              animationDirection: 'reverse'
            }}
          />

          {/* Cardinal Antique Diamond Accents */}
          <div className="absolute top-0 text-[#DAA520] text-[0.65rem] -translate-y-1/2 drop-shadow-[0_0_8px_rgba(218,165,32,0.8)]">◆</div>
          <div className="absolute bottom-0 text-[#DAA520] text-[0.65rem] translate-y-1/2 drop-shadow-[0_0_8px_rgba(218,165,32,0.8)]">◆</div>
          <div className="absolute left-0 text-[#DAA520] text-[0.65rem] -translate-x-1/2 drop-shadow-[0_0_8px_rgba(218,165,32,0.8)]">◆</div>
          <div className="absolute right-0 text-[#DAA520] text-[0.65rem] translate-x-1/2 drop-shadow-[0_0_8px_rgba(218,165,32,0.8)]">◆</div>

          {/* Inner Golden Aura Glow */}
          <div className="absolute inset-7 rounded-full bg-gradient-to-tr from-[#DAA520]/20 via-[#8E2800]/25 to-transparent blur-md animate-pulse" />

          {/* Center Medallion: Authentic Olla Podrida Seal */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center p-2 filter drop-shadow-[0_0_24px_rgba(218,165,32,0.45)] transition-transform duration-300">
            <img
              src={assets.footerSeal}
              alt="Ensemble Olla Podrida Siegel"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        </div>

        {/* Ensemble Title */}
        <h1 className="font-macondo text-2xl sm:text-3xl md:text-4xl text-[#F5F5DC] tracking-wide font-normal mb-1.5 text-center drop-shadow-[0_2px_12px_rgba(218,165,32,0.5)]">
          Ensemble Olla Podrida
        </h1>

        {/* Subtitle */}
        <p className="font-serif text-[0.68rem] sm:text-xs text-[#DAA520]/85 uppercase tracking-[0.28em] text-center mb-6 drop-shadow-sm font-medium">
          {customSubtitle || 'Klangvielfalt aus Mittelalter & Renaissance'}
        </p>

        {/* Slender Medieval Filigree Progress Bar */}
        <div className="w-48 sm:w-60 h-[3px] bg-[#DAA520]/20 rounded-full relative overflow-hidden mb-3 border border-[#DAA520]/30 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#8E2800] via-[#DAA520] to-[#F5F5DC] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(218,165,32,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Flourish Counter */}
        <div className="flex items-center space-x-2 text-[0.72rem] font-serif text-[#F5F5DC]/70 tracking-widest">
          <span className="text-[#DAA520]/70 text-[0.65rem]">❧</span>
          <span className="font-mono text-[#DAA520] font-light">{progress}%</span>
          <span className="text-[#DAA520]/70 text-[0.65rem]">❧</span>
        </div>
      </div>
    </div>
  );
};
