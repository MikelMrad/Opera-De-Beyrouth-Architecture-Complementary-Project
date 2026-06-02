'use client';

import { useMemo, useState } from 'react';
import type { SeatStatus } from '@/types';
import PanoramaModal from '@/components/PanoramaModal/PanoramaModal';
import { seatViews, getClosestView } from '@/lib/seatViews';
import './SeatMap2.css';

interface SeatDef {
  id: string;
  row: string;
  number: number;
  section: string;
  x: number;
  y: number;
  rot: number;
}

interface RowLabel {
  letter: string;
  x: number;
  y: number;
}

interface SectionLabel {
  name: string;
  x: number;
  y: number;
}

interface Layout {
  seats: SeatDef[];
  rows: RowLabel[];
  sections: SectionLabel[];
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface SeatMapProps {
  auditorium: 'main' | 'chamber';
  reservedIds: string[];
  selectedIds: string[];
  onSeatClick: (id: string) => void;
  maxSelection?: number;
}

const DEG     = Math.PI / 180;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const SEAT_SIZE = { w: 30, h: 35, rx: 5 } as const;

const FRONT_ROWS = 11;
const BACK_ROWS  = 9;
const TOTAL_ROWS = FRONT_ROWS + BACK_ROWS; // 20

const LEFT_FRONT:   number[] = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
const CENTRE_FRONT: number[] = [7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 11];
const RIGHT_FRONT:  number[] = [7, 7, 7, 7, 7, 7, 7, 7, 7,  7,  7];

const LEFT_BACK:   number[] = [8, 8, 8, 8, 8, 8, 8, 8, 8];
const CENTRE_BACK: number[] = [11, 11, 12, 11, 12, 12, 13, 13, 13];
const RIGHT_BACK:  number[] = [7, 7, 7, 7, 7, 7, 7, 7, 7];

const SECTIONS = ['Balcony', 'Upper Balcony'];

const CX       = 0;
const CY_A     = -8000;
const PITCH    = 38;
const AISLE    = 58;
const ROW_GAP  = 52;
const R0_FRONT = 8400;
const CROSS    = 140;
const R0_BACK  = R0_FRONT + FRONT_ROWS * ROW_GAP + CROSS;

const C_HALF_MAX    = (13 / 2) * PITCH;
const OUTER_ANG_L   = -(C_HALF_MAX + AISLE + 8 * PITCH + PITCH / 2) / R0_BACK;
const OUTER_ANG_R   =  (C_HALF_MAX + AISLE + 7 * PITCH + PITCH / 2) / R0_BACK;

function place(R: number, s: number): { x: number; y: number; rot: number } {
  const th = s / R;
  return { x: CX + R * Math.sin(th), y: CY_A + R * Math.cos(th), rot: th / DEG };
}

function buildLayout(): Layout {
  const seats: SeatDef[]  = [];
  const rows:  RowLabel[] = [];

  const buildRow = (
    R: number,
    rowIndex: number, // 0 = nearest stage (front row 0), 19 = farthest (back row 8)
    section: string,
    nL: number,
    nC: number,
    nR: number,
  ) => {
    const letter = LETTERS[rowIndex];

    const positions: Array<{ x: number; y: number; rot: number }> = [];

    for (let k = 0; k < nC; k++)
      positions.push(place(R, (k - (nC - 1) / 2) * PITCH));
    for (let j = 0; j < nL; j++)
      positions.push(place(R, R * OUTER_ANG_L + j * PITCH + PITCH / 2));
    for (let j = 0; j < nR; j++)
      positions.push(place(R, R * OUTER_ANG_R - j * PITCH - PITCH / 2));

    positions.sort((a, b) => a.x - b.x);

    let rowMinX = Infinity;
    let rowMinXY = 0;

    positions.forEach((pos, idx) => {
      const number = idx + 1;
      seats.push({ id: `${letter}${number}`, row: letter, number, section, x: pos.x, y: pos.y, rot: pos.rot });
      if (pos.x < rowMinX) { rowMinX = pos.x; rowMinXY = pos.y; }
    });

    rows.push({ letter, x: rowMinX - 22, y: rowMinXY + 4 });
  };

  for (let i = 0; i < FRONT_ROWS; i++)
    buildRow(R0_FRONT + i * ROW_GAP, i, 'balcony', LEFT_FRONT[i], CENTRE_FRONT[i], RIGHT_FRONT[i]);

  for (let j = 0; j < BACK_ROWS; j++)
    buildRow(R0_BACK + j * ROW_GAP, FRONT_ROWS + j, 'upper', LEFT_BACK[j], CENTRE_BACK[j], RIGHT_BACK[j]);

  return finalize(seats, rows);
}

function finalize(seats: SeatDef[], rows: RowLabel[]): Layout {
  const xs = seats.map((s) => s.x);
  const ys = seats.map((s) => s.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // front bank = rows T–K (nearest stage, smallest y in geometry = top of SVG)
  // back bank  = rows J–A (farthest, largest y = bottom of SVG)
  const frontFirstLetter = LETTERS[TOTAL_ROWS - 1]; // T — nearest stage
  const frontLastLetter  = LETTERS[BACK_ROWS];       // J — last of front bank
  const backFirstLetter  = LETTERS[BACK_ROWS - 1];   // I — first of back bank

  const frontTop    = Math.min(...seats.filter((s) => s.row === frontFirstLetter).map((s) => s.y));
  const frontBottom = Math.max(...seats.filter((s) => s.row === frontLastLetter).map((s) => s.y));
  const backTop     = Math.min(...seats.filter((s) => s.row === backFirstLetter).map((s) => s.y));

  const sections: SectionLabel[] = [
    { name: SECTIONS[0], x: minX - 4, y: frontTop - 26 },
    { name: SECTIONS[1], x: minX - 4, y: (frontBottom + backTop) / 2 + 4 },
  ];

  return { seats, rows, sections, minX, minY, maxX, maxY };
}

function getSeatStatus(id: string, reservedIds: string[], selectedIds: string[]): SeatStatus {
  if (reservedIds.includes(id)) return 'reserved';
  if (selectedIds.includes(id)) return 'selected';
  return 'available';
}

export default function SeatMap2({
  auditorium: _auditorium,
  reservedIds,
  selectedIds,
  onSeatClick,
  maxSelection = 4,
}: SeatMapProps) {
  const [modal, setModal] = useState<{ id: string; section: string; imgSrc: string } | null>(null);
  const [bubble, setBubble] = useState<{ id: string; section: string; imgSrc: string; hasOwn: boolean } | null>(null);

  const layout = useMemo(() => buildLayout(), []);

  const seat = SEAT_SIZE;
  const PAD_X       = 70;
  const STAGE_SPACE = 110;
  const PAD_BOTTOM  = 50;

  const vbX = layout.minX - PAD_X;
  const vbY = layout.minY - STAGE_SPACE;
  const vbW = layout.maxX - layout.minX + PAD_X * 2;
  const vbH = layout.maxY - layout.minY + STAGE_SPACE + PAD_BOTTOM;

  const scale = 16 / seat.w;
  const pxW   = Math.round(vbW * scale);
  const pxH   = Math.round(vbH * scale);

  // Stage at the TOP (above minY)
  const stageW = (layout.maxX - layout.minX) * 0.48;
  const cxMid  = (layout.minX + layout.maxX) / 2 + 20;
  const stageX = cxMid - stageW / 2;
  const stageY = layout.minY - STAGE_SPACE + 30;

  return (
    <div className="seatmap">
      <p className="seatmap__scroll-hint" aria-hidden="true">
        ← Faire défiler pour voir le plan →
      </p>

      <div className="seatmap__svg-wrapper">
        <svg
          className="seatmap__svg"
          viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
          width={pxW}
          height={pxH}
          role="group"
          aria-label="Petit Auditorium seat map"
        >
          {/* Stage — at the TOP */}
          <rect
            className="seatmap__stage-rect"
            x={stageX}
            y={stageY}
            width={stageW}
            height={48}
            rx={6}
          />
          <text
            className="seatmap__stage-text"
            x={cxMid}
            y={stageY + 30}
            textAnchor="middle"
          >
            SCÈNE
          </text>

          {/* Section labels */}
          {layout.sections.map((s) => (
            <text key={s.name} className="seatmap__section-label" x={s.x} y={s.y}>
              {s.name}
            </text>
          ))}

          {/* Row labels */}
          {layout.rows.map((r) => (
            <text key={r.letter} className="seatmap__row-label" x={r.x} y={r.y} textAnchor="middle">
              {r.letter}
            </text>
          ))}

          {/* Seats */}
          {layout.seats.map((s) => {
            const status = getSeatStatus(s.id, reservedIds, selectedIds);
            return (
              <rect
                key={s.id}
                className={`seat seat--${status}`}
                x={s.x - seat.w / 2}
                y={s.y - seat.h / 2}
                width={seat.w}
                height={seat.h}
                rx={seat.rx}
                ry={seat.rx}
                transform={`rotate(${s.rot} ${s.x} ${s.y})`}
                data-seat-id={s.id}
                data-section={s.section}
                role="button"
                aria-label={`Seat ${s.id}, ${status}`}
                aria-pressed={status === 'selected'}
                tabIndex={status === 'reserved' ? -1 : 0}
                onClick={() => {
                  if (status === 'reserved') return;
                  onSeatClick(s.id);
                  const imgSrc = getClosestView('chamber', s.id, seatViews);
                  if (imgSrc) setBubble({ id: s.id, section: s.section, imgSrc, hasOwn: !!seatViews['chamber']?.[s.id] });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (status === 'reserved') return;
                    onSeatClick(s.id);
                    const imgSrc = getClosestView('chamber', s.id, seatViews);
                    if (imgSrc) setBubble({ id: s.id, section: s.section, imgSrc, hasOwn: !!seatViews['chamber']?.[s.id] });
                  }
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Selection info */}
      <div className="seatmap__selection-bar">
        <p>
          Selected:{' '}
          <span>{selectedIds.length > 0 ? selectedIds.join(', ') : 'None'}</span>
        </p>
        <p className="seatmap__max-notice">Max {maxSelection} seats</p>
      </div>

      {/* Legend */}
      <ul className="seatmap__legend" role="list">
        <li className="seatmap__legend-item">
          <span className="seatmap__legend-swatch seatmap__legend-swatch--available" />
          Available
        </li>
        <li className="seatmap__legend-item">
          <span className="seatmap__legend-swatch seatmap__legend-swatch--selected" />
          Selected
        </li>
        <li className="seatmap__legend-item">
          <span className="seatmap__legend-swatch seatmap__legend-swatch--reserved" />
          Reserved
        </li>
      </ul>

      {bubble && (
        <>
          <div className="svm__bubble-backdrop" onClick={() => setBubble(null)} />
          <button
            className="svm__bubble"
            onClick={() => { setModal({ id: bubble.id, section: bubble.section, imgSrc: bubble.imgSrc }); setBubble(null); }}
          >
            {bubble.hasOwn ? 'See seating in 3D' : 'See similar view'}
          </button>
        </>
      )}

      {modal && (
        <PanoramaModal
          seatId={modal.id}
          sectionName={modal.section}
          src={modal.imgSrc}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}