import React from 'react';
import { ASSETS } from '../data/siteContent';
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

const EVENTS: PostEvent[] = [
  {
    id: 'boerstel-2026',
    category: 'Konzert',
    title: 'Konzert beim Bio-Regio-Markt im Stift Börstel',
    dateStr: '11/10/2026',
    timeStr: '14.00',
    locationStr: 'Stiftskirche Börstel, Börstel 1, 49626 Berge',
    descriptionHtml: 'Eintritt frei, um eine Spende wird gebeten&nbsp;<a href="https://www.oekomodellregion-hasetal.de/#c269" target="_blank" rel="noopener noreferrer" class="text-[#DAA520] underline hover:text-[#E5C031]">https://www.oekomodellregion-hasetal.de/#c269</a>',
    expandedDetailsHtml: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Begleiten Sie uns durch die herbstliche Kulisse des historischen Stifts Börstel und genießen Sie die authentische Klangwelt der Renaissance.',
    imageSrc: 'https://olla-podrida.de/wp-content/uploads/2026/09/Biomarkt-vorne-mit-Musik.jpg',
    linkUrl: 'https://www.oekomodellregion-hasetal.de/#c269'
  },
  {
    id: 'atter-advent-2026',
    category: 'Konzert',
    title: 'Lebendiger Adventskalender in Atter',
    dateStr: '29/11/2026',
    timeStr: '18.00 Uhr',
    locationStr: 'Stadtteiltreff Atter, Karl-Barth-Straße 10, 49076 Osnabrück',
    descriptionHtml: 'Winterlich-weihnachtliches Konzert zum 17. Lebendigen Adventskalender im Stadteiltreff Atter<br/>• Beginn 18.00 Uhr<br/>• Freie Platzwahl<br/>• Wir freuen uns über Deine Spende am Ausgang.<br/>• Zwischen den Musikstücken werden bei Keksen und Punsch kurze Geschichten erzählt.<br/><a href="https://www.wir-in-atter.de/" target="_blank" rel="noopener noreferrer" class="text-[#DAA520] underline hover:text-[#E5C031]">https://www.wir-in-atter.de/</a>',
    expandedDetailsHtml: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Neben festlicher Instrumentalmusik auf Krummhörnern und Sackpfeifen erklingen stimmungsvolle Gesänge zur Adventszeit.',
    imageSrc: 'https://olla-podrida.de/wp-content/uploads/2024/09/Screenshot_20240929_154952_Samsung-Internet-1536x956.jpg',
    linkUrl: 'https://www.wir-in-atter.de/'
  },
  {
    id: 'quakenbrueck-2026',
    category: 'Konzert',
    title: '3. Weihnachts- und Mitsingkonzert zusammen mit dem Chorforum Quakenbrück',
    dateStr: '30/12/2026',
    timeStr: '16.00 Uhr',
    locationStr: 'St. Marienkirche Quakenbrück, Markt 4, 49610 Quakenbrück',
    descriptionHtml: 'Gemeinsam Weihnachten singen und Gemeinsam Weihnachten lauschen<br/>• Zusammen mit dem Chorforum Quakenbrück laden wir herzlich zu einem kleinen Mitsing-Konzert in die St. Marienkirche nach Quakenbrück ein.<br/><a href="https://www.chorforum-quakenbrueck.de/" target="_blank" rel="noopener noreferrer" class="text-[#DAA520] underline hover:text-[#E5C031]">https://www.chorforum-quakenbrueck.de/</a>',
    expandedDetailsHtml: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Ein feierlicher Jahresausklang in der akustisch eindrucksvollen St. Marienkirche Quakenbrück mit gemeinsamem Gesang und historischer Musik.',
    imageSrc: 'https://olla-podrida.de/wp-content/uploads/2024/11/st-marienkirche-quakenbr-ck-1536x1152.jpg',
    linkUrl: 'https://www.chorforum-quakenbrueck.de/'
  }
];

export const TermineSection: React.FC = () => {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: false });
  const [scrollY, setScrollY] = React.useState(0);
  const [expandedEventId, setExpandedEventId] = React.useState<string | null>(null);

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
          <h2 className="font-macondo text-[2.15rem] sm:text-[2.85rem] md:text-[3.8rem] text-[#F5F5DC] font-normal tracking-wide drop-shadow-md">
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
          {EVENTS.map((event, index) => {
            const staggerDelay = index * 130;
            const isExpanded = expandedEventId === event.id;
            const smokeFloat = Math.cos((scrollY * 0.002) + index) * 10;

            return (
              <div
                key={event.id}
                onClick={() => toggleEvent(event.id)}
                className={`relative flex flex-col sm:flex-row-reverse items-start bg-[#1A1A18] rounded-[0.625rem] p-6 md:p-8 transition-all duration-300 hover:bg-[#1e1c1b] hover:shadow-[0_0.5rem_1.875rem_rgba(218,165,32,0.2)] group overflow-hidden border cursor-pointer ${
                  isExpanded ? 'border-[#DAA520] shadow-[0_0_1.5625rem_rgba(218,165,32,0.22)]' : 'border-[#2a2825] hover:border-[#DAA520]/60'
                }`}
                style={{
                  transform: isInView ? 'scale(1)' : 'scale(0.88)',
                  opacity: isInView ? 1 : 0,
                  transitionProperty: 'opacity, transform, background-color, border-color, box-shadow',
                  transitionDuration: '650ms, 650ms, 300ms, 300ms, 300ms',
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transitionDelay: `${staggerDelay}ms, ${staggerDelay}ms, 0ms, 0ms, 0ms`
                }}
              >
                {/* Dunstwolke implemented directly as background inside each infobox with parallax mist */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-50 transition-all duration-700 mix-blend-screen bg-cover bg-bottom bg-no-repeat z-0"
                  style={{
                    backgroundImage: `url("${ASSETS.smokeAlt}")`,
                    transform: `translate3d(0, ${smokeFloat}px, 0)`
                  }}
                />

                {/* Image Column (.uc_post_list_image - strictly square, top-right orientation on all viewports) */}
                <div className="w-full max-w-[16rem] sm:max-w-none ml-auto sm:ml-0 sm:w-52 md:w-60 lg:w-68 xl:w-72 aspect-square shrink-0 rounded-[0.9375rem] overflow-hidden relative z-10 shadow-lg self-start">
                  <img
                    src={event.imageSrc}
                    alt={event.title}
                    className="w-full h-full object-cover object-center transition-all duration-500 transform scale-[1.02] group-hover:scale-[1.08] group-hover:brightness-110"
                    loading="lazy"
                  />
                </div>

                {/* Content Column (.uc_post_list_content, left side on desktop & tablet) */}
                <div className="flex-1 w-full sm:pr-6 md:pr-8 pt-4 sm:pt-0 flex flex-col justify-start text-left relative z-10">
                  {/* Category Badge matching .ue-grid-item-category a */}
                  <div className="mb-2">
                    <span className="inline-block bg-[#CD895B] group-hover:bg-[#DAA520] transition-colors duration-300 text-white font-roboto text-[0.7rem] font-semibold uppercase px-2.5 py-0.5 rounded-[0.2rem] tracking-wide shadow-sm">
                      {event.category}
                    </span>
                  </div>

                  {/* Title matching .uc_post_list_title - non-navigating, 5% smaller */}
                  <h3 className="font-macondo text-[1.425rem] sm:text-[1.78rem] md:text-[2.47rem] md:leading-[2.75rem] font-normal mt-1 mb-4 text-[#D79951] group-hover:text-[#F3CE72] transition-colors duration-200 select-none">
                    {event.title}
                  </h3>

                  {/* Metadata matching .ue-grid-item-meta-data */}
                  <div className="space-y-1 font-macondo text-lg sm:text-xl md:text-[1.4rem] md:leading-[2rem] text-[#F5F5DC] mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="group-hover:scale-110 transition-transform duration-200">🗓️</span>
                      <span>{event.dateStr}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="group-hover:scale-110 transition-transform duration-200">🕐</span>
                      <span>{event.timeStr}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">📍</span>
                      <span>{event.locationStr}</span>
                    </div>
                  </div>

                  {/* Description matching .uc_post_content */}
                  <div
                    className="font-macondo text-sm sm:text-base md:text-[1.1rem] md:leading-[1.6rem] font-semibold text-[#F5F5DC] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: event.descriptionHtml }}
                  />

                  {/* Expandable Accordion Content */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isExpanded
                        ? 'max-h-[35rem] opacity-100 mt-5 pt-4 border-t border-[#DAA520]/30'
                        : 'max-h-0 opacity-0 mt-0 pt-0'
                    }`}
                  >
                    <div className="bg-[#110e0c]/80 p-4 sm:p-5 rounded-lg border border-[#DAA520]/25 space-y-3 font-macondo text-sm sm:text-base md:text-[1.15rem] md:leading-[1.75rem] text-[#F5F5DC]/95 shadow-inner">
                      <div className="flex items-center space-x-2 text-[#DAA520] font-bold text-base sm:text-lg">
                        <span>✦</span>
                        <span>Ausführliche Konzertinformationen & Programm</span>
                      </div>
                      <p className="leading-relaxed">
                        {event.expandedDetailsHtml}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-[#F5F5DC]/70 font-sans border-t border-[#DAA520]/15">
                        <span>🎵 Historische Musik der Renaissance & des Mittelalters</span>
                        <span>🏛️ Freie Platzwahl vor Ort</span>
                        <span>📜 Eintritt frei / Spende erbeten</span>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Toggle Bar with Chevron */}
                  <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#2a2825] group-hover:border-[#DAA520]/40 transition-colors">
                    <span className="font-macondo text-base sm:text-lg text-[#DAA520] group-hover:text-[#F3CE72] flex items-center space-x-2">
                      <span>{isExpanded ? 'Weniger anzeigen' : 'Mehr Details & Programm anzeigen'}</span>
                    </span>
                    <span className={`text-[#DAA520] text-xl transition-transform duration-300 transform ${isExpanded ? 'rotate-180 text-[#F3CE72]' : 'rotate-0'}`}>
                      ▾
                    </span>
                  </div>
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
