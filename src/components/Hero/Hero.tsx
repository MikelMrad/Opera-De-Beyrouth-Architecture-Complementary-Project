'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import './Hero.css';

// Split title string into individual character spans for GSAP stagger
const TITLE = 'Opéra de Beyrouth';
const titleChars = Array.from(TITLE); // Array.from handles multi-byte chars (é)

export default function Hero() {
  const charsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    // Hero title animates on page load, not scroll — handled here, not in the global hook
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    const init = async () => {
      const gsap = (await import('gsap')).default;
      ctx = gsap.context(() => {
        gsap.fromTo(
          charsRef.current,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            stagger: 0.04,
            ease: 'expo.out',
            delay: 0.2,
          }
        );
      });
    };

    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section className="hero">
      <video
        className="hero__bg"
        src="/hero-video.mp4"
        poster="/images/banner.png"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__eyebrow">Est. Beyrouth, Liban</p>

        <h1
          className="hero__title"
          aria-label={TITLE}
        >
          {titleChars.map((char, i) => (
            <span
              key={i}
              className={`hero__char${char === ' ' ? ' hero__char--space' : ''}`}
              ref={(el) => {
                if (el) charsRef.current[i] = el;
              }}
              aria-hidden="true"
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </h1>

        <div className="hero__divider" />

        <p className="hero__subtitle">
          La Première Maison d&apos;Opéra de Renommée Mondiale à Beyrouth
        </p>

      </div>

      <div className="hero__scroll-hint">
        <span>Défiler</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
