/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Header } from './components/Header';
import { HeroStage } from './components/HeroStage';
import { EnsembleSection } from './components/EnsembleSection';
import { TermineSection } from './components/TermineSection';
import { KontaktSection } from './components/KontaktSection';
import { Footer } from './components/Footer';
import { AudioPlayer } from './components/AudioPlayer';
import { LegalModal } from './components/LegalModal';
import { ArchiveModal } from './components/ArchiveModal';

import { Preloader } from './components/Preloader';
import { ASSETS } from './data/siteContent';

export default function App() {
  const [legalModalType, setLegalModalType] = useState<'impressum' | 'datenschutz' | 'cookies' | null>(null);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  useEffect(() => {
    // Ultra-silky Lenis smooth scrolling for luxury momentum feel
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  const handleOpenLegal = (type: 'impressum' | 'datenschutz' | 'cookies') => {
    setLegalModalType(type);
  };

  const handleCloseLegal = () => {
    setLegalModalType(null);
  };

  return (
    <div className="relative min-h-screen bg-[#070202] text-[#F5F5DC] flex flex-col font-sans selection:bg-[#DAA520] selection:text-[#F5F5DC]">
      {/* 1:1 Preloader matching original site */}
      <Preloader />

      {/* 1:1 Fixed Navigation Ribbon */}
      <Header
        onOpenLegal={handleOpenLegal}
        onOpenTermineArchive={() => setArchiveModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full flex flex-col bg-[#070202]">
        {/* Unified Theatrical Hall Realm: contains both the stage figures and the parchment ensemble section */}
        <div className="relative w-full overflow-hidden bg-[#070202]">
          {/* Continuous Stone Hall Backdrop spanning from header down behind EnsembleSection */}
          <div
            className="hidden md:block absolute inset-0 w-full h-[115%] bg-cover bg-top bg-no-repeat pointer-events-none opacity-95"
            style={{
              backgroundImage: `url(${ASSETS.heroBackgroundDesktop})`,
              backgroundPosition: 'center top',
              backgroundSize: '100% auto'
            }}
          />
          <div
            className="md:hidden absolute inset-0 w-full h-[115%] bg-cover bg-top bg-no-repeat pointer-events-none opacity-95"
            style={{
              backgroundImage: `url(${ASSETS.heroBackgroundMobile})`,
              backgroundPosition: 'center top',
              backgroundSize: '100% auto'
            }}
          />

          {/* Clean Theatrical Hero Stage (#Start) */}
          <HeroStage onSelectMember={() => {}} />

          {/* Parchment Ribbon Ensemble Section (#ensemble) - Overlapping with 100% transparent background */}
          <EnsembleSection />

          {/* Smooth, soft transition into the solid black website background before Termine */}
          <div className="absolute bottom-0 inset-x-0 h-36 md:h-52 bg-gradient-to-b from-transparent via-[#070202]/70 to-[#070202] pointer-events-none z-10" />
        </div>

        {/* Termine Section (#termine) */}
        <TermineSection />

        {/* Kontakt Section with Susanne and Parchment Form (#kontakt) */}
        <KontaktSection
          onOpenPrivacy={() => handleOpenLegal('datenschutz')}
        />
      </main>

      {/* 1:1 Footer */}
      <Footer
        onOpenLegal={handleOpenLegal}
        onOpenCookies={() => handleOpenLegal('cookies')}
      />

      {/* 1:1 Floating Audio Player (♫ bottom-right) */}
      <AudioPlayer />

      {/* Legal Modals (Impressum, Datenschutz, Cookies) */}
      <LegalModal
        type={legalModalType}
        onClose={handleCloseLegal}
        onSwitchType={setLegalModalType}
      />

      {/* Concert Chronicle & Archive Modal */}
      <ArchiveModal
        isOpen={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
      />
    </div>
  );
}
