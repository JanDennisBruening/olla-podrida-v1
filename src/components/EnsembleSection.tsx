import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/siteContent';
import { useInView } from '../hooks/useInView';

interface MusicianPortrait {
  id: string;
  name: string;
  image: string;
  alt: string;
  baseScale: number;
}

// 7 Musician Cutout Portraits - perfectly uniform base scale
const MUSICIANS: MusicianPortrait[] = [
  {
    id: 'susanne',
    name: 'Susanne',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Susanne_klein.webp',
    alt: 'Susanne spielt vergnügt auf der Flöte',
    baseScale: 1.0
  },
  {
    id: 'lutz',
    name: 'Lutz',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Lutz_klein.png',
    alt: 'Lutz',
    baseScale: 1.0
  },
  {
    id: 'sandra',
    name: 'Sandra',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/10/2024_Sandra_2-Ebene-2-1-712x1024.webp',
    alt: 'Sandra',
    baseScale: 1.0
  },
  {
    id: 'silke',
    name: 'Silke',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Silke_2_klein.webp',
    alt: 'Silke',
    baseScale: 1.0
  },
  {
    id: 'klemens',
    name: 'Klemens',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Klemens_3_klein.webp',
    alt: 'Klemens',
    baseScale: 1.0
  },
  {
    id: 'simone',
    name: 'Simone',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Simone_klein.webp',
    alt: 'Simone',
    baseScale: 1.0
  },
  {
    id: 'ruth',
    name: 'Ruth',
    image: 'https://olla-podrida.de/wp-content/uploads/2024/07/Ruth_2_klein.webp',
    alt: 'Ruth',
    baseScale: 1.0
  }
];

export const EnsembleSection: React.FC = () => {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: false });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ensemble"
      className="relative w-full bg-transparent text-[#F5F5DC] overflow-visible -mt-[15vw] md:-mt-[12vw] lg:-mt-[7.5rem] xl:-mt-[9.5rem] pt-0 pb-0 select-none z-20"
    >
      {/* Main Parchment Paper Container */}
      <div className="w-full flex flex-col items-center px-0 md:px-[5.5%] relative z-10">

        {/* Authentic Parchment Scroll: Integrated ribbon banner on top, authentic deckled sides, and torn bottom */}
        <div
          className={`relative w-full max-w-none md:max-w-[67rem] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] transition-all duration-700 ease-out transform ${
            isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.99]'
          }`}
          style={{
            backgroundImage: `url(${isMobile ? '/SchleifePapierMobile.webp' : '/SchleifePapier.webp'})`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: isMobile ? '100% 100%' : '100% auto'
          }}
        >
          {/* Internal Content mapped directly inside the authentic parchment paper scroll with proper padding */}
          <div className="pt-[28vw] md:pt-[16.5rem] lg:pt-[17.5rem] pb-[14vw] md:pb-[10rem] px-[12vw] md:px-[9rem] lg:px-[10rem] flex flex-col items-start text-left">
            
            {/* Title matching .elementor-element-7bd36bc3 - Positioned cleanly on the parchment paper below ribbon */}
            <h2
              className={`font-macondo text-[6.5vw] md:text-[2.6rem] lg:text-[3.35rem] font-semibold text-[#0A0707] tracking-normal mb-2 md:mb-6 leading-tight text-left w-full transition-all duration-700 delay-100 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Ensemble Olla Podrida
            </h2>

            {/* Container 615a8bb3: Paragraph 1 + Logo (Side-by-side on tablet & desktop, stacked cleanly on mobile) */}
            <div
              className={`w-full flex flex-col md:flex-row items-center justify-between text-left mb-2 md:mb-6 gap-2 md:gap-8 transition-all duration-700 delay-200 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="w-full md:w-[60%] font-macondo text-[3.7vw] md:text-[1.24rem] lg:text-[1.28rem] font-semibold text-[#0A0707] leading-[5.2vw] md:leading-[1.82rem] text-justify md:text-left">
                <p>
                  Eigentlich bezeichnet es ein typisches Gericht der kastilischen Küche und war ursprünglich ein Eintopf. Der Name des Gerichts stammt in Wirklichkeit von dem mittelalterlichen spanischen Ausdruck „olla poderida“ („mächtiger Topf“). Die Franzosen haben den Begriff wörtlich übersetzt mit Potpourri, was in dem Sinne einem musikalischen Cocktail nahekommt. Zum einen symbolisiert der Name unsere musikalische Vielfalt, zum anderen genießen wir den schmackhaften Eintopf bei unseren alljährlichen gemeinsamen Festessen.
                </p>
              </div>

              {/* Large, proud Olla Podrida Pot Illustration .elementor-element-dd00022 - Enlarged by 30% proportionally */}
              <div className="w-full md:w-[40%] flex justify-center md:justify-end shrink-0 my-3 md:my-0">
                <div className="relative flex items-center justify-center">
                  <img
                    src={ASSETS.logo}
                    alt="Olla Podrida Emblem - Brodelnder Eintopf mit Instrumenten"
                    className="w-[17rem] md:w-[34rem] lg:w-[41.5rem] h-auto object-contain transition-transform duration-500 hover:scale-105 drop-shadow-md select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Paragraph 2 matching .elementor-element-57e0be44 */}
            <div
              className={`w-full font-macondo text-[3.7vw] md:text-[1.24rem] lg:text-[1.28rem] font-semibold text-[#0A0707] leading-[5.2vw] md:leading-[1.82rem] mb-2 md:mb-7 text-justify md:text-left transition-all duration-700 delay-300 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p>
                Die Klangvielfalt aus Mittelalter und Renaissance – so sehen wir uns und genauso lebendig wie damals, so erleben wir uns! Voller Kraft mit Krummhörnern, Sackpfeifen und Trommeln, aber auch verspielt und anrührend mit Harfe, Laute und Psalter. Rein instrumental oder mit mehrstimmigem Gesang vorgetragen – wir erwecken diese Musik mit Freude und Hingabe zu neuem Leben.
              </p>
            </div>

            {/* The 7 Musician Cutout Portraits (elementor-hidden-mobile on small screens, full display on tablet & desktop) */}
            <div className="hidden md:block w-full my-4 md:my-6 overflow-visible">
              <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 items-end justify-items-center w-full overflow-visible">
                {MUSICIANS.map((musician, index) => {
                  const isHovered = hoveredMember === musician.id;
                  const targetScale = isHovered ? 1.10 : 1.0;
                  const entranceDelay = index * 80;

                  return (
                    <div
                      key={musician.id}
                      className="relative group flex flex-col items-center justify-end cursor-pointer w-full overflow-visible"
                      onMouseEnter={() => setHoveredMember(musician.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                      onClick={() => setHoveredMember(hoveredMember === musician.id ? null : musician.id)}
                    >
                      {/* Premium Addons Global Tooltip showing name */}
                      <div
                        className={`absolute -top-10 sm:-top-12 px-2 py-0.5 rounded bg-[#070202] border border-[#DAA520] text-[#F5F5DC] font-macondo text-xs sm:text-sm whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-30 ${
                          isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95'
                        }`}
                      >
                        <span>{musician.name}</span>
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#070202] border-r border-b border-[#DAA520] rotate-45" />
                      </div>

                      {/* Figure cutout: perfectly uniform height constraint across all 7 figures */}
                      <div
                        className="h-14 sm:h-18 md:h-24 lg:h-30 xl:h-34 flex items-end justify-center overflow-visible"
                        style={{
                          transformOrigin: 'bottom center',
                          transform: isInView
                            ? `translateY(0) scale(${targetScale})`
                            : 'translateY(1.5rem) scale(0.94)',
                          opacity: isInView ? 1 : 0,
                          transitionProperty: 'opacity, transform, filter',
                          transitionDuration: isHovered ? '250ms' : '650ms',
                          transitionTimingFunction: isHovered ? 'ease-out' : 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: isHovered ? '0ms' : `${entranceDelay}ms`
                        }}
                      >
                        <img
                          src={musician.image}
                          alt={musician.alt}
                          className={`h-full w-auto max-w-none object-contain object-bottom transition-all duration-300 ${
                            isHovered
                              ? 'filter saturate-100 brightness-105 drop-shadow-md'
                              : 'filter saturate-[0.6] brightness-95 drop-shadow-xs'
                          }`}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Paragraph 3 (History Note) matching .elementor-element-35650362 / 4d5d6953 */}
            <div
              className={`w-full font-macondo text-[3.5vw] sm:text-[3.2vw] md:text-[1.24rem] lg:text-[1.28rem] font-semibold text-[#0A0707] leading-[4.7vw] sm:leading-[4.2vw] md:leading-[1.82rem] mt-2.5 md:mt-6 text-justify md:text-left transition-all duration-700 delay-400 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p>
                In seiner jetzigen Besetzung besteht das Ensemble seit 2017 und ist aus der Musikgruppe „Mercks wol!“ hervorgegangen. Wir konzertieren an historischen Stätten, in Kirchen und Museen, manchmal auch auf Märkten, und verleihen Lesungen und Vorträgen den musikalischen Rahmen. Die Berufsmusik ist uns eine Fremde, und so ist es jedes einzelne Mal ein besonderes Ereignis, wenn wir alle zusammenkommen, aus allen Himmelsrichtungen, und die alten Klänge der Vergangenheit in der Gegenwart erklingen lassen.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
