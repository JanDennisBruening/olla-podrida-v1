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
          minHeight: '9rem'
        }}
      >
        {/* Desktop Ribbon Bar (.elementor-element-6cf3c0da) */}
        <div
          className="pointer-events-auto relative hidden md:flex items-start justify-center w-[80rem] max-w-full h-[9.3rem] transition-all duration-300"
          style={{
            backgroundImage: `url(${ASSETS.menuBackgroundDesktop})`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        >
          {/* Left Navigation Container (.elementor-element-709406c2) */}
          <div className="w-[30%] mt-12 flex items-center justify-end space-x-12 pr-6">
            <button
              onClick={() => scrollToSection('Start')}
              className="font-macondo text-[1.7rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs"
            >
              Start
            </button>
            <button
              onClick={() => scrollToSection('ensemble')}
              className="font-macondo text-[1.7rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs"
            >
              Ensemble
            </button>
          </div>

          {/* Center Logo Container (.elementor-element-7c6f51bd & 4897424a) - hangs over navigation */}
          <div className="w-[20%] lg:w-[22%] -mt-3 flex justify-center items-start z-30">
            <button
              onClick={() => scrollToSection('Start')}
              className="relative w-40 h-40 lg:w-48 lg:h-48 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer translate-y-3 lg:translate-y-4 filter drop-shadow-xl"
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
                className="w-32 h-32 lg:w-38 lg:h-38 object-contain -mt-3 drop-shadow-md"
              />
            </button>
          </div>

          {/* Right Navigation Container (.elementor-element-4236051d) */}
          <div className="w-[30%] mt-12 flex items-center justify-start space-x-12 pl-6">
            <button
              onClick={() => scrollToSection('termine')}
              className="font-macondo text-[1.7rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs"
            >
              Termine
            </button>
            <button
              onClick={() => scrollToSection('kontakt')}
              className="font-macondo text-[1.7rem] font-semibold text-[#0A0707] hover:scale-110 hover:text-[#0A0707] transition-transform duration-100 cursor-pointer drop-shadow-xs"
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
