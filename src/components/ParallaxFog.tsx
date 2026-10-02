import React, { useEffect, useRef } from 'react';
import { getAssets } from '../data/siteContent';

export const ParallaxFog: React.FC = () => {
  const assets = getAssets();
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    let rafId: number;

    const updateParallax = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // Layer 1: Distant Castle Ruins Ambient Mist (slow organic wave response)
      if (layer1Ref.current) {
        // Undulating scroll parallax that gently billows with scroll motion
        const wave1 = Math.sin(scrollY * 0.0018) * 45;
        const drift1 = ((scrollY * -0.08) % 360);
        layer1Ref.current.style.transform = `translate3d(0, ${(wave1 + drift1).toFixed(1)}px, 0)`;
      }

      // Layer 2: Swirling Wall & Ground Mist (counter-wave response at different frequency)
      if (layer2Ref.current) {
        const wave2 = Math.cos(scrollY * 0.0024) * 60;
        const drift2 = ((scrollY * -0.16) % 400);
        layer2Ref.current.style.transform = `translate3d(0, ${(wave2 + drift2).toFixed(1)}px, 0)`;
      }

      // Layer 3: Whispering Foreground Wisps (drifts closer in depth)
      if (layer3Ref.current) {
        const wave3 = Math.sin(scrollY * 0.003 + 1.2) * 35;
        const drift3 = ((scrollY * -0.24) % 300);
        layer3Ref.current.style.transform = `translate3d(0, ${(wave3 + drift3).toFixed(1)}px, 0)`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Initial positioning
    updateParallax();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-[2]">
      {/* Layer 1: Deep Ambient Mystic Castle Fog – Slow wide drift */}
      <div
        ref={layer1Ref}
        className="absolute -inset-x-0 -top-[25%] -bottom-[25%] pointer-events-none overflow-hidden opacity-[0.24] sm:opacity-[0.28] mix-blend-screen"
        style={{ willChange: 'transform' }}
      >
        <div className="w-full h-full animate-fog-drift">
          <img
            src={assets.smokeAlt}
            alt=""
            className="w-full h-full object-cover animate-mystic-glow"
            style={{ animationDuration: '28s', filter: 'brightness(108%) contrast(102%)' }}
          />
        </div>
      </div>

      {/* Layer 2: Swirling Mid-Ground Castle Ruin Mist – Counter-drift */}
      <div
        ref={layer2Ref}
        className="absolute -inset-x-0 -top-[30%] -bottom-[30%] pointer-events-none overflow-hidden opacity-[0.18] sm:opacity-[0.22] mix-blend-screen"
        style={{ willChange: 'transform' }}
      >
        <div className="w-full h-full animate-fog-drift-reverse">
          <img
            src={assets.smokeBottom}
            alt=""
            className="w-full h-full object-cover scale-110"
            style={{ animationDuration: '34s', filter: 'brightness(112%) contrast(105%)' }}
          />
        </div>
      </div>

      {/* Layer 3: Whispering Foreground Wisps – Very light, drifts in front of dark backgrounds */}
      <div
        ref={layer3Ref}
        className="absolute -inset-x-0 -top-[35%] -bottom-[35%] pointer-events-none overflow-hidden opacity-[0.09] sm:opacity-[0.12] mix-blend-screen"
        style={{ willChange: 'transform' }}
      >
        <div className="w-full h-full animate-fog-drift" style={{ animationDuration: '44s' }}>
          <img
            src={assets.smokeAlt}
            alt=""
            className="w-full h-full object-cover scale-125"
            style={{ filter: 'brightness(115%) contrast(95%)' }}
          />
        </div>
      </div>
    </div>
  );
};
