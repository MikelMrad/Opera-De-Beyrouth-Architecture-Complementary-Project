'use client';

import { useEffect } from 'react';
import './SeatViewModal.css';

interface Props {
  seatId: string;
  section: string;
  imgSrc: string;
  onClose: () => void;
}

export default function SeatViewModal({ seatId, section, imgSrc, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="svm__overlay" onClick={onClose}>
      <div className="svm__frame" onClick={(e) => e.stopPropagation()}>
        <span className="svm__badge">
          {seatId} &middot; {section}
        </span>
        <button className="svm__close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="svm__image" src={imgSrc} alt={`View from seat ${seatId}`} />
        <span className="svm__label">View from this seat</span>
      </div>
    </div>
  );
}
