import React, { useState } from 'react';
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
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: false });

  return (
    <section
      ref={sectionRef}
      id="ensemble"
      className="relative w-full bg-transparent text-[#F5F5DC] overflow-visible -mt-[7rem] sm:-mt-[9rem] md:-mt-[12rem] lg:-mt-[15rem] pt-0 pb-4 select-none z-20"
    >
      {/* Main Parchment Paper Ribbon Container (.elementor-element-54faf8e6 & 28ffdb8c) */}
      <div className="w-full flex justify-center px-2 sm:px-4 relative z-10">
        <div
          className={`relative w-full max-w-[67rem] transition-all duration-700 ease-out transform ${
            isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.99]'
          }`}
          style={{
            backgroundImage: `url("${ASSETS.ribbonPaper}")`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
          }}
        >
          {/* Internal Content mapped directly inside the parchment paper area */}
          <div className="pt-[28vw] sm:pt-[24vw] md:pt-[17rem] pb-10 sm:pb-12 md:pb-16 px-[6vw] sm:px-[8vw] md:px-[7rem] lg:px-[8rem] flex flex-col items-start text-left">
            
            {/* Title matching .elementor-element-7bd36bc3 - Left-aligned as requested */}
            <h2
              className={`font-macondo text-3xl sm:text-5xl md:text-[3.8rem] font-semibold text-[#0A0707] tracking-normal mb-6 md:mb-8 leading-tight text-left w-full transition-all duration-700 delay-100 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Ensemble Olla Podrida
            </h2>

            {/* Container 615a8bb3: Paragraph 1 + Logo in 2 columns on desktop */}
            <div
              className={`w-full flex flex-col md:flex-row items-center justify-between text-left mb-4 md:mb-6 gap-4 md:gap-6 transition-all duration-700 delay-200 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="w-full md:w-[70%] font-macondo text-sm sm:text-base md:text-[1.28rem] font-semibold text-[#0A0707] leading-relaxed md:leading-[1.85rem] text-justify md:text-left">
                <p>
                  Eigentlich bezeichnet es ein typisches Gericht der kastilischen Küche und war ursprünglich ein Eintopf. Der Name des Gerichts stammt in Wirklichkeit von dem mittelalterlichen spanischen Ausdruck „olla poderida“ („mächtiger Topf“). Die Franzosen haben den Begriff wörtlich übersetzt mit Potpourri, was in dem Sinne einem musikalischen Cocktail nahekommt. Zum einen symbolisiert der Name unsere musikalische Vielfalt, zum anderen genießen wir den schmackhaften Eintopf bei unseren alljährlichen gemeinsamen Festessen.
                </p>
              </div>

              {/* Circular Logo Emblem .elementor-element-dd00022 */}
              <div className="w-full md:w-[28%] flex justify-center md:justify-end shrink-0 my-2 md:my-0">
                <img
                  src={ASSETS.logo}
                  alt="Olla Podrida Emblem"
                  className="w-36 sm:w-44 md:w-52 h-auto object-contain transition-transform duration-500 hover:scale-105 drop-shadow-sm"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Paragraph 2 matching .elementor-element-57e0be44 */}
            <div
              className={`w-full font-macondo text-sm sm:text-base md:text-[1.28rem] font-semibold text-[#0A0707] leading-relaxed md:leading-[1.85rem] mb-6 md:mb-10 text-justify md:text-left transition-all duration-700 delay-300 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p>
                Die Klangvielfalt aus Mittelalter und Renaissance – so sehen wir uns und genauso lebendig wie damals, so erleben wir uns! Voller Kraft mit Krummhörnern, Sackpfeifen und Trommeln, aber auch verspielt und anrührend mit Harfe, Laute und Psalter. Rein instrumental oder mit mehrstimmigem Gesang vorgetragen – wir erwecken diese Musik mit Freude und Hingabe zu neuem Leben.
              </p>
            </div>

            {/* The 7 Musician Cutout Portraits - ALL EXACTLY THE SAME UNIFORM HEIGHT & COMFORTABLY SPACED */}
            <div className="w-full my-4 md:my-6 overflow-visible">
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
                        className="h-22 sm:h-28 md:h-36 lg:h-42 xl:h-46 flex items-end justify-center overflow-visible"
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

            {/* Paragraph 3 (History Note) matching .elementor-element-35650362 */}
            <div
              className={`w-full font-macondo text-sm sm:text-base md:text-[1.28rem] font-semibold text-[#0A0707] leading-relaxed md:leading-[1.85rem] mt-6 md:mt-8 text-justify md:text-left transition-all duration-700 delay-400 ease-out ${
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

      {/* Soft transition into the black background below the natural deckle parchment edge */}
      <div className="w-full h-12 md:h-16 bg-gradient-to-b from-transparent to-[#070202] pointer-events-none" />
    </section>
  );
};
