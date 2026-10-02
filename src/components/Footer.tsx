import React, { useState, useRef, useEffect } from 'react';
import { getAssets, getSiteTexts } from '../data/siteContent';
import { useInView } from '../hooks/useInView';
import { Lock } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'impressum' | 'datenschutz') => void;
  onOpenCookies: () => void;
  onOpenTermineArchive: () => void;
  onOpenPresse?: () => void;
  onOpenLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenCookies, onOpenTermineArchive, onOpenPresse, onOpenLogin }) => {
  const assets = getAssets();
  const texts = getSiteTexts();
  const currentYear = new Date().getFullYear();
  const [cookieTooltip, setCookieTooltip] = useState(false);
  const { ref: footerRef, isInView } = useInView<HTMLElement>({ threshold: 0.05, rootMargin: '0px 0px -40px 0px', triggerOnce: true });

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

  const openJdbPopup = () => {
    // 1. Trigger any element bound by embed.js
    const bound = document.querySelector('[data-jdb-footer-bound="true"]') as HTMLElement | null;
    if (bound) {
      bound.click();
      return;
    }
    const hiddenTrigger = document.getElementById('jdb-footer-trigger') as HTMLElement | null;
    if (hiddenTrigger) {
      hiddenTrigger.click();
      return;
    }
    // 2. Graceful fallback: navigate directly to developer website
    window.open('https://janbruening.de/', '_blank', 'noopener,noreferrer');
  };

  const handleCreditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.getAttribute('data-jdb-footer-bound') === 'true') {
      return;
    }
    e.preventDefault();
    openJdbPopup();
  };

  const handleCreditKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.currentTarget.getAttribute('data-jdb-footer-bound') === 'true') {
        return;
      }
      e.preventDefault();
      openJdbPopup();
    }
  };

  useEffect(() => {
    // 1. Clean up any rogue fallback credit injected by embed.js outside root
    const cleanupRogues = () => {
      document.querySelectorAll('.jdb-footer-credit').forEach((el) => {
        el.remove();
      });
    };
    cleanupRogues();
    const t = setTimeout(cleanupRogues, 400);

    // 2. Prevent the jarring white loading box flash from embed.js Shadow DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.shadowRoot) {
            const style = document.createElement('style');
            style.textContent = `
              .status {
                opacity: 0 !important;
                animation: jdbStatusDelayedFade 0.25s ease 0.6s forwards !important;
              }
              @keyframes jdbStatusDelayedFade {
                to { opacity: 1 !important; }
              }
            `;
            node.shadowRoot.appendChild(style);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });

    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#070202] pt-12 md:pt-16 pb-8 text-[#F5F5DC] overflow-hidden select-none"
    >
      {/* Smoke & Fog Atmosphere attached to the very bottom with smooth transition into black */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="w-full h-full animate-fog-drift" style={{ animationDuration: '36s' }}>
          <img
            src={assets.smokeAlt}
            alt="Dunsthintergrund"
            className="w-full h-full object-cover object-bottom opacity-35 mix-blend-screen scale-105"
          />
        </div>
        {/* Soft atmospheric gradient blend into general dark background - no hard cut */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#070202]/30 to-[#070202]" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#070202] via-[#070202]/80 to-transparent" />
      </div>

      <div
        className="relative z-10 max-w-[80rem] mx-auto px-[5.5%] flex flex-col items-center"
      >
        
        {/* Seal Emblem .elementor-element-195d87f2 with generous breathing space above */}
        <div
          className={`mt-2 mb-6 sm:mb-8 cursor-pointer transition-all duration-800 ease-out transform ${
            isInView ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-6'
          }`}
          onClick={() => scrollTo('Start')}
        >
          <img
            src={assets.footerSeal}
            alt="Olla Podrida"
            className="w-28 h-28 md:w-32 md:h-32 object-contain p-1 overflow-visible hover:scale-110 transition-transform duration-300 drop-shadow-[0_4px_12px_rgba(218,165,32,0.3)]"
            loading="lazy"
          />
        </div>

        {/* Footer Navigation Buttons: Konzertchronik, Presse, Cookie & Consent, Datenschutz, Impressum */}
        <div
          className={`w-full flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 lg:gap-x-8 gap-y-2 mb-4 font-macondo text-[0.95rem] sm:text-[1.05rem] md:text-[1.12rem] font-medium text-[#F5F5DC] text-center transition-all duration-700 delay-150 ease-out transform ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={onOpenTermineArchive}
            className="hover:text-[#DAA520] transition-colors cursor-pointer py-0.5"
          >
            Konzertchronik
          </button>
          <button
            onClick={onOpenPresse}
            className="hover:text-[#DAA520] transition-colors cursor-pointer py-0.5"
          >
            {texts.navPresse || 'Presse'}
          </button>

          {/* Cookies und Consent button with Premium Tooltip */}
          <div className="relative inline-block py-0.5">
            <button
              onClick={onOpenCookies}
              onMouseEnter={() => setCookieTooltip(true)}
              onMouseLeave={() => setCookieTooltip(false)}
              className="hover:text-[#DAA520] transition-colors cursor-pointer"
            >
              Cookie &amp; Consent
            </button>
            {cookieTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded bg-[#070202] border border-[#DAA520] text-[#F5F5DC] font-macondo text-sm whitespace-nowrap shadow-2xl z-50 pointer-events-none">
                Nur essenzielle Cookie &amp; Consent-Speicherung für Musik aus alten Zeiten!
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

        {/* Divider with Center "O" matching .elementor-element-6e50220f */}
        <div
          className={`w-full max-w-xl my-4 flex items-center justify-center transition-all duration-1000 delay-350 ease-out transform ${
            isInView ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
          }`}
        >
          <div className="flex-1 h-[1px] bg-[#DAA520]/40" />
          <div className="mx-4 text-[#DAA520] font-macondo text-xl font-bold">
            O
          </div>
          <div className="flex-1 h-[1px] bg-[#DAA520]/40" />
        </div>

        {/* Dynamic Current Year with JavaScript (new Date().getFullYear()) & Headline Font (font-macondo) */}
        <div
          className={`w-full max-w-[15rem] min-[400px]:max-w-[18rem] sm:max-w-md md:max-w-xl mx-auto mb-16 sm:mb-8 md:mb-0 text-center text-xs sm:text-sm text-[#F5F5DC]/80 font-normal space-y-2 mt-2 transition-all duration-700 delay-450 ease-out transform ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-macondo text-lg sm:text-xl md:text-2xl text-[#F5F5DC] tracking-wide">
            {currentYear} © Ensemble Olla Podrida
          </p>
          <div className="text-xs sm:text-sm text-[#F5F5DC]/70 font-dosis tracking-wider font-light flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5">
            <span>
              {(texts.footerDev || 'Design, Konzept und Webentwicklung · Jan Dennis Brüning')
                .replace(/·?\s*(www\.janbruening\.de|Jan Dennis Brüning).*$/i, '')
                .trim() || 'Design, Konzept und Webentwicklung'}
            </span>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                data-jdb-footer
                title="Jan Dennis Brüning – Gestaltung und digitale Begleitung (öffnet Infobox)"
                aria-label="Jan Dennis Brüning – Gestaltung und digitale Begleitung (öffnet Infobox)"
                className="text-[#DAA520] hover:underline cursor-pointer transition-colors hover:text-[#FFD700] bg-transparent border-0 p-0 font-inherit inline align-baseline"
                onClick={handleCreditClick}
                onKeyDown={handleCreditKeyDown}
              >
                Jan Dennis Brüning
              </button>
              <span className="text-[#DAA520]/50 mx-0.5">|</span>
              <button
                type="button"
                onClick={onOpenLogin}
                title="Admin- &amp; Redaktions-Login"
                aria-label="Admin- und Redaktions-Login"
                className="text-[#DAA520]/75 hover:text-[#DAA520] transition-colors p-0.5 inline-flex items-center hover:scale-110 cursor-pointer"
              >
                <Lock size={12} className="inline opacity-85 hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
