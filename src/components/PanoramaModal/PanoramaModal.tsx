'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import './PanoramaModal.css';

// Three.js is heavy and touches `window`, so load the viewer client-only with
// a spinner while it initialises.
const PanoramaViewer = dynamic(
  () => import('@/components/PanoramaViewer/PanoramaViewer'),
  {
    ssr: false,
    loading: () => <div className="pano-modal__spinner" aria-label="Loading 360° view" />,
  },
);

interface PanoramaModalProps {
  src: string;
  seatId: string;
  sectionName: string;
  onClose: () => void;
}

export default function PanoramaModal({ src, seatId, sectionName, onClose }: PanoramaModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // next frame → CSS transition runs as a fade-in
    const raf = requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className={`pano-modal${visible ? ' pano-modal--visible' : ''}`}>
      <div className="pano-modal__stage">
        <PanoramaViewer src={src} />
      </div>

      <div className="pano-modal__badge">
        <span className="pano-modal__seat">{seatId}</span>
        <span className="pano-modal__section">{sectionName}</span>
      </div>

      <button className="pano-modal__close" onClick={onClose} aria-label="Close 360° view">
        &times;
      </button>

      <span className="pano-modal__hint">Drag to look around · Scroll to zoom</span>
    </div>
  );
}
