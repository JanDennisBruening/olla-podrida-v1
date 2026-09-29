import React, { useMemo, useState, useEffect } from 'react';
import { getAssets, getConcertEvents, resolveAssetUrl } from '../data/siteContent';
import { useInView } from '../hooks/useInView';

interface PostEvent {
  id: string;
  category: string;
  title: string;
  dateStr: string;
  timeStr: string;
  locationStr: string;
  descriptionHtml: string;
  expandedDetailsHtml: string;
  imageSrc: string;
  linkUrl?: string;
}

export const TermineSection: React.FC = () => {
  const assets = getAssets();
  const rawEvents = getConcertEvents();
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.05, rootMargin: '0px 0px -40px 0px', triggerOnce: true });
  const [scrollY, setScrollY] = useState(0);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Filter for upcoming events (or fallback to all if none flagged upcoming)
  const sortedEvents = useMemo(() => {
    const upcoming = rawEvents.filter((e) => e.isUpcoming);
    const list = upcoming.length > 0 ? upcoming : rawEvents;

    return list.map((ev) => ({
      id: ev.id,
      category: ev.category || 'Konzert',
      title: ev.title,
      dateStr: ev.date,
      timeStr: ev.time,
      locationStr: ev.location,
      descriptionHtml: ev.description,
      expandedDetailsHtml: ev.ticketInfo || ev.description,
      imageSrc: resolveAssetUrl(ev.imageUrl || '/images/Biomarkt-vorne-mit-Musik.jpg'),
      linkUrl: ev.link
    }));
  }, [rawEvents]);

  const toggleEvent = (eventId: string) => {
    setExpandedEventId((prev) => (prev === eventId ? null : eventId));
  };

  React.useEffect(() => {
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
      ref={sectionRef}
      id="termine"
      className="relative w-full bg-[#070202] text-[#F5F5DC] overflow-hidden pt-10 sm:pt-14 md:pt-20 lg:pt-28 pb-16 select-none"
    >
      <div className="max-w-[80rem] mx-auto px-[5.5%] relative z-10">
        
        {/* Section Heading matching .elementor-element-41d3014 with entrance animation */}
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          <h2 className="font-macondo text-[2.15rem] sm:text-[2.85rem] md:text-[4.0rem] text-[#F5F5DC] font-normal tracking-wide drop-shadow-md">
            Aktuelle Termine
          </h2>
          {/* Subtle antique flourish line */}
          <div
            className={`w-28 sm:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#DAA520] to-transparent mx-auto mt-3 transition-all duration-1000 delay-200 ${
              isInView ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          />
        </div>

        {/* Unlimited Elements Post List Grid (.elementor-element-4ae5a5e) with pop-in entrance */}
        <div className="flex flex-col space-y-10 md:space-y-10">
          {sortedEvents.map((event, index) => {
            const staggerDelay = index * 130;
            const isExpanded = expandedEventId === event.id;
            const smokeFloat = Math.cos((scrollY * 0.002) + index) * 10;

            return (
              <div
                key={event.id}
                onClick={() => toggleEvent(event.id)}
                className={`relative flex flex-col items-start bg-[#1A1A18] rounded-[0.625rem] p-5 sm:p-7 lg:p-8 transition-all duration-300 hover:bg-[#1e1c1b] hover:shadow-[0_0.5rem_1.875rem_rgba(218,165,32,0.2)] group overflow-hidden border cursor-pointer w-full ${
                  isExpanded ? 'border-[#DAA520] shadow-[0_0_1.5625rem_rgba(218,165,32,0.22)]' : 'border-[#2a2825] hover:border-[#DAA520]/60'
                }`}
                style={{
                  transform: isInView ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
                  opacity: isInView ? 1 : 0,
                  transitionProperty: 'opacity, transform, background-color, border-color, box-shadow',
                  transitionDuration: '750ms, 750ms, 300ms, 300ms, 300ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${staggerDelay}ms, ${staggerDelay}ms, 0ms, 0ms, 0ms`
                }}
              >
                {/* Dunstwolke implemented directly as background inside each infobox with parallax mist */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-50 transition-all duration-700 mix-blend-screen bg-cover bg-bottom bg-no-repeat z-0"
                  style={{
                    backgroundImage: `url("${assets.smokeAlt}")`,
                    transform: `translate3d(0, ${smokeFloat}px, 0)`
                  }}
                />

                {/* Top Section: Side-by-side on desktop (image right, text left), stacked on mobile/tablet */}
                <div className="w-full flex flex-col lg:flex-row-reverse items-start gap-5 lg:gap-8 relative z-10">
                  {/* Image Column: Full-width landscape above content on Mobile & Tablet, strictly square on right on Desktop */}
                  <div
                    className="w-full lg:w-64 xl:w-72 aspect-[16/9] sm:aspect-[21/9] lg:aspect-square shrink-0 rounded-[0.75rem] overflow-hidden shadow-lg self-start transition-all duration-700 ease-out"
                    style={{
                      transform: isInView ? 'scale(1) translate3d(0, 0, 0)' : 'scale(0.95) translate3d(0, 20px, 0)',
                      opacity: isInView ? 1 : 0,
                      transitionDelay: `${staggerDelay + 100}ms`
                    }}
                  >
                    <img
                      src={event.imageSrc}
                      alt={event.title}
                      className="w-full h-full object-cover object-center transition-all duration-500 transform scale-[1.01] group-hover:scale-[1.06] group-hover:brightness-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Content Column: 100% full width on Mobile and Tablet, flex-1 on Desktop */}
                  <div className="w-full flex-1 flex flex-col justify-start text-left">
                    {/* Category Badge matching .ue-grid-item-category a */}
                    <div
                      className="mb-2 transition-all duration-500 ease-out"
                      style={{
                        transform: isInView ? 'translateY(0)' : 'translateY(12px)',
                        opacity: isInView ? 1 : 0,
                        transitionDelay: `${staggerDelay + 160}ms`
                      }}
                    >
                      <span className="inline-block bg-[#CD895B] group-hover:bg-[#DAA520] transition-colors duration-300 text-white font-roboto text-[0.7rem] font-semibold uppercase px-2.5 py-0.5 rounded-[0.2rem] tracking-wide shadow-sm">
                        {event.category}
                      </span>
                    </div>

                    {/* Title: enlarged on mobile viewport for proud presence */}
                    <h3
                      className="font-macondo text-[1.85rem] sm:text-[2.1rem] md:text-[2.47rem] leading-tight md:leading-[2.75rem] font-normal mt-1 mb-4 text-[#D79951] group-hover:text-[#F3CE72] transition-all duration-600 ease-out select-none"
                      style={{
                        transform: isInView ? 'translateY(0)' : 'translateY(14px)',
                        opacity: isInView ? 1 : 0,
                        transitionDelay: `${staggerDelay + 220}ms`
                      }}
                    >
                      {event.title}
                    </h3>

                    {/* Metadata matching .ue-grid-item-meta-data with individual staggered row reveals */}
                    <div className="space-y-1.5 font-macondo text-lg sm:text-xl md:text-[1.4rem] md:leading-[2rem] text-[#F5F5DC] mb-4">
                      {/* Date Item */}
                      <div
                        className="flex items-center space-x-2 transition-all duration-500 ease-out"
                        style={{
                          transform: isInView ? 'translateX(0)' : 'translateX(-16px)',
                          opacity: isInView ? 1 : 0,
                          transitionDelay: `${staggerDelay + 280}ms`
                        }}
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200">🗓️</span>
                        <span>{event.dateStr}</span>
                      </div>
                      {/* Time Item */}
                      <div
                        className="flex items-center space-x-2 transition-all duration-500 ease-out"
                        style={{
                          transform: isInView ? 'translateX(0)' : 'translateX(-16px)',
                          opacity: isInView ? 1 : 0,
                          transitionDelay: `${staggerDelay + 340}ms`
                        }}
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200">🕐</span>
                        <span>{event.timeStr}</span>
                      </div>
                      {/* Location Item */}
                      <div
                        className="flex items-start space-x-2 transition-all duration-500 ease-out"
                        style={{
                          transform: isInView ? 'translateX(0)' : 'translateX(-16px)',
                          opacity: isInView ? 1 : 0,
                          transitionDelay: `${staggerDelay + 400}ms`
                        }}
                      >
                        <span className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">📍</span>
                        <span>{event.locationStr}</span>
                      </div>
                    </div>

                    {/* Description matching .uc_post_content */}
                    <div
                      className="font-macondo text-sm sm:text-base md:text-[1.1rem] md:leading-[1.6rem] font-semibold text-[#F5F5DC] leading-relaxed transition-all duration-600 ease-out"
                      style={{
                        transform: isInView ? 'translateY(0)' : 'translateY(14px)',
                        opacity: isInView ? 1 : 0,
                        transitionDelay: `${staggerDelay + 460}ms`
                      }}
                      dangerouslySetInnerHTML={{ __html: event.descriptionHtml }}
                    />
                  </div>
                </div>

                {/* Expandable Accordion Content: 100% FULL WIDTH across the entire box */}
                <div
                  className={`w-full relative z-10 transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded
                      ? 'max-h-[45rem] opacity-100 mt-6 pt-5 border-t border-[#DAA520]/40'
                      : 'max-h-0 opacity-0 mt-0 pt-0'
                  }`}
                >
                  <div className="w-full bg-[#110e0c]/90 p-5 sm:p-6 rounded-lg border border-[#DAA520]/30 space-y-3 font-macondo text-base sm:text-lg md:text-[1.18rem] md:leading-[1.8rem] text-[#F5F5DC]/95 shadow-inner text-left">
                    <div className="flex items-center space-x-2 text-[#DAA520] font-bold text-lg sm:text-xl">
                      <span>✦</span>
                      <span>Ausführliche Konzertinformationen &amp; Programm</span>
                    </div>
                    <p className="leading-relaxed">
                      {event.expandedDetailsHtml}
                    </p>
                    <div className="pt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-[#F5F5DC]/70 font-sans border-t border-[#DAA520]/20">
                      <span>🎵 Historische Musik der Renaissance &amp; des Mittelalters</span>
                      <span>🏛️ Freie Platzwahl vor Ort</span>
                      <span>📜 Eintritt frei / Spende erbeten</span>
                    </div>
                  </div>
                </div>

                {/* Accordion Toggle Bar with Chevron across bottom of card */}
                <div
                  className="w-full relative z-10 mt-4 pt-3 flex items-center justify-between border-t border-[#2a2825] group-hover:border-[#DAA520]/40 transition-all duration-500 ease-out"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transitionDelay: `${staggerDelay + 520}ms`
                  }}
                >
                  <span className="font-macondo text-base sm:text-lg text-[#DAA520] group-hover:text-[#F3CE72] flex items-center space-x-2">
                    <span>{isExpanded ? 'Weniger anzeigen' : 'Mehr Details & Programm anzeigen'}</span>
                  </span>
                  <span className={`text-[#DAA520] text-xl transition-transform duration-300 transform ${isExpanded ? 'rotate-180 text-[#F3CE72]' : 'rotate-0'}`}>
                    ▾
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Seamless transition without cut-off divider */}
      <div className="w-full h-12 bg-gradient-to-b from-transparent to-[#070202]" />
    </section>
  );
};
