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
      className="relative w-full bg-[#070202] text-[#F5F5DC] overflow-hidden pt-4 md:pt-10 pb-6 md:pb-8 select-none"
    >
      <div className="max-w-[66rem] mx-auto px-4 sm:px-6 md:px-8 relative z-10">

        {/* Two-Column Layout (.elementor-element-29fca19) - tightly connected without black voids */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-start">
          
          {/* Left Column: Heading + Text + Susanne */}
          <div
            className={`md:col-span-5 flex flex-col text-left transition-all duration-700 delay-150 ease-out z-20 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="flex flex-row items-center md:items-start justify-between gap-3">
              <div className="w-[62%] sm:w-[65%] md:w-full flex flex-col pl-4 sm:pl-6 md:pl-5">
                <h2 className="font-macondo text-[2.88rem] md:text-[4.5rem] text-[#F5F5DC] font-normal tracking-wide text-left mb-1 sm:mb-2 leading-tight">
                  Kontakt &amp; Anfragen
                </h2>
                <div className="space-y-1.5 sm:space-y-2.5 font-macondo text-[0.88rem] sm:text-[1.05rem] md:text-[1.18rem] font-semibold text-[#F5F5DC] leading-snug sm:leading-relaxed md:leading-[1.7rem] text-left">
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
              </div>

              {/* Susanne figure on right on mobile: chest aligned with headline, extends down over form card */}
              <div className="w-[38%] sm:w-[35%] md:w-full flex justify-center md:justify-start items-center shrink-0 -mb-8 sm:-mb-10 md:mb-0 md:mt-2 z-30 pointer-events-none">
                <div className="w-36 sm:w-44 md:w-56 lg:w-60 transition-transform duration-500 hover:scale-105">
                  <img
                    src="https://olla-podrida.de/wp-content/uploads/2024/07/Susanne_klein.webp"
                    alt="Susanne spielt vergnügt auf der Flöte"
                    className="w-full h-auto object-contain drop-shadow-md"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (.elementor-element-8e91fcb): Contact Card with hintergrundbild2.png */}
          <div
            className={`md:col-span-7 flex justify-center relative -mt-3 sm:-mt-4 md:mt-0 transition-all duration-700 delay-250 ease-out z-10 ${
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
              className="relative w-full max-w-[42rem] min-h-[38rem] sm:min-h-[42rem] md:min-h-[44rem] px-7 sm:px-12 md:px-16 py-12 sm:py-14 md:py-16 flex flex-col justify-center transition-all duration-300 z-10 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]"
              style={{
                backgroundImage: `url("https://olla-podrida.de/wp-content/uploads/2024/07/hintergrundbild2.png")`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%'
              }}
            >
              {/* Contact Form 7 container (.ue_contact_form_7) with generous presence and padding */}
              <form onSubmit={handleSubmit} className="w-full max-w-[21rem] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto flex flex-col gap-3.5 sm:gap-4.5">
                
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

                {/* Submit button .wpcf7-submit: Black background with Gold text matching original */}
                <div className="pt-2">
                  <input
                    type="submit"
                    value="Olla, olla!"
                    className="font-macondo text-lg sm:text-xl font-normal px-6 py-2 rounded-[0.3125rem] text-[#DAA520] bg-[#0A0707] hover:bg-black hover:text-white transition-all duration-200 cursor-pointer shadow-[0.375rem_0.375rem_1rem_-0.3125rem_rgba(0,0,0,0.5)] border-none active:scale-95"
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
