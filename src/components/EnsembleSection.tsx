import React, { useState } from 'react';
import { getAssets, getEnsembleConfig, getEnsembleMembers, resolveAssetUrl } from '../data/siteContent';
import { useInView } from '../hooks/useInView';

export const EnsembleSection: React.FC = () => {
  const assets = getAssets();
  const ensembleConfig = getEnsembleConfig();
  const rawMembers = getEnsembleMembers();

  // 7 Musician Cutout Portraits in original canonical sequence:
  // Simone, Klemens, Silke, Sandra, Lutz, Susanne, Ruth
  const sequence = ['simone', 'klemens', 'silke', 'sandra', 'lutz', 'susanne', 'ruth'];
  const musicians = sequence.map((id) => {
    const found = rawMembers.find((m) => m.id === id);
    return {
      id,
      name: found ? found.name : id.charAt(0).toUpperCase() + id.slice(1),
      image: found?.portraitImage || resolveAssetUrl(`/images/${id}_klein.webp`),
      alt: found?.tooltip || found?.name || id,
      baseScale: 1.0
    };
  });

  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.08, rootMargin: '0px 0px -50px 0px', triggerOnce: true });
  const { ref: musiciansRef, isInView: musiciansInView } = useInView<HTMLDivElement>({ threshold: 0.12, rootMargin: '0px 0px -40px 0px', triggerOnce: true });
  const { ref: textBottomRef, isInView: textBottomInView } = useInView<HTMLDivElement>({ threshold: 0.12, rootMargin: '0px 0px -30px 0px', triggerOnce: true });

  // Tablet split (4 + 3)
  const tabletRow1 = musicians.slice(0, 4); // Simone, Klemens, Silke, Sandra
  const tabletRow2 = musicians.slice(4);    // Lutz, Susanne, Ruth

  // Narrow Mobile split (3 + 3 + 1)
  const mobileRow1 = musicians.slice(0, 3); // Simone, Klemens, Silke
  const mobileRow2 = musicians.slice(3, 6); // Sandra, Lutz, Susanne
  const mobileRow3 = musicians.slice(6);    // Ruth (solo, centered & slightly larger)

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center bg-transparent text-[#F5F5DC] overflow-visible -mt-[16vw] sm:-mt-[15vw] md:-mt-[13vw] lg:-mt-[10rem] xl:-mt-[11.5rem] pt-0 pb-0 select-none z-20"
    >
      {/* Centered Parchment Container - Reduced side borders by half, perfectly centered */}
      <div className="w-full flex flex-col items-center justify-center px-0 relative z-10">

        {/* Scroll anchor placed directly at top of section with clearance for fixed navbar */}
        <div id="ensemble" className="absolute -top-16 sm:-top-20 md:-top-24 lg:-top-28 scroll-mt-20 md:scroll-mt-24 lg:scroll-mt-28 pointer-events-none" />

        {/* Single continuous parchment scroll: SchleifePapier.webp (Desktop) / SchleifePapierMobile.webp (Mobile/Tablet) */}
        {/* background-size: 100% auto locks banner proportions so it NEVER squashes, stretches, or deforms */}
        <div
          className={`relative w-[96vw] sm:w-[96vw] md:w-[96vw] max-w-[62rem] lg:max-w-[70rem] xl:max-w-[76rem] mx-auto filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] flex flex-col items-center transition-all duration-1000 ease-out transform ${
            isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
          }`}
          style={{
            backgroundImage: `url('${resolveAssetUrl('/SchleifePapierMobile.webp')}')`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% auto'
          }}
        >
          {/* Content directly below the ribbon: padding-top places headline right underneath the ribbon banner */}
          <div className="w-full pt-[31vw] sm:pt-[29vw] md:pt-[26vw] lg:pt-[17rem] xl:pt-[19rem] pb-20 sm:pb-24 md:pb-28 lg:pb-32 px-[12vw] sm:px-[11%] md:px-[12%] lg:px-[13%] xl:px-[14%] flex flex-col items-start text-left">
            
            {/* Title matching .elementor-element-7bd36bc3 - Appears directly after the ribbon banner */}
            <h2
              className={`font-macondo text-[6.5vw] md:text-[2.6rem] lg:text-[3.2rem] xl:text-[3.6rem] font-semibold text-[#0A0707] tracking-normal mb-3 md:mb-5 lg:mb-6 leading-tight text-left w-full transition-all duration-700 delay-100 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {ensembleConfig.title || 'Ensemble Olla Podrida'}
            </h2>

            {/* ======================================================== */}
            {/* DESKTOP VIEWPORT (>= 1024px / lg:): Paragraph 1 + Logo side-by-side */}
            {/* ======================================================== */}
            <div className={`hidden lg:flex w-full flex-row items-center justify-between gap-5 xl:gap-8 mb-5 overflow-visible transition-all duration-700 delay-200 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {/* Paragraph 1 (left column: ~60%) */}
              <div className="w-[60%] xl:w-[60%] font-macondo text-[1.3rem] font-semibold text-[#0A0707] leading-[1.85rem] text-left">
                <p>
                  {ensembleConfig.paragraph1 || 'Eigentlich bezeichnet es ein typisches Gericht der kastilischen Küche und war ursprünglich ein Eintopf. Der Name des Gerichts stammt in Wirklichkeit von dem mittelalterlichen spanischen Ausdruck „olla poderida“ („mächtiger Topf“). Die Franzosen haben den Begriff wörtlich übersetzt mit Potpourri, was in dem Sinne einem musikalischen Cocktail nahekommt. Zum einen symbolisiert der Name unsere musikalische Vielfalt, zum anderen genießen wir den schmackhaften Eintopf bei unseren alljährlichen gemeinsamen Festessen.'}
                </p>
              </div>

              {/* Suppentopf Illustration (right column: ~40%) - enlarged by 20% */}
              <div className="w-[40%] xl:w-[40%] flex justify-center items-center overflow-visible p-2">
                <img
                  src={ensembleConfig.logo || assets.logo}
                  alt="Olla Podrida Emblem - Brodelnder Eintopf mit Instrumenten"
                  className="w-full max-w-[21rem] xl:max-w-[22.2rem] h-auto object-contain transition-transform duration-500 hover:scale-105 drop-shadow-md select-none pointer-events-none"
                  loading="lazy"
                />
              </div>
            </div>

            {/* ======================================================== */}
            {/* MOBILE & TABLET VIEWPORT (< 1024px): Paragraph 1 + Centered Logo below */}
            {/* ======================================================== */}
            <div className={`lg:hidden w-full font-macondo text-[3.7vw] md:text-[1.3rem] font-semibold text-[#0A0707] leading-[5.2vw] md:leading-[1.85rem] text-justify md:text-left transition-all duration-700 delay-200 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <p>
                {ensembleConfig.paragraph1 || 'Eigentlich bezeichnet es ein typisches Gericht der kastilischen Küche und war ursprünglich ein Eintopf. Der Name des Gerichts stammt in Wirklichkeit von dem mittelalterlichen spanischen Ausdruck „olla poderida“ („mächtiger Topf“). Die Franzosen haben den Begriff wörtlich übersetzt mit Potpourri, was in dem Sinne einem musikalischen Cocktail nahekommt. Zum einen symbolisiert der Name unsere musikalische Vielfalt, zum anderen genießen wir den schmackhaften Eintopf bei unseren alljährlichen gemeinsamen Festessen.'}
              </p>
            </div>

            {/* Suppentopf Illustration on Mobile & Tablet: Centered between text parts & enlarged by 20% */}
            <div className={`lg:hidden w-full flex justify-center my-5 sm:my-7 md:my-8 overflow-visible transition-all duration-700 delay-250 ease-out ${
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
              <div className="relative flex items-center justify-center p-2 overflow-visible">
                <img
                  src={ensembleConfig.logo || assets.logo}
                  alt="Olla Podrida Emblem - Brodelnder Eintopf mit Instrumenten"
                  className="w-[17.4rem] sm:w-[21.6rem] md:w-[25.2rem] max-w-full h-auto object-contain transition-transform duration-500 hover:scale-105 drop-shadow-md select-none pointer-events-none"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Paragraph 2: Full width across all viewports */}
            <div
              className={`w-full font-macondo text-[3.7vw] md:text-[1.3rem] lg:text-[1.3rem] font-semibold text-[#0A0707] leading-[5.2vw] md:leading-[1.85rem] lg:leading-[1.85rem] mb-4 sm:mb-6 md:mb-7 lg:mb-8 text-justify md:text-left transition-all duration-700 delay-300 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p>
                {ensembleConfig.paragraph2 || 'Die Klangvielfalt aus Mittelalter und Renaissance – so sehen wir uns und genauso lebendig wie damals, so erleben wir uns! Voller Kraft mit Krummhörnern, Sackpfeifen und Trommeln, aber auch verspielt und anrührend mit Harfe, Laute und Psalter. Rein instrumental oder mit mehrstimmigem Gesang vorgetragen – wir erwecken diese Musik mit Freude und Hingabe zu neuem Leben.'}
              </p>
            </div>

            {/* ======================================================== */}
            {/* 7 MUSICIANS SECTION (Desktop, Tablet, Mobile) - Cascading entrance when scrolled into view */}
            {/* ======================================================== */}
            <div ref={musiciansRef} className="w-full overflow-visible">
              {/* 1. DESKTOP VIEWPORT (>= 1024px / lg:): ALL 7 FIGURES SIDE-BY-SIDE IN ONE ROW */}
              <div className="hidden lg:flex w-full my-6 overflow-visible justify-between items-end gap-2 xl:gap-4">
                {musicians.map((musician, index) => {
                  const isHovered = hoveredMember === musician.id;
                  const targetScale = isHovered ? 1.08 : 1.0;
                  const entranceDelay = 100 + index * 120;

                  return (
                    <div
                      key={musician.id}
                      className="relative group flex flex-col items-center justify-end cursor-pointer overflow-visible flex-1"
                      onMouseEnter={() => setHoveredMember(musician.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                      onClick={() => setHoveredMember(hoveredMember === musician.id ? null : musician.id)}
                    >
                      {/* Tooltip */}
                      <div
                        className={`absolute -top-11 px-2.5 py-0.5 rounded bg-[#070202] border border-[#DAA520] text-[#F5F5DC] font-macondo text-sm whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-30 ${
                          isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95'
                        }`}
                      >
                        <span>{musician.name}</span>
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#070202] border-r border-b border-[#DAA520] rotate-45" />
                      </div>

                      {/* Figure Cutout with Distinct Stagger Wave */}
                      <div
                        className="h-36 xl:h-42 flex items-end justify-center overflow-visible"
                        style={{
                          transformOrigin: 'bottom center',
                          transform: musiciansInView
                            ? `translateY(0) scale(${targetScale})`
                            : 'translateY(2.8rem) scale(0.85)',
                          opacity: musiciansInView ? 1 : 0,
                          transitionProperty: 'opacity, transform, filter',
                          transitionDuration: isHovered ? '250ms' : '800ms',
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
                              : 'filter saturate-[0.85] brightness-98 drop-shadow-xs'
                          }`}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

            {/* ======================================================== */}
            {/* 2. TABLET VIEWPORT (768px to 1023px): 4 + 3 COMPACT ROWS */}
            {/* ======================================================== */}
            <div className="hidden md:flex lg:hidden w-full my-6 overflow-visible flex-col items-center gap-4 md:gap-5">
              {/* Row 1: 4 Musicians Centered (Simone, Klemens, Silke, Sandra) */}
              <div className="w-full flex justify-center items-end gap-2.5 md:gap-3.5 overflow-visible">
                {tabletRow1.map((musician, index) => {
                  const isHovered = hoveredMember === musician.id;
                  const targetScale = isHovered ? 1.08 : 1.0;
                  const entranceDelay = 150 + index * 120;

                  return (
                    <div
                      key={musician.id}
                      className="relative group flex flex-col items-center justify-end cursor-pointer overflow-visible"
                      onMouseEnter={() => setHoveredMember(musician.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                      onClick={() => setHoveredMember(hoveredMember === musician.id ? null : musician.id)}
                    >
                      <div
                        className={`absolute -top-10 px-2 py-0.5 rounded bg-[#070202] border border-[#DAA520] text-[#F5F5DC] font-macondo text-xs whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-30 ${
                          isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95'
                        }`}
                      >
                        <span>{musician.name}</span>
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#070202] border-r border-b border-[#DAA520] rotate-45" />
                      </div>

                      <div
                        className="h-32 md:h-36 flex items-end justify-center overflow-visible"
                        style={{
                          transformOrigin: 'bottom center',
                          transform: musiciansInView
                            ? `translateY(0) scale(${targetScale})`
                            : 'translateY(2rem) scale(0.90)',
                          opacity: musiciansInView ? 1 : 0,
                          transitionProperty: 'opacity, transform, filter',
                          transitionDuration: isHovered ? '250ms' : '750ms',
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
                              : 'filter saturate-[0.8] brightness-98 drop-shadow-xs'
                          }`}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2: 3 Musicians Centered Underneath (Lutz, Susanne, Ruth) */}
              <div className="w-full flex justify-center items-end gap-2.5 md:gap-3.5 overflow-visible">
                {tabletRow2.map((musician, index) => {
                  const isHovered = hoveredMember === musician.id;
                  const targetScale = isHovered ? 1.08 : 1.0;
                  const entranceDelay = 150 + (index + 4) * 120;

                  return (
                    <div
                      key={musician.id}
                      className="relative group flex flex-col items-center justify-end cursor-pointer overflow-visible"
                      onMouseEnter={() => setHoveredMember(musician.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                      onClick={() => setHoveredMember(hoveredMember === musician.id ? null : musician.id)}
                    >
                      <div
                        className={`absolute -top-10 px-2 py-0.5 rounded bg-[#070202] border border-[#DAA520] text-[#F5F5DC] font-macondo text-xs whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-30 ${
                          isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95'
                        }`}
                      >
                        <span>{musician.name}</span>
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-[#070202] border-r border-b border-[#DAA520] rotate-45" />
                      </div>

                      <div
                        className="h-32 md:h-36 flex items-end justify-center overflow-visible"
                        style={{
                          transformOrigin: 'bottom center',
                          transform: musiciansInView
                            ? `translateY(0) scale(${targetScale})`
                            : 'translateY(2rem) scale(0.90)',
                          opacity: musiciansInView ? 1 : 0,
                          transitionProperty: 'opacity, transform, filter',
                          transitionDuration: isHovered ? '250ms' : '750ms',
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
                              : 'filter saturate-[0.8] brightness-98 drop-shadow-xs'
                          }`}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ======================================================== */}
            {/* 3. MOBILE VIEWPORT (< 768px): 3 + 3 + 1 (UNIFORM SIZE ACROSS ALL 7 FIGURES) */}
            {/* ======================================================== */}
            <div className="md:hidden w-full my-4 overflow-visible flex flex-col items-center gap-3 sm:gap-4 -mx-1">
              {/* Row 1: 3 Musicians (Simone, Klemens, Silke) */}
              <div className="w-full flex justify-center items-end gap-2.5 sm:gap-3.5 overflow-visible">
                {mobileRow1.map((musician, index) => {
                  const isHovered = hoveredMember === musician.id;
                  const targetScale = isHovered ? 1.08 : 1.0;

                  return (
                    <div
                      key={musician.id}
                      className="relative group flex flex-col items-center justify-end cursor-pointer overflow-visible"
                      onMouseEnter={() => setHoveredMember(musician.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                      onClick={() => setHoveredMember(hoveredMember === musician.id ? null : musician.id)}
                    >
                      <div
                        className={`absolute -top-8 px-1.5 py-0.5 rounded bg-[#070202] border border-[#DAA520] text-[#F5F5DC] font-macondo text-[11px] whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-30 ${
                          isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95'
                        }`}
                      >
                        <span>{musician.name}</span>
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1 h-1 bg-[#070202] border-r border-b border-[#DAA520] rotate-45" />
                      </div>

                      <div
                        className="flex items-end justify-center overflow-visible"
                        style={{
                          height: 'min(32vw, 9.5rem)',
                          minHeight: '7rem',
                          maxHeight: '9.5rem',
                          transformOrigin: 'bottom center',
                          transform: musiciansInView
                            ? `translateY(0) scale(${targetScale})`
                            : 'translateY(2rem) scale(0.90)',
                          opacity: musiciansInView ? 1 : 0,
                          transitionProperty: 'opacity, transform, filter',
                          transitionDuration: isHovered ? '250ms' : '750ms',
                          transitionTimingFunction: isHovered ? 'ease-out' : 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${150 + index * 120}ms`
                        }}
                      >
                        <img
                          src={musician.image}
                          alt={musician.alt}
                          className="h-full w-auto max-w-[28vw] object-contain object-bottom drop-shadow-xs"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2: 3 Musicians (Sandra, Lutz, Susanne) */}
              <div className="w-full flex justify-center items-end gap-2.5 sm:gap-3.5 overflow-visible">
                {mobileRow2.map((musician, index) => {
                  const isHovered = hoveredMember === musician.id;
                  const targetScale = isHovered ? 1.08 : 1.0;

                  return (
                    <div
                      key={musician.id}
                      className="relative group flex flex-col items-center justify-end cursor-pointer overflow-visible"
                      onMouseEnter={() => setHoveredMember(musician.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                      onClick={() => setHoveredMember(hoveredMember === musician.id ? null : musician.id)}
                    >
                      <div
                        className={`absolute -top-8 px-1.5 py-0.5 rounded bg-[#070202] border border-[#DAA520] text-[#F5F5DC] font-macondo text-[11px] whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-30 ${
                          isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95'
                        }`}
                      >
                        <span>{musician.name}</span>
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1 h-1 bg-[#070202] border-r border-b border-[#DAA520] rotate-45" />
                      </div>

                      <div
                        className="flex items-end justify-center overflow-visible"
                        style={{
                          height: 'min(32vw, 9.5rem)',
                          minHeight: '7rem',
                          maxHeight: '9.5rem',
                          transformOrigin: 'bottom center',
                          transform: musiciansInView
                            ? `translateY(0) scale(${targetScale})`
                            : 'translateY(2rem) scale(0.90)',
                          opacity: musiciansInView ? 1 : 0,
                          transitionProperty: 'opacity, transform, filter',
                          transitionDuration: isHovered ? '250ms' : '750ms',
                          transitionTimingFunction: isHovered ? 'ease-out' : 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${150 + (index + 3) * 120}ms`
                        }}
                      >
                        <img
                          src={musician.image}
                          alt={musician.alt}
                          className="h-full w-auto max-w-[28vw] object-contain object-bottom drop-shadow-xs"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 3: 1 Musician (Ruth) - Centered with EXACT SAME UNIFORM SIZE */}
              <div className="w-full flex justify-center items-end overflow-visible mt-1">
                {mobileRow3.map((musician) => {
                  const isHovered = hoveredMember === musician.id;
                  const targetScale = isHovered ? 1.08 : 1.0;

                  return (
                    <div
                      key={musician.id}
                      className="relative group flex flex-col items-center justify-end cursor-pointer overflow-visible"
                      onMouseEnter={() => setHoveredMember(musician.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                      onClick={() => setHoveredMember(hoveredMember === musician.id ? null : musician.id)}
                    >
                      <div
                        className={`absolute -top-8 px-1.5 py-0.5 rounded bg-[#070202] border border-[#DAA520] text-[#F5F5DC] font-macondo text-[11px] whitespace-nowrap shadow-xl transition-all duration-200 pointer-events-none z-30 ${
                          isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-95'
                        }`}
                      >
                        <span>{musician.name}</span>
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1 h-1 bg-[#070202] border-r border-b border-[#DAA520] rotate-45" />
                      </div>

                      <div
                        className="flex items-end justify-center overflow-visible"
                        style={{
                          height: 'min(32vw, 9.5rem)',
                          minHeight: '7rem',
                          maxHeight: '9.5rem',
                          transformOrigin: 'bottom center',
                          transform: musiciansInView
                            ? `translateY(0) scale(${targetScale})`
                            : 'translateY(2rem) scale(0.90)',
                          opacity: musiciansInView ? 1 : 0,
                          transitionProperty: 'opacity, transform, filter',
                          transitionDuration: isHovered ? '250ms' : '750ms',
                          transitionTimingFunction: isHovered ? 'ease-out' : 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: `${150 + 6 * 120}ms`
                        }}
                      >
                        <img
                          src={musician.image}
                          alt={musician.alt}
                          className="h-full w-auto max-w-[28vw] object-contain object-bottom drop-shadow-xs"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Paragraph 3 (Text unterhalb der Figuren) - 1.3rem font-size with individual trigger */}
          <div
            ref={textBottomRef}
            className={`w-full font-macondo text-[3.7vw] md:text-[1.3rem] lg:text-[1.3rem] font-semibold text-[#0A0707] leading-[5.2vw] md:leading-[1.85rem] lg:leading-[1.85rem] mt-3 md:mt-5 lg:mt-6 text-justify md:text-left transition-all duration-700 ease-out transform ${
              textBottomInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p>
              {ensembleConfig.paragraph3 || 'In seiner jetzigen Besetzung besteht das Ensemble seit 2017 und ist aus der Musikgruppe „Mercks wol!“ hervorgegangen. Wir konzertieren an historischen Stätten, in Kirchen und Museen, manchmal auch auf Märkten, und verleihen Lesungen und Vorträgen den musikalischen Rahmen. Die Berufsmusik ist uns eine Fremde, und so ist es jedes einzelne Mal ein besonderes Ereignis, wenn wir alle zusammenkommen, aus allen Himmelsrichtungen, und die alten Klänge der Vergangenheit in der Gegenwart erklingen lassen.'}
            </p>
          </div>

          </div>
        </div>
      </div>
    </section>
  );
};
