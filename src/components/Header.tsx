import React, { useState } from 'react';
import { ASSETS } from '../data/siteContent';
import { X } from 'lucide-react';

interface HeaderProps {
  onOpenLegal: (type: 'impressum' | 'datenschutz') => void;
  onOpenTermineArchive: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLegal, onOpenTermineArchive }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(element, { offset: -25, duration: 1.2 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Fixed Header Navigation matching .elementor-element-4aa968b4 */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[998] flex flex-col items-center pointer-events-none select-none transition-all duration-700 ease-out ${
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
            backgroundImage: `url(${ASSETS.menuBackgroundDesktop})`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        >
          {/* Left Navigation Container (.elementor-element-709406c2) - optically centered vertically on parchment banner */}
          <div className="w-[38%] h-full flex items-center justify-end space-x-6 sm:space-x-8 lg:space-x-12 pr-4 sm:pr-8 md:pr-10 lg:pr-14 -translate-y-1 sm:-translate-y-1.5 md:-translate-y-2.5 lg:-translate-y-3">
            <button
              onClick={() => scrollToSection('Start')}
              className="font-macondo text-[1.1rem] sm:text-[1.25rem] md:text-[1.38rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              Start
            </button>
            <button
              onClick={() => scrollToSection('ensemble')}
              className="font-macondo text-[1.1rem] sm:text-[1.25rem] md:text-[1.38rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              Ensemble
            </button>
          </div>

          {/* Center Logo Container (.elementor-element-7c6f51bd & 4897424a) - hangs over navigation */}
          <div className="w-[18%] -mt-1 lg:-mt-2 flex justify-center items-start z-30">
            <button
              onClick={() => scrollToSection('Start')}
              className="relative w-22 h-22 sm:w-26 sm:h-26 md:w-30 md:h-30 lg:w-40 lg:h-40 xl:w-46 xl:h-46 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer translate-y-1 md:translate-y-2 lg:translate-y-3 filter drop-shadow-xl"
              style={{
                backgroundImage: `url(${ASSETS.logoBackground})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
              title="Ensemble Olla Podrida"
            >
              <img
                src={ASSETS.navLogo}
                alt="Ensemble Olla Podrida Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-38 xl:h-38 object-contain -mt-2 lg:-mt-3 drop-shadow-md"
              />
            </button>
          </div>

          {/* Right Navigation Container (.elementor-element-4236051d) - optically centered vertically on parchment banner */}
          <div className="w-[38%] h-full flex items-center justify-start space-x-6 sm:space-x-8 lg:space-x-12 pl-4 sm:pl-8 md:pl-10 lg:pl-14 -translate-y-1 sm:-translate-y-1.5 md:-translate-y-2.5 lg:-translate-y-3">
            <button
              onClick={() => scrollToSection('termine')}
              className="font-macondo text-[1.1rem] sm:text-[1.25rem] md:text-[1.38rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              Termine
            </button>
            <button
              onClick={() => scrollToSection('kontakt')}
              className="font-macondo text-[1.1rem] sm:text-[1.25rem] md:text-[1.38rem] lg:text-[1.6rem] xl:text-[1.72rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs whitespace-nowrap"
            >
              Kontakt
            </button>
          </div>
        </div>

        {/* Mobile Header Ribbon (.elementor-element-6cf3c0da mobile) */}
        <div
          className="pointer-events-auto relative md:hidden flex items-start justify-between w-full h-[24vw] min-h-[5.5rem] max-h-[7rem] px-5 pt-1.5 sm:pt-2"
          style={{
            backgroundImage: `url(${ASSETS.menuBackgroundMobile})`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '140vw auto'
          }}
        >
          {/* Logo pinned to top edge, larger size */}
          <button
            onClick={() => scrollToSection('Start')}
            className="flex items-center -mt-1 sm:-mt-2 transition-transform duration-200 active:scale-95 cursor-pointer z-30"
          >
            <div
              className="w-22 h-22 sm:w-26 sm:h-26 flex items-center justify-center p-1 filter drop-shadow-xl"
              style={{
                backgroundImage: `url(${ASSETS.logoBackground})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            >
              <img
                src={ASSETS.navLogo}
                alt="Ensemble Olla Podrida Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow -mt-1"
              />
            </div>
          </button>

          {/* Hamburger toggle button positioned high up in header ribbon with high contrast */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mt-2.5 sm:mt-3 p-2.5 rounded-full bg-[#070202]/90 border border-[#DAA520]/70 text-[#DAA520] hover:text-[#F5F5DC] hover:border-[#DAA520] focus:outline-none cursor-pointer flex flex-col space-y-1 justify-center items-center shadow-lg transition-transform active:scale-90 z-30"
            aria-label="Menü öffnen"
          >
            <span className="block w-5 h-[2px] bg-current rounded-full" />
            <span className="block w-5 h-[2px] bg-current rounded-full" />
            <span className="block w-4 h-[2px] bg-current rounded-full self-start" />
          </button>
        </div>
      </nav>

      {/* Modern Medieval Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-center items-center p-5 bg-[#070202]/95 backdrop-blur-md select-none transition-all duration-300">
          
          {/* Menu Card Container with antique golden border */}
          <div className="relative w-full max-w-sm mx-auto bg-[#141210] border-2 border-[#DAA520]/50 rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-[0_10px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(218,165,32,0.18)]">
            
            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-3.5 right-3.5 p-2 rounded-full bg-[#070202] border border-[#DAA520]/50 text-[#F5F5DC] hover:text-[#DAA520] hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Menü schließen"
            >
              <X size={26} />
            </button>

            {/* Logo in Mobile Menu */}
            <div className="flex flex-col items-center mb-5 mt-1">
              <img
                src={ASSETS.logo}
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
