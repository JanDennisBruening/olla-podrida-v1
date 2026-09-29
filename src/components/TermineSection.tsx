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
  registrationContact?: string;
}

interface EventCardItemProps {
  event: PostEvent;
  index: number;
  scrollY: number;
  isExpanded: boolean;
  onToggle: () => void;
  onPrint: () => void;
  smokeAlt: string;
}

const printEventDocument = (event: PostEvent, logoUrl: string) => {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    window.print();
    return;
  }

  const printHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>${event.title} - Ensemble Olla Podrida</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1a120c;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    .print-card {
      border: 2px solid #8B6508;
      border-radius: 8px;
      padding: 24px;
      background: #faf7f0;
      position: relative;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #8B6508;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .header-logo {
      max-height: 70px;
      margin-bottom: 6px;
    }
    .header-title {
      font-size: 24px;
      margin: 0;
      color: #3d2314;
      letter-spacing: 0.5px;
      font-weight: bold;
    }
    .header-sub {
      font-size: 13px;
      font-style: italic;
      color: #6b4d32;
      margin-top: 4px;
    }
    .category-badge {
      display: inline-block;
      background: #8B6508;
      color: #ffffff;
      padding: 4px 12px;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: bold;
      letter-spacing: 1px;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .event-title {
      font-size: 22px;
      color: #2b170c;
      margin: 4px 0 16px 0;
      line-height: 1.25;
    }
    .content-grid {
      display: flex;
      gap: 20px;
      margin-bottom: 18px;
    }
    .meta-box {
      flex: 1.3;
      background: #ffffff;
      border: 1px solid #d4c29d;
      border-radius: 6px;
      padding: 14px;
      font-size: 13.5px;
    }
    .meta-row {
      display: flex;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .meta-row:last-child {
      margin-bottom: 0;
    }
    .meta-icon {
      font-size: 15px;
      margin-right: 8px;
      flex-shrink: 0;
    }
    .meta-label {
      font-weight: bold;
      color: #3d2314;
      margin-right: 4px;
    }
    .image-box {
      flex: 0.9;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .event-img {
      max-width: 100%;
      max-height: 160px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid #c2ad82;
    }
    .contact-box {
      background: #fff8eb;
      border-left: 4px solid #8B6508;
      padding: 10px 14px;
      margin-bottom: 16px;
      border-radius: 0 4px 4px 0;
      font-size: 13.5px;
    }
    .contact-title {
      font-weight: bold;
      color: #8B6508;
      margin-bottom: 2px;
    }
    .description-box {
      background: #ffffff;
      border: 1px solid #d4c29d;
      border-radius: 6px;
      padding: 14px 16px;
      margin-bottom: 18px;
      font-size: 13.5px;
      line-height: 1.6;
    }
    .description-title {
      font-weight: bold;
      color: #3d2314;
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .footer {
      border-top: 1px solid #d4c29d;
      padding-top: 10px;
      font-size: 11px;
      color: #666;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    @media print {
      body { background: transparent; }
      .print-card { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="print-card">
    <div class="header">
      ${logoUrl ? `<img src="${logoUrl}" class="header-logo" alt="Olla Podrida Logo" />` : ''}
      <h1 class="header-title">Ensemble Olla Podrida</h1>
      <div class="header-sub">Klangvielfalt aus Mittelalter und Renaissance · Veranstaltungsinformation</div>
    </div>

    <div class="category-badge">${event.category || 'Konzert'}</div>
    <h2 class="event-title">${event.title}</h2>

    <div class="content-grid">
      <div class="meta-box">
        <div class="meta-row">
          <span class="meta-icon">🗓️</span>
          <div><span class="meta-label">Datum:</span> ${event.dateStr}</div>
        </div>
        <div class="meta-row">
          <span class="meta-icon">🕐</span>
          <div><span class="meta-label">Uhrzeit:</span> ${event.timeStr}</div>
        </div>
        <div class="meta-row">
          <span class="meta-icon">📍</span>
          <div><span class="meta-label">Ort:</span> ${event.locationStr}</div>
        </div>
        ${event.expandedDetailsHtml ? `
        <div class="meta-row">
          <span class="meta-icon">🎟️</span>
          <div><span class="meta-label">Eintritt & Details:</span> ${event.expandedDetailsHtml.replace(/<[^>]*>?/gm, '')}</div>
        </div>` : ''}
      </div>

      ${event.imageSrc ? `
      <div class="image-box">
        <img src="${event.imageSrc}" class="event-img" alt="${event.title}" />
      </div>` : ''}
    </div>

    ${event.registrationContact ? `
    <div class="contact-box">
      <div class="contact-title">📞 Kontakt &amp; Anmeldung:</div>
      <div>${event.registrationContact}</div>
    </div>` : ''}

    <div class="description-box">
      <div class="description-title">Programmbeschreibung:</div>
      <div>${event.descriptionHtml}</div>
    </div>

    <div class="footer">
      <div><strong>Ensemble Olla Podrida</strong> · www.olla-podrida.de · info@olla-podrida.de</div>
      <div>Gedruckt am: ${new Date().toLocaleDateString('de-DE')}</div>
    </div>
  </div>
  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;

  printWindow.document.write(printHtml);
  printWindow.document.close();
};

const EventCardItem: React.FC<EventCardItemProps> = ({
  event,
  index,
  scrollY,
  isExpanded,
  onToggle,
  onPrint,
  smokeAlt
}) => {
  const { ref: cardRef, isInView } = useInView<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
    triggerOnce: true
  });
  const smokeFloat = Math.cos((scrollY * 0.002) + index) * 10;

  return (
    <div
      ref={cardRef}
      onClick={onToggle}
      className={`relative flex flex-col items-start bg-[#1A1A18] rounded-[0.625rem] p-5 sm:p-7 lg:p-8 transition-all duration-500 hover:bg-[#1e1c1b] hover:shadow-[0_0.5rem_1.875rem_rgba(218,165,32,0.2)] group overflow-hidden border cursor-pointer w-full ${
        isExpanded ? 'border-[#DAA520] shadow-[0_0_1.5625rem_rgba(218,165,32,0.22)]' : 'border-[#2a2825] hover:border-[#DAA520]/60'
      }`}
      style={{
        transform: isInView ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.97)',
        opacity: isInView ? 1 : 0,
        transitionProperty: 'opacity, transform, background-color, border-color, box-shadow',
        transitionDuration: '750ms, 750ms, 300ms, 300ms, 300ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0ms'
      }}
    >
      {/* Dunstwolke implemented directly as background inside each infobox with parallax mist */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-50 transition-all duration-700 mix-blend-screen bg-cover bg-bottom bg-no-repeat z-0"
        style={{
          backgroundImage: `url("${smokeAlt}")`,
          transform: `translate3d(0, ${smokeFloat}px, 0)`
        }}
      />

      {/* Top Section: Side-by-side on desktop (image right, text left), stacked on mobile/tablet */}
      <div className="w-full flex flex-col lg:flex-row-reverse items-start gap-5 lg:gap-8 relative z-10">
        {/* Image Column: Full-width landscape above content on Mobile & Tablet, strictly square on right on Desktop */}
        <div
          className="w-full lg:w-64 xl:w-72 aspect-[16/9] sm:aspect-[21/9] lg:aspect-square shrink-0 rounded-[0.75rem] overflow-hidden shadow-lg self-start transition-all duration-700 ease-out"
          style={{
            transform: isInView ? 'scale(1) translate3d(0, 0, 0)' : 'scale(0.95) translate3d(0, 16px, 0)',
            opacity: isInView ? 1 : 0,
            transitionDelay: '100ms'
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
          {/* Category Badge & PDF Print Button */}
          <div
            className="mb-2 flex items-center gap-2.5 flex-wrap transition-all duration-500 ease-out"
            style={{
              transform: isInView ? 'translateY(0)' : 'translateY(10px)',
              opacity: isInView ? 1 : 0,
              transitionDelay: '150ms'
            }}
          >
            <span className="inline-block bg-[#CD895B] group-hover:bg-[#DAA520] transition-colors duration-300 text-white font-roboto text-[0.7rem] font-semibold uppercase px-2.5 py-0.5 rounded-[0.2rem] tracking-wide shadow-sm">
              {event.category}
            </span>

            {/* PDF / Drucken Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrint();
              }}
              className="inline-flex items-center gap-1.5 bg-[#251c16] hover:bg-[#DAA520] text-[#DAA520] hover:text-[#070202] border border-[#DAA520]/50 transition-all duration-200 text-[0.7rem] font-macondo px-2.5 py-0.5 rounded-[0.2rem] cursor-pointer shadow-sm active:scale-95 group/pdf"
              title="Veranstaltung als DIN A4 Seite ausdrucken oder als PDF speichern"
            >
              <span className="text-[0.75rem] transition-transform duration-200 group-hover/pdf:scale-110">📄</span>
              <span className="font-bold tracking-wider">PDF / Drucken</span>
            </button>
          </div>

          {/* Title: enlarged on mobile viewport for proud presence */}
          <h3
            className="font-macondo text-[1.85rem] sm:text-[2.1rem] md:text-[2.47rem] leading-tight md:leading-[2.75rem] font-normal mt-1 mb-4 text-[#D79951] group-hover:text-[#F3CE72] transition-all duration-600 ease-out select-none"
            style={{
              transform: isInView ? 'translateY(0)' : 'translateY(12px)',
              opacity: isInView ? 1 : 0,
              transitionDelay: '200ms'
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
                transitionDelay: '260ms'
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
                transitionDelay: '320ms'
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
                transitionDelay: '380ms'
              }}
            >
              <span className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">📍</span>
              <span>{event.locationStr}</span>
            </div>

            {/* Flexible Contact & Registration (only displayed when filled) */}
            {event.registrationContact && (
              <div
                className="flex items-start space-x-2 pt-1 transition-all duration-500 ease-out text-[#DAA520]"
                style={{
                  transform: isInView ? 'translateX(0)' : 'translateX(-16px)',
                  opacity: isInView ? 1 : 0,
                  transitionDelay: '420ms'
                }}
              >
                <span className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">📞</span>
                <span>
                  <strong className="text-[#DAA520]">Kontakt &amp; Anmeldung:</strong>{' '}
                  <span className="text-[#F5F5DC] font-normal">{event.registrationContact}</span>
                </span>
              </div>
            )}
          </div>

          {/* Description matching .uc_post_content */}
          <div
            className="font-macondo text-sm sm:text-base md:text-[1.1rem] md:leading-[1.6rem] font-semibold text-[#F5F5DC] leading-relaxed transition-all duration-600 ease-out"
            style={{
              transform: isInView ? 'translateY(0)' : 'translateY(12px)',
              opacity: isInView ? 1 : 0,
              transitionDelay: '440ms'
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
          {event.registrationContact && (
            <div className="p-3 bg-[#1e140e] border border-[#DAA520]/40 rounded text-sm text-[#F5F5DC]">
              <strong className="text-[#DAA520] block mb-0.5">📞 Kontakt &amp; Anmeldung:</strong>
              {event.registrationContact}
            </div>
          )}
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
          transitionDelay: '500ms'
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
};

export const TermineSection: React.FC = () => {
  const assets = getAssets();
  const rawEvents = getConcertEvents();
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.05, rootMargin: '0px 0px -40px 0px', triggerOnce: true });
  const [scrollY, setScrollY] = useState(0);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Auto-Archive: Only include upcoming events whose date and time have not expired yet
  const sortedEvents = useMemo(() => {
    const upcoming = rawEvents.filter((e) => e.isUpcoming);
    // If auto-expiration applies, only show future events in "Aktuelle Termine"
    return upcoming.map((ev) => ({
      id: ev.id,
      category: ev.category || 'Konzert',
      title: ev.title,
      dateStr: ev.date,
      timeStr: ev.time,
      locationStr: ev.location,
      descriptionHtml: ev.description,
      expandedDetailsHtml: ev.ticketInfo || ev.description,
      imageSrc: resolveAssetUrl(ev.imageUrl || '/images/Biomarkt-vorne-mit-Musik.jpg'),
      linkUrl: ev.link,
      registrationContact: ev.contactRegistration || ''
    }));
  }, [rawEvents]);

  const toggleEvent = (eventId: string) => {
    setExpandedEventId((prev) => (prev === eventId ? null : eventId));
  };

  const handlePrintEvent = (event: PostEvent) => {
    printEventDocument(event, assets.logo);
  };

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
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event, index) => (
              <EventCardItem
                key={event.id}
                event={event}
                index={index}
                scrollY={scrollY}
                isExpanded={expandedEventId === event.id}
                onToggle={() => toggleEvent(event.id)}
                onPrint={() => handlePrintEvent(event)}
                smokeAlt={assets.smokeAlt}
              />
            ))
          ) : (
            <div className="bg-[#1A1A18] rounded-xl p-8 border border-[#DAA520]/40 text-center font-macondo text-xl text-[#F5F5DC]/80">
              <p>Zurzeit sind keine weiteren Konzerttermine in Planung.</p>
              <p className="text-sm mt-2 text-[#D1C7AC]">Schauen Sie bald wieder vorbei oder stöbern Sie in unserer Konzertchronik!</p>
            </div>
          )}
        </div>

      </div>

      {/* Seamless transition without cut-off divider */}
      <div className="w-full h-12 bg-gradient-to-b from-transparent to-[#070202]" />
    </section>
  );
};
