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
  desktop: { left: string; top: string; width: string; zIndex: number };
  tablet: { left: string; top: string; width: string; zIndex: number };
  mobile: { left: string; top: string; width: string; zIndex: number };
}

// 7 Ensemble figures - strictly centered on 50% across Desktop, Tablet, and Mobile
// Susanne and Ruth lower bodies intentionally overlap and step behind the parchment ribbon (no empty voids!)
// Sandra on the right is placed with plenty of breathing space from Lutz so all faces are completely unobstructed
const STAGE_FIGURES: StageFigure[] = [
  {
    id: 'simone',
    name: 'Simone',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Simone.webp',
    alt: 'Simone',
    entranceDelay: 80,
    desktop: { left: '26%', top: '8%', width: '20rem', zIndex: 4 },
    tablet: { left: '25%', top: '6%', width: '24vw', zIndex: 4 },
    mobile: { left: '16%', top: '4%', width: '33vw', zIndex: 4 }
  },
  {
    id: 'klemens',
    name: 'Klemens',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Klemens.webp',
    alt: 'Klemens',
    entranceDelay: 160,
    desktop: { left: '45%', top: '7%', width: '19rem', zIndex: 5 },
    tablet: { left: '46%', top: '5%', width: '22vw', zIndex: 5 },
    mobile: { left: '45%', top: '3%', width: '32vw', zIndex: 5 }
  },
  {
    id: 'silke',
    name: 'Silke',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Silke.webp',
    alt: 'Silke',
    entranceDelay: 260,
    desktop: { left: '14%', top: '16%', width: '22rem', zIndex: 7 },
    tablet: { left: '12%', top: '13%', width: '26vw', zIndex: 7 },
    mobile: { left: '3%', top: '11%', width: '36vw', zIndex: 7 }
  },
  {
    id: 'sandra',
    name: 'Sandra',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/10/2024_Sandra_Olla-Podrida_web_2.webp',
    alt: 'Sandra',
    entranceDelay: 360,
    desktop: { left: '58%', top: '15%', width: '23rem', zIndex: 9 },
    tablet: { left: '59%', top: '13%', width: '26vw', zIndex: 9 },
    mobile: { left: '59%', top: '11%', width: '38vw', zIndex: 9 }
  },
  {
    id: 'lutz',
    name: 'Lutz',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Lutz.webp',
    alt: 'Lutz',
    entranceDelay: 460,
    desktop: { left: '37%', top: '15%', width: '25rem', zIndex: 8 },
    tablet: { left: '37%', top: '13%', width: '27vw', zIndex: 8 },
    mobile: { left: '29%', top: '11%', width: '44vw', zIndex: 8 }
  },
  {
    id: 'susanne',
    name: 'Susanne',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Susanne-1.webp',
    alt: 'Susanne spielt vergnügt auf der Flöte',
    entranceDelay: 580,
    desktop: { left: '26%', top: '24%', width: '33rem', zIndex: 10 },
    tablet: { left: '26%', top: '21%', width: '36vw', zIndex: 10 },
    mobile: { left: '17%', top: '17%', width: '52vw', zIndex: 10 }
  },
  {
    id: 'ruth',
    name: 'Ruth',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Ruth_web_5.webp',
    alt: 'Ruth',
    entranceDelay: 680,
    desktop: { left: '45%', top: '34%', width: '23rem', zIndex: 9 },
    tablet: { left: '45%', top: '28%', width: '28vw', zIndex: 9 },
    mobile: { left: '42%', top: '24%', width: '42vw', zIndex: 9 }
  }
];

export const HeroStage: React.FC<HeroStageProps> = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Dynamically track viewport mode for seamless scaling across smartphone, tablet, and desktop
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setViewportMode('mobile');
      } else if (w < 1140) {
        setViewportMode('tablet');
      } else {
        setViewportMode('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Trigger entrance sequence once on initial mount (no scroll-based re-triggering)
  useEffect(() => {
    let triggered = false;
    const triggerEntrance = () => {
      if (!triggered) {
        triggered = true;
        setIsLoaded(true);
      }
    };

    window.addEventListener('preloader-finish', triggerEntrance);
    const timer = setTimeout(triggerEntrance, 1000);

    return () => {
      window.removeEventListener('preloader-finish', triggerEntrance);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="Start"
      className="relative w-full select-none bg-transparent flex flex-col justify-end pt-12 sm:pt-14 md:pt-16 lg:pt-20 z-10 overflow-visible"
      style={{
        // Compact height so the lower robes dip directly behind the parchment ribbon without a giant empty space
        minHeight: viewportMode === 'mobile'
          ? 'min(68svh, 36rem)'
          : viewportMode === 'tablet'
          ? 'min(72svh, 42rem)'
          : 'min(78svh, 48rem)'
      }}
    >
      {/* Harmonized Stage Layer across Mobile, Tablet, and Desktop */}
      <div
        className={`relative w-full mx-auto overflow-visible ${
          viewportMode === 'mobile'
            ? 'h-[64svh] min-h-[28rem] max-h-[36rem]'
            : viewportMode === 'tablet'
            ? 'h-[70svh] min-h-[34rem] max-h-[42rem]'
            : 'w-full h-[76svh] min-h-[38rem] max-h-[48rem]'
        }`}
      >
        {STAGE_FIGURES.map((member) => {
          const cfg = viewportMode === 'mobile'
            ? member.mobile
            : viewportMode === 'tablet'
            ? member.tablet
            : member.desktop;

          return (
            <div
              key={member.id}
              className="absolute cursor-default select-none pointer-events-none"
              style={{
                left: cfg.left,
                top: cfg.top,
                width: cfg.width,
                zIndex: cfg.zIndex,
                transition: 'transform 900ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity 800ms ease-out',
                transitionDelay: `${member.entranceDelay}ms`,
                transform: isLoaded
                  ? 'translate3d(0, 0, 0)'
                  : 'translate3d(0, 24px, 0)',
                opacity: isLoaded ? 1 : 0
              }}
            >
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

      {/* Ground Smoke & Fog Layer placed at bottom z-[2] */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[2]">
        <img
          src={ASSETS.smokeAlt}
          alt="Atmosphärischer Rauch"
          className="w-full h-24 sm:h-30 md:h-36 object-cover object-bottom opacity-20 mix-blend-screen"
          style={{
            filter: 'brightness(105%) contrast(98%)'
          }}
        />
      </div>
    </section>
  );
};
