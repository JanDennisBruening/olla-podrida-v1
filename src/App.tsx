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
import { PresseModal } from './components/PresseModal';

import { Preloader } from './components/Preloader';
import { CookieBanner } from './components/CookieBanner';
import { ASSETS } from './data/siteContent';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function checkHasConsent(): boolean {
  if (typeof window === 'undefined') return false;

  const urlParams = new URLSearchParams(window.location.search);
  // URL parameter to force consent reset for testing (?reset=1 or ?cookie=1)
  if (urlParams.has('reset') || urlParams.has('cookie') || urlParams.has('banner')) {
    return false;
  }
  if (urlParams.has('skip_banner') || urlParams.has('nobanner')) {
    return true;
  }

  // 1. Check for valid 30-day browser cookie
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const trimmed = c.trim();
    if (trimmed.startsWith('olla_cookie_consent=true')) {
      return true;
    }
  }

  // 2. Check localStorage with 30-day expiration timestamp
  try {
    const consentTimeStr = localStorage.getItem('olla_cookie_consent_time');
    if (consentTimeStr) {
      const consentTime = parseInt(consentTimeStr, 10);
      if (!isNaN(consentTime) && Date.now() - consentTime < THIRTY_DAYS_MS) {
        return true;
      }
    }
  } catch {}

  return false;
}

function saveConsent() {
  if (typeof window === 'undefined') return;

  // Set 30-day cookie
  const maxAgeSeconds = 30 * 24 * 60 * 60;
  document.cookie = `olla_cookie_consent=true; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;

  // Set localStorage backup with timestamp
  try {
    localStorage.setItem('olla_cookie_consent', 'true');
    localStorage.setItem('olla_cookie_consent_time', Date.now().toString());
  } catch {}
}

export default function App() {
  const [legalModalType, setLegalModalType] = useState<'impressum' | 'datenschutz' | 'cookies' | null>(null);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [presseModalOpen, setPresseModalOpen] = useState(false);

  // Cookie consent: stored as a 30-day cookie. If already accepted within 30 days, preloader starts immediately.
  const [hasConsent, setHasConsent] = useState(checkHasConsent);

  const handleAcceptCookies = () => {
    saveConsent();
    setHasConsent(true);
  };

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

  // Pause Lenis smooth scrolling when any modal is open to ensure 100% native, unblocked inner scrolling
  useEffect(() => {
    const isAnyModalOpen = !!legalModalType || archiveModalOpen || presseModalOpen;
    const lenis = (window as any).__lenis;
    if (lenis) {
      if (isAnyModalOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [legalModalType, archiveModalOpen, presseModalOpen]);

  const handleOpenLegal = (type: 'impressum' | 'datenschutz' | 'cookies') => {
    setLegalModalType(type);
  };

  const handleCloseLegal = () => {
    setLegalModalType(null);
  };

  const handleCloseAllModals = () => {
    setArchiveModalOpen(false);
    setPresseModalOpen(false);
    setLegalModalType(null);
  };

  return (
    <div className="relative min-h-screen bg-[#070202] text-[#F5F5DC] flex flex-col font-sans selection:bg-[#DAA520] selection:text-[#F5F5DC]">
      {/* 1:1 Preloader matching original site - waits for cookie consent on first visit */}
      <Preloader canStart={hasConsent} />

      {/* Atmospheric Medieval Cookie Consent Banner - displayed first before entering */}
      {!hasConsent && (
        <CookieBanner
          onAccept={handleAcceptCookies}
          onOpenPrivacy={() => handleOpenLegal('datenschutz')}
          onOpenImpressum={() => handleOpenLegal('impressum')}
        />
      )}

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

      {/* 1:1 Footer with Konzertchronik & Presse */}
      <Footer
        onOpenLegal={handleOpenLegal}
        onOpenCookies={() => handleOpenLegal('cookies')}
        onOpenTermineArchive={() => setArchiveModalOpen(true)}
        onOpenPresse={() => setPresseModalOpen(true)}
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

      {/* Press & Media Kit Modal */}
      <PresseModal
        isOpen={presseModalOpen}
        onClose={() => setPresseModalOpen(false)}
      />
    </div>
  );
}
