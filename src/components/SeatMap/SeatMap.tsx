'use client';

import { useMemo } from 'react';
import type { SeatStatus } from '@/types';
import './SeatMap.css';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface SeatDef {
  id: string;
  row: string;
  number: number;
  section: string;
  x: number;       // seat centre, in plan units
  y: number;
  rot: number;     // degrees; seat faces the stage
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

/* ------------------------------------------------------------------ */
/*  Geometry — reconstructed 1:1 from the architectural PDFs.           */
/*                                                                      */
/*  Both halls are raked seating split by a cross-aisle into two banks, */
/*  each bank divided L / C / R by two aisles. The MAIN auditorium is   */
/*  a gentle concentric arc (centre above the stage); the CHAMBER       */
/*  balcony is a fan (centre below) so its side blocks splay outward —  */
/*  exactly as drawn in the plans.                                      */
/* ------------------------------------------------------------------ */

const DEG = Math.PI / 180;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const SEAT = {
  main: { w: 28, h: 33, rx: 5 },
  chamber: { w: 38, h: 44, rx: 7 },
} as const;

/* ---- MAIN: Grand Auditorium (Scène · E.T. +8.00) ----
   Seat-by-seat from the plan. Two banks (front 10 rows, back 8 rows),
   each split L / C / R. The centre block is ALWAYS 18. Rows are
   concentric arcs with the centre above the stage -> a gentle ∪.
   Front side-blocks align on the outer wall and grow inward; back
   side-blocks align on the inner (aisle) edge and shed seats outward
   as the dome trims the corners. Index 0 of every list = row nearest
   the stage. Per-row seat counts are the venue's exact numbers.        */
const MAIN = {
  cx: 1224,
  cyA: -6000,                 // arc centre (above the stage)
  radii: [                    // fitted per-row radii, front -> back
    7381, 7450, 7509, 7580, 7653, 7726, 7800, 7873, 7941, 8011, // front (10)
    8118, 8186, 8258, 8334, 8407, 8486, 8556, 8606,             // back  (8)
  ],
  nFront: 10,
  pitch: 34.3,                // seat spacing along the arc
  aisle: 52,                  // extra aisle gap (arc length)
  leftFront:  [13, 12, 13, 13, 13, 14, 14, 15, 15, 16],
  rightFront: [12, 13, 13, 13, 14, 14, 15, 15, 16, 16],
  leftBack:   [16, 16, 16, 15, 15, 14, 13, 12],
  rightBack:  [16, 16, 16, 15, 15, 14, 13, 12],
  sections: ['Orchestra', 'Parterre'],
};

/* ---- CHAMBER: Balcony (Niveau +11.00 N.F.) ---- */
const CHAMBER = {
  cx: 1223,
  cyB: 6500,          // fan centre, below -> side blocks splay outward
  halfX: 1015,
  upperN: 9,
  upperR0: 6500 - 410,
  upperGap: 57,
  lowerN: 12,
  lowerR0: 6500 - 1280,
  lowerGap: 71,
  aisleA: [-3.2, 3.2],   // radial aisles, in degrees
  aisleHalfDeg: 0.9,
  pitch: 50,
  sections: ['Balcony', 'Upper Balcony'],
};

function buildMain(): Layout {
  const c = MAIN;
  const p = c.pitch;
  const innerR = 9 * p + c.aisle;   // inner edge of the side blocks (back bank)
  const wall = 24 * p + c.aisle;    // outer wall (front) = widest back-row outer edge

  const seats: SeatDef[] = [];
  const rows: RowLabel[] = [];

  const place = (R: number, s: number) => {
    const th = s / R;               // seats face the stage (rotate by the arc angle)
    return { x: c.cx + R * Math.sin(th), y: c.cyA + R * Math.cos(th), rot: th / DEG };
  };

  const buildRow = (
    R: number,
    letter: string,
    section: string,
    nL: number,
    nR: number,
    back: boolean
  ) => {
    const offsets: number[] = [];
    for (let k = 0; k < 18; k++) offsets.push((k - 8.5) * p);   // centre block: 18, centred
    if (!back) {
      for (let j = 0; j < nL; j++) offsets.push(-innerR - j * p); // left: inner edge, fill outward
      for (let j = 0; j < nR; j++) offsets.push(innerR + j * p)
    } else {
      for (let j = 0; j < nL; j++) offsets.push(-innerR - j * p); // left: inner edge, fill outward
      for (let j = 0; j < nR; j++) offsets.push(innerR + j * p);  // right: inner edge, fill outward
    }
    offsets.sort((a, b) => a - b);  // number left -> right

    let rowMinX = Infinity;
    let rowMinXY = 0;
    offsets.forEach((s, idx) => {
      const { x, y, rot } = place(R, s);
      const number = idx + 1;
      seats.push({ id: `${letter}${number}`, row: letter, number, section, x, y, rot });
      if (x < rowMinX) { rowMinX = x; rowMinXY = y; }
    });
    rows.push({ letter, x: rowMinX - 20, y: rowMinXY + 4 });
  };

  for (let i = 0; i < 10; i++)
    buildRow(c.radii[i], LETTERS[i], 'orchestra', c.leftFront[i], c.rightFront[i], false);
  for (let j = 0; j < 8; j++)
    buildRow(c.radii[10 + j], LETTERS[10 + j], 'parterre', c.leftBack[j], c.rightBack[j], true);

  return finalize(seats, rows, c.sections, c.nFront);
}

function buildChamber(): Layout {
  const c = CHAMBER;
  const radii: number[] = [];
  for (let i = 0; i < c.upperN; i++) radii.push(c.upperR0 - c.upperGap * i);
  for (let i = 0; i < c.lowerN; i++) radii.push(c.lowerR0 - c.lowerGap * i);

  const seats: SeatDef[] = [];
  const rows: RowLabel[] = [];

  radii.forEach((r, ri) => {
    const Adeg = Math.asin(Math.min(c.halfX / r, 0.99)) / DEG;
    const n = Math.round((2 * Adeg * DEG * r) / c.pitch);
    const letter = LETTERS[ri];
    let num = 1;
    let rowMinX = Infinity;
    let rowMinXY = 0;

    for (let k = 0; k <= n; k++) {
      const adeg = -Adeg + (k * 2 * Adeg) / n;
      if (c.aisleA.some((aa) => Math.abs(adeg - aa) < c.aisleHalfDeg)) continue;
      const a = adeg * DEG;
      const x = c.cx + r * Math.sin(a);
      const y = c.cyB - r * Math.cos(a);
      seats.push({
        id: `${letter}${num}`,
        row: letter,
        number: num,
        section: ri < c.upperN ? 'balcony' : 'upper',
        x,
        y,
        rot: adeg,
      });
      if (x < rowMinX) { rowMinX = x; rowMinXY = y; }
      num++;
    }
    rows.push({ letter, x: rowMinX - 26, y: rowMinXY + 4 });
  });

  return finalize(seats, rows, c.sections, c.upperN);
}

/** Compute bbox + section-label anchors shared by both halls. */
function finalize(
  seats: SeatDef[],
  rows: RowLabel[],
  sectionNames: string[],
  frontRowCount: number
): Layout {
  const xs = seats.map((s) => s.x);
  const ys = seats.map((s) => s.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // front label sits just above row A; rear label sits in the cross-aisle
  const frontTop = Math.min(...seats.filter((s) => s.row === LETTERS[0]).map((s) => s.y));
  const backFirstLetter = LETTERS[frontRowCount];
  const backTop = Math.min(...seats.filter((s) => s.row === backFirstLetter).map((s) => s.y));
  const frontLastLetter = LETTERS[frontRowCount - 1];
  const frontBottom = Math.max(...seats.filter((s) => s.row === frontLastLetter).map((s) => s.y));

  const sections: SectionLabel[] = [
    { name: sectionNames[0], x: minX - 4, y: frontTop - 26 },
    { name: sectionNames[1], x: minX - 4, y: (frontBottom + backTop) / 2 + 4 },
  ];

  return { seats, rows, sections, minX, minY, maxX, maxY };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function getSeatStatus(
  id: string,
  reservedIds: string[],
  selectedIds: string[]
): SeatStatus {
  if (reservedIds.includes(id)) return 'reserved';
  if (selectedIds.includes(id)) return 'selected';
  return 'available';
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function SeatMap({
  auditorium,
  reservedIds,
  selectedIds,
  onSeatClick,
  maxSelection = 4,
}: SeatMapProps) {
  const layout = useMemo(
    () => (auditorium === 'main' ? buildMain() : buildChamber()),
    [auditorium]
  );

  const seat = SEAT[auditorium];
  const PAD_X = 70;
  const STAGE_SPACE = 130;
  const PAD_BOTTOM = 50;

  const vbX = layout.minX - PAD_X;
  const vbY = layout.minY - STAGE_SPACE;
  const vbW = layout.maxX - layout.minX + PAD_X * 2;
  const vbH = layout.maxY - layout.minY + STAGE_SPACE + PAD_BOTTOM;

  // Render at a fixed on-screen scale (~16px seats) so the map keeps usable
  // tap targets: it fits within the wrapper on desktop and scrolls on mobile.
  const scale = 16 / seat.w;
  const pxW = Math.round(vbW * scale);
  const pxH = Math.round(vbH * scale);

  const stageW = (layout.maxX - layout.minX) * 0.46;
  const stageH = 52;
  const cx = (layout.minX + layout.maxX) / 2;
  const stageX = cx - stageW / 2;
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
          aria-label={`${auditorium === 'main' ? 'Grand Auditorium' : 'Balcony'} seat map`}
        >
          {/* Stage */}
          <rect
            className="seatmap__stage-rect"
            x={stageX}
            y={stageY}
            width={stageW}
            height={stageH}
            rx={6}
          />
          <text
            className="seatmap__stage-text"
            x={cx}
            y={stageY + stageH / 2 + 5}
            textAnchor="middle"
          >
            SCÈNE
          </text>

          {/* Section labels */}
          {layout.sections.map((s) => (
            <text
              key={s.name}
              className="seatmap__section-label"
              x={s.x}
              y={s.y}
            >
              {s.name}
            </text>
          ))}

          {/* Row labels */}
          {layout.rows.map((r) => (
            <text
              key={r.letter}
              className="seatmap__row-label"
              x={r.x}
              y={r.y}
              textAnchor="middle"
            >
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
                transform={`rotate(${-s.rot * 3.5} ${s.x} ${s.y})`}
                data-seat-id={s.id}
                data-section={s.section}
                role="button"
                aria-label={`Seat ${s.id}, ${status}`}
                aria-pressed={status === 'selected'}
                tabIndex={status === 'reserved' ? -1 : 0}
                onClick={() => status !== 'reserved' && onSeatClick(s.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (status !== 'reserved') onSeatClick(s.id);
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
    </div>
  );
}
