import React, { useState } from 'react';
import { ASSETS } from '../data/siteContent';
import { useInView } from '../hooks/useInView';

interface KontaktSectionProps {
  onOpenPrivacy: () => void;
}

export const KontaktSection: React.FC<KontaktSectionProps> = ({ onOpenPrivacy }) => {
  const { ref: sectionRef, isInView } = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    acceptance: false
  });
  const [responseOutput, setResponseOutput] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.acceptance) {
      setResponseOutput({
        text: 'Bitte füllen Sie alle erforderlichen Felder aus und stimmen Sie den Datenschutzrichtlinien zu.',
        isError: true
      });
      return;
    }

    setResponseOutput({
      text: 'Vielen Dank für Ihre Nachricht. Sie wurde erfolgreich versendet.',
      isError: false
    });
    setFormData({
      name: '',
      email: '',
      message: '',
      acceptance: false
    });
  };

  return (
    <section
      ref={sectionRef}
      id="kontakt"
      className="relative w-full bg-[#070202] text-[#F5F5DC] overflow-hidden pt-8 md:pt-10 pb-4 md:pb-6 select-none"
    >
      <div className="max-w-[61rem] mx-auto px-[4%] sm:px-[5%] relative z-10">

        {/* Section Heading - compact width matching content */}
        <div
          className={`text-left mb-2 md:mb-3 transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="font-macondo text-[2.15rem] sm:text-[2.65rem] md:text-[3.4rem] text-[#F5F5DC] font-normal tracking-wide text-left">
            Kontakt &amp; Anfragen
          </h2>
        </div>

        {/* Two-Column Layout (.elementor-element-29fca19) - tightened gap and compact width */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column (.elementor-element-2641b3e): Intro text + Susanne with flute */}
          <div
            className={`md:col-span-5 flex flex-row md:flex-col items-center md:items-start text-left gap-3 sm:gap-4 md:space-y-5 transition-all duration-700 delay-150 ease-out ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Text editor on left on mobile, full width on desktop */}
            <div className="w-[62%] md:w-full space-y-2 sm:space-y-3 font-macondo text-[0.88rem] sm:text-[1.05rem] md:text-[1.18rem] font-semibold text-[#F5F5DC] leading-snug sm:leading-relaxed md:leading-[1.7rem] text-left">
              <p>
                Wir freuen uns auf Ihre Nachrichten und Anfragen. Ob Lob, Kritik oder einfach nur ein Gruß – Ihre Worte sind uns wichtig.
              </p>
              <p>
                Kontaktieren Sie uns über unser Formular oder per E-Mail:{' '}
                <a
                  href="mailto:info@olla-podrida.de"
                  className="font-macondo text-[0.98rem] sm:text-[1.15rem] md:text-[1.2rem] text-[#DAA520] hover:underline break-words"
                >
                  info(at)olla-podrida.de
                </a>
              </p>
            </div>

            {/* Susanne on right on mobile, below text on desktop */}
            <div className="w-[38%] md:w-full flex justify-center md:justify-start items-center shrink-0 pt-0 md:pt-2">
              <div className="w-28 sm:w-36 md:w-56 lg:w-60 transition-transform duration-500 hover:scale-105">
                <img
                  src="https://olla-podrida.de/wp-content/uploads/2024/07/Susanne_klein.webp"
                  alt="Susanne spielt vergnügt auf der Flöte"
                  className="w-full h-auto object-contain drop-shadow-md"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Column (.elementor-element-8e91fcb): Contact Card with hintergrundbild2.png */}
          <div
            className={`md:col-span-7 flex justify-center relative transition-all duration-700 delay-250 ease-out ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Ornamental Musiknoten Banner Graphic (.elementor-element-a3831ca) positioned higher up overlapping top */}
            <div className="hidden md:block absolute -top-16 sm:-top-22 md:-top-28 right-[-0.5rem] md:right-[-1rem] lg:right-[-1.5rem] pointer-events-none z-20 w-[19rem] sm:w-[22rem] lg:w-[25rem]">
              <img
                src="https://olla-podrida.de/wp-content/uploads/2024/07/2024_07_22_Elemente_Olla-Podrida_Zeichenflaeche-1-1024x611.png"
                alt="Musiknoten Pergament"
                className="w-full h-auto object-contain drop-shadow-md"
                loading="lazy"
              />
            </div>

            <div
              className="relative w-full max-w-[39rem] min-h-[36rem] md:min-h-[40rem] px-8 sm:px-13 md:px-17 lg:px-21 py-8 sm:py-10 md:py-12 flex flex-col justify-center transition-all duration-300 z-10"
              style={{
                backgroundImage: `url("https://olla-podrida.de/wp-content/uploads/2024/07/hintergrundbild2.png")`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            >
              {/* Contact Form 7 container (.ue_contact_form_7) with calibrated edge margins on mobile & desktop */}
              <form onSubmit={handleSubmit} className="w-full max-w-[17rem] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto space-y-3 sm:space-y-3.5">
                
                {/* Name */}
                <div>
                  <label className="block font-macondo text-xl text-[#0A0707] font-normal mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-[3rem] px-4 rounded-[0.25rem] bg-[#F4F4E980] border border-[#0A0707]/20 text-[#0A0707] font-macondo text-[1.2rem] focus:outline-none focus:bg-[#F4F4E9] shadow-inner"
                  />
                </div>

                {/* E-Mail-Adresse */}
                <div>
                  <label className="block font-macondo text-xl text-[#0A0707] font-normal mb-1">
                    E-Mail-Adresse
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-[3rem] px-4 rounded-[0.25rem] bg-[#F4F4E980] border border-[#0A0707]/20 text-[#0A0707] font-macondo text-[1.2rem] focus:outline-none focus:bg-[#F4F4E9] shadow-inner"
                  />
                </div>

                {/* Nachricht */}
                <div>
                  <label className="block font-macondo text-xl text-[#0A0707] font-normal mb-1">
                    Nachricht
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 rounded-[0.25rem] bg-[#F4F4E980] border border-[#0A0707]/20 text-[#0A0707] font-macondo text-[1.2rem] focus:outline-none focus:bg-[#F4F4E9] shadow-inner resize-y h-[6.5rem]"
                  />
                </div>

                {/* Checkbox Privacy matching .wpcf7-acceptance */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    id="cf-acceptance"
                    type="checkbox"
                    checked={formData.acceptance}
                    onChange={(e) => setFormData({ ...formData, acceptance: e.target.checked })}
                    className="w-4 h-4 rounded border-[#0A0707]/40 bg-[#F5F5DC8A] text-[#DAA520] focus:ring-0 cursor-pointer accent-[#DAA520]"
                  />
                  <label htmlFor="cf-acceptance" className="font-macondo text-sm md:text-base text-[#0A0707] cursor-pointer">
                    Hiermit stimme ich den{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="underline text-[#0A0707] hover:text-[#DAA520]"
                    >
                      Datenschutzrichtlinien
                    </button>{' '}
                    zu.
                  </label>
                </div>

                {/* Submit button .wpcf7-submit: Black background with Gold text matching original */}
                <div className="pt-2">
                  <input
                    type="submit"
                    value="Olla, olla!"
                    className="font-macondo text-xl font-normal px-6 py-2 rounded-[0.3125rem] text-[#DAA520] bg-[#0A0707] hover:bg-black hover:text-white transition-all duration-200 cursor-pointer shadow-[0.375rem_0.375rem_1rem_-0.3125rem_rgba(0,0,0,0.5)] border-none"
                  />
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
