export type SeatStatus = 'available' | 'selected' | 'reserved';

export interface Seat {
  id: string;
  row: string;
  number: number;
  section: string;
  status: SeatStatus;
}

export type Auditorium = 'main' | 'chamber';

export interface Reservation {
  seatIds: string[];
  auditorium: Auditorium;
  name: string;
  email: string;
  timestamp: Date;
}

export interface SeatDoc {
  seatId: string;
  auditorium: Auditorium;
  reserved: boolean;
  reservedBy: string;
}
