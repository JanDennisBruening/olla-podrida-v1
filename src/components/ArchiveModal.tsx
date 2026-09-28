import React, { useEffect } from 'react';
import { CONCERT_EVENTS, ConcertEvent } from '../data/siteContent';
import { X, Calendar, MapPin, Clock, ExternalLink, Music } from 'lucide-react';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-5xl max-h-[88vh] bg-[#120B08] border-2 border-[#DAA520]/70 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(218,165,32,0.25)] overflow-hidden flex flex-col text-[#F5F5DC]"
        onClick={(e) => e.stopPropagation()}
        style={{
          touchAction: 'pan-y'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#DAA520]/30 bg-[#1C120D] shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <Music className="text-[#DAA520] shrink-0" size={24} />
            <div>
              <h2 className="font-macondo text-xl sm:text-3xl text-[#DAA520] leading-tight">
                Konzertchronik &amp; Archiv
              </h2>
              <p className="text-xs text-[#D1C7AC]">Alle Veranstaltungen von Olla Podrida</p>
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

        {/* Content list with native smooth touch scrolling and Lenis prevention */}
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overscroll-contain"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {CONCERT_EVENTS.map((event) => (
              <div
                key={event.id}
                className="bg-[#1A100B] border border-[#DAA520]/30 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-[#DAA520] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.6875rem] font-macondo uppercase px-2.5 py-0.5 rounded bg-[#DAA520] text-[#070202] font-bold">
                      {event.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${event.isUpcoming ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-stone-800 text-stone-300'}`}>
                      {event.isUpcoming ? 'Kommend' : 'Archiv'}
                    </span>
                  </div>

                  <h3 className="font-macondo text-xl text-[#F5F5DC] mb-2">{event.title}</h3>

                  <div className="space-y-1 text-xs text-[#D1C7AC] mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#DAA520]">🗓️</span>
                      <span>{event.date}</span>
                      {event.time && <span>· {event.time}</span>}
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-[#DAA520]">📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#D1C7AC]/80 leading-relaxed mb-4">
                    {event.description}
                  </p>
                </div>

                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-[#DAA520] hover:text-white pt-2 border-t border-[#DAA520]/20 font-medium"
                  >
                    <span>Veranstaltungslink öffnen</span>
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
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
