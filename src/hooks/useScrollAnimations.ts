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
 */
export function useScrollAnimations(pathname: string) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ctx is declared here so the useEffect cleanup can call ctx.revert().
    // Previously ctx was only in scope inside requestAnimationFrame, so the
    // cleanup's ctx.revert() was unreachable — old animations accumulated on
    // every route change.
    let ctx: ReturnType<typeof gsap.context> | undefined;

    const rafId = requestAnimationFrame(() => {
      ctx = gsap.context(() => {

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

        /* ----------------------------------------------------------
           4. HORIZONTAL SCROLL SECTION
        ---------------------------------------------------------- */
        const horizSection = document.querySelector<HTMLElement>('.horiz-scroll-section');
        const horizTrack = document.querySelector<HTMLElement>('.horiz-scroll-track');

        if (horizSection && horizTrack) {
          const getScrollDistance = () =>
            horizTrack.scrollWidth - horizTrack.offsetWidth;

          gsap.to(horizTrack, {
            x: () => -getScrollDistance(),
            ease: 'none',
            scrollTrigger: {
              trigger: horizSection,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => `+=${getScrollDistance()}`,
              invalidateOnRefresh: true,
            },
          });
        }

      }); // end gsap.context
    });

    return () => {
      cancelAnimationFrame(rafId);
      // ctx may be undefined if the RAF hadn't fired yet — optional chaining is safe
      ctx?.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}
