import React, { useState, useEffect } from 'react';
import { getAudioConfig } from '../data/siteContent';
import { audioManager } from '../utils/audioManager';

export const AudioPlayer: React.FC = () => {
  const config = getAudioConfig();
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

  if (!config.enabled) {
    return null;
  }

  return (
    <div
      className="audio-player fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[10030] select-none"
    >
      <button
        type="button"
        onClick={togglePlay}
        className="relative group cursor-pointer flex items-center justify-center w-20 h-20 md:w-24 md:h-24 transition-transform duration-300 hover:scale-105 active:scale-95 bg-transparent border-none p-0 focus:outline-none"
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
            className="font-macondo font-bold text-[9.5px] md:text-[10px] tracking-[0.22em] uppercase transition-colors duration-300"
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

        {/* Inner Round Button with musical note and golden loop glow */}
        <div
          id="play-pause-button"
          className={`relative z-10 w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-md pointer-events-none ${
            isPlaying
              ? 'bg-[#221812] text-[#FFD700] border border-[#DAA520] animate-gold-glow-loop'
              : 'bg-[#151210] text-[#DAA520]/80 hover:text-[#DAA520] border border-[#DAA520]/40'
          }`}
        >
          <span
            className={`text-xl md:text-2xl transition-transform duration-300 ${
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
    </div>
  );
};
