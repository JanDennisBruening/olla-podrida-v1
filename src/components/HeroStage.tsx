import React, { useState, useEffect } from 'react';
import { getAssets, getHeroConfig, getEnsembleMembers, resolveAssetUrl } from '../data/siteContent';

interface HeroStageProps {
  onSelectMember?: (memberId: string) => void;
}

interface StageFigureConfig {
  id: string;
  name: string;
  defaultImage: string;
  defaultAlt: string;
  entranceDelay: number;
  desktopXl: { left: string; top: string; width: string; zIndex: number };
  desktopLg: { left: string; top: string; width: string; zIndex: number };
  tablet: { left: string; top: string; width: string; zIndex: number };
  mobile: { left: string; top: string; width: string; zIndex: number };
}

const CANONICAL_STAGE_FIGURES: StageFigureConfig[] = [
  {
    id: 'simone',
    name: 'Simone',
    defaultImage: '/images/Simone_stage.webp',
    defaultAlt: 'Simone',
    entranceDelay: 1030,
    desktopXl: { left: '26%', top: '8%', width: '20rem', zIndex: 4 },
    desktopLg: { left: '25%', top: '8%', width: '20rem', zIndex: 4 },
    tablet: { left: '25%', top: '6%', width: '24vw', zIndex: 4 },
    mobile: { left: '10%', top: '3%', width: '40vw', zIndex: 4 }
  },
  {
    id: 'klemens',
    name: 'Klemens',
    defaultImage: '/images/Klemens_stage.webp',
    defaultAlt: 'Klemens',
    entranceDelay: 900,
    desktopXl: { left: '44%', top: '7%', width: '19rem', zIndex: 5 },
    desktopLg: { left: '44%', top: '7%', width: '19rem', zIndex: 5 },
    tablet: { left: '46%', top: '5%', width: '22vw', zIndex: 5 },
    mobile: { left: '38%', top: '1%', width: '38vw', zIndex: 5 }
  },
  {
    id: 'silke',
    name: 'Silke',
    defaultImage: '/images/Silke_stage.webp',
    defaultAlt: 'Silke',
    entranceDelay: 770,
    desktopXl: { left: '9%', top: '16%', width: '22rem', zIndex: 7 },
    desktopLg: { left: '9%', top: '16%', width: '22rem', zIndex: 7 },
    tablet: { left: '13%', top: '13%', width: '26vw', zIndex: 7 },
    mobile: { left: '-1%', top: '14%', width: '42vw', zIndex: 7 }
  },
  {
    id: 'sandra',
    name: 'Sandra',
    defaultImage: '/images/2024_Sandra_Olla-Podrida_web_2.webp',
    defaultAlt: 'Sandra',
    entranceDelay: 640,
    desktopXl: { left: '57%', top: '15%', width: '23rem', zIndex: 9 },
    desktopLg: { left: '57%', top: '15%', width: '23rem', zIndex: 9 },
    tablet: { left: '58%', top: '13%', width: '26vw', zIndex: 9 },
    mobile: { left: '52%', top: '12%', width: '44vw', zIndex: 10 }
  },
  {
    id: 'lutz',
    name: 'Lutz',
    defaultImage: '/images/Lutz.webp',
    defaultAlt: 'Lutz',
    entranceDelay: 510,
    desktopXl: { left: '35%', top: '15%', width: '25rem', zIndex: 8 },
    desktopLg: { left: '35%', top: '15%', width: '25rem', zIndex: 8 },
    tablet: { left: '37%', top: '13%', width: '27vw', zIndex: 8 },
    mobile: { left: '26%', top: '10%', width: '46vw', zIndex: 8 }
  },
  {
    id: 'susanne',
    name: 'Susanne',
    defaultImage: '/images/Susanne-1.webp',
    defaultAlt: 'Susanne spielt vergnügt auf der Flöte',
    entranceDelay: 250,
    desktopXl: { left: '19%', top: '24%', width: '33rem', zIndex: 10 },
    desktopLg: { left: '18%', top: '24%', width: '33rem', zIndex: 10 },
    tablet: { left: '25%', top: '21%', width: '36vw', zIndex: 10 },
    mobile: { left: '12%', top: '22%', width: '56vw', zIndex: 14 }
  },
  {
    id: 'ruth',
    name: 'Ruth',
    defaultImage: '/images/Ruth_web_5.webp',
    defaultAlt: 'Ruth',
    entranceDelay: 380,
    desktopXl: { left: '44%', top: '34%', width: '23rem', zIndex: 9 },
    desktopLg: { left: '44%', top: '34%', width: '23rem', zIndex: 9 },
    tablet: { left: '45%', top: '28%', width: '28vw', zIndex: 9 },
    mobile: { left: '44%', top: '26%', width: '38vw', zIndex: 12 }
  }
];

export const HeroStage: React.FC<HeroStageProps> = () => {
  const assets = getAssets();
  const heroConfig = getHeroConfig();
  const ensembleMembers = getEnsembleMembers();
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktopLg' | 'desktopXl'>('desktopXl');

  // Dynamically track viewport mode: mobile (<= 600px), tablet (601px to 1024px), desktop LG, and desktop XL
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
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

  // Trigger entrance sequence once preloader finishes and unveils the stage
  useEffect(() => {
    let triggered = false;
    const triggerEntrance = () => {
      if (!triggered) {
        triggered = true;
        // Pause 100ms so the Klangvielfalt banner is mounted and rendered first
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    window.addEventListener('preloader-finish', triggerEntrance);
    window.addEventListener('preloader-removed', () => {
      if (!triggered) {
        triggered = true;
        setIsLoaded(true);
      }
    });

    // If returning visitor already completed preloader
    if (typeof window !== 'undefined' && (window as any).__OLLA_PAGE_READY__) {
      triggerEntrance();
    }

    return () => {
      window.removeEventListener('preloader-finish', triggerEntrance);
    };
  }, []);

  return (
    <section
      id="Start"
      className="relative w-full select-none bg-transparent flex flex-col justify-end pt-14 md:pt-16 lg:pt-20 z-10 overflow-visible"
      style={{
        // Harmonized height so the figures fit naturally and the lower robes dip directly behind the parchment ribbon
        minHeight: viewportMode === 'mobile'
          ? 'min(48svh, 21rem)'
          : viewportMode === 'tablet'
          ? 'min(52svh, 26rem)'
          : 'min(72svh, 42rem)'
      }}
    >
      {/* Stone Hall Backdrop strictly for the Hero Stage – Fades in slowly from dark */}
      <div
        className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat pointer-events-none -z-10"
        style={{
          backgroundImage: `url(${heroConfig.bgDesktop || assets.heroBackgroundDesktop})`,
          backgroundPosition: 'center top',
          backgroundSize: '100% auto',
          transition: 'opacity 2200ms cubic-bezier(0.16, 1, 0.3, 1), transform 2600ms cubic-bezier(0.16, 1, 0.3, 1), filter 2200ms ease-out',
          opacity: isLoaded ? 0.98 : 0,
          transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
          filter: isLoaded ? 'brightness(100%) contrast(100%)' : 'brightness(30%) contrast(125%)'
        }}
      />
      <div
        className="md:hidden absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat pointer-events-none -z-10"
        style={{
          backgroundImage: `url(${heroConfig.bgMobile || assets.heroBackgroundMobile})`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          transition: 'opacity 2200ms cubic-bezier(0.16, 1, 0.3, 1), transform 2600ms cubic-bezier(0.16, 1, 0.3, 1), filter 2200ms ease-out',
          opacity: isLoaded ? 0.98 : 0,
          transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
          filter: isLoaded ? 'brightness(100%) contrast(100%)' : 'brightness(30%) contrast(125%)'
        }}
      />

      {/* Atmospheric Torch / Candle Glow points illuminating the stone hall arches on left and right */}
      <div
        className={`absolute top-[22%] left-[6%] w-52 h-52 rounded-full bg-amber-600/18 blur-3xl pointer-events-none transition-opacity duration-1500 -z-5 ${
          isLoaded ? 'opacity-80 animate-pulse' : 'opacity-0'
        }`}
        style={{ animationDuration: '3.6s' }}
      />
      <div
        className={`absolute top-[22%] right-[6%] w-52 h-52 rounded-full bg-amber-600/18 blur-3xl pointer-events-none transition-opacity duration-1500 -z-5 ${
          isLoaded ? 'opacity-80 animate-pulse' : 'opacity-0'
        }`}
        style={{ animationDuration: '4.4s', animationDelay: '1.2s' }}
      />

      {/* Warm Ambient Center Stage Glow illuminating the figures and stone hall from behind */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-2000 -z-6 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(218, 165, 32, 0.14) 0%, rgba(184, 115, 51, 0.06) 50%, transparent 80%)'
        }}
      />

      {/* Top navbar blend gradient so navbar floats smoothly over the stone hall backdrop */}
      <div className="absolute top-0 inset-x-0 h-24 md:h-32 bg-gradient-to-b from-[#070202]/85 via-[#070202]/40 to-transparent pointer-events-none -z-4" />

      {/* Drifting Stage Mist / Smoke Layer across the floor */}
      {heroConfig.smokeEnabled && (
        <div
          className={`absolute bottom-0 inset-x-0 h-28 md:h-36 pointer-events-none overflow-hidden transition-opacity duration-2000 -z-5 ${
            isLoaded ? 'opacity-35' : 'opacity-0'
          }`}
        >
          <img
            src={assets.smokeBottom || assets.smokeAlt}
            alt=""
            className="w-full h-full object-cover object-bottom mix-blend-screen scale-105"
            style={{ filter: 'brightness(110%) contrast(115%)' }}
          />
        </div>
      )}

      {/* Bottom fade into pure #070202 */}
      <div className="absolute bottom-0 inset-x-0 h-12 md:h-16 bg-gradient-to-b from-transparent to-[#070202] pointer-events-none -z-10" />

      {/* Harmonized Stage Layer across Mobile, Tablet, and Desktop */}
      <div
        className={`relative w-full max-w-[76rem] mx-auto overflow-visible ${
          viewportMode === 'mobile'
            ? 'h-[48svh] min-h-[17rem] max-h-[22rem]'
            : viewportMode === 'tablet'
            ? 'h-[52svh] min-h-[21rem] max-h-[27rem]'
            : 'h-[70svh] min-h-[32rem] max-h-[42rem]'
        }`}
      >
        {CANONICAL_STAGE_FIGURES.map((figure) => {
          const member = ensembleMembers.find((m) => m.id === figure.id);
          if (member && member.showHero === false) {
            return null;
          }

          const cfg = viewportMode === 'mobile'
            ? figure.mobile
            : viewportMode === 'tablet'
            ? figure.tablet
            : viewportMode === 'desktopLg'
            ? figure.desktopLg
            : figure.desktopXl;

          // Viewport-specific fine-tuning offsets
          let offX = 0;
          let offY = 0;
          if (viewportMode === 'mobile') {
            offX = member?.offsetXMobile ?? member?.offsetX ?? 0;
            offY = member?.offsetYMobile ?? member?.offsetY ?? 0;
          } else if (viewportMode === 'tablet') {
            offX = member?.offsetXTablet ?? member?.offsetX ?? 0;
            offY = member?.offsetYTablet ?? member?.offsetY ?? 0;
          } else {
            // desktopLg or desktopXl
            offX = member?.offsetXDesktop ?? member?.offsetX ?? 0;
            offY = member?.offsetYDesktop ?? member?.offsetY ?? 0;
          }

          // Determine authentic image source
          let imageSrc = figure.defaultImage;
          if (member?.stageImage) {
            const isThumbnail = /[\/_](simone|silke|klemens|ruth|susanne|lutz)_klein\.webp$/i.test(member.stageImage) ||
                                /[\/](simone|silke|klemens)\.webp$/i.test(member.stageImage);
            if (!isThumbnail) {
              imageSrc = member.stageImage;
            }
          }

          const resolvedImage = resolveAssetUrl(imageSrc);
          const altText = member?.tooltip || member?.name || figure.defaultAlt;

          return (
            <div
              key={figure.id}
              className="absolute cursor-default select-none pointer-events-none"
              style={{
                left: cfg.left,
                top: cfg.top,
                width: cfg.width,
                zIndex: cfg.zIndex,
                transition: 'transform 720ms cubic-bezier(0.16, 1, 0.3, 1), opacity 560ms ease-out',
                transitionDelay: `${figure.entranceDelay}ms`,
                transform: isLoaded
                  ? `translate3d(${offX}px, ${offY}px, 0)`
                  : `translate3d(${offX}px, ${offY + 80}px, 0)`,
                opacity: isLoaded ? 1 : 0
              }}
            >
              <img
                src={resolvedImage}
                alt={altText}
                className="w-full h-auto object-contain filter drop-shadow-[0_10px_22px_rgba(0,0,0,0.85)] pointer-events-none"
                loading="eager"
              />
            </div>
          );
        })}
      </div>

      {/* Ground Smoke & Fog Layer placed at bottom z-[2] */}
      {heroConfig.smokeEnabled && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[2]">
          <img
            src={assets.smokeAlt}
            alt="Atmosphärischer Rauch"
            className="w-full h-24 sm:h-30 md:h-36 object-cover object-bottom mix-blend-screen"
            style={{
              opacity: typeof heroConfig.smokeOpacity === 'number' ? heroConfig.smokeOpacity : 0.2,
              filter: 'brightness(105%) contrast(98%)'
            }}
          />
        </div>
      )}
    </section>
  );
};
