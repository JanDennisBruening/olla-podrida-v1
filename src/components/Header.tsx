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
          {/* Left Navigation Container (.elementor-element-709406c2) - shifted closer to center logo and positioned vertically center/top */}
          <div className="w-[38%] h-full flex items-center justify-end space-x-6 sm:space-x-8 lg:space-x-12 pr-4 sm:pr-8 md:pr-10 lg:pr-14 pt-0 sm:pt-1 md:pt-1 lg:pt-2">
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

          {/* Right Navigation Container (.elementor-element-4236051d) - shifted closer to center logo and positioned vertically center/top */}
          <div className="w-[38%] h-full flex items-center justify-start space-x-6 sm:space-x-8 lg:space-x-12 pl-4 sm:pr-8 md:pl-10 lg:pl-14 pt-0 sm:pt-1 md:pt-1 lg:pt-2">
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
          className="pointer-events-auto relative md:hidden flex items-center justify-between w-full h-[30vw] min-h-[5.5rem] px-5"
          style={{
            backgroundImage: `url(${ASSETS.menuBackgroundMobile})`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '140vw auto'
          }}
        >
          {/* Logo center */}
          <button
            onClick={() => scrollToSection('Start')}
            className="flex items-center -mt-1 translate-y-1.5 transition-transform duration-200 active:scale-95"
          >
            <div
              className="w-18 h-18 sm:w-22 sm:h-22 flex items-center justify-center p-1"
              style={{
                backgroundImage: `url(${ASSETS.logoBackground})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            >
              <img
                src={ASSETS.navLogo}
                alt="Logo"
                className="w-16 h-16 sm:w-18 sm:h-18 object-contain drop-shadow"
              />
            </div>
          </button>

          {/* Hamburger toggle button (.icon-bars) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-3 text-[#0B0A0AE3] focus:outline-none cursor-pointer flex flex-col space-y-1.5 justify-center items-center"
            aria-label="Menü öffnen"
          >
            <span className="block w-6 h-[0.15625rem] bg-[#0B0A0AE3] rounded-sm" />
            <span className="block w-6 h-[0.15625rem] bg-[#0B0A0AE3] rounded-sm" />
            <span className="block w-6 h-[0.15625rem] bg-[#0B0A0AE3] rounded-sm" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay matching mobile-background-menu4.png */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col justify-center items-center px-6 text-center select-none"
          style={{
            backgroundImage: `url("https://olla-podrida.de/wp-content/uploads/2024/07/mobile-background-menu4.png")`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-[#0A0707] hover:text-[#DAA520] transition-colors cursor-pointer"
            aria-label="Menü schließen"
          >
            <X size={36} />
          </button>

          {/* Logo in Mobile Menu */}
          <div className="mb-6 -mt-8">
            <img
              src={ASSETS.logo}
              alt="Logo"
              className="w-24 h-24 mx-auto object-contain drop-shadow-md"
            />
            <h2 className="font-macondo text-3xl text-[#0A0707] font-bold mt-2">
              Olla Podrida
            </h2>
          </div>

          {/* Menu items in Macondo Swash Caps */}
          <div className="flex flex-col space-y-4 text-3xl font-macondo font-semibold text-[#0A0707]">
            <button
              onClick={() => scrollToSection('Start')}
              className="py-1 hover:text-[#DAA520] transition-colors cursor-pointer"
            >
              Start
            </button>
            <button
              onClick={() => scrollToSection('ensemble')}
              className="py-1 hover:text-[#DAA520] transition-colors cursor-pointer"
            >
              Ensemble
            </button>
            <button
              onClick={() => scrollToSection('termine')}
              className="py-1 hover:text-[#DAA520] transition-colors cursor-pointer"
            >
              Termine
            </button>
            <button
              onClick={() => scrollToSection('kontakt')}
              className="py-1 hover:text-[#DAA520] transition-colors cursor-pointer"
            >
              Kontakt
            </button>
          </div>

          {/* Footer links in mobile menu */}
          <div className="mt-8 pt-4 border-t border-[#0A0707]/30 flex flex-wrap justify-center gap-4 text-xs font-sans text-[#0A0707]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTermineArchive();
              }}
              className="hover:underline font-semibold"
            >
              Konzertchronik
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLegal('impressum');
              }}
              className="hover:underline font-semibold"
            >
              Impressum
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLegal('datenschutz');
              }}
              className="hover:underline font-semibold"
            >
              Datenschutz
            </button>
          </div>
        </div>
      )}
    </>
  );
};
