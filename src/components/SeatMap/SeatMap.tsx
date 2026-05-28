'use client';

import { useMemo } from 'react';
import type { SeatStatus } from '@/types';
import './SeatMap.css';

/* ------------------------------------------------------------------ */
/*  Types & constants                                                   */
/* ------------------------------------------------------------------ */

interface SeatDef {
  id: string;
  row: string;
  number: number;
  section: string;
  x: number;
  y: number;
}

interface SeatMapProps {
  auditorium: 'main' | 'chamber';
  reservedIds: string[];
  selectedIds: string[];
  onSeatClick: (id: string) => void;
  maxSelection?: number;
}

const SEAT_W = 18;
const SEAT_H = 16;
const SEAT_GAP = 4;
const ROW_HEIGHT = SEAT_H + 8;
const LEFT_MARGIN = 32;
const SVG_PADDING_TOP = 60;   // space for stage
const STAGE_H = 36;
const LABEL_W = 22;

/* ------------------------------------------------------------------ */
/*  Seat layout builders                                                */
/* ------------------------------------------------------------------ */

function buildMainAuditorium(): { seats: SeatDef[]; svgWidth: number; svgHeight: number } {
  const seats: SeatDef[] = [];

  // Orchestra: rows A–N (14 rows), 20 seats each
  const orchRows = 'ABCDEFGHIJKLMN'.split('');
  const orchSeatsPerRow = 20;
  const orchRowWidth = orchSeatsPerRow * (SEAT_W + SEAT_GAP) - SEAT_GAP;
  const orchStartX = LEFT_MARGIN + LABEL_W;
  const orchStartY = SVG_PADDING_TOP + STAGE_H + 24;

  orchRows.forEach((row, ri) => {
    // Slight perspective curve: later rows get a small horizontal offset
    const curve = ri * 1.4;
    const y = orchStartY + ri * ROW_HEIGHT;
    for (let s = 0; s < orchSeatsPerRow; s++) {
      const x = orchStartX + curve + s * (SEAT_W + SEAT_GAP);
      seats.push({
        id: `${row}${s + 1}`,
        row,
        number: s + 1,
        section: 'orchestra',
        x,
        y,
      });
    }
  });

  // Balcony: rows O–R (4 rows), 12 seats each — visually offset higher and narrower
  const balcRows = 'OPQR'.split('');
  const balcSeatsPerRow = 12;
  const balcSeatsWidth = balcSeatsPerRow * (SEAT_W + SEAT_GAP) - SEAT_GAP;
  const balcStartX = orchStartX + (orchRowWidth - balcSeatsWidth) / 2;
  const balcStartY = orchStartY + orchRows.length * ROW_HEIGHT + 32;

  balcRows.forEach((row, ri) => {
    const y = balcStartY + ri * ROW_HEIGHT;
    for (let s = 0; s < balcSeatsPerRow; s++) {
      const x = balcStartX + s * (SEAT_W + SEAT_GAP);
      seats.push({
        id: `${row}${s + 1}`,
        row,
        number: s + 1,
        section: 'balcony',
        x,
        y,
      });
    }
  });

  const svgWidth = LEFT_MARGIN + LABEL_W + orchRowWidth + LEFT_MARGIN;
  const lastSeat = seats[seats.length - 1];
  const svgHeight = lastSeat.y + SEAT_H + 40;

  return { seats, svgWidth, svgHeight };
}

function buildChamberHall(): { seats: SeatDef[]; svgWidth: number; svgHeight: number } {
  const seats: SeatDef[] = [];

  // Floor: rows A–G (7 rows), 18 seats each
  const floorRows = 'ABCDEFG'.split('');
  const floorSeatsPerRow = 18;
  const floorRowWidth = floorSeatsPerRow * (SEAT_W + SEAT_GAP) - SEAT_GAP;
  const floorStartX = LEFT_MARGIN + LABEL_W;
  const floorStartY = SVG_PADDING_TOP + STAGE_H + 24;

  floorRows.forEach((row, ri) => {
    const curve = ri * 1.2;
    const y = floorStartY + ri * ROW_HEIGHT;
    for (let s = 0; s < floorSeatsPerRow; s++) {
      const x = floorStartX + curve + s * (SEAT_W + SEAT_GAP);
      seats.push({
        id: `${row}${s + 1}`,
        row,
        number: s + 1,
        section: 'floor',
        x,
        y,
      });
    }
  });

  // Mezzanine: rows H–J (3 rows), 9 seats each
  const mezzRows = 'HIJ'.split('');
  const mezzSeatsPerRow = 9;
  const mezzSeatsWidth = mezzSeatsPerRow * (SEAT_W + SEAT_GAP) - SEAT_GAP;
  const mezzStartX = floorStartX + (floorRowWidth - mezzSeatsWidth) / 2;
  const mezzStartY = floorStartY + floorRows.length * ROW_HEIGHT + 32;

  mezzRows.forEach((row, ri) => {
    const y = mezzStartY + ri * ROW_HEIGHT;
    for (let s = 0; s < mezzSeatsPerRow; s++) {
      const x = mezzStartX + s * (SEAT_W + SEAT_GAP);
      seats.push({
        id: `${row}${s + 1}`,
        row,
        number: s + 1,
        section: 'mezzanine',
        x,
        y,
      });
    }
  });

  const svgWidth = LEFT_MARGIN + LABEL_W + floorRowWidth + LEFT_MARGIN;
  const lastSeat = seats[seats.length - 1];
  const svgHeight = lastSeat.y + SEAT_H + 40;

  return { seats, svgWidth, svgHeight };
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

function getSeatClassName(status: SeatStatus): string {
  return `seat seat--${status}`;
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
  const { seats, svgWidth, svgHeight } = useMemo(
    () =>
      auditorium === 'main' ? buildMainAuditorium() : buildChamberHall(),
    [auditorium]
  );

  const isMain = auditorium === 'main';
  const sectionLabels = isMain
    ? { first: 'Orchestra', second: 'Balcony' }
    : { first: 'Floor', second: 'Mezzanine' };

  // Y positions for section labels
  const firstSectionY = SVG_PADDING_TOP + STAGE_H + 16;
  const secondSectionStartRow = isMain ? 14 : 7;
  const secondSectionY =
    firstSectionY + secondSectionStartRow * ROW_HEIGHT + 24;

  const stageWidth = svgWidth * 0.6;
  const stageX = (svgWidth - stageWidth) / 2;

  return (
    <div className="seatmap">
      <div className="seatmap__svg-wrapper">
        <svg
          className="seatmap__svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width={svgWidth}
          height={svgHeight}
          aria-label={`${isMain ? 'Main Auditorium' : 'Chamber Hall'} seat map`}
        >
          {/* Stage */}
          <rect
            className="seatmap__stage-rect"
            x={stageX}
            y={SVG_PADDING_TOP}
            width={stageWidth}
            height={STAGE_H}
            rx={3}
          />
          <text
            className="seatmap__stage-text"
            x={svgWidth / 2}
            y={SVG_PADDING_TOP + STAGE_H / 2 + 5}
            textAnchor="middle"
          >
            STAGE
          </text>

          {/* Section labels */}
          <text
            className="seatmap__section-label"
            x={LEFT_MARGIN}
            y={firstSectionY}
          >
            {sectionLabels.first}
          </text>
          <text
            className="seatmap__section-label"
            x={LEFT_MARGIN}
            y={secondSectionY}
          >
            {sectionLabels.second}
          </text>

          {/* Row labels + seats */}
          {seats.map((seat, i) => {
            const isFirstInRow =
              i === 0 || seats[i - 1].row !== seat.row;
            const status = getSeatStatus(seat.id, reservedIds, selectedIds);

            return (
              <g key={seat.id}>
                {/* Row letter — only rendered for the first seat in each row */}
                {isFirstInRow && (
                  <text
                    className="seatmap__row-label"
                    x={seat.x - LABEL_W}
                    y={seat.y + SEAT_H - 4}
                    textAnchor="middle"
                  >
                    {seat.row}
                  </text>
                )}
                <rect
                  className={getSeatClassName(status)}
                  x={seat.x}
                  y={seat.y}
                  width={SEAT_W}
                  height={SEAT_H}
                  rx={2}
                  ry={2}
                  data-seat-id={seat.id}
                  data-section={seat.section}
                  role="button"
                  aria-label={`Seat ${seat.id}, ${status}`}
                  aria-pressed={status === 'selected'}
                  tabIndex={status === 'reserved' ? -1 : 0}
                  onClick={() => status !== 'reserved' && onSeatClick(seat.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (status !== 'reserved') onSeatClick(seat.id);
                    }
                  }}
                />
              </g>
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
