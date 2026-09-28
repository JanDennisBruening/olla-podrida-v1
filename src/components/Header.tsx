import React, { useState } from 'react';
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

  const isAnyOpen = mobileMenuOpen || isArchiveOpen;

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

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
        className={`fixed top-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none select-none transition-all duration-700 ease-out ${
          isMounted ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
        }`}
        style={{
          background: 'radial-gradient(at top center, rgba(7, 2, 2, 0.39) 35%, rgba(242, 41, 91, 0) 62%)',
          minHeight: 'min(11.8vw, 9.3rem)'
        }}
      >
        {/* Desktop & Tablet Ribbon Bar (.elementor-element-6cf3c0da) - strictly maintains un-squished aspect ratio */}
        <div
          className="pointer-events-auto relative hidden md:flex items-center justify-center w-full max-w-[80rem] aspect-[2048/238] transition-all duration-300"
          style={{
            backgroundImage: `url(${assets.menuBackgroundDesktop})`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        >
          {/* Left Navigation Container – always vertically centred in the ribbon */}
          <div className="w-[38%] h-full flex items-center justify-end space-x-5 md:space-x-7 lg:space-x-12 pr-3 md:pr-6 lg:pr-14">
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

          {/* Center Logo Container – shifted down by ~5% (translate-y) so it is never cropped at the top, perfectly centered within the parchment paper */}
          <div className="w-[20%] h-full flex justify-center items-center z-30">
            <button
              onClick={() => scrollToSection('Start')}
              className="relative aspect-[324/391] h-28 sm:h-32 md:h-36 lg:h-44 xl:h-48 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer filter drop-shadow-xl translate-y-3.5 sm:translate-y-4 md:translate-y-5 lg:translate-y-6"
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

          {/* Right Navigation Container – always vertically centred in the ribbon */}
          <div className="w-[38%] h-full flex items-center justify-start space-x-5 md:space-x-7 lg:space-x-12 pl-3 md:pl-6 lg:pl-14">
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
          {/* Logo pinned flush against top edge: exactly 24% of total width as requested */}
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

          {/* Medieval Calligraphic Menu / Close Button with smooth morphing animation, identical proportions and colors */}
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

      {/* Modern Medieval Mobile Menu Overlay with full scrollability */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-[10010] flex flex-col justify-start items-center p-4 sm:p-6 pt-22 sm:pt-24 pb-8 bg-[#070202]/95 backdrop-blur-md select-none overflow-y-auto transition-all duration-300"
        >
          {/* Menu Card Container with antique golden border */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm mx-auto my-auto bg-[#141210] border-2 border-[#DAA520]/50 rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-[0_10px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(218,165,32,0.18)]"
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
            {/* Logo in Mobile Menu */}
            <div className="flex flex-col items-center mb-5 mt-1">
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
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#DAA520]/40 to-transparent mb-4" />

            {/* Main Navigation Links */}
            <div className="w-full flex flex-col space-y-2 text-center font-macondo">
              <button
                onClick={() => scrollToSection('Start')}
                className="w-full py-2 px-4 rounded-lg text-2xl text-[#F5F5DC] hover:text-[#0A0707] hover:bg-[#DAA520] transition-colors duration-150 cursor-pointer active:scale-98"
              >
                Start
              </button>
              <button
                onClick={() => scrollToSection('ensemble')}
                className="w-full py-2 px-4 rounded-lg text-2xl text-[#F5F5DC] hover:text-[#0A0707] hover:bg-[#DAA520] transition-colors duration-150 cursor-pointer active:scale-98"
              >
                Ensemble
              </button>
              <button
                onClick={() => scrollToSection('termine')}
                className="w-full py-2 px-4 rounded-lg text-2xl text-[#F5F5DC] hover:text-[#0A0707] hover:bg-[#DAA520] transition-colors duration-150 cursor-pointer active:scale-98"
              >
                Termine
              </button>
              <button
                onClick={() => scrollToSection('kontakt')}
                className="w-full py-2 px-4 rounded-lg text-2xl text-[#F5F5DC] hover:text-[#0A0707] hover:bg-[#DAA520] transition-colors duration-150 cursor-pointer active:scale-98"
              >
                Kontakt
              </button>
            </div>

            {/* Secondary links divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#DAA520]/30 to-transparent my-4" />

            {/* Footer links in mobile menu */}
            <div className="flex flex-wrap justify-center gap-3 text-xs font-sans text-[#F5F5DC]/80">
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
