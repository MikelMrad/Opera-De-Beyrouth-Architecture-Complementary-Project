'use client';

// Lenis smooth scroll, frame-synced with GSAP's ticker so ScrollTrigger
// stays accurate without any extra position corrections.

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    let lenisInstance: import('lenis').default | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rafFn: ((time: number) => void) | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scrollHandler: (() => void) | null = null;

    const init = async () => {
      const Lenis = (await import('lenis')).default;
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      lenisInstance = new Lenis({
        duration: 1.35,
        // Exponential ease-out — feels weighty and elegant
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        // Keep touch scroll native on mobile
        touchMultiplier: 1.5,
      });

      // Tell ScrollTrigger to recalculate on every Lenis scroll frame
      scrollHandler = () => ScrollTrigger.update();
      lenisInstance.on('scroll', scrollHandler);

      // Drive Lenis via GSAP's unified ticker — avoids double RAF loops
      rafFn = (time: number) => lenisInstance?.raf(time * 1000);
      gsap.ticker.add(rafFn);
      gsap.ticker.lagSmoothing(0);
    };

    init();

    return () => {
      if (lenisInstance && scrollHandler) {
        lenisInstance.off('scroll', scrollHandler);
      }
      if (rafFn) {
        import('gsap').then(({ default: gsap }) => gsap.ticker.remove(rafFn!));
      }
      lenisInstance?.destroy();
    };
  }, []);

  return null;
}
