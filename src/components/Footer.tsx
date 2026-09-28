import React, { useState } from 'react';
import { ASSETS } from '../data/siteContent';
import { useInView } from '../hooks/useInView';

interface FooterProps {
  onOpenLegal: (type: 'impressum' | 'datenschutz') => void;
  onOpenCookies: () => void;
  onOpenTermineArchive: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenCookies, onOpenTermineArchive }) => {
  const currentYear = new Date().getFullYear();
  const [cookieTooltip, setCookieTooltip] = useState(false);
  const { ref: footerRef, isInView } = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: false });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(el, { offset: -25, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#070202] pt-12 md:pt-16 pb-8 text-[#F5F5DC] overflow-hidden select-none"
    >
      {/* Smoke & Fog Atmosphere attached to the very bottom with smooth transition into black */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={ASSETS.smokeAlt}
          alt="Dunsthintergrund"
          className="w-full h-full object-cover object-bottom opacity-35 mix-blend-screen"
        />
        {/* Soft atmospheric gradient blend into general dark background - no hard cut */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#070202]/30 to-[#070202]" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#070202] via-[#070202]/80 to-transparent" />
      </div>

      <div
        className={`relative z-10 max-w-[80rem] mx-auto px-[5.5%] flex flex-col items-center transition-all duration-700 ease-out ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        
        {/* Seal Emblem .elementor-element-195d87f2 with generous breathing space above */}
        <div className="mt-2 mb-6 sm:mb-8 transition-transform duration-300 hover:scale-110 cursor-pointer" onClick={() => scrollTo('Start')}>
          <img
            src={ASSETS.footerSeal}
            alt="Olla Podrida"
            className="w-28 h-28 md:w-32 md:h-32 object-contain"
            loading="lazy"
          />
        </div>

        {/* Footer Navigation Buttons: Two cleanly stacked rows with minimal line gap */}
        <div className="w-full flex flex-col items-center gap-y-1 sm:gap-y-1.5 mb-4 font-macondo text-[0.92rem] sm:text-[1.02rem] md:text-[1.12rem] font-medium text-[#F5F5DC] text-center">
          
          {/* Main sections row */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-7 md:gap-x-8">
            <button
              onClick={() => scrollTo('ensemble')}
              className="hover:text-[#DAA520] transition-colors cursor-pointer py-0.5"
            >
              Ensemble
            </button>
            <button
              onClick={() => scrollTo('termine')}
              className="hover:text-[#DAA520] transition-colors cursor-pointer py-0.5"
            >
              Termine
            </button>
            <button
              onClick={onOpenTermineArchive}
              className="hover:text-[#DAA520] transition-colors cursor-pointer py-0.5"
            >
              Konzertchronik
            </button>
            <button
              onClick={() => scrollTo('kontakt')}
              className="hover:text-[#DAA520] transition-colors cursor-pointer py-0.5"
            >
              Kontakt
            </button>
          </div>

          {/* Legal and cookies row */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-7 md:gap-x-8">
            {/* Cookies button with Premium Tooltip */}
            <div className="relative inline-block py-0.5">
              <button
                onClick={onOpenCookies}
                onMouseEnter={() => setCookieTooltip(true)}
                onMouseLeave={() => setCookieTooltip(false)}
                className="hover:text-[#DAA520] transition-colors cursor-pointer"
              >
                Cookies
              </button>
              {cookieTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded bg-[#070202] border border-[#DAA520] text-[#F5F5DC] font-macondo text-sm whitespace-nowrap shadow-2xl z-50 pointer-events-none">
                  Nur essenzielle Cookies und Musik aus alten Zeiten!
                  <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#070202] border-r border-b border-[#DAA520] rotate-45" />
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenLegal('datenschutz')}
              className="hover:text-[#DAA520] transition-colors cursor-pointer py-0.5"
            >
              Datenschutz
            </button>
            <button
              onClick={() => onOpenLegal('impressum')}
              className="hover:text-[#DAA520] transition-colors cursor-pointer py-0.5"
            >
              Impressum
            </button>
          </div>
        </div>

        {/* Divider with Center "O" matching .elementor-element-6e50220f */}
        <div className="w-full max-w-xl my-4 flex items-center justify-center">
          <div className="flex-1 h-[1px] bg-[#DAA520]/40" />
          <div className="mx-4 text-[#DAA520] font-macondo text-xl font-bold">
            O
          </div>
          <div className="flex-1 h-[1px] bg-[#DAA520]/40" />
        </div>

        {/* Dynamic Current Year with JavaScript (new Date().getFullYear()) & Headline Font (font-macondo) */}
        <div className="text-center text-xs sm:text-sm text-[#F5F5DC]/80 font-normal space-y-1.5 mt-2">
          <p className="font-macondo text-lg sm:text-xl md:text-2xl text-[#F5F5DC] tracking-wide">
            {new Date().getFullYear()} © Olla Podrida
          </p>
          <p className="text-xs sm:text-sm text-[#F5F5DC]/70 font-dosis tracking-wider font-light">
            Design und Entwicklung: Jan Dennis Brüning ·{' '}
            <a
              href="https://www.janbruening.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DAA520] hover:underline"
            >
              www.janbruening.de
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};
