'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HorizontalQuotes.css';

// The desktop horizontal-scroll pin is set up *here*, co-located with the
// section it pins, rather than in the global useScrollAnimations hook. Pinning
// makes ScrollTrigger wrap <section> in a `pin-spacer` and reparent it — DOM
// React doesn't know about. By reverting inside this component's own
// layout-effect cleanup, GSAP unwinds the spacer *before* React unmounts the
// section on navigation (e.g. clicking an auditorium → /reserve), avoiding the
// "removeChild: node is not a child of this node" error. useLayoutEffect (not
// useEffect) is required so the revert runs synchronously during teardown,
// before the DOM is removed.

// useLayoutEffect on the client, useEffect on the server (avoids the SSR warning).
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const QUOTES = [
  {
    text: 'La musique ne nous dit pas ce qui a été — elle révèle ce que nous avons toujours été.',
    attribution: 'Opéra de Beyrouth',
  },
  {
    text: 'Beyrouth ne tombe pas. Elle descend, accumule la lumière au fond de la mer, et remonte comme un soleil nouveau.',
    attribution: 'Mémoire & Lumière',
  },
  {
    text: 'Dans la salle d\'opéra, le son devient architecture. Chaque aria, une voûte de pierre tremblante.',
    attribution: 'Art & Espace',
  },
  {
    text: 'S\'asseoir dans l\'obscurité face à une scène éclairée est un acte d\'espoir. Le plus ancien que nous connaissions.',
    attribution: 'Le Spectacle Vivant',
  },
] as const;

export default function HorizontalQuotes() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    // Desktop only — mobile uses the CSS vertical stack, no pin.
    if (!section || !track || window.innerWidth <= 768) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const getScrollDistance = () => track.scrollWidth - track.offsetWidth;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="horiz-scroll-section"
      aria-label="Citations — Opéra de Beyrouth"
    >
      <div ref={trackRef} className="horiz-scroll-track" role="list">
        {QUOTES.map((quote, i) => (
          <article className="quote-card" key={i} role="listitem">
            <span className="quote-card__index">
              0{i + 1} / 0{QUOTES.length}
            </span>
            <div className="quote-card__ornament" aria-hidden="true" />
            <p className="quote-card__text">{quote.text}</p>
            <p className="quote-card__attribution">{quote.attribution}</p>
          </article>
        ))}
      </div>

      {/* Dot indicators — purely decorative */}
      <div className="horiz-scroll-dots" aria-hidden="true">
        {QUOTES.map((_, i) => (
          <span key={i} className="horiz-scroll-dot" />
        ))}
      </div>
    </section>
  );
}
