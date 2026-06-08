'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

interface ImageEntry {
  index: number;
  src: string;
}

// Edit this array to change the number and name shown next to each image.
// Index 0 = 1.jpg/png/webp, index 1 = 2.jpg/png/webp, etc.
const CONTEXT_ITEMS: Array<{ number: string; label: string }> = [
  { number: '', label: 'Plan Masse' },
  { number: '', label: 'Plan Maase' },
];

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

function findImageUrl(index: number): Promise<string | null> {
  return new Promise((resolve) => {
    let tried = 0;
    for (const ext of EXTENSIONS) {
      const url = `/context/${index}.${ext}`;
      const img = new window.Image();
      img.onload = () => resolve(url);
      img.onerror = () => {
        tried++;
        if (tried === EXTENSIONS.length) resolve(null);
      };
      img.src = url;
    }
  });
}

export default function ContextPage() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAllImages() {
      const all: ImageEntry[] = [];
      let i = 1;

      while (true) {
        const src = await findImageUrl(i);
        if (!src || cancelled) break;
        all.push({ index: i, src });
        i++;
      }

      if (!cancelled) {
        setImages(all);
        setLoaded(true);
      }
    }

    loadAllImages();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--color-offwhite)', minHeight: '100vh', paddingTop: 80 }}>
        {!loaded && (
          <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1.5px solid var(--color-navy)',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}
        {images.map((entry, idx) => (
          <ContextImageSlot
            key={entry.index}
            entry={entry}
            number={CONTEXT_ITEMS[entry.index - 1]?.number ?? String(entry.index).padStart(2, '0')}
            label={CONTEXT_ITEMS[entry.index - 1]?.label ?? `Image ${entry.index}`}
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

function ContextImageSlot({
  entry,
  number,
  label,
}: {
  entry: ImageEntry;
  number: string;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShouldRender(true);
        } else {
          setShouldRender(false);
          setIsLoaded(false);
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        background: 'var(--color-offwhite)',
      }}
    >
      {/* Pulse placeholder */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#e8e8e0',
          animation: 'pulse 1.8s ease-in-out infinite',
        }} />
      )}

      {/* Left label */}
      <div style={{
        position: 'absolute',
        left: '2.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        zIndex: 2,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        <div style={{ height: 56, width: 1, background: 'var(--color-navy)', opacity: 0.2 }} />

        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: 'var(--color-navy)',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          lineHeight: 1,
        }}>
          {number}
        </span>

        <div style={{
          width: 3,
          height: 3,
          borderRadius: '50%',
          background: 'var(--color-navy)',
          opacity: 0.35,
          flexShrink: 0,
        }} />

        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: 'var(--color-navy)',
          opacity: 0.6,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          lineHeight: 1,
        }}>
          {label}
        </span>

        <div style={{ height: 56, width: 1, background: 'var(--color-navy)', opacity: 0.2 }} />
      </div>

      {/* Image */}
      {shouldRender && (
        <img
          src={entry.src}
          alt={label}
          onLoad={() => setIsLoaded(true)}
          style={{
            display: 'block',
            height: '100vh',
            width: 'auto',
            position: 'relative',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}
