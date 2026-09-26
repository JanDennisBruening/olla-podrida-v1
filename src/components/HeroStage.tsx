import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/siteContent';

interface HeroStageProps {
  onSelectMember?: (memberId: string) => void;
}

interface StageFigure {
  id: string;
  name: string;
  image: string;
  alt: string;
  entranceDelay: number;
  depthRatio: number;
  desktop: { left: string; top: string; width: string; zIndex: number };
  mobile: { left: string; top: string; width: string; zIndex: number };
}

// Ordered strictly foreground-first for entrance sequence:
// 1. Susanne (furthest foreground, z:10)
// 2. Ruth (z:9)
// 3. Lutz (z:8)
// 4. Sandra (z:7)
// 5. Silke (z:7)
// 6. Klemens (z:5)
// 7. Simone (z:4)
const STAGE_FIGURES: StageFigure[] = [
  {
    id: 'susanne',
    name: 'Susanne',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Susanne-1.webp',
    alt: 'Susanne spielt vergnügt auf der Flöte',
    entranceDelay: 80,
    depthRatio: 0.04,
    desktop: { left: '30%', top: '27%', width: '31rem', zIndex: 10 },
    mobile: { left: '8%', top: '26%', width: '62vw', zIndex: 10 }
  },
  {
    id: 'ruth',
    name: 'Ruth',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Ruth_web_5.webp',
    alt: 'Ruth',
    entranceDelay: 220,
    depthRatio: 0.05,
    desktop: { left: '47%', top: '41%', width: '22rem', zIndex: 9 },
    mobile: { left: '42%', top: '37%', width: '47vw', zIndex: 9 }
  },
  {
    id: 'lutz',
    name: 'Lutz',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Lutz.webp',
    alt: 'Lutz',
    entranceDelay: 360,
    depthRatio: 0.07,
    desktop: { left: '39%', top: '20%', width: '24rem', zIndex: 8 },
    mobile: { left: '26%', top: '20%', width: '48vw', zIndex: 8 }
  },
  {
    id: 'sandra',
    name: 'Sandra',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/10/2024_Sandra_Olla-Podrida_web_2.webp',
    alt: 'Sandra',
    entranceDelay: 500,
    depthRatio: 0.09,
    desktop: { left: '54%', top: '19%', width: '22rem', zIndex: 7 },
    mobile: { left: '50%', top: '19%', width: '45vw', zIndex: 7 }
  },
  {
    id: 'silke',
    name: 'Silke',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Silke.webp',
    alt: 'Silke',
    entranceDelay: 640,
    depthRatio: 0.09,
    desktop: { left: '23.5%', top: '18%', width: '21rem', zIndex: 7 },
    mobile: { left: '1.5%', top: '17%', width: '43vw', zIndex: 7 }
  },
  {
    id: 'klemens',
    name: 'Klemens',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Klemens.webp',
    alt: 'Klemens',
    entranceDelay: 780,
    depthRatio: 0.13,
    desktop: { left: '44%', top: '13%', width: '19rem', zIndex: 5 },
    mobile: { left: '40%', top: '12%', width: '38vw', zIndex: 5 }
  },
  {
    id: 'simone',
    name: 'Simone',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Simone.webp',
    alt: 'Simone',
    entranceDelay: 920,
    depthRatio: 0.15,
    desktop: { left: '34%', top: '14%', width: '20rem', zIndex: 4 },
    mobile: { left: '16%', top: '13%', width: '40vw', zIndex: 4 }
  }
];

export const HeroStage: React.FC<HeroStageProps> = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Trigger entrance sequence shortly after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Parallax scroll handler
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="Start"
      className="relative w-full select-none bg-transparent flex flex-col justify-end pt-16 md:pt-20 z-10"
      style={{
        // Dynamically adapts height to viewport: in portrait mode avoids huge bottom voids, in landscape preserves stage presence
        minHeight: 'min(94svh, 60rem)'
      }}
    >
      {/* Desktop Stage Layer (.elementor-element-26804e5b: width 100rem centered) */}
      <div className="hidden md:block relative w-full max-w-[100rem] mx-auto h-[88svh] min-h-[46rem] max-h-[60rem]">
        {STAGE_FIGURES.map((member) => {
          const parallaxOffset = Math.min(scrollY * member.depthRatio, 50);

          return (
            <div
              key={member.id}
              className="absolute cursor-default select-none pointer-events-none"
              style={{
                left: member.desktop.left,
                top: member.desktop.top,
                width: member.desktop.width,
                zIndex: member.desktop.zIndex,
                transition: 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms ease-out',
                transitionDelay: `${member.entranceDelay}ms`,
                transform: isLoaded
                  ? `translate3d(0, ${parallaxOffset}px, 0) scale(1)`
                  : `translate3d(0, ${parallaxOffset + 70}px, 0) scale(0.92)`,
                opacity: isLoaded ? 1 : 0
              }}
            >
              {/* Authentic stage cutout - clean, unobscured, non-clickable */}
              <img
                src={member.image}
                alt={member.alt}
                className="w-full h-auto object-contain filter drop-shadow-[0_10px_22px_rgba(0,0,0,0.85)] pointer-events-none"
                loading="eager"
              />
            </div>
          );
        })}
      </div>

      {/* Mobile & Portrait Stage Layout - Dynamically sized to prevent dead gaps in portrait */}
      <div className="md:hidden relative w-full h-[78svh] min-h-[36rem] max-h-[48rem] pt-16 overflow-visible">
        {STAGE_FIGURES.map((member) => {
          const parallaxOffset = Math.min(scrollY * member.depthRatio, 35);

          return (
            <div
              key={member.id}
              className="absolute cursor-default select-none pointer-events-none"
              style={{
                left: member.mobile.left,
                top: member.mobile.top,
                width: member.mobile.width,
                zIndex: member.mobile.zIndex,
                transition: 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms ease-out',
                transitionDelay: `${member.entranceDelay}ms`,
                transform: isLoaded
                  ? `translate3d(0, ${parallaxOffset}px, 0) scale(1)`
                  : `translate3d(0, ${parallaxOffset + 50}px, 0) scale(0.92)`,
                opacity: isLoaded ? 1 : 0
              }}
            >
              <img
                src={member.image}
                alt={member.alt}
                className="w-full h-auto object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] pointer-events-none"
                loading="eager"
              />
            </div>
          );
        })}
      </div>

      {/* Ground Smoke & Fog Layer placed at bottom z-[2] so it stays under/behind figures and does not obscure faces/bodies */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[2] transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${Math.min(scrollY * -0.04, 20)}px, 0)`
        }}
      >
        <img
          src={ASSETS.smokeAlt}
          alt="Atmosphärischer Rauch"
          className="w-full h-28 sm:h-36 md:h-44 object-cover object-bottom opacity-20 mix-blend-screen"
          style={{
            filter: 'brightness(105%) contrast(98%)'
          }}
        />
      </div>

      {/* Atmosphere floor transition without black cut-off so EnsembleSection overlaps seamlessly */}
    </section>
  );
};
