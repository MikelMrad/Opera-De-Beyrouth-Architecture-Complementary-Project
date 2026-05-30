'use client';

// SeatMap2 is the Chamber Hall variant of the interactive seat map.
// It delegates to the shared SeatMap component with auditorium="chamber".
// Extend this file if chamber-specific layout differences are ever required.

import SeatMap from '@/components/SeatMap/SeatMap';
import './SeatMap2.css';

interface SeatMap2Props {
  reservedIds: string[];
  selectedIds: string[];
  onSeatClick: (id: string) => void;
  maxSelection?: number;
}
//bump
export default function SeatMap2({
  reservedIds,
  selectedIds,
  onSeatClick,
  maxSelection = 4,
}: SeatMap2Props) {
  return (
    <div className="seatmap2__wrapper">
      <SeatMap
        auditorium="chamber"
        reservedIds={reservedIds}
        selectedIds={selectedIds}
        onSeatClick={onSeatClick}
        maxSelection={maxSelection}
      />
    </div>
  );
}
