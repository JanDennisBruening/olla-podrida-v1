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
import { LoginModal } from './components/LoginModal';
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

function getOrCreateConsentSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem('olla_consent_session_id');
    if (!id) {
      const rand = Math.random().toString(36).substring(2, 8).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
      id = `OP-${rand}`;
      localStorage.setItem('olla_consent_session_id', id);
    }
    return id;
  } catch {
    return 'OP-ANONYM';
  }
}

function saveConsent(audio: boolean = true) {
  if (typeof window === 'undefined') return;

  // Set 30-day cookie
  const maxAgeSeconds = 30 * 24 * 60 * 60;
  document.cookie = `olla_cookie_consent=true; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;

  const sessionId = getOrCreateConsentSessionId();

  // Set localStorage backup with timestamp
  try {
    localStorage.setItem('olla_cookie_consent', 'true');
    localStorage.setItem('olla_cookie_consent_time', Date.now().toString());
  } catch {}

  // Log to WordPress REST API
  try {
    const restBase = (window as unknown as { OLLA_DATA?: { restUrl?: string } }).OLLA_DATA?.restUrl;
    const endpoint = restBase ? `${restBase}olla-podrida/v1/consent` : '/wp-json/olla-podrida/v1/consent';
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        action: 'grant',
        essential: true,
        audio: audio,
        duration_days: 30
      })
    }).catch(() => {});
  } catch {}
}

function revokeConsent() {
  if (typeof window === 'undefined') return;
  document.cookie = 'olla_cookie_consent=; max-age=0; path=/;';

  let sessionId = '';
  try {
    sessionId = localStorage.getItem('olla_consent_session_id') || '';
    localStorage.removeItem('olla_cookie_consent');
    localStorage.removeItem('olla_cookie_consent_time');
    localStorage.removeItem('olla_consent_session_id');
  } catch {}

  // Log revocation to WordPress REST API
  try {
    const restBase = (window as unknown as { OLLA_DATA?: { restUrl?: string } }).OLLA_DATA?.restUrl;
    const endpoint = restBase ? `${restBase}olla-podrida/v1/consent` : '/wp-json/olla-podrida/v1/consent';
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId || 'OP-REVOKED',
        action: 'revoke',
        essential: false,
        audio: false
      })
    }).catch(() => {});
  } catch {}
}

export default function App() {
  const [legalModalType, setLegalModalType] = useState<'impressum' | 'datenschutz' | 'cookies' | null>(null);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [presseModalOpen, setPresseModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Cookie consent: stored as a 30-day cookie. If already accepted within 30 days, preloader starts immediately.
  const [hasConsent, setHasConsent] = useState(checkHasConsent);
  const [sessionId, setSessionId] = useState(() => getOrCreateConsentSessionId());

  const handleAcceptCookies = (audio: boolean = true) => {
    saveConsent(audio);
    setHasConsent(true);
  };

  const handleRevokeConsent = () => {
    revokeConsent();
    setHasConsent(false);
    setLegalModalType(null);
    setSessionId(getOrCreateConsentSessionId());
  };

  const handleLoginSuccess = (_redirectUrl: string) => {
    setLoginModalOpen(false);
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

    lenis.on('scroll', (e: { scroll: number }) => {
      window.dispatchEvent(new CustomEvent('olla-scroll', { detail: { scroll: e.scroll } }));
    });

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

  // Lock body & html scroll completely and pause Lenis while cookie consent banner is visible
  useEffect(() => {
    if (!hasConsent) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      const lenis = (window as any).__lenis;
      if (lenis) lenis.stop();
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (lenis) lenis.start();
      };
    }
  }, [hasConsent]);

  // Pause Lenis smooth scrolling when any modal is open to ensure 100% native, unblocked inner scrolling
  useEffect(() => {
    const isAnyModalOpen = !hasConsent || !!legalModalType || archiveModalOpen || presseModalOpen || loginModalOpen;
    const lenis = (window as any).__lenis;
    if (lenis) {
      if (isAnyModalOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [hasConsent, legalModalType, archiveModalOpen, presseModalOpen, loginModalOpen]);

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
    setLoginModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#070202] text-[#F5F5DC] flex flex-col font-sans selection:bg-[#DAA520] selection:text-[#F5F5DC] overflow-x-hidden w-full max-w-[100vw]">
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

      {/* Subtle Global Ambient Mystic Fog Layer - Low opacity to maintain optimal text readability */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-[0.12] mix-blend-screen">
        <img
          src={ASSETS.smokeAlt}
          alt=""
          className="w-full h-full object-cover animate-fog-drift animate-mystic-glow"
          style={{ animationDuration: '32s' }}
        />
      </div>

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
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* 1:1 Floating Audio Player (♫ bottom-right) */}
      <AudioPlayer />

      {/* Legal Modals (Impressum, Datenschutz, Cookies und Consent) */}
      <LegalModal
        type={legalModalType}
        onClose={handleCloseLegal}
        onSwitchType={setLegalModalType}
        onRevokeConsent={handleRevokeConsent}
        sessionId={sessionId}
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

      {/* Atmospheric Medieval Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
