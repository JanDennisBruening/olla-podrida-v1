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
    // Disable smooth scrolling on mobile / touch viewports (< 768px), native touch scrolling is used instead
    const isMobileOrTouch = typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );

    if (isMobileOrTouch) {
      // Lenis is deactivated for mobile devices to allow native OS scrolling
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: false,
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

  const handleCloseAllModals = () => {
    setArchiveModalOpen(false);
    setLegalModalType(null);
  };

  return (
    <div className="relative min-h-screen bg-[#070202] text-[#F5F5DC] flex flex-col font-sans selection:bg-[#DAA520] selection:text-[#F5F5DC]">
      {/* 1:1 Preloader matching original site */}
      <Preloader />

      {/* 1:1 Fixed Navigation Ribbon with synchronized menu and archive state */}
      <Header
        onOpenLegal={handleOpenLegal}
        onOpenTermineArchive={() => setArchiveModalOpen(true)}
        isArchiveOpen={archiveModalOpen}
        onCloseAll={handleCloseAllModals}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full flex flex-col bg-[#070202]">
        {/* Clean Theatrical Hero Stage (#Start) */}
        <HeroStage onSelectMember={() => {}} />

        {/* Parchment Ribbon Ensemble Section (#ensemble) - Overlapping stage with 100% transparent background */}
        <EnsembleSection />

        {/* Termine Section (#termine) */}
        <TermineSection />

        {/* Kontakt Section with Susanne and Parchment Form (#kontakt) */}
        <KontaktSection
          onOpenPrivacy={() => handleOpenLegal('datenschutz')}
        />
      </main>

      {/* 1:1 Footer with Konzertchronik */}
      <Footer
        onOpenLegal={handleOpenLegal}
        onOpenCookies={() => handleOpenLegal('cookies')}
        onOpenTermineArchive={() => setArchiveModalOpen(true)}
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
