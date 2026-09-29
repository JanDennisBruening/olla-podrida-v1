import React, { useState, useEffect } from 'react';
import { getAssets } from '../data/siteContent';

interface HeaderProps {
  onOpenLegal: (type: 'impressum' | 'datenschutz') => void;
  onOpenTermineArchive: () => void;
  isArchiveOpen?: boolean;
  onCloseAll?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLegal,
  onOpenTermineArchive,
  isArchiveOpen = false,
  onCloseAll
}) => {
  const assets = getAssets();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const isAnyOpen = mobileMenuOpen || isArchiveOpen;

  // Unfold / glide down navigation from top after preloader completes
  React.useEffect(() => {
    const handlePreloaderFinish = () => {
      setTimeout(() => setIsMounted(true), 150);
    };

    window.addEventListener('preloader-finish', handlePreloaderFinish);
    const fallbackTimer = setTimeout(() => setIsMounted(true), 1400);

    return () => {
      window.removeEventListener('preloader-finish', handlePreloaderFinish);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Smooth mobile menu open/close lifecycle with stagger transitions
  useEffect(() => {
    if (mobileMenuOpen) {
      setIsMenuMounted(true);
      const frame = requestAnimationFrame(() => {
        setIsMenuVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsMenuVisible(false);
      const timer = setTimeout(() => {
        setIsMenuMounted(false);
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [mobileMenuOpen]);

  const handleToggleMobileMenu = () => {
    if (isAnyOpen) {
      setMobileMenuOpen(false);
      if (onCloseAll) onCloseAll();
    } else {
      setMobileMenuOpen(true);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (onCloseAll) onCloseAll();
    const element = document.getElementById(id);
    if (element) {
      const lenis = (window as any).__lenis;
      const isMobile = window.innerWidth < 768;
      const navOffset = isMobile ? -75 : -110;
      if (lenis) {
        lenis.scrollTo(element, { offset: navOffset, duration: 1.2 });
      } else {
        const y = element.getBoundingClientRect().top + window.pageYOffset + navOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Fixed Header Navigation matching .elementor-element-4aa968b4 */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none select-none transition-all duration-1000 ease-out origin-top ${
          isMounted ? 'translate-y-0 opacity-100 scale-y-100' : '-translate-y-full opacity-0 scale-y-90'
        }`}
        style={{
          background: 'radial-gradient(at top center, rgba(7, 2, 2, 0.39) 35%, rgba(242, 41, 91, 0) 62%)',
          minHeight: 'min(11.8vw, 9.3rem)'
        }}
      >
        {/* Desktop & Tablet Ribbon Bar (.elementor-element-6cf3c0da) - strictly maintains un-squished aspect ratio, shrunk 5% on desktop */}
        <div
          className="pointer-events-auto relative hidden md:flex items-center justify-center w-full max-w-[76rem] aspect-[2048/238] transition-all duration-300 lg:scale-[0.95] origin-top"
          style={{
            backgroundImage: `url(${assets.menuBackgroundDesktop})`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        >
          {/* Left Navigation Container – vertically centered between top and bottom parchment edges across tablet and desktop */}
          <div className="w-[38%] h-full flex items-center justify-end space-x-5 md:space-x-7 lg:space-x-12 pr-3 md:pr-6 lg:pr-14 md:-translate-y-2 lg:translate-y-0">
            <button
              onClick={() => scrollToSection('Start')}
              className="font-macondo text-[1.1rem] sm:text-[1.2rem] md:text-[1.28rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              Start
            </button>
            <button
              onClick={() => scrollToSection('ensemble')}
              className="font-macondo text-[1.1rem] sm:text-[1.2rem] md:text-[1.28rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              Ensemble
            </button>
          </div>

          {/* Center Logo Container – strictly centered in tablet without inflating ribbon or overlapping stage */}
          <div className="w-[20%] h-full flex justify-center items-center z-30">
            <button
              onClick={() => scrollToSection('Start')}
              className="relative aspect-[324/391] h-24 sm:h-26 md:h-28 lg:h-40 xl:h-44 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer filter drop-shadow-xl md:-translate-y-1.5 lg:translate-y-4 xl:translate-y-5"
              style={{
                backgroundImage: `url(${assets.logoBackground})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
              title="Ensemble Olla Podrida"
            >
              <img
                src={assets.navLogo}
                alt="Ensemble Olla Podrida Logo"
                className="w-[85%] h-[85%] object-contain drop-shadow-md my-auto transition-transform duration-200"
              />
            </button>
          </div>

          {/* Right Navigation Container – vertically centered between top and bottom parchment edges across tablet and desktop */}
          <div className="w-[38%] h-full flex items-center justify-start space-x-5 md:space-x-7 lg:space-x-12 pl-3 md:pl-6 lg:pl-14 md:-translate-y-2 lg:translate-y-0">
            <button
              onClick={() => scrollToSection('termine')}
              className="font-macondo text-[1.1rem] sm:text-[1.2rem] md:text-[1.28rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              Termine
            </button>
            <button
              onClick={() => scrollToSection('kontakt')}
              className="font-macondo text-[1.1rem] sm:text-[1.2rem] md:text-[1.28rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              Kontakt
            </button>
          </div>
        </div>

        {/* Mobile Header Ribbon (.elementor-element-6cf3c0da mobile) - Unified Mobile Viewport */}
        <div
          className="pointer-events-auto relative md:hidden flex items-center justify-between w-full h-[15vw] min-h-[3.6rem] max-h-[4.8rem] px-3.5"
          style={{
            backgroundImage: `url(${assets.menuBackgroundMobile})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
          }}
        >
          {/* Logo pinned flush against top edge: exactly 24% of total width */}
          <button
            onClick={() => scrollToSection('Start')}
            className="self-start -mt-0.5 flex items-start transition-transform duration-200 active:scale-95 cursor-pointer z-30"
          >
            <div
              className="w-[24vw] h-[24vw] min-w-[5.6rem] min-h-[5.6rem] flex items-center justify-center p-1.5 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]"
              style={{
                backgroundImage: `url(${assets.logoBackground})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            >
              <img
                src={assets.navLogo}
                alt="Ensemble Olla Podrida Logo"
                className="w-[84%] h-[84%] object-contain drop-shadow-md"
              />
            </div>
          </button>

          {/* Medieval Calligraphic Menu / Close Button with smooth morphing animation */}
          <button
            onClick={handleToggleMobileMenu}
            className="self-center my-auto mr-4 flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-300 active:scale-80 scale-[0.90] z-30"
            aria-label={isAnyOpen ? 'Menü schließen' : 'Menü öffnen'}
            title={isAnyOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            <div className="w-[26px] h-[17px] relative flex flex-col justify-between items-center filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
              {/* Top calligraphic bar */}
              <span
                className="block w-full h-[2.5px] bg-[#1D1D1B] rounded-[2px] transition-all duration-300 ease-in-out origin-center"
                style={{
                  transform: isAnyOpen ? 'translateY(7.25px) rotate(45deg)' : 'translateY(0) rotate(0deg)'
                }}
              />
              {/* Middle calligraphic bar */}
              <span
                className="block w-full h-[2.5px] bg-[#1D1D1B] rounded-[2px] transition-all duration-200 ease-in-out origin-center"
                style={{
                  opacity: isAnyOpen ? 0 : 1,
                  transform: isAnyOpen ? 'scale(0)' : 'scale(1)'
                }}
              />
              {/* Bottom calligraphic bar */}
              <span
                className="block w-full h-[2.5px] bg-[#1D1D1B] rounded-[2px] transition-all duration-300 ease-in-out origin-center"
                style={{
                  transform: isAnyOpen ? 'translateY(-7.25px) rotate(-45deg)' : 'translateY(0) rotate(0deg)'
                }}
              />
            </div>
            <span className="font-macondo font-bold text-[10.5px] tracking-wider text-[#1D1D1B] uppercase leading-none mt-1 min-w-[3rem] text-center transition-all duration-300">
              {isAnyOpen ? 'Schließen' : 'Menü'}
            </span>
          </button>
        </div>
      </nav>

      {/* Medieval Mobile Menu Overlay with smooth open/close and staggered item reveal */}
      {isMenuMounted && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`fixed inset-0 z-[10010] flex flex-col justify-start items-center p-4 sm:p-6 pt-22 sm:pt-24 pb-8 bg-[#070202]/95 backdrop-blur-md select-none overflow-y-auto transition-opacity duration-300 ease-out ${
            isMenuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Menu Card Container with antique golden border & unfold animation */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm mx-auto my-auto bg-[#141210] border-2 border-[#DAA520]/50 rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-[0_10px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(218,165,32,0.18)] transition-all duration-350 ease-out transform ${
              isMenuVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-6'
            }`}
          >
            {/* Elegant Close Button inside Modal Card */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#DAA520]/40 flex items-center justify-center text-[#DAA520] hover:text-[#141210] hover:bg-[#DAA520] transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="Menü schließen"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M 2 2 L 12 12 M 12 2 L 2 12" />
              </svg>
            </button>

            {/* Logo in Mobile Menu - Stagger step 1 */}
            <div
              className={`flex flex-col items-center mb-5 mt-1 transition-all duration-400 ease-out transform ${
                isMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
              }`}
              style={{ transitionDelay: isMenuVisible ? '60ms' : '0ms' }}
            >
              <img
                src={assets.logo}
                alt="Olla Podrida"
                className="w-20 h-20 object-contain drop-shadow-md"
              />
              <h2 className="font-macondo text-2xl sm:text-3xl text-[#DAA520] font-normal mt-2 tracking-wide">
                Ensemble Olla Podrida
              </h2>
              <p className="font-macondo text-xs text-[#F5F5DC]/70 italic mt-0.5">
                Klangvielfalt aus Mittelalter &amp; Renaissance
              </p>
            </div>

            {/* Divider */}
            <div
              className={`w-full h-[1px] bg-gradient-to-r from-transparent via-[#DAA520]/40 to-transparent mb-4 transition-all duration-300 ease-out ${
                isMenuVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
              }`}
              style={{ transitionDelay: isMenuVisible ? '120ms' : '0ms' }}
            />

            {/* Main Navigation Links with Staggered Cascading Appearance */}
            <div className="w-full flex flex-col space-y-2 text-center font-macondo">
              <button
                onClick={() => scrollToSection('Start')}
                className={`w-full py-2 px-4 rounded-lg text-2xl text-[#F5F5DC] hover:text-[#0A0707] hover:bg-[#DAA520] transition-all duration-300 cursor-pointer active:scale-98 transform ${
                  isMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: isMenuVisible ? '160ms' : '0ms' }}
              >
                Start
              </button>
              <button
                onClick={() => scrollToSection('ensemble')}
                className={`w-full py-2 px-4 rounded-lg text-2xl text-[#F5F5DC] hover:text-[#0A0707] hover:bg-[#DAA520] transition-all duration-300 cursor-pointer active:scale-98 transform ${
                  isMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: isMenuVisible ? '200ms' : '0ms' }}
              >
                Ensemble
              </button>
              <button
                onClick={() => scrollToSection('termine')}
                className={`w-full py-2 px-4 rounded-lg text-2xl text-[#F5F5DC] hover:text-[#0A0707] hover:bg-[#DAA520] transition-all duration-300 cursor-pointer active:scale-98 transform ${
                  isMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: isMenuVisible ? '240ms' : '0ms' }}
              >
                Termine
              </button>
              <button
                onClick={() => scrollToSection('kontakt')}
                className={`w-full py-2 px-4 rounded-lg text-2xl text-[#F5F5DC] hover:text-[#0A0707] hover:bg-[#DAA520] transition-all duration-300 cursor-pointer active:scale-98 transform ${
                  isMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: isMenuVisible ? '280ms' : '0ms' }}
              >
                Kontakt
              </button>
            </div>

            {/* Secondary links divider */}
            <div
              className={`w-full h-[1px] bg-gradient-to-r from-transparent via-[#DAA520]/30 to-transparent my-4 transition-all duration-300 ease-out ${
                isMenuVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
              }`}
              style={{ transitionDelay: isMenuVisible ? '320ms' : '0ms' }}
            />

            {/* Footer links in mobile menu - Stagger step final */}
            <div
              className={`flex flex-wrap justify-center gap-3 text-xs font-sans text-[#F5F5DC]/80 transition-all duration-300 ease-out transform ${
                isMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: isMenuVisible ? '350ms' : '0ms' }}
            >
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTermineArchive();
                }}
                className="hover:text-[#DAA520] hover:underline transition-colors cursor-pointer"
              >
                Konzertchronik
              </button>
              <span className="text-[#DAA520]/40">•</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLegal('impressum');
                }}
                className="hover:text-[#DAA520] hover:underline transition-colors cursor-pointer"
              >
                Impressum
              </button>
              <span className="text-[#DAA520]/40">•</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLegal('datenschutz');
                }}
                className="hover:text-[#DAA520] hover:underline transition-colors cursor-pointer"
              >
                Datenschutz
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
