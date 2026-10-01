import React, { useState, useEffect } from 'react';
import { getAssets } from '../data/siteContent';
import { Lock, User, KeyRound, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (redirectUrl: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const assets = getAssets();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setIsSuccess(false);
      setLoginProgress(0);
      setErrorMessage(null);
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setIsMounted(true);
        });
      });
      return () => cancelAnimationFrame(raf1);
    } else {
      setIsMounted(false);
      setIsClosing(false);
      setIsSuccess(false);
      setLoginProgress(0);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isSuccess || isClosing) return; // Prevent closing during redirect transition
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsMounted(false);
      setIsClosing(false);
    }, 320);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isClosing, isSuccess]);

  if (!isOpen && !isClosing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Bitte gib sowohl deinen Benutzernamen als auch dein Passwort ein.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const data = (window as any).OLLA_PODRIDA_DATA || {};
    const ajaxUrl = data.ajaxUrl || '/wp-admin/admin-ajax.php';
    const nonce = data.loginNonce || '';

    const formData = new URLSearchParams();
    formData.append('action', 'olla_podrida_ajax_login');
    formData.append('nonce', nonce);
    formData.append('log', username.trim());
    formData.append('pwd', password);
    if (rememberMe) {
      formData.append('rememberme', 'forever');
    }

    try {
      const response = await fetch(ajaxUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
      });

      const json = await response.json();

      if (json.success) {
        setIsLoading(false);
        setIsSuccess(true);
        const redirectUrl = json.data?.redirect || '/wp-admin/index.php';

        // Animate smooth medieval progress bar from 0% to 100% inside the pop-up
        const startTime = performance.now();
        const duration = 1200; // 1.2s smooth loading animation inside modal

        const animProgress = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const raw = Math.min(elapsed / duration, 1);
          const eased = Math.sin((raw * Math.PI) / 2);
          const pct = Math.round(eased * 100);
          setLoginProgress(pct);

          if (raw < 1) {
            requestAnimationFrame(animProgress);
          } else {
            // Smooth fade/transition out of modal directly into backend
            setTimeout(() => {
              setIsClosing(true);
              setTimeout(() => {
                onLoginSuccess(redirectUrl);
                window.location.href = redirectUrl;
              }, 260);
            }, 140);
          }
        };

        requestAnimationFrame(animProgress);
      } else {
        setIsLoading(false);
        setErrorMessage(json.data?.message || 'Ungültige Zugangsdaten. Bitte überprüfe Benutzername und Passwort.');
      }
    } catch (err) {
      // Fallback: If network or AJAX fails, submit standard form to wp-login.php
      console.error('AJAX Login error:', err);
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.loginUrl || '/wp-login.php';

      const logInput = document.createElement('input');
      logInput.type = 'hidden';
      logInput.name = 'log';
      logInput.value = username.trim();
      form.appendChild(logInput);

      const pwdInput = document.createElement('input');
      pwdInput.type = 'hidden';
      pwdInput.name = 'pwd';
      pwdInput.value = password;
      form.appendChild(pwdInput);

      if (rememberMe) {
        const remInput = document.createElement('input');
        remInput.type = 'hidden';
        remInput.name = 'rememberme';
        remInput.value = 'forever';
        form.appendChild(remInput);
      }

      const redInput = document.createElement('input');
      redInput.type = 'hidden';
      redInput.name = 'redirect_to';
      redInput.value = data.adminUrl || '/wp-admin/index.php';
      form.appendChild(redInput);

      document.body.appendChild(form);
      form.submit();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100002] flex items-center justify-center p-3 sm:p-6 select-none transition-all duration-300 ease-out overflow-hidden ${
        isMounted && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        backgroundColor: 'rgba(7, 2, 2, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      onClick={handleClose}
    >
      {/* Ambient drifting smoke in login backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-25 z-0">
        <img
          src={assets.smokeAlt}
          alt=""
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] object-cover animate-fog-drift"
        />
      </div>

      <div
        className={`relative z-10 w-full max-w-md bg-[#140D09] border-2 border-[#DAA520] rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(218,165,32,0.28)] flex flex-col text-[#F5F5DC] overflow-hidden p-6 sm:p-9 transition-all duration-350 cubic-bezier(0.16, 1, 0.3, 1) ${
          isMounted && !isClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-6'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Corner Accents */}
        <div className="absolute top-2.5 left-2.5 text-[#DAA520]/60 text-sm pointer-events-none">✦</div>
        <div className="absolute top-2.5 right-2.5 text-[#DAA520]/60 text-sm pointer-events-none">✦</div>
        <div className="absolute bottom-2.5 left-2.5 text-[#DAA520]/60 text-sm pointer-events-none">✦</div>
        <div className="absolute bottom-2.5 right-2.5 text-[#DAA520]/60 text-sm pointer-events-none">✦</div>

        {/* Close Button - hidden during redirect sequence */}
        {!isSuccess && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#1e130c] border border-[#DAA520]/40 hover:border-[#DAA520] text-[#D1C7AC] hover:text-[#FFD700] flex items-center justify-center text-lg transition-colors cursor-pointer"
            aria-label="Schließen"
          >
            &times;
          </button>
        )}

        {isSuccess ? (
          /* ======================================================== */
          /* SELF-CONTAINED IN-MODAL SUCCESS & LOADING TRANSITION      */
          /* ======================================================== */
          <div className="py-4 sm:py-6 flex flex-col items-center text-center transition-all duration-500 ease-out">
            {/* Spinning Antique Outer Circle & Medallion */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border border-dashed border-[#DAA520]/60 animate-spin"
                style={{ animationDuration: '14s' }}
              />
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#2a1708] via-[#1a0e05] to-[#3a200a] border-2 border-[#FFD700] shadow-[0_0_28px_rgba(255,215,0,0.55)] flex items-center justify-center">
                <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">✨</span>
              </div>
            </div>

            <h3 className="font-macondo text-2xl sm:text-3xl text-[#DAA520] font-normal tracking-wide drop-shadow-sm mb-1.5">
              Anmeldung erfolgreich!
            </h3>
            <p className="font-serif text-xs sm:text-sm text-[#F5F5DC]/85 italic mb-6 max-w-xs leading-relaxed">
              Willkommen zurück! Das Redaktions-Cockpit wird vorbereitet...
            </p>

            {/* Filigree Antique Progress Bar */}
            <div className="w-56 sm:w-64 h-2 bg-[#DAA520]/20 rounded-full relative overflow-hidden mb-3 border border-[#DAA520]/40 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#8E2800] via-[#DAA520] to-[#FFD700] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(255,215,0,0.8)]"
                style={{ width: `${loginProgress}%` }}
              />
            </div>

            {/* Percentage flourish */}
            <div className="flex items-center space-x-2 text-xs font-serif text-[#F5F5DC]/70 tracking-widest">
              <span className="text-[#DAA520]/80">❧</span>
              <span className="font-mono text-[#DAA520] font-medium">{loginProgress}%</span>
              <span className="text-[#DAA520]/80">❧</span>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* STANDARD LOGIN CREDENTIALS FORM                           */
          /* ======================================================== */
          <>
            {/* Ornate Header with Lock Emblem */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 mb-3 flex items-center justify-center">
                {/* Spinning antique dashed outer circle */}
                <div
                  className="absolute inset-0 rounded-full border border-dashed border-[#DAA520]/60 animate-spin"
                  style={{ animationDuration: '28s' }}
                />
                {/* Inner medallion with lock */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1e130c] border-2 border-[#DAA520] p-2 shadow-[0_0_20px_rgba(218,165,32,0.5)] flex items-center justify-center text-[#DAA520]">
                  <Lock size={26} className="text-[#DAA520] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                </div>
              </div>

              <h2 className="font-macondo text-2xl sm:text-3xl text-[#DAA520] font-normal tracking-wide drop-shadow-sm mb-1">
                Admin- &amp; Redaktion
              </h2>
              <p className="font-serif text-xs sm:text-sm text-[#F5F5DC]/80 italic">
                Melde dich mit deinen Zugangsdaten an, um in das Redaktionssystem zu gelangen.
              </p>
            </div>

            {/* Error Alert Box */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-bounce">
                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email Field */}
              <div>
                <label className="block text-xs font-semibold text-[#D1C7AC] mb-1.5 uppercase tracking-wider">
                  Benutzername oder E-Mail
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#DAA520]/70 pointer-events-none">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="name@domain.de oder benutzer"
                    autoComplete="username"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#0a0503] border border-[#DAA520]/40 focus:border-[#FFD700] text-[#F5F5DC] placeholder-[#8c8270] text-sm sm:text-base outline-none transition-colors shadow-inner"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-[#D1C7AC] uppercase tracking-wider">
                    Passwort
                  </label>
                  <a
                    href="/wp-login.php?action=lostpassword"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#DAA520] hover:text-[#FFD700] underline transition-colors"
                  >
                    Passwort vergessen?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-[#DAA520]/70 pointer-events-none">
                    <KeyRound size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl bg-[#0a0503] border border-[#DAA520]/40 focus:border-[#FFD700] text-[#F5F5DC] placeholder-[#8c8270] text-sm sm:text-base outline-none transition-colors shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#DAA520]/70 hover:text-[#FFD700] transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberme"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded bg-[#0a0503] border-[#DAA520] text-[#DAA520] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#DAA520]"
                />
                <label htmlFor="rememberme" className="text-xs sm:text-sm text-[#D1C7AC] cursor-pointer">
                  Angemeldet bleiben
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 sm:h-13 flex items-center justify-center gap-2 px-6 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#CD853F] hover:from-[#DAA520] hover:via-[#FFD700] hover:to-[#DAA520] text-[#070202] font-macondo font-bold text-base sm:text-lg border-2 border-[#FFD700] shadow-[0_4px_20px_rgba(218,165,32,0.45)] hover:shadow-[0_6px_25px_rgba(255,215,0,0.6)] active:scale-[0.98] transition-all cursor-pointer tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin text-[#070202]" />
                      <span>Wird angemeldet...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} className="text-[#070202]" />
                      <span>Anmelden</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="w-full h-10 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#D1C7AC]/80 hover:text-[#FFD700] transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Zurück zur Website</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
