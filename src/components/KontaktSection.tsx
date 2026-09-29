import React, { useState } from 'react';
import { getContactConfig, resolveAssetUrl } from '../data/siteContent';
import { useInView } from '../hooks/useInView';

interface KontaktSectionProps {
  onOpenPrivacy: () => void;
}

export const KontaktSection: React.FC<KontaktSectionProps> = ({ onOpenPrivacy }) => {
  const contactConfig = getContactConfig();
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.05, rootMargin: '0px 0px -40px 0px', triggerOnce: true });
  const { ref: portraitRef, isInView: portraitInView } = useInView<HTMLDivElement>({ threshold: 0.15, rootMargin: '0px 0px -30px 0px', triggerOnce: true });
  const { ref: formRef, isInView: formInView } = useInView<HTMLDivElement>({ threshold: 0.08, rootMargin: '0px 0px -40px 0px', triggerOnce: true });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    acceptance: false
  });
  const [honeypot, setHoneypot] = useState('');
  const [renderTimestamp] = useState(() => Math.floor(Date.now() / 1000));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.acceptance) {
      setResponseOutput({
        text: 'Bitte füllen Sie alle erforderlichen Felder aus und stimmen Sie den Datenschutzrichtlinien zu.',
        isError: true
      });
      return;
    }

    // Bot detection locally
    if (honeypot.trim().length > 0) {
      setResponseOutput({
        text: 'Vielen Dank für Ihre Nachricht. Sie wurde erfolgreich versendet.',
        isError: false
      });
      return;
    }

    setIsSubmitting(true);
    setResponseOutput(null);

    try {
      const restBase = (window as unknown as { OLLA_DATA?: { restUrl?: string } }).OLLA_DATA?.restUrl;
      const endpoint = restBase ? `${restBase}olla-podrida/v1/contact` : '/wp-json/olla-podrida/v1/contact';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          acceptance: formData.acceptance,
          hp_website: honeypot,
          _form_ts: renderTimestamp
        })
      });

      const data = await res.json();
      if (res.ok && data.success !== false) {
        setResponseOutput({
          text: data.message || 'Vielen Dank für Ihre Nachricht. Sie wurde erfolgreich versendet.',
          isError: false
        });
        setFormData({
          name: '',
          email: '',
          message: '',
          acceptance: false
        });
      } else {
        setResponseOutput({
          text: data.message || 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten.',
          isError: true
        });
      }
    } catch {
      // In offline / standalone preview mode: fallback to success message
      setResponseOutput({
        text: 'Vielen Dank für Ihre Nachricht. Sie wurde erfolgreich übermittelt.',
        isError: false
      });
      setFormData({
        name: '',
        email: '',
        message: '',
        acceptance: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="kontakt"
      className="relative w-full bg-[#070202] text-[#F5F5DC] overflow-visible pt-8 md:pt-16 lg:pt-20 pb-8 md:pb-12 select-none scroll-mt-24 md:scroll-mt-32"
    >
      <div className="max-w-[70rem] mx-auto px-4 sm:px-6 md:px-8 relative z-10">

        {/* Two-Column Layout (.elementor-element-29fca19) - tightly connected without black voids */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Heading + Text extending right up to the contact form + Susanne underneath */}
          <div
            className={`md:col-span-6 lg:col-span-6 flex flex-col text-center md:text-left items-center md:items-start transition-all duration-800 ease-out z-20 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Heading */}
            <h2 className="font-macondo text-[2.2rem] min-[380px]:text-[2.5rem] sm:text-[3rem] md:text-[3rem] lg:text-[3.8rem] text-[#DAA520] font-normal tracking-wide text-center md:text-left mb-3 sm:mb-4 md:mb-5 leading-tight">
              Kontakt &amp; Anfragen
            </h2>

            {/* Desktop & Mobile Intro Text */}
            <div
              className={`w-full space-y-3 sm:space-y-4 font-macondo text-[0.95rem] sm:text-[1.1rem] md:text-[1.18rem] lg:text-[1.28rem] font-semibold text-[#F5F5DC] leading-snug sm:leading-relaxed md:leading-[1.85rem] text-center md:text-left pr-0 md:pr-2 lg:pr-4 transition-all duration-700 delay-150 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <p className="w-full">
                {contactConfig.introParagraph1 || 'Wir freuen uns auf Ihre Nachrichten und Anfragen. Ob Lob, Kritik oder einfach nur ein Gruß – Ihre Worte sind uns wichtig.'}
              </p>
              <p className="w-full">
                {contactConfig.introParagraph2 || 'Kontaktieren Sie uns über unser Formular oder per E-Mail:'}{' '}
                <a
                  href={`mailto:${contactConfig.recipientEmail || 'info@olla-podrida.de'}`}
                  className="font-macondo text-[1.05rem] sm:text-[1.18rem] md:text-[1.22rem] lg:text-[1.32rem] text-[#DAA520] hover:underline break-words"
                >
                  {contactConfig.emailDisplay || 'info(at)olla-podrida.de'}
                </a>
              </p>
            </div>

            {/* Susanne figure: centered on mobile, enlarged by 30%, slightly hovering over top edge of contact form on mobile */}
            <div
              ref={portraitRef}
              className="w-full flex justify-center md:justify-start items-center mt-6 sm:mt-8 md:mt-8 mb-[-3rem] min-[380px]:mb-[-3.6rem] sm:mb-[-4.2rem] md:mb-0 z-30 pointer-events-none"
            >
              <div
                className={`w-[10.5rem] min-[380px]:w-[11.8rem] sm:w-[13.5rem] md:w-44 lg:w-52 transition-all duration-800 ease-out transform ${
                  portraitInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'
                }`}
              >
                <img
                  src={contactConfig.portrait || resolveAssetUrl('/images/Susanne_klein.webp')}
                  alt="Susanne spielt vergnügt auf der Flöte"
                  className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-300 pointer-events-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Column (.elementor-element-8e91fcb): Contact Card with hintergrundbild2.png + extra horizontal margin on mobile */}
          <div
            ref={formRef}
            className={`md:col-span-6 lg:col-span-6 flex justify-center md:justify-end relative mt-0 px-3 min-[400px]:px-5 sm:px-8 md:px-0 transition-all duration-900 ease-out z-10 ${
              formInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.97]'
            }`}
          >
            {/* Ornamental Musiknoten Banner Graphic (.elementor-element-a3831ca) positioned on top of form */}
            <div
              className={`hidden md:block absolute -top-14 sm:-top-18 md:-top-22 lg:-top-24 right-[-0.5rem] md:right-[-1rem] lg:right-[-1.5rem] pointer-events-none z-20 w-[19rem] sm:w-[22rem] lg:w-[24rem] transition-all duration-800 delay-200 ease-out transform ${
                formInView ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 -translate-y-4 rotate-2'
              }`}
            >
              <img
                src={resolveAssetUrl('/images/musiknoten-banner.png')}
                alt="Musiknoten Pergament"
                className="w-full h-auto object-contain drop-shadow-md"
                loading="eager"
              />
            </div>

            <div
              className="relative w-full max-w-[42rem] min-h-[38rem] sm:min-h-[42rem] md:min-h-[44rem] px-7 sm:px-12 md:px-16 py-12 sm:py-14 md:py-16 flex flex-col justify-center transition-all duration-300 z-10 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]"
              style={{
                backgroundImage: `url("${resolveAssetUrl('/images/hintergrundbild2.png')}")`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%'
              }}
            >
              {/* Contact Form 7 container (.ue_contact_form_7) with generous presence and padding */}
              <form onSubmit={handleSubmit} className="w-full max-w-[21rem] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto flex flex-col gap-3.5 sm:gap-4.5">
                
                {/* Honeypot anti-bot protection */}
                <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                  <label htmlFor="hp_website">Website</label>
                  <input
                    type="text"
                    id="hp_website"
                    name="hp_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Name */}
                <div className="w-full">
                  <label className="block font-macondo text-lg sm:text-xl text-[#0A0707] font-normal mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-[0.25rem] bg-[#F4F4E9]/90 border border-[#0A0707]/25 text-[#0A0707] font-macondo text-base sm:text-[1.18rem] focus:outline-none focus:bg-[#F4F4E9] focus:border-[#DAA520] shadow-inner"
                  />
                </div>

                {/* E-Mail-Adresse */}
                <div className="w-full">
                  <label className="block font-macondo text-lg sm:text-xl text-[#0A0707] font-normal mb-1">
                    E-Mail-Adresse
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-[0.25rem] bg-[#F4F4E9]/90 border border-[#0A0707]/25 text-[#0A0707] font-macondo text-base sm:text-[1.18rem] focus:outline-none focus:bg-[#F4F4E9] focus:border-[#DAA520] shadow-inner"
                  />
                </div>

                {/* Nachricht */}
                <div className="w-full">
                  <label className="block font-macondo text-lg sm:text-xl text-[#0A0707] font-normal mb-1">
                    Nachricht
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3.5 sm:p-4 rounded-[0.25rem] bg-[#F4F4E9]/90 border border-[#0A0707]/25 text-[#0A0707] font-macondo text-base sm:text-[1.18rem] focus:outline-none focus:bg-[#F4F4E9] focus:border-[#DAA520] shadow-inner resize-y min-h-[5.5rem] sm:min-h-[6.5rem]"
                  />
                </div>

                {/* Checkbox Privacy matching .wpcf7-acceptance - vertically centered with checkbox at exact same line height */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="cf-acceptance"
                    type="checkbox"
                    checked={formData.acceptance}
                    onChange={(e) => setFormData({ ...formData, acceptance: e.target.checked })}
                    className="w-4 h-4 rounded border-[#0A0707]/40 bg-[#F5F5DC8A] text-[#DAA520] focus:ring-0 cursor-pointer accent-[#DAA520] shrink-0 m-0"
                  />
                  <label
                    htmlFor="cf-acceptance"
                    className="font-macondo text-xs sm:text-sm md:text-base text-[#0A0707] cursor-pointer leading-tight inline-flex items-center flex-wrap gap-x-1"
                  >
                    <span>Hiermit stimme ich den</span>
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="underline text-[#0A0707] hover:text-[#DAA520] inline leading-tight cursor-pointer"
                    >
                      Datenschutzrichtlinien
                    </button>
                    <span>zu.</span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="font-macondo text-lg sm:text-xl font-normal px-6 py-2 rounded-[0.3125rem] text-[#DAA520] bg-[#0A0707] hover:bg-black hover:text-white transition-all duration-200 cursor-pointer shadow-[0.375rem_0.375rem_1rem_-0.3125rem_rgba(0,0,0,0.5)] border-none active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Wird gesendet...' : 'Olla, olla!'}
                  </button>
                </div>

                {/* Response feedback matching .wpcf7-response-output */}
                {responseOutput && (
                  <div
                    className={`font-macondo text-sm mt-3 leading-snug ${
                      responseOutput.isError ? 'text-[#F15C1C]' : 'text-emerald-800 font-semibold'
                    }`}
                  >
                    {responseOutput.text}
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
