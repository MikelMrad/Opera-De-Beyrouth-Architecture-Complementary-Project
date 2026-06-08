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
const PLANS: Array<{ number: string; label: string }> = [
  { number: '+3.5O', label: 'RDC' },
  { number: '+8.00 ; +13.00', label: 'Auditoriums' },
  { number: '-1.50', label: 'Parking' },
  { number: '-5.00', label: 'Parking' },
  { number: '05', label: 'Coupe Transversale' },
  { number: '06', label: 'Détails Structurels' },
  { number: '07', label: 'Plan de Façade' },
  { number: '08', label: "Plan d'Ensemble" },
];

export default function DrawingsPage() {
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
        const url = `/architectural-drawings/${i}.pdf`;
        try {
          const resp = await fetch(url, { method: 'HEAD' });
          if (!resp.ok) break;
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
        {!loaded && <div style={{ height: '100vh', background: 'var(--color-offwhite)' }} />}
        {pages.map((entry, idx) => (
          <PdfPageCanvas
            key={`${entry.pdfIndex}-${entry.pageIndex}`}
            entry={entry}
            number={PLANS[entry.pdfIndex - 1]?.number ?? String(entry.pdfIndex).padStart(2, '0')}
            label={PLANS[entry.pdfIndex - 1]?.label ?? `Plan ${entry.pdfIndex}`}
            isLast={idx === pages.length - 1}
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
  isLast,
}: {
  entry: PageEntry;
  number: string;
  label: string;
  isLast: boolean;
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
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: isLast ? 0 : 20,
        background: 'var(--color-offwhite)',
      }}
    >
      {/* Pulse placeholder */}
      {!isRendered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#e8e8e0',
            animation: 'pulse 1.8s ease-in-out infinite',
          }}
        />
      )}

      {/* Left label */}
      <div
        style={{
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
        }}
      >
        {/* top line */}
        <div style={{ height: 56, width: 1, background: 'var(--color-navy)', opacity: 0.2 }} />

        {/* plan number */}
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 300,
            letterSpacing: '0.18em',
            color: 'var(--color-navy)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            lineHeight: 1,
          }}
        >
          {number}
        </span>

        {/* dot divider */}
        <div
          style={{
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'var(--color-navy)',
            opacity: 0.35,
            flexShrink: 0,
          }}
        />

        {/* plan name */}
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-navy)',
            opacity: 0.6,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>

        {/* bottom line */}
        <div style={{ height: 56, width: 1, background: 'var(--color-navy)', opacity: 0.2 }} />
      </div>

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
    </div>
  );
}
