import React, { useState, useEffect } from 'react';
import { getAssets, getSiteTexts } from '../data/siteContent';

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
  const texts = getSiteTexts();
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

  // Smooth mobile menu open/close lifecycle with bi-directional stagger transitions
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('mobile-menu-open', mobileMenuOpen);
    }
    if (mobileMenuOpen) {
      setIsMenuMounted(true);
      setIsMenuVisible(false);
      // Ensure DOM has mounted and initial hidden frame painted before animating in
      const timer = setTimeout(() => {
        setIsMenuVisible(true);
      }, 30);
      return () => clearTimeout(timer);
    } else {
      setIsMenuVisible(false);
      // Wait for all reverse stagger transitions to finish gracefully before unmounting
      const timer = setTimeout(() => {
        setIsMenuMounted(false);
      }, 480);
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
        className={`fixed top-0 left-0 right-0 z-[10020] flex flex-col items-center pointer-events-none select-none transition-all duration-1000 ease-out origin-top ${
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
              {texts.navStart || 'Start'}
            </button>
            <button
              onClick={() => scrollToSection('ensemble')}
              className="font-macondo text-[1.1rem] sm:text-[1.2rem] md:text-[1.28rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              {texts.navEnsemble || 'Ensemble'}
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
              {texts.navTermine || 'Termine'}
            </button>
            <button
              onClick={() => scrollToSection('kontakt')}
              className="font-macondo text-[1.1rem] sm:text-[1.2rem] md:text-[1.28rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              {texts.navKontakt || 'Kontakt'}
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
          {/* Logo pinned flush against top edge: shifted 5% left and enlarged by 5% overall */}
          <button
            onClick={() => scrollToSection('Start')}
            className="self-start -mt-0.5 flex items-start transition-transform duration-200 active:scale-95 cursor-pointer z-30 scale-[1.07] -translate-x-[5%] origin-top-left"
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
                className="w-[87%] h-[87%] object-contain drop-shadow-md"
              />
            </div>
          </button>

          {/* Medieval Calligraphic Menu / Close Button with crisp morphing animation - width fixed to lock horizontal position */}
          <button
            onClick={handleToggleMobileMenu}
            className="self-center my-auto mr-1.5 sm:mr-3 flex flex-col items-center justify-center w-[4.8rem] shrink-0 p-1 cursor-pointer transition-all duration-300 active:scale-80 scale-[0.95] z-30"
            aria-label={isAnyOpen ? 'Menü schließen' : 'Menü öffnen'}
            title={isAnyOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            <div className="w-[28px] h-[18px] relative flex flex-col justify-between items-center filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
              {/* Top calligraphic bar */}
              <span
                className="block w-full h-[2.8px] bg-[#1D1D1B] rounded-[2px] transition-all duration-300 ease-in-out origin-center"
                style={{
                  transform: isAnyOpen ? 'translateY(7.6px) rotate(45deg)' : 'translateY(0) rotate(0deg)'
                }}
              />
              {/* Middle calligraphic bar */}
              <span
                className="block w-full h-[2.8px] bg-[#1D1D1B] rounded-[2px] transition-all duration-200 ease-in-out origin-center"
                style={{
                  opacity: isAnyOpen ? 0 : 1,
                  transform: isAnyOpen ? 'scale(0)' : 'scale(1)'
                }}
              />
              {/* Bottom calligraphic bar */}
              <span
                className="block w-full h-[2.8px] bg-[#1D1D1B] rounded-[2px] transition-all duration-300 ease-in-out origin-center"
                style={{
                  transform: isAnyOpen ? 'translateY(-7.6px) rotate(-45deg)' : 'translateY(0) rotate(0deg)'
                }}
              />
            </div>
            <span className="font-macondo font-bold text-[11px] tracking-wider text-[#1D1D1B] uppercase leading-none mt-1 w-full text-center transition-all duration-300">
              {isAnyOpen ? 'Schließen' : 'Menü'}
            </span>
          </button>
        </div>
      </nav>

      {/* Medieval Mobile Menu Overlay with smooth open/close, atmospheric fog and staggered item reveal */}
      {isMenuMounted && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`fixed inset-0 z-[10010] flex flex-col justify-start items-center p-4 sm:p-6 pt-[18vw] min-[400px]:pt-[19vw] sm:pt-24 pb-8 bg-[#070202]/92 backdrop-blur-md select-none overflow-y-auto transition-opacity duration-350 ease-in-out ${
            isMenuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ transitionDelay: isMenuVisible ? '0ms' : '120ms' }}
        >
          {/* Atmospheric Smoke & Fog Layer in Mobile Menu Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src={assets.smokeAlt}
              alt=""
              className="w-full h-full object-cover object-center opacity-35 mix-blend-screen scale-110 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#070202]/60 via-transparent to-[#070202]/85 pointer-events-none" />
          </div>

          {/* Menu Card Container without yellow border & unfold animation */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm mx-auto my-auto bg-[#141210]/95 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-[0_16px_50px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-300 ease-out transform z-10 ${
              isMenuVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'
            }`}
            style={{
              transitionDelay: isMenuVisible ? '0ms' : '140ms',
              transitionTimingFunction: isMenuVisible ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.4, 0, 1, 1)'
            }}
          >
            {/* Subtle inner card smoke accent */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-15 mix-blend-screen z-0">
              <img src={assets.smokeAlt} alt="" className="w-full h-full object-cover object-center pointer-events-none" />
            </div>

            {/* Logo in Mobile Menu - Stagger step 1 */}
            <div
              className={`flex flex-col items-center mb-5 mt-1 transition-all duration-300 ease-out transform ${
                isMenuVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-3 scale-95'
              }`}
              style={{ transitionDelay: isMenuVisible ? '70ms' : '240ms' }}
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
              className={`w-full h-[1px] bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent mb-4 transition-all duration-300 ease-out ${
                isMenuVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
              style={{ transitionDelay: isMenuVisible ? '130ms' : '200ms' }}
            />

            {/* Main Navigation Links with Bi-directional Staggered Appearance */}
            <div className="w-full flex flex-col space-y-2 text-center font-macondo">
              {[
                { id: 'Start', label: texts.navStart || 'Start', openDelay: '180ms', closeDelay: '160ms' },
                { id: 'ensemble', label: texts.navEnsemble || 'Ensemble', openDelay: '230ms', closeDelay: '120ms' },
                { id: 'termine', label: texts.navTermine || 'Termine', openDelay: '280ms', closeDelay: '70ms' },
                { id: 'kontakt', label: texts.navKontakt || 'Kontakt', openDelay: '330ms', closeDelay: '30ms' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-2xl text-[#F5F5DC] hover:text-[#0A0707] hover:bg-[#DAA520] transition-all duration-300 cursor-pointer active:scale-95 transform ${
                    isMenuVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                  }`}
                  style={{ transitionDelay: isMenuVisible ? item.openDelay : item.closeDelay }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Secondary links divider */}
            <div
              className={`w-full h-[1px] bg-gradient-to-r from-transparent via-[#DAA520]/30 to-transparent my-4 transition-all duration-300 ease-out ${
                isMenuVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
              style={{ transitionDelay: isMenuVisible ? '380ms' : '15ms' }}
            />

            {/* Footer links in mobile menu - Stagger step final */}
            <div
              className={`flex flex-wrap justify-center gap-3.5 text-[0.95rem] font-macondo tracking-wide text-[#F5F5DC]/90 transition-all duration-300 ease-out transform ${
                isMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{ transitionDelay: isMenuVisible ? '420ms' : '0ms' }}
            >
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTermineArchive();
                }}
                className="hover:text-[#DAA520] transition-colors cursor-pointer"
              >
                Konzertchronik
              </button>
              <span className="text-[#DAA520]/40">•</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLegal('impressum');
                }}
                className="hover:text-[#DAA520] transition-colors cursor-pointer"
              >
                Impressum
              </button>
              <span className="text-[#DAA520]/40">•</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLegal('datenschutz');
                }}
                className="hover:text-[#DAA520] transition-colors cursor-pointer"
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
