'use client';
import { useState } from 'react';
import Image from 'next/image';
import './GalleryGrid.css';

interface Props {
  images: string[];
}

const ROW_HEIGHT_REST   = 240;   // px — at rest
const ROW_HEIGHT_ACTIVE = 520;   // px — on hover: sized so a 16:9 cell at ~75% row-width shows the image uncropped

export default function GalleryGrid({ images }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const cells = images.slice(0, 8);
  const rows  = [cells.slice(0, 4), cells.slice(4, 8)];

  return (
    <div className="gallery-grid">
      {rows.map((row, rowIdx) => {
        const rowActive = hovered !== null && hovered.startsWith(`${rowIdx}-`);

        return (
          <div
            key={rowIdx}
            className="gallery-grid__row"
            style={{ height: rowActive ? ROW_HEIGHT_ACTIVE : ROW_HEIGHT_REST }}
          >
            {row.map((src, colIdx) => {
              const id        = `${rowIdx}-${colIdx}`;
              const isActive  = hovered === id;
              const flexGrow  = rowActive ? (isActive ? 4 : 0.25) : 1;

              return (
                <div
                  key={colIdx}
                  className="gallery-grid__item"
                  style={{ flexGrow }}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 75vw"
                    style={{ objectFit: 'cover' }}
                    className={`gallery-grid__img${rowActive && !isActive ? ' gallery-grid__img--dim' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
