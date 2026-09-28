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
  desktopXl: { left: string; top: string; width: string; zIndex: number };
  desktopLg: { left: string; top: string; width: string; zIndex: number };
  tablet: { left: string; top: string; width: string; zIndex: number };
  mobile: { left: string; top: string; width: string; zIndex: number };
}

// 7 Ensemble figures - strictly centered on 50% across Desktop XL, Desktop LG, Tablet, and Mobile
// Susanne and Ruth lower bodies intentionally overlap and step behind the parchment ribbon (no empty voids!)
// Sandra on the right is placed with plenty of breathing space from Lutz so all faces are completely unobstructed
const STAGE_FIGURES: StageFigure[] = [
  {
    id: 'simone',
    name: 'Simone',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Simone.webp',
    alt: 'Simone',
    entranceDelay: 80,
    desktopXl: { left: '26%', top: '8%', width: '20rem', zIndex: 4 },
    desktopLg: { left: '25%', top: '8%', width: '20rem', zIndex: 4 },
    tablet: { left: '25%', top: '6%', width: '24vw', zIndex: 4 },
    mobile: { left: '10%', top: '3%', width: '40vw', zIndex: 4 } // 1% down
  },
  {
    id: 'klemens',
    name: 'Klemens',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Klemens.webp',
    alt: 'Klemens',
    entranceDelay: 160,
    desktopXl: { left: '44%', top: '7%', width: '19rem', zIndex: 5 },
    desktopLg: { left: '44%', top: '7%', width: '19rem', zIndex: 5 },
    tablet: { left: '46%', top: '5%', width: '22vw', zIndex: 5 },
    mobile: { left: '38%', top: '1%', width: '38vw', zIndex: 5 } // 4% further left
  },
  {
    id: 'silke',
    name: 'Silke',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Silke.webp',
    alt: 'Silke',
    entranceDelay: 260,
    desktopXl: { left: '9%', top: '16%', width: '22rem', zIndex: 7 },
    desktopLg: { left: '9%', top: '16%', width: '22rem', zIndex: 7 },
    tablet: { left: '13%', top: '13%', width: '26vw', zIndex: 7 },
    mobile: { left: '-1%', top: '14%', width: '42vw', zIndex: 7 } // 2% down
  },
  {
    id: 'sandra',
    name: 'Sandra',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/10/2024_Sandra_Olla-Podrida_web_2.webp',
    alt: 'Sandra',
    entranceDelay: 360,
    desktopXl: { left: '57%', top: '15%', width: '23rem', zIndex: 9 },
    desktopLg: { left: '57%', top: '15%', width: '23rem', zIndex: 9 },
    tablet: { left: '58%', top: '13%', width: '26vw', zIndex: 9 },
    mobile: { left: '52%', top: '12%', width: '44vw', zIndex: 10 }
  },
  {
    id: 'lutz',
    name: 'Lutz',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Lutz.webp',
    alt: 'Lutz',
    entranceDelay: 460,
    desktopXl: { left: '35%', top: '15%', width: '25rem', zIndex: 8 },
    desktopLg: { left: '35%', top: '15%', width: '25rem', zIndex: 8 },
    tablet: { left: '37%', top: '13%', width: '27vw', zIndex: 8 },
    mobile: { left: '26%', top: '10%', width: '46vw', zIndex: 8 }
  },
  {
    id: 'susanne',
    name: 'Susanne',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Susanne-1.webp',
    alt: 'Susanne spielt vergnügt auf der Flöte',
    entranceDelay: 580,
    desktopXl: { left: '19%', top: '24%', width: '33rem', zIndex: 10 },
    desktopLg: { left: '18%', top: '24%', width: '33rem', zIndex: 10 },
    tablet: { left: '25%', top: '21%', width: '36vw', zIndex: 10 },
    mobile: { left: '12%', top: '22%', width: '56vw', zIndex: 14 } // 2% down
  },
  {
    id: 'ruth',
    name: 'Ruth',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Ruth_web_5.webp',
    alt: 'Ruth',
    entranceDelay: 680,
    desktopXl: { left: '44%', top: '34%', width: '23rem', zIndex: 9 },
    desktopLg: { left: '44%', top: '34%', width: '23rem', zIndex: 9 },
    tablet: { left: '45%', top: '28%', width: '28vw', zIndex: 9 },
    mobile: { left: '44%', top: '26%', width: '38vw', zIndex: 12 } // 2% down, 1% left
  }
];

export const HeroStage: React.FC<HeroStageProps> = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktopLg' | 'desktopXl'>('desktopXl');

  // Dynamically track viewport mode: mobile (<= 600px), tablet (601px to 1024px), desktop LG, and desktop XL
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 600) {
        setViewportMode('mobile');
      } else if (w <= 1024) {
        setViewportMode('tablet');
      } else if (w < 1280) {
        setViewportMode('desktopLg');
      } else {
        setViewportMode('desktopXl');
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
      className="relative w-full select-none bg-transparent flex flex-col justify-end pt-14 md:pt-16 lg:pt-20 z-10 overflow-visible"
      style={{
        // Harmonized height so the figures fit naturally and the lower robes dip directly behind the parchment ribbon
        minHeight: viewportMode === 'mobile'
          ? 'min(58svh, 25rem)'
          : viewportMode === 'tablet'
          ? 'min(72svh, 42rem)'
          : 'min(78svh, 48rem)'
      }}
    >
      {/* Stone Hall Backdrop strictly for the Hero Stage */}
      <div
        className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat pointer-events-none opacity-95 -z-10"
        style={{
          backgroundImage: `url(${ASSETS.heroBackgroundDesktop})`,
          backgroundPosition: 'center top',
          backgroundSize: '100% auto'
        }}
      />
      <div
        className="md:hidden absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat pointer-events-none opacity-95 -z-10"
        style={{
          backgroundImage: `url(${ASSETS.heroBackgroundMobile})`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover'
        }}
      />
      {/* Bottom fade into pure #070202 */}
      <div className="absolute bottom-0 inset-x-0 h-16 md:h-24 bg-gradient-to-b from-transparent to-[#070202] pointer-events-none -z-10" />

      {/* Harmonized Stage Layer across Mobile, Tablet, and Desktop */}
      <div
        className={`relative w-full max-w-[76rem] mx-auto overflow-visible ${
          viewportMode === 'mobile'
            ? 'h-[58svh] min-h-[20rem] max-h-[27rem]'
            : viewportMode === 'tablet'
            ? 'h-[70svh] min-h-[34rem] max-h-[42rem]'
            : 'h-[76svh] min-h-[38rem] max-h-[48rem]'
        }`}
      >
        {STAGE_FIGURES.map((member) => {
          const cfg = viewportMode === 'mobile'
            ? member.mobile
            : viewportMode === 'tablet'
            ? member.tablet
            : viewportMode === 'desktopLg'
            ? member.desktopLg
            : member.desktopXl;

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
