'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

type Entry =
  | { type: 'image'; index: number; src: string }
  | { type: 'pdf'; pdfIndex: number; pageIndex: number; pdf: PDFDocumentProxy };

const CONTEXT_ITEMS: Array<{ number: string; label: string }> = [
  { number: '', label: 'Analyse De Site' },
  { number: '', label: 'Programme' },
  { number: '', label: 'Plan Masse' },
  { number: '', label: 'Plan Maase' },
];

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

function findImageUrl(index: number): Promise<string | null> {
  return new Promise((resolve) => {
    let tried = 0;
    for (const ext of IMAGE_EXTENSIONS) {
      const url = `/context/${index}.${ext}`;
      const img = new window.Image();
      img.onload = () => resolve(url);
      img.onerror = () => {
        tried++;
        if (tried === IMAGE_EXTENSIONS.length) resolve(null);
      };
      img.src = url;
    }
  });
}

export default function ContextPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist');
      GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

      const all: Entry[] = [];
      let i = 1;

      while (true) {
        // Try PDF first
        try {
          const pdf = await getDocument({ url: `/context/${i}.pdf` }).promise;
          if (cancelled) return;
          for (let p = 1; p <= pdf.numPages; p++) {
            all.push({ type: 'pdf', pdfIndex: i, pageIndex: p, pdf });
          }
          i++;
          continue;
        } catch {
          // not a PDF, try image
        }

        const src = await findImageUrl(i);
        if (!src || cancelled) break;
        all.push({ type: 'image', index: i, src });
        i++;
      }

      if (!cancelled) {
        setEntries(all);
        setLoaded(true);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, []);

  function getItemMeta(index: number) {
    const item = CONTEXT_ITEMS[index - 1];
    return {
      number: item?.number ?? String(index).padStart(2, '0'),
      label: item?.label ?? `Item ${index}`,
    };
  }

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
        {entries.map((entry, idx) => {
          const sourceIndex = entry.type === 'pdf' ? entry.pdfIndex : entry.index;
          const { number, label } = getItemMeta(sourceIndex);
          if (entry.type === 'pdf') {
            return (
              <PdfSlot
                key={`pdf-${entry.pdfIndex}-${entry.pageIndex}`}
                entry={entry}
                number={number}
                label={label}
              />
            );
          }
          return (
            <ImageSlot
              key={`img-${entry.index}`}
              entry={entry}
              number={number}
              label={label}
            />
          );
        })}
      </div>
      <Footer />
    </>
  );
}

function LabelRow({ number, label }: { number: string; label: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      width: '100%',
      padding: '1.25rem 2.5rem',
      zIndex: 2,
      userSelect: 'none',
    }}>
      <span style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '0.22em',
        color: 'var(--color-navy)',
      }}>
        {number}
      </span>
      <span style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '0.22em',
        color: 'var(--color-navy)',
        opacity: 0.6,
      }}>
        {label}
      </span>
    </div>
  );
}

function ImageSlot({
  entry,
  number,
  label,
}: {
  entry: Extract<Entry, { type: 'image' }>;
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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        background: 'var(--color-offwhite)',
      }}
    >
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#e8e8e0',
          animation: 'pulse 1.8s ease-in-out infinite',
        }} />
      )}
      {shouldRender && (
        // eslint-disable-next-line @next/next/no-img-element
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
      <LabelRow number={number} label={label} />
    </div>
  );
}

function PdfSlot({
  entry,
  number,
  label,
}: {
  entry: Extract<Entry, { type: 'pdf' }>;
  number: string;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderingRef = useRef(false);
  const renderedRef = useRef(false);
  const [isRendered, setIsRendered] = useState(false);

  async function renderPage() {
    const canvas = canvasRef.current;
    if (!canvas || renderingRef.current) return;
    renderingRef.current = true;
    try {
      const page: PDFPageProxy = await entry.pdf.getPage(entry.pageIndex);
      const dpr = window.devicePixelRatio || 1;
      const baseVp = page.getViewport({ scale: 1 });
      const scale = dpr * (window.innerHeight / baseVp.height);
      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      renderedRef.current = true;
      setIsRendered(true);
    } finally {
      renderingRef.current = false;
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas || !renderedRef.current) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    renderedRef.current = false;
    setIsRendered(false);
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!renderedRef.current && !renderingRef.current) renderPage();
        } else {
          clearCanvas();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(container);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        background: 'var(--color-offwhite)',
      }}
    >
      {!isRendered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#e8e8e0',
          animation: 'pulse 1.8s ease-in-out infinite',
        }} />
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          height: '100vh',
          width: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      />
      <LabelRow number={number} label={label} />
    </div>
  );
}
