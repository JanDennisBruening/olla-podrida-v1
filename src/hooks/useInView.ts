import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.12, rootMargin = '0px 0px -40px 0px', triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let isDisposed = false;

    const setupObserver = () => {
      if (isDisposed || !el) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (triggerOnce && observer) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(el);
    };

    // If preloader is active, wait until page is unveiled before observing
    if (typeof window !== 'undefined' && !(window as any).__OLLA_PAGE_READY__) {
      const handleReady = () => {
        // Small delay so preloader fade is completely invisible
        setTimeout(setupObserver, 50);
      };

      window.addEventListener('preloader-removed', handleReady, { once: true });
      // Fallback timer if preloader is disabled or fails
      const fallbackTimer = setTimeout(handleReady, 1800);

      return () => {
        isDisposed = true;
        window.removeEventListener('preloader-removed', handleReady);
        clearTimeout(fallbackTimer);
        if (observer) observer.disconnect();
      };
    }

    setupObserver();

    return () => {
      isDisposed = true;
      if (observer) observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
}
