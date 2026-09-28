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
      <div className="max-w-[80rem] mx-auto px-[5.5%] relative z-10">

        {/* Section Heading - reduced gap to text below */}
        <div
          className={`text-left mb-2 md:mb-3 max-w-6xl mx-auto transition-all duration-700 ease-out ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="font-macondo text-[2.15rem] sm:text-[2.85rem] md:text-[3.8rem] text-[#F5F5DC] font-normal tracking-wide text-left">
            Kontakt &amp; Anfragen
          </h2>
        </div>

        {/* Two-Column Layout (.elementor-element-29fca19) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Column (.elementor-element-2641b3e): Intro text + Susanne with flute */}
          <div
            className={`md:col-span-5 flex flex-col items-center md:items-start text-left space-y-6 transition-all duration-700 delay-150 ease-out ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            {/* Text editor .elementor-element-79de16e using authentic font-macondo */}
            <div className="w-full space-y-4 font-macondo text-base sm:text-lg md:text-[1.25rem] font-semibold text-[#F5F5DC] leading-relaxed md:leading-[1.8rem] text-left">
              <p>
                Wir freuen uns auf Ihre Nachrichten und Anfragen. Ob Lob, Kritik oder einfach nur ein Gruß – Ihre Worte sind uns wichtig.
              </p>
              <p>
                Kontaktieren Sie uns über unser Formular oder per E-Mail:{' '}
                <a
                  href="mailto:info@olla-podrida.de"
                  className="font-macondo text-[1.3rem] text-[#DAA520] hover:underline"
                >
                  info(at)olla-podrida.de
                </a>
              </p>
            </div>

            {/* Susanne Cutout Illustration .elementor-element-aa9541e - Scaled up for majestic presence */}
            <div className="w-full flex justify-center md:justify-start items-center pt-2 md:pt-4">
              <div className="w-48 sm:w-56 md:w-64 lg:w-72 transition-transform duration-500 hover:scale-105">
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
            <div className="hidden md:block absolute -top-20 sm:-top-28 md:-top-32 right-[-0.5rem] md:right-[-1.5rem] lg:right-[-2.5rem] pointer-events-none z-20 w-[22rem] sm:w-[26rem] lg:w-[30rem]">
              <img
                src="https://olla-podrida.de/wp-content/uploads/2024/07/2024_07_22_Elemente_Olla-Podrida_Zeichenflaeche-1-1024x611.png"
                alt="Musiknoten Pergament"
                className="w-full h-auto object-contain drop-shadow-md"
                loading="lazy"
              />
            </div>

            <div
              className="relative w-full max-w-[42rem] min-h-[38rem] md:min-h-[44rem] px-8 sm:px-14 md:px-20 lg:px-24 xl:px-28 py-8 sm:py-12 md:py-14 lg:py-16 flex flex-col justify-center transition-all duration-300 z-10"
              style={{
                backgroundImage: `url("https://olla-podrida.de/wp-content/uploads/2024/07/hintergrundbild2.png")`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            >
              {/* Contact Form 7 container (.ue_contact_form_7) with generous edge margins on desktop */}
              <form onSubmit={handleSubmit} className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto space-y-3.5">
                
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
