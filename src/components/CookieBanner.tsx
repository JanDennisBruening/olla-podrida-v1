import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('olla_cookies_accepted');
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('olla_cookies_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm p-4 rounded-xl bg-[#140D09]/95 border border-[#DAA520] shadow-2xl backdrop-blur-md text-[#F5F5DC] text-xs leading-relaxed animate-fadeIn">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Cookie size={20} className="text-[#DAA520] shrink-0 mt-0.5" />
          <div>
            <p className="font-macondo text-sm text-[#DAA520] font-semibold mb-1">
              Nur essenzielle Cookies und Musik aus alten Zeiten!
            </p>
            <p className="text-[#D1C7AC] text-[0.6875rem] mb-2.5">
              Wir verwenden ausschließlich technisch essenzielle Cookies, damit Sie unsere Musik und Seiteninhalte ungestört erleben können.{' '}
              <button
                onClick={onOpenPrivacy}
                className="text-[#DAA520] underline hover:text-white"
              >
                Datenschutz
              </button>
            </p>
            <button
              onClick={accept}
              className="px-4 py-1.5 rounded-lg bg-[#DAA520] hover:bg-[#e2af31] text-[#070202] font-macondo text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Einverstanden
            </button>
          </div>
        </div>

        <button
          onClick={accept}
          className="text-[#D1C7AC] hover:text-[#DAA520] p-1 transition-colors"
          aria-label="Ausblenden"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
