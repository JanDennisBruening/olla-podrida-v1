import React, { useState, useEffect } from 'react';

export const Preloader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // 0.3s delay + 0.2s opacity transition matching window.onload in original site
    const timer1 = setTimeout(() => {
      setOpacity(0);
      const timer2 = setTimeout(() => {
        setVisible(false);
      }, 200);
      return () => clearTimeout(timer2);
    }, 300);

    return () => clearTimeout(timer1);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[99999] flex justify-center items-center bg-[#000000] transition-opacity duration-200 ease-out"
      style={{ opacity }}
    >
      <div
        className="w-[3.125rem] h-[3.125rem] rounded-full border-[0.25rem] border-white/30 border-t-[#DAA520] animate-spin"
      />
    </div>
  );
};
