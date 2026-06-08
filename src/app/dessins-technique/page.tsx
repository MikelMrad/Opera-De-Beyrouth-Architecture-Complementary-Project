'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

interface PageEntry {
  pdfIndex: number;
  pageIndex: number;
  pdf: PDFDocumentProxy;
}

// Edit this array to change the number and name shown next to each PDF.
// Index 0 = 1.pdf, index 1 = 2.pdf, etc.
const ITEMS: Array<{ number: string; label: string }> = [
  { number: 'Axonometrie Mecanique', label: 'Axonometrie Electrique' },
  { number: '02', label: 'Coupe Technique' },
  { number: '03', label: 'Détail Structurel' },
  { number: '04', label: 'Façade Technique' },
  { number: '05', label: 'Plan Électrique' },
  { number: '06', label: 'Plan Mécanique' },
  { number: '07', label: 'Détail Fondations' },
  { number: '08', label: 'Détail Toiture' },
];

export default function DessinsTechniquePage() {
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAllPdfs() {
      const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist');
      GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

      const allPages: PageEntry[] = [];
      let i = 1;

      while (true) {
        const url = `/dessins-technique/${i}.pdf`;
        try {
          const pdf = await getDocument({ url }).promise;
          if (cancelled) return;
          for (let p = 1; p <= pdf.numPages; p++) {
            allPages.push({ pdfIndex: i, pageIndex: p, pdf });
          }
          i++;
        } catch {
          break;
        }
      }

      if (!cancelled) {
        setPages(allPages);
        setLoaded(true);
      }
    }

    loadAllPdfs();
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
        {pages.map((entry) => (
          <PdfPageCanvas
            key={`${entry.pdfIndex}-${entry.pageIndex}`}
            entry={entry}
            number={ITEMS[entry.pdfIndex - 1]?.number ?? String(entry.pdfIndex).padStart(2, '0')}
            label={ITEMS[entry.pdfIndex - 1]?.label ?? `Dessin ${entry.pdfIndex}`}
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

function PdfPageCanvas({
  entry,
  number,
  label,
}: {
  entry: PageEntry;
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
      {/* Pulse placeholder */}
      {!isRendered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#e8e8e0',
          animation: 'pulse 1.8s ease-in-out infinite',
        }} />
      )}

      {/* PDF canvas */}
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

      {/* Bottom label */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
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
    </div>
  );
}
