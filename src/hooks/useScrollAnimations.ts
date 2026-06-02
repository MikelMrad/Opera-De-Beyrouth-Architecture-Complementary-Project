'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Sets up all GSAP scroll-triggered animations for the site.
 * Called once per route change from AnimationsInit.
 *
 * Initial states (.anim-fade-up, .anim-scale-in) are defined in globals.css.
 * GSAP only drives them to their final values.
 *
 * Everything is created inside a single gsap.context() and torn down with
 * ctx.revert() on cleanup. revert() also unwinds the ScrollTrigger `pin`
 * spacer it injects around .horiz-scroll-section, restoring the DOM to the
 * exact shape React expects. Running synchronously in the effect (instead of
 * a deferred requestAnimationFrame) means the pin is created *after*
 * hydration, so it never races a React commit — which previously surfaced as
 * a dev-only "removeChild: node is not a child of this node" error under
 * StrictMode's double-mount.
 */
export function useScrollAnimations(pathname: string) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      /* ----------------------------------------------------------
         1. SECTION TITLES — h2 clip-path wipe reveal
      ---------------------------------------------------------- */
      gsap.utils.toArray<HTMLElement>('h2').forEach((el) => {
        gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(el, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'expo.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        });
      });

      /* ----------------------------------------------------------
         2. FADE-UP ELEMENTS — .anim-fade-up
         Covers cards, paragraphs, footer columns, footer bottom.
         ScrollTrigger.batch groups nearby elements so they stagger
         together when they enter the viewport as a group.
      ---------------------------------------------------------- */
      ScrollTrigger.batch('.anim-fade-up', {
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        },
        start: 'top 90%',
        once: true,
      });

      /* ----------------------------------------------------------
         3. SCALE-IN ELEMENTS — .anim-scale-in (image blocks)
         Entrance + subtle parallax scrub.
      ---------------------------------------------------------- */
      gsap.utils.toArray<HTMLElement>('.anim-scale-in').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });

        gsap.to(el, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });

      // NOTE: the pinned horizontal-scroll section lives in its own component
      // (components/HorizontalQuotes) so its pin is reverted on that
      // component's unmount — before React removes the <section> — which is
      // what previously caused a "removeChild" error on navigation.

    }); // end gsap.context

    // Trigger positions depend on final layout; recalculate once now and again
    // after web fonts swap in (Cormorant / Inter shift element heights).
    ScrollTrigger.refresh();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, [pathname]);
}
