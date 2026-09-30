import React, { useState, useEffect } from 'react';
import { getAudioConfig, getSiteTexts } from '../data/siteContent';
import { audioManager } from '../utils/audioManager';

export const AudioPlayer: React.FC = () => {
  const config = getAudioConfig();
  const texts = getSiteTexts();
  const [isPlaying, setIsPlaying] = useState(audioManager.isPlaying());

  const buttonText = config.buttonText || '• Musik an / aus • Musik an / aus';

  useEffect(() => {
    // Synchronize play state with global audio manager
    const unsubscribe = audioManager.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const togglePlay = () => {
    audioManager.toggle();
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!config.enabled) {
    return null;
  }

  return (
    <div
      className="audio-player fixed bottom-5 right-4 sm:bottom-7 sm:right-6 md:bottom-9 md:right-8 z-[10030] select-none flex flex-col items-center gap-1.5"
    >
      <button
        type="button"
        onClick={togglePlay}
        className="relative group cursor-pointer flex items-center justify-center w-16 h-16 md:w-[4.8rem] md:h-[4.8rem] transition-transform duration-300 hover:scale-105 active:scale-95 bg-transparent border-none p-0 focus:outline-none"
        aria-label={isPlaying ? 'Musik pausieren' : 'Musik abspielen'}
        title={config.title ? `${config.title} - ${isPlaying ? 'Pausieren' : 'Abspielen'}` : (isPlaying ? 'Musik pausieren' : 'Musik abspielen')}
      >
        {/* Ambient Dark Backdrop behind the badge with golden glow loop when playing */}
        <div
          className={`absolute inset-1 rounded-full bg-[#070202]/85 backdrop-blur-sm border transition-all duration-500 shadow-[0_4px_16px_rgba(0,0,0,0.8)] pointer-events-none ${
            isPlaying ? 'border-[#DAA520] animate-gold-glow-loop' : 'border-[#DAA520]/30'
          }`}
        />

        {/* Circular Curved SVG Text "MUSIK AN / AUS" - Rotates continuously, spins faster with energy when playing */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none origin-center"
          style={{
            animation: isPlaying ? 'spin 12s linear infinite' : 'spin 24s linear infinite'
          }}
          viewBox="0 0 120 120"
        >
          <defs>
            <path
              id="musicCirclePath"
              d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
            />
          </defs>
          <text
            className="font-macondo font-bold text-[9px] md:text-[9.5px] tracking-[0.2em] uppercase transition-colors duration-300"
            fill={isPlaying ? '#FFD700' : '#DAA520'}
            style={{
              filter: isPlaying
                ? 'drop-shadow(0 0 4px rgba(218,165,32,0.8))'
                : 'drop-shadow(0 1px 2px rgba(0,0,0,0.95))'
            }}
          >
            <textPath
              href="#musicCirclePath"
              xlinkHref="#musicCirclePath"
              startOffset="50%"
              textAnchor="middle"
            >
              {buttonText}
            </textPath>
          </text>
        </svg>

        {/* Inner Round Button with musical note and golden loop glow (20% smaller) */}
        <div
          id="play-pause-button"
          className={`relative z-10 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md pointer-events-none ${
            isPlaying
              ? 'bg-[#221812] text-[#FFD700] border border-[#DAA520] animate-gold-glow-loop'
              : 'bg-[#151210] text-[#DAA520]/80 hover:text-[#DAA520] border border-[#DAA520]/40'
          }`}
        >
          <span
            className={`text-base md:text-lg transition-transform duration-300 ${
              isPlaying
                ? 'scale-110 drop-shadow-[0_0_8px_rgba(218,165,32,0.9)] animate-pulse text-[#FFD700]'
                : 'group-hover:scale-110 text-[#DAA520]'
            }`}
          >
            ♫
          </span>

          {/* Pulse ring when playing */}
          {isPlaying && (
            <span className="absolute -inset-0.5 rounded-full border border-[#DAA520]/50 animate-ping opacity-60 pointer-events-none" />
          )}
        </div>
      </button>

      {/* Nach oben (Scroll-to-top) Button directly below the music button (-20% size) */}
      <button
        type="button"
        onClick={handleScrollToTop}
        className="group flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-[#070202]/90 border border-[#DAA520]/50 hover:border-[#DAA520] text-[#DAA520] hover:text-[#FFD700] text-[9.5px] sm:text-[10px] font-macondo tracking-wider shadow-[0_3px_10px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title="Zurück zum Seitenanfang scrollen"
        aria-label="Nach oben scrollen"
      >
        <span className="text-[8.5px] sm:text-[9px] transition-transform duration-300 group-hover:-translate-y-0.5 font-bold">▲</span>
        <span className="font-semibold whitespace-nowrap">{texts.scrollTop || 'Nach oben'}</span>
      </button>
    </div>
  );
};
