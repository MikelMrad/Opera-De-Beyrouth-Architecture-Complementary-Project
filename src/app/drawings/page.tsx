'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import './drawings.css';

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
  { number: 'Façade Sud', label: 'Façade Ouest' },
  { number: 'Façade Est', label: 'Façade Nord' },
  { number: "Coupe AA'", label: "Coupe BB'" },
];

// One config per gallery block: heading (rewritten from the old vertical
// left-hand labels), how many pending detail views sit in the right column,
// and whether those are landscape or portrait. Index 0 = first block, etc.
type BlockConfig = {
  meta: string;
  title: string;
  slots: number;
  orient: 'landscape' | 'portrait';
};

const BLOCKS: BlockConfig[] = [
  { meta: 'Niveau +3.50', title: 'Rez-de-Chaussée', slots: 3, orient: 'landscape' },
  { meta: 'Niveaux +8.00 / +13.00', title: 'Les Auditoriums', slots: 3, orient: 'landscape' },
  { meta: 'Niveau −1.50', title: 'Parking · Niveau 1', slots: 2, orient: 'portrait' },
  { meta: 'Niveau −5.00', title: 'Parking · Niveau 2', slots: 2, orient: 'portrait' },
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
          const pdf = await getDocument({ url }).promise;
          if (cancelled) return;
          for (let p = 1; p <= pdf.numPages; p++) {
            allPages.push({ pdfIndex: i, pageIndex: p, pdf });
          }
          i++;
        } catch {
          // PDF doesn't exist or failed to load — stop here
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

  // The first four plans become centered gallery blocks — each one big image
  // with its own column of three (pending → placeholders). Remaining plans
  // (façades / sections) stay full-screen below.
  const blockPages = pages.slice(0, 4);
  const restPages = pages.slice(4);

  return (
    <>
      <Navbar />
      <div className="dwg-page">
        {!loaded && (
          <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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

        {blockPages.length > 0 && (
          <div className="dwg-blocks">
            {blockPages.map((entry, i) => {
              const cfg = BLOCKS[i];
              const portrait = cfg?.orient === 'portrait';
              return (
                <section className="dwg-block" key={`${entry.pdfIndex}-${entry.pageIndex}`}>
                  <header className="dwg-block__head">
                    <span className="dwg-block__meta">{cfg?.meta}</span>
                    <h2 className="dwg-block__title">{cfg?.title ?? `Plan ${i + 1}`}</h2>
                  </header>

                  <div className={`dwg-block__grid${portrait ? '' : ' dwg-block__grid--accordion'}`}>
                    <div className="dwg-block__main">
                      <GalleryTile entry={entry} />
                    </div>
                    <div className={`dwg-block__col${portrait ? ' dwg-block__col--portrait' : ' dwg-block__col--accordion'}`}>
                      {Array.from({ length: cfg?.slots ?? 3 }).map((_, j) => (
                        <DetailTile key={j} block={i + 1} slot={j + 1} portrait={portrait} />
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {restPages.map((entry) => (
          <PdfPageCanvas
            key={`${entry.pdfIndex}-${entry.pageIndex}`}
            entry={entry}
            number={PLANS[entry.pdfIndex - 1]?.number ?? String(entry.pdfIndex).padStart(2, '0')}
            label={PLANS[entry.pdfIndex - 1]?.label ?? `Plan ${entry.pdfIndex}`}
          />
        ))}
      </div>
      <Footer />
    </>
  );
}

/** Empty slot for a detail view that hasn't been added yet; expands on hover. */
function PlaceholderTile({ portrait = false }: { portrait?: boolean }) {
  return (
    <div className={`dwg-placeholder${portrait ? ' dwg-placeholder--portrait' : ''}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span>À venir</span>
    </div>
  );
}

// Detail-view files live in per-block folders, named by slot:
//   public/architectural-drawings/block<1..4>/<1..n>.<ext>
// Images are tried first, then a PDF; a missing slot shows the placeholder.
const IMAGE_EXTS = ['webp', 'jpg', 'jpeg', 'png'] as const;

/** Resolve true if an image URL loads (also primes the browser cache). */
function imageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/** Load a PDF document, or null if it isn't there. */
async function loadPdfDoc(url: string): Promise<PDFDocumentProxy | null> {
  try {
    const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist');
    GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    return await getDocument({ url }).promise;
  } catch {
    return null;
  }
}

type Resolved =
  | { kind: 'loading' }
  | { kind: 'image'; url: string }
  | { kind: 'pdf'; pdf: PDFDocumentProxy }
  | { kind: 'none' };

/** One column slot: finds its file (image → pdf → none) and renders it. */
function DetailTile({ block, slot, portrait }: { block: number; slot: number; portrait: boolean }) {
  const [resolved, setResolved] = useState<Resolved>({ kind: 'loading' });
  const base = `/architectural-drawings/block${block}/${slot}`;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      for (const ext of IMAGE_EXTS) {
        const url = `${base}.${ext}`;
        if (await imageExists(url)) {
          if (!cancelled) setResolved({ kind: 'image', url });
          return;
        }
        if (cancelled) return;
      }
      const pdf = await loadPdfDoc(`${base}.pdf`);
      if (cancelled) return;
      setResolved(pdf ? { kind: 'pdf', pdf } : { kind: 'none' });
    })();

    return () => { cancelled = true; };
  }, [base]);

  if (resolved.kind === 'loading') {
    return (
      <div className="dwg-tile">
        <div className="dwg-tile__pulse" />
      </div>
    );
  }
  if (resolved.kind === 'image') {
    return (
      <div className="dwg-tile">
        <Image
          src={resolved.url}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="dwg-tile__img"
        />
      </div>
    );
  }
  if (resolved.kind === 'pdf') {
    return <DetailPdf pdf={resolved.pdf} />;
  }
  return <PlaceholderTile portrait={portrait} />;
}

/** Renders the first page of a detail PDF as a gallery tile. */
function DetailPdf({ pdf }: { pdf: PDFDocumentProxy }) {
  const entry = useMemo<PageEntry>(() => ({ pdfIndex: 0, pageIndex: 1, pdf }), [pdf]);
  return <GalleryTile entry={entry} />;
}

/**
 * Renders one PDF page onto a canvas, lazily: it only paints when the canvas
 * scrolls near the viewport and clears itself when it leaves, to keep memory
 * bounded across many large plans. Returns the refs + a rendered flag so
 * different layouts (full-screen vs gallery tile) can share the same logic.
 */
function usePdfPageCanvas(entry: PageEntry) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderingRef = useRef(false);
  const renderedRef = useRef(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
  }, [entry]);

  return { containerRef, canvasRef, isRendered };
}

/** Gallery-style tile: cropped to fill its cell, expands to natural ratio on hover. */
function GalleryTile({ entry }: { entry: PageEntry }) {
  const { containerRef, canvasRef, isRendered } = usePdfPageCanvas(entry);

  return (
    <div ref={containerRef} className="dwg-tile">
      {!isRendered && <div className="dwg-tile__pulse" />}
      <canvas ref={canvasRef} className="dwg-tile__canvas" />
    </div>
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
  const { containerRef, canvasRef, isRendered } = usePdfPageCanvas(entry);

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
            fontWeight: 700,
            letterSpacing: '0.22em',
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
            color: 'var(--color-navy)',
            opacity: 0.6,
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            lineHeight: 1,
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
